//add coupon

export const dynamic = 'force-dynamic';

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
    const {userId} = await auth(request)

    const isAdmin = await authAdmin(userId)

    if(!isAdmin) {
        return NextResponse.json({error: 'unauthorized user'}, {status:403})
    }

    const body = await request.json()
    const coupon = body.coupon
    const normalizeCode = coupon.code.trim().toUpperCase()

    const existingCoupon = await prisma.coupon.findUnique({
        where: { code: normalizeCode }
        });

    if (existingCoupon) {
        return NextResponse.json(
            { error: `The coupon code '${normalizeCode}' already exists. Please choose a different name.` }, 
            { status: 400 }
        );
    }

    const createCoupon = await prisma.coupon.create({data: coupon})
        //run inngest schedular function 
        await inngest.send({
            name: "app.coupon.expired",
            data: {
                code: createCoupon.code,
                expiresAt: createCoupon.expiresAt,
            }
        })
   
    return NextResponse.json({message: 'coupon added successfully'}, {createCoupon}, {status: 200})
}
catch(error){
    console.error(error)
    return NextResponse.json({error: error.code || 'internal server error'}, {status: 500})
}


}


//delete coupon 

export async function DELETE(request){
    try{
        const {userId} = await auth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 })
        }
        const isAdmin = await authAdmin(userId)
        if(!isAdmin){
            return NextResponse.json({error: 'unauthorized user'}, {status:403})
        }
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        if (!code) {
            return NextResponse.json({ error: "Missing required 'code' query parameter" }, { status: 400 })
        }
       const deletedCoupon = await prisma.coupon.deleteMany({
            where: {code}
        })
        if(deletedCoupon.count === 0) {
            return NextResponse.json({error: 'coupon code not found or already deleted'}, {status: 404})
        }

        return NextResponse.json({message: 'Coupon deleted successfully'}, {status: 200})
    }catch(error){
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })

    }
}


//GET list of coupons

export async function GET(request){
    try{
        const {userId} = await auth(request)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const isAdmin = await authAdmin(userId)
        if(!isAdmin){
            return NextResponse.json({error: 'unauthorized user'}, {status:403})

        }
        const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({coupons}, {status: 200})
    }catch(error){
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })


    }
}
