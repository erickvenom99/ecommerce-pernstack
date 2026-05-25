
import { prisma } from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try { 
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
        }
        
        const isAdmin = await authAdmin(userId)
        
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Forbidden: You do not have administrator permissions" }, 
                { status: 403 }
            )
        }
        
        const body = await request.json()
        const { storeId, status } = body
        
        if (!storeId || !["approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid store payload parameters" }, { status: 400 })
        }

        
        const updateStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: status === "approved", // Dynamically sets true/false based on status matching
            },
            select: {
                id: true,
                isActive: true,
                status: true
            }
        })

        return NextResponse.json({ 
            message: `Store ${status} updated successfully.`, 
            store: updateStore 
        }, { status: 200 })

    } catch (error) {
        console.error("Store approval mutation error:", error)
        return NextResponse.json(
            { error: "Internal Server Error: Transaction processing failed" }, 
            { status: 500 }
        )
    }
}