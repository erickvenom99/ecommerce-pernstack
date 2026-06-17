
//upate orders 

import { prisma } from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(request){ 
    try {
        const {userId} = await auth()
        const store = await authSeller(userId)
        if(!store){
            return NextResponse.json({error: 'unauthorized user'}, {status: 403})
        }
        const body = await request.json()
        const {orderId, status} = body
    
        if(!orderId || !status) {
            return NextResponse.json({error: "Missing order info and status info"}, {status: 400})
        }
        const storeId = store.id
        const updateOrder = await prisma.order.updateMany({
            where: {id: orderId, storeId},
            data: {status}
        })
        if(updateOrder.count === 0){
           return NextResponse.json({ error: "Order not found or does not belong to this store" }, { status: 404 });
        }
        return NextResponse.json({message: 'order status changes succeessfully'})
        
    } catch (error) {
        console.error('Failed to updated order', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }

}


//get orders

export async function GET(request){
    try {
        const {userId} = await auth()
        const store =  await authSeller(userId)
        if(!store){
            return NextResponse.json({error: 'unauthorized user'}, {status: 403})
        }
        const storeId = store.id
        const orders = await prisma.order.findMany({
            where: {storeId},
            include: {
                user: true,
                address: true,
                orderItems: {include: {product: true}}
            },
            orderBy: {createdAt: 'desc'}
        })
        return NextResponse.json({orders})
    } catch (error) {
        console.error('Failed to fetch order', error)
        console.error('Error name:', error?.name)
        console.error('Error message:', error?.message)
        console.error('Error stack:', error?.stack) 
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}