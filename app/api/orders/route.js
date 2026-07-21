import { prisma } from "@/lib/prisma"
import { auth, currentUser} from "@clerk/nextjs/server"
import { PaymentMethod } from "@prisma/client"
import { NextResponse } from "next/server"
import axios from 'axios'

export async function POST(request) {

    try {
        const { userId, has } = await auth()
        const clerkUser = await currentUser()

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
        }

        const body = await request.json()
        const { addressId, couponCode, paymentMethod, items } = body

        // Validate structural inputs
        if (!addressId || !paymentMethod || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Missing order information" }, { status: 400 })
        }

        // Validate address ownership
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId }
        })

        if (!address) {
            return NextResponse.json({ error: "Invalid address" }, { status: 400 })
        }

        // Coupon validation
        let coupon = null
        if (couponCode) {
            coupon = await prisma.coupon.findFirst({
                where: {
                    code: couponCode.toUpperCase(),
                    expiresAt: { gt: new Date() }
                }
            })

            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found or expired" }, { status: 404 })
            }

            if (coupon.forNewUser) {
                const existingSuccessfulOrders = await prisma.order.count({
                    where: {
                        userId,
                        status: { in: ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"]}
                    }
                })

                if (existingSuccessfulOrders > 0) {
                    return NextResponse.json({ error: "Coupon is for new users only" }, { status: 400 })
                }
            }
        }

        const isMemberPlan = has({ plan: "plus" })

        if (coupon?.forMember && !isMemberPlan) {
            return NextResponse.json({ error: "Coupon is for plus members only" }, { status: 400 })
        }

        // Fetch products mapping
        const productIds = items.map(item => item.id)
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        })

        if (products.length !== productIds.length) {
            return NextResponse.json({ error: "One or more products were not found" }, { status: 404 })
        }

        const productsMap = Object.fromEntries(products.map(product => [product.id, product]))

        for (const item of items) {
            const product = productsMap[item.id]
            if (!product || !product.inStock) {
                return NextResponse.json({
                    error: `${product?.name || 'Product'} is currently out of stock.`
                }, { status: 400 })
            }
        }

        // Group items by storeId
        const ordersByStore = new Map()
        for (const item of items) {
            const product = productsMap[item.id]
            const storeId = product.storeId

            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, [])
            }

            ordersByStore.get(storeId).push({
                ...item,
                price: product.price
            })
        }

        // Calculate split shipping fee distribution metrics
        const totalVendors = ordersByStore.size
        const shippingPerVendor = (!isMemberPlan && totalVendors > 0) ? (5 / totalVendors) : 0

        // Fetch user's primary email address
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "Primary email address not found on user profile" }, { status: 400 })
        }

        const orderIds = []
        let fullAmount = 0
        
        // Create a unique transaction track reference token upfront
        const reference = `ref_${userId.split('_')[1] || userId}_${Date.now()}`

        if (paymentMethod === 'PAYSTACK') {
            await prisma.order.deleteMany({
                where: {
                    userId: userId,
                    paymentMethod: 'PAYSTACK',
                    isPaid: false
                }
            });
        }

        // 🟢 Run transactional database operations cleanly without network request deadlocks
        await prisma.$transaction(async (tx) => {

            for (const [storeId, sellerItems] of ordersByStore.entries()) {
                let total = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

                if (coupon) {
                    total -= (total * coupon.discount) / 100
                }

                total += shippingPerVendor
                total = Number(total.toFixed(2))
                fullAmount += total

                for (const item of sellerItems) {
                    const product = productsMap[item.id]
                    const txProduct = await tx.product.findUnique({
                        where: { id: item.id }
                    })

                    if (!txProduct || !txProduct.inStock) {
                        throw new Error(`${product.name} is no longer available.`)
                    }
                }

                // Create individual store sub-order record
                const order = await tx.order.create({
                    data: {
                        userId,
                        storeId,
                        addressId,
                        total,
                        paymentMethod,
                        isCouponUsed: Boolean(coupon),
                        coupon: coupon ? coupon : null,
                        // 🟢 We assign the payment tracking reference here!
                        // This allows your upcoming webhook to trace exactly which orders are paid.
                        paymentReference: paymentMethod === 'PAYSTACK' ? reference : null, 
                        orderItems: {
                            create: sellerItems.map(item => ({
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    }
                })

                orderIds.push(order.id)
            }

            // Wipe checkout cart parameters clean
            if (paymentMethod === 'COD') {
                await tx.user.update({
                    where: { id: userId },
                    data: { cart: {} }
                })
            }
        })

        // 🟢STEP 2: Safe space to handle HTTP operations with Paystack API clusters outside of DB locks
        let paystackSession = null
        if (paymentMethod === 'PAYSTACK') {
            const amountInKobo = Math.round(fullAmount * 100)
            const appUrl = process.env.NEXT_PUBLIC_APP_URL 
                ? process.env.NEXT_PUBLIC_APP_URL 
                : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

            const callbackUrl = `${appUrl}/cart`;
            
            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email,
                    amount: amountInKobo,
                    reference,
                    callback: callbackUrl,
                    channels: ["card", "bank_transfer", "mobile_money"],
                    metadata: {
                        orderIds: orderIds.join(','),
                        userId,
                        appId: 'gocart'
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            paystackSession = {
                access_code: response.data.data.access_code,
                reference: response.data.data.reference,
                email,
                amount: amountInKobo
            }
        }

        // 🟢 FIX: Returning the payload down to sync up with OrderSummary.jsx state
        return NextResponse.json({
            message: "Order created successfully",
            paystackSession,
            orderIds
        }, { status: 201 })

    } catch (error) {
        console.error("Failed to create order:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { 
                userId, 
                OR: [
                    { paymentMethod: PaymentMethod.COD },
                    // Only show Paystack items to customers if verification confirmations successfully updated `isPaid`
                    { AND: [{ paymentMethod: PaymentMethod.PAYSTACK }, { isPaid: true }] }
                ]
            },
            include: {
                orderItems: { include: { product: true } },
                address: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ orders }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch order:', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}