import { prisma } from "@/lib/prisma"; // Ensure prisma instance is explicitly imported
import authSeller from "@/middleware/authSeller"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 })
        }

        const storeInfo = await authSeller(userId)
        if (!storeInfo) {
            return NextResponse.json({ error: 'Seller store not found' }, { status: 401 })
        }
        
        const storeId = storeInfo.id 

        // 1. FIXED: Named variable orderMetrics to match calculation variables below
        // Note: Change to .order if your Prisma schema uses singular naming
        const orderMetrics = await prisma.order.aggregate({
            where: { storeId: storeId },
            _count: { id: true },
            _sum: { total: true }
        })

        // 2. FIXED: Count products using a standardized naming layout
        // Note: Change to .product if your Prisma schema uses singular naming
        const totalProductCount = await prisma.product.count({
            where: { storeId: storeId }
        })

        // 3. FIXED: Corrected .findMan typo to .findMany
        const sellerProduct = await prisma.product.findMany({
            where: { storeId: storeId },
            select: { id: true }
        })

        const productIds = sellerProduct.map(p => p.id)

        const ratings = await prisma.rating.findMany({
            where: { productId: { in: productIds } },
            include: {
                user: {
                    select: { name: true, imageUrl: true } 
                }, 
                product: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' } 
        });

        // 4. Clean variable reference matching
        const totalOrder = orderMetrics._count.id || 0;
        const totalEarnings = Math.round(orderMetrics._sum.total || 0);

        const dashboardData = {
            ratings,
            totalOrder,
            totalEarnings,
            totalProduct: totalProductCount // 👈 FIXED: Linked correctly now
        };

        return NextResponse.json({ success: true, dashboardData }, { status: 200 });

    } catch (error) {
        console.error("Dashboard metric data aggregation failed:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, 
            { status: 500 }
        );
    }
}