//get store info and store product 

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

export async function GET(request){

    try {

        const {searchParams} = request.nextUrl
        const username = searchParams.get('username')
        if(!username){
            return NextResponse.json({error: 'Missing username'}, {status: 400})
        }

        const storeProduct = await prisma.store.findUnique({
            where: {username: username.toLowerCase()},
            include: {products : {include: {rating: true}}}
        })
        if(!storeProduct) {
            return NextResponse.json({error: "Store not found"}, {status: 404})
        }

        if(!storeProduct.isActive){
            return NextResponse.json({error: "This store is currently unavailable"}, {status: 400})
        }

       if(storeProduct.status !== "approved") {
            return NextResponse.json({error: "The store front is currently unavailable"}, {status: 403})
        }

        const {products, ...storeInfo} = storeProduct

        return NextResponse.json({success: true, store: storeInfo, products: products}, {status: 200})

    }catch(error){
        console.error("Failed to find store and get product information", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });

    }
}