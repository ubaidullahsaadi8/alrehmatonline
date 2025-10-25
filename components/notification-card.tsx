"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NotificationCard() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/user/notifications/count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group/card bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-8 shadow-2xl border-4 border-white hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-700 hover:scale-105 hover:-translate-y-3 relative">
      {unreadCount > 0 && (
        <Badge className="absolute top-6 right-6 bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none animate-pulse shadow-lg px-3 py-1 font-bold">
          {unreadCount} New
        </Badge>
      )}
      <div className="relative mb-6">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017] shadow-xl group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500">
          <Bell className="w-8 h-8 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover/card:text-[#0f3a2e] transition-colors duration-300">Notifications</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {loading ? (
          "Loading..."
        ) : unreadCount > 0 ? (
          `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
        ) : (
          "View messages from instructors"
        )}
      </p>
      <Link href="/student/notifications" className="block">
        <Button className="w-full group/btn relative overflow-hidden px-6 py-4 bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl font-bold bg-size-200 animate-gradient-flow-slow">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Notifications <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
          </span>
        </Button>
      </Link>
    </div>
  )
}
