import crypto  from "crypto"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        // Read the absolute raw text string body for cryptography checking
        const rawBody = await request.text()
        const paystackSignature = request.headers.get('x-paystack-signature')

        // Compute HMAC SHA512 hash to verify origin authenticity
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(rawBody)
            .digest('hex')

        if (hash !== paystackSignature) {
            return NextResponse.json({ error: "Invalid integrity signature" }, { status: 401 })
        }

        const event = JSON.parse(rawBody)

        // Listen explicitly for the event type confirming settlement success
        if (event.event === 'charge.success') {
            const sessionData = event.data
            const userId = event.data.metadata?.userId;
            const paymentReference = sessionData.reference

            // Update database records asynchronously matching the payload trace markers
            await prisma.order.updateMany({
                where: { paymentReference },
                data: {
                    isPaid: true,
                    status: "ORDER_PLACED" // Transition out of holding states if applicable
                }
            })

            if(userId){
                await prisma.user.update({
                    where: {id: userId},
                    data: {cart: {}}
                })
            }
            
            console.log(`Successfully verified and updated reference: ${paymentReference}`)
            return NextResponse.json({ message: 'Webhook processed and cart cleared' }, { status: 200 });
        }

        // Always acknowledge Paystack with a clean 200 statement so they don't loop retry operations
        return new NextResponse("Event Logged", { status: 200 })

    } catch (error) {
        console.error("Paystack Webhook Failure Event:", error)
        return NextResponse.json({ error: "Webhook Handler Crashed" }, { status: 500 })
    }
}