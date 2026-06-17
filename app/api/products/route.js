//display product 

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        let listProducts = await prisma.product.findMany({
            where: {inStock: true},
            orderBy: {createdAt: 'desc'},
            include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true,
                        user: {select: {name: true, image: true}}
                    }
                },
                store: {
                    select: {
                        isActive: true,
                        name: true,
                        username: true,
                        logo: true,
                    }
                }
            }
        })
        //remove product with store isActive false
        const products = listProducts.filter(product => product.store.isActive)
        return NextResponse.json({message:'product fetched successfully', products:products}, {status: 200})
    } catch (error) {
        console.error('Failed to fetch product', error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
        
    }
}