//display product 

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        let listProducts = await prisma.product.findMany({
            where: {inStock: true},
            include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true,
                        user: {select: {name: true, image: true}}
                    }
                },
                orderBy: {createdAt: 'desc'}
            }
        })
        //remove product with store isActive false
        listProducts = listProducts.filter(product => product.store.isActive)
        return NextResponse.json({message:'product fetched successfully', product}, {status: 200})
    } catch (error) {
        console.error('Failed to fetch product', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
        
    }
}