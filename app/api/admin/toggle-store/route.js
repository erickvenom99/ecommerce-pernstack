import authAdmin from "@/middleware/authAdmin"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: Please log in" },
                { status: 401 }
            )
        }

        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Forbidden: Admins only" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { storeId } = body

        if (!storeId) {
            return NextResponse.json(
                { error: "Missing storeId" },
                { status: 400 }
            )
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                isActive: true,
                status: true,
            }
        })

        
        if (!store) {
            return NextResponse.json(
                { error: "Store not found" },
                { status: 404 }
            )
        }

        if (store.status !== "approved") {
            return NextResponse.json(
                { error: `Cannot toggle visibility — store is currently '${store.status}'` },
                { status: 400 }
            )
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive: !store.isActive },
            select: { isActive: true }
        })

        return NextResponse.json(
            { message: "Store status updated successfully", isActive: updatedStore.isActive },
            { status: 200 }
        )

    } catch (error) {
        console.error("Toggle store error:", error)
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },  
            { status: 500 }
        )
    }
}