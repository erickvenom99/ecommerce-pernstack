import { prisma } from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//check authenicated Seller
export async function GET(request) {
    try {
        const { userId } = await auth()
        if(!userId) {
            return NextResponse.json({error: "unauthorized user"}, {status: 401})
        }
        const storeOwner= await authSeller(userId)

        if (!storeOwner) {
            return NextResponse.json({error: "unauthorized user" }, { status: 401 })
        }

        return NextResponse.json({storeOwner}, {status: 200})

    } catch (error) {
        console.error("Failed to fetch and authenticate seller info", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });

    }
}