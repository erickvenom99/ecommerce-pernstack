import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { userId, has } = await auth()

    if (!userId) {                                    
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing coupon code' }, { status: 400 })
    }

    const useCoupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
        expiresAt: { gt: new Date() }
      }
    })

    if (!useCoupon) {
      return NextResponse.json({ error: 'Coupon not found or expired' }, { status: 404 })
    }

    if (useCoupon.forNewUser) {
      const userOrders = await prisma.order.findMany({
        where: {
          userId,
          //status: { in: ["PAID", "COMPLETED", "DELIVERED", "SHIPPED"] } 
        }
      })

      if (userOrders.length > 0) {
        return NextResponse.json(
          { error: 'Coupon is for new users only' },
          { status: 400 }
        )
      }
    }

    if (useCoupon.forMember) {
      const hasPlusPlan = has({ plan: 'plus' })
      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: 'Coupon is for plus members only' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ coupon: useCoupon }, { status: 200 })  // ✅ explicit 200

  } catch (error) {
    console.error('Error verifying coupon:', error)
    return NextResponse.json(
      { error: error?.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}