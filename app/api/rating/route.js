// rate product 

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        const {userId} = await auth()
        if(!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
        const body = await request.json()
        const{orderId, productId, rating, review} = body
        //validate input
        if(!orderId || !productId || !rating) {
            return NextResponse.json({error: 'Missing required fields'}, {status: 400})
        }
        if(rating < 1 || rating > 5) {
            return NextResponse.json({error: 'Rating must be between 1 and 5'}, {status: 400})
        }

        //check if user has purchased the product
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: userId
            },
            include: {
                orderItems: { include: { product: true } } 
                }
        })
        const hasPurchased = order.orderItems.some(item => item.productId == productId)
        if(!order || !hasPurchased) {
            return NextResponse.json({error: 'You can only rate products you have purchased'}, {status: 403})
        }
        const isAlreadyRated = await prisma.rating.findFirst({
            where: {
                userId: userId,
                productId: productId,
            }
        })
        if(isAlreadyRated) {
            return NextResponse.json({error: 'You have already rated this product'}, {status: 400})
        }

        const newRating = await prisma.rating.create({
            data: {
                userId: userId,
                productId: productId,
                rating: rating,
                review: review,
                orderId: orderId
            }
        })

        return NextResponse.json({message: 'Rating submitted successfully', rating: newRating}, {status: 201})  

    

    } catch (error) {
        console.error('Failed to submit rating', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
        
    }
}

//Get product Rating and Reviews
export async function GET(request) {
    try {
        const {userId} = await auth()
        if(!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
        const ratings = await prisma.rating.findMany({
            where: {userId}
        })

        return NextResponse.json({message: 'fetched rating successfully', rating: ratings}, {status: 201})
        
    } catch (error) {
        console.error('Failed to fetch ratings', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}