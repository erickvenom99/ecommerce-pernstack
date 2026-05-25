// app/admin/page.jsx (or your admin dashboard view file path)
'use client'

import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { useAuth } from "@clerk/nextjs"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from 'axios'

export default function AdminDashboard() {

    const { getToken } = useAuth()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    

    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalRevenue: 0, 
        revenue: 0,
        totalOrders: 0,
        totalStores: 0,
        recentOrders: [],
    })

    //  Mapped references to target the exact incoming transactional database keys
    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + (dashboardData.revenue || 0), icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.totalStores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            
            // 🟢 FIXED: Added leading forward slash to target absolute route accurately
            const res = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            setDashboardData(res.data.dashboardData)

        } catch (error) {
            console.error("Dashboard fetch error details:", error)
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center justify-between border border-slate-200 p-4 px-6 rounded-lg bg-white shadow-sm">
                            <div className="flex flex-col gap-1 text-xs font-medium tracking-wide">
                                <p className="text-slate-400 uppercase">{card.title}</p>
                                <b className="text-2xl font-semibold text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={44} className="w-11 h-11 p-2.5 text-slate-500 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart Component */}
            <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                <h2 className="text-lg font-medium text-slate-700 mb-4">Order Analytics Over Time</h2>
                <OrdersAreaChart allOrders={dashboardData?.recentOrders} />
            </div>
        </div>
    )
}