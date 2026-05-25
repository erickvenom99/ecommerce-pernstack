//Get all pending and rejected stores

import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request){
    try {
        const {userId} = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: Please log in to access this resource" }, 
                { status: 401 }
            );
        }
        const isAdmin = await authAdmin(userId) 

            if(!isAdmin){
                return NextResponse.json({error: 'you are not authorized'}, {status: 401})
            }
        const stores = await prisma.store.findMany({
            where: {status: {in: ['pending', 'rejected']}},
            include: {user: true}
        })
        return NextResponse.json({success:true, stores}, {status: 200})
    }catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 500})
        
    }
}
