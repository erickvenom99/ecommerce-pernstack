// app/api/admin/dashboard/route.js

import authAdmin from "@/middleware/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
        }

        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 })
        }

        // 🟢 FIXED: Using concurrent Promise.all without forcing a transaction lock 
        // This lets the serverless database process queries flexibly as connections open up
        const [totalOrders, totalStores, totalProducts, revenueAggregation, recentOrders] = await Promise.all([
            prisma.order.count().catch(() => 0), // Fallback safety catch definitions
            prisma.store.count().catch(() => 0),             
            prisma.product.count().catch(() => 0),
            
            prisma.order.aggregate({
                _sum: {
                    total: true
                }
            }).catch(() => ({ _sum: { total: 0 } })),

            prisma.order.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    createdAt: true,
                    total: true,
                    status: true  
                }
            }).catch(() => [])
        ]);

        // Safe extraction
        const rawRevenue = revenueAggregation?._sum?.total || 0;
        const formattedRevenue = Number(rawRevenue).toFixed(2);

        return NextResponse.json({
            dashboardData: {
                totalOrders,
                totalStores,
                totalProducts,
                revenue: formattedRevenue,
                recentOrders 
            }
        }, { status: 200 })

    } catch (error) {
        console.error("ADMIN DASHBOARD PIPELINE BREAKAGE:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}