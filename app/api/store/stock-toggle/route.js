//toggle stock of a product 
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import authSeller from "@/middleware/authSeller";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 })
        }
        const body = await request.json().catch(() => null)
        const productId = body?.productId

        if (!productId) {
            return NextResponse.json({ error: "Missing required product id" }, { status: 400 })
        }
        const storeInfo = await authSeller(userId)
        if (!storeInfo) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 })
        }
        // check for product 
        const storeId = storeInfo.id
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                storeId: storeId // Strict ownership check: Only toggle if it belongs to this merchant
            },
            select: {
                inStock: true
            }
        });

        // If the product ID didn't match or doesn't belong to this storeId, count will be 0
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        const updatedStock = await prisma.product.update({
            where: {id: productId},
            data: {inStock: !product.inStock},
            select: {inStock: true}
        })

        return NextResponse.json({ message: "Product stock updated successfully", inStock:updatedStock.inStock }, { status: 200 })

    } catch (error) {
        console.error("update product stock failed", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });

    }
}