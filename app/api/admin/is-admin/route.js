// app/api/admin/is-admin/route.js

import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // 1. Authenticate the user session via Clerk
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ isAdmin: false }, { status: 401 });
        }

        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ isAdmin: false }, { status: 403 });
        }

        return NextResponse.json({ isAdmin: true }, { status: 200 });

    } catch (error) {
        console.error("Role check endpoint failure:", error);
        return NextResponse.json({ isAdmin: false, error: "Internal Verification Error" }, { status: 500 });
    }
}