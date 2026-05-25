
import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//Get all approved stores

export async function GET(request){
    try {
        const {userId} = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: Please log in" }, 
                { status: 401 }
            );
        }
        const isAdmin = await authAdmin(userId)
            if(!isAdmin){
                return NextResponse.json({error: 'Forbidden: Admins only'}, {status: 403})
            }
        const ApproveStores = await prisma.store.findMany({
            where: {status: 'approved'},
            include: {user: true}
        })
        return NextResponse.json({success:true, ApproveStores}, {status: 200})
    }catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 500})
        
    }
}
