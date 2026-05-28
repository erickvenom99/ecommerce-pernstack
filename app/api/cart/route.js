import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
//update cart
export async function POST(request){
    try {
        const {userId} = await auth()
        if (!userId) {                            
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const {cart} = body
        if(!cart){
            return NextResponse.json({error: 'Missing cart on payload'}, {status: 400})
        }
        await prisma.user.update({
            where: {id: userId},
            data: {cart: cart}
        })
        return NextResponse.json({message: 'Cart successfully updated'}, {status: 200})
        
    } catch (error) {
        console.error('Failed to updated cart', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
        
    }
}

//get user cart

export async function GET(request){
    try {
        const {userId} = await auth()
        if (!userId) {                            
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const user = await prisma.user.findUnique({
            where: {id: userId},
        })

        if (!user) { 
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        const cart = user.cart
        return NextResponse.json({success: true, message: 'fetch cart successful', cart}, {status: 200})
    } catch (error) {
        console.error('Failed to fetch cart', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
        
    }
}