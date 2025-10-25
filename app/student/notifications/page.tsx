"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  BookOpen,
  User,
  Settings,
  CheckCircle,
  Circle,
  Filter,
  ExternalLink,
  Sparkles,
  GraduationCap,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  message: string
  title?: string | null
  created_at: string
  is_read: boolean
  read_at: string | null
  type: 'course' | 'admin'
  course?: {
    id: string
    title: string
  }
  instructor?: {
    id: string
    name: string
  }
  admin?: {
    name: string
  }
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "instructor" | "admin">("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/student/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/student/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
      await Promise.all(unreadIds.map(id => 
        fetch(`/api/student/notifications/${id}/read`, { method: 'POST' })
      ))
      setNotifications(notifications.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.is_read
    if (filter === "instructor") return notification.type === 'course'
    if (filter === "admin") return notification.type === 'admin'
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageSquare className="w-4 h-4" />
      case "announcement": return <Bell className="w-4 h-4" />
      case "meeting_update": return <Calendar className="w-4 h-4" />
      case "assignment": return <BookOpen className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "message": return "bg-blue-500/20 text-blue-300"
      case "announcement": return "bg-purple-500/20 text-purple-300"
      case "meeting_update": return "bg-green-500/20 text-green-300"
      case "assignment": return "bg-orange-500/20 text-orange-300"
      default: return "bg-gray-500/20 text-gray-300"
    }
  }

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case "instructor": return <User className="w-4 h-4" />
      case "admin": return <Settings className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-900 text-xl font-bold">Loading notifications...</div>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-white w-full">
      <Navbar />
      
      {/* Stunning Hero Section */}
      <section className="relative pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
        {/* Mega Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Particles */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? "#E6B325" : "#0f3a2e",
                opacity: 0.2,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}

          {/* Islamic Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="notif-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.6">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 60 60"
                      to="360 60 60"
                      dur="40s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="60" cy="60" r="30" fill="none" stroke="#0f3a2e" strokeWidth="1.5" opacity="0.4">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="360 60 60"
                      to="0 60 60"
                      dur="30s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#notif-pattern)" />
            </svg>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E6B325]/30 to-transparent rounded-full blur-3xl animate-mega-pulse" />
          <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-[#0f3a2e]/20 to-transparent rounded-full blur-3xl animate-mega-pulse-reverse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gradient-to-r from-[#E6B325]/30 via-[#D4A017]/20 to-[#E6B325]/30 border-2 border-[#E6B325]/50 w-max backdrop-blur-md shadow-2xl shadow-[#E6B325]/30 animate-glow-pulse">
            <Sparkles className="w-5 h-5 text-[#D4A017] animate-spin-slow" />
            <Bell className="w-5 h-5 text-[#E6B325] animate-bounce-subtle" />
            <span className="text-sm font-black text-[#0f3a2e] uppercase tracking-widest">
              {unreadCount} Unread Notifications
            </span>
            <TrendingUp className="w-5 h-5 text-[#D4A017] animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 text-center mb-4 animate-fade-in-scale">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
              Notifications
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 text-center px-4 animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
            Stay updated with messages from instructors and announcements
          </p>
        </div>
      </section>
      
      <div className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Filter Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-6 sm:p-8 mb-8 shadow-2xl border-4 border-white animate-slide-up-fade">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                  className={filter === "unread" ? "bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === "instructor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("instructor")}
                  className={filter === "instructor" ? "bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                >
                  <User className="w-4 h-4 mr-2" />
                  From Instructors
                </Button>
                <Button
                  variant={filter === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("admin")}
                  className={filter === "admin" ? "bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  From Admin
                </Button>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="border-[#0f3a2e] text-[#0f3a2e] hover:bg-[#0f3a2e] hover:text-white font-bold transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-12 shadow-2xl border-4 border-white text-center animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325] to-[#D4A017] rounded-full blur-2xl opacity-30" />
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017] mx-auto">
                  <Bell className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Notifications</h3>
              <p className="text-gray-600 text-lg">
                {filter === "all" 
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredNotifications.map((notification, index) => (
                <Link 
                  key={notification.id}
                  href={`/student/notifications/${notification.id}`}
                >
                  <div 
                    className={`group/notif bg-gradient-to-br from-white to-gray-50 rounded-[2rem] p-6 sm:p-8 shadow-xl border-4 border-white hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-500 hover:scale-[1.02] cursor-pointer animate-slide-up-fade ${
                      !notification.is_read ? 'ring-4 ring-[#E6B325]/50' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                            {!notification.is_read && (
                              <div className="w-3 h-3 bg-gradient-to-r from-[#E6B325] to-[#D4A017] rounded-full animate-pulse shadow-lg"></div>
                            )}
                            
                            {notification.type === 'course' ? (
                              <>
                                <Badge className="bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold px-3 py-1">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Course
                                </Badge>
                                
                                <Badge variant="outline" className="border-[#0f3a2e] text-[#0f3a2e] font-semibold px-3 py-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {notification.instructor?.name}
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Badge className="bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] text-white border-none font-bold px-3 py-1">
                                  <Settings className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                                
                                <Badge variant="outline" className="border-[#E6B325] text-[#D4A017] font-semibold px-3 py-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {notification.admin?.name}
                                </Badge>
                              </>
                            )}
                            
                            <span className="text-gray-500 text-sm font-medium">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2 text-base leading-relaxed font-medium">
                            {notification.message}
                          </p>
                          
                          {notification.type === 'course' && notification.course && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-semibold">{notification.course.title}</span>
                              </div>
                            </div>
                          )}
                          
                          {notification.title && (
                            <div className="text-sm text-gray-500 italic mt-2">
                              {notification.title}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          {!notification.is_read ? (
                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-bold px-3 py-1 shadow-lg">
                              New
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-600 border-none font-semibold px-3 py-1">
                              Read
                            </Badge>
                          )}
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover/notif:text-[#E6B325] transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}