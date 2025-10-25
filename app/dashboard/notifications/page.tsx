"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  ArrowLeft,
  Check,
  Filter,
  ChevronRight,
  ChevronDown,
  Loader2,
  Sparkles,
  GraduationCap,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { format } from "date-fns"
import Navbar from "@/components/navbar"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  link?: string
}

type NotificationsByDate = {
  [date: string]: Notification[]
}

export default function NotificationsPage() {
  const router = useRouter()
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  const [notificationsByDate, setNotificationsByDate] = useState<NotificationsByDate>({})
  const [activeTab, setActiveTab] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({})
  
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user/notifications')
        
        if (response.ok) {
          const data = await response.json()
          
          const notificationsArray = Array.isArray(data) ? data : []
          setAllNotifications(notificationsArray)
          
          
          const grouped = groupNotificationsByDate(notificationsArray)
          setNotificationsByDate(grouped)
          
          
          const expanded: { [key: string]: boolean } = {}
          Object.keys(grouped).forEach(date => {
            expanded[date] = true
          })
          setExpandedDates(expanded)
        } else {
          console.error('Failed to fetch notifications')
          setAllNotifications([])
          setNotificationsByDate({})
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setAllNotifications([])
        setNotificationsByDate({})
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  
  const groupNotificationsByDate = (notifications: Notification[]) => {
    
    if (!Array.isArray(notifications)) {
      return {}
    }
    
    return notifications.reduce<NotificationsByDate>((acc, notification) => {
      if (!notification || !notification.created_at) {
        return acc; 
      }
      
      const date = new Date(notification.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(notification)
      return acc
    }, {})
  }

  
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, "MMMM d, yyyy")
  }

  
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${id}`, {
        method: 'PUT',
      })
      
      if (response.ok) {
        
        setAllNotifications(prev => {
          if (!Array.isArray(prev)) return []
          return prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          )
        })
        
        
        setNotificationsByDate(prev => {
          const updated = { ...prev }
          for (const date in updated) {
            if (Array.isArray(updated[date])) {
              updated[date] = updated[date].map(notification => 
                notification.id === id 
                  ? { ...notification, read: true } 
                  : notification
              )
            }
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`/api/user/notifications/mark-all-read`, {
        method: 'PUT',
      })
      
      if (response.ok) {
        
        setAllNotifications(prev => {
          if (!Array.isArray(prev)) return []
          return prev.map(notification => ({ ...notification, read: true }))
        })
        
        
        setNotificationsByDate(prev => {
          const updated = { ...prev }
          for (const date in updated) {
            if (Array.isArray(updated[date])) {
              updated[date] = updated[date].map(notification => 
                ({ ...notification, read: true })
              )
            }
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  
  const toggleDateExpansion = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }))
  }

  
  const getFilteredNotificationsByDate = () => {
    const filtered: NotificationsByDate = {}
    
    if (!notificationsByDate) {
      return filtered;
    }
    
    for (const date in notificationsByDate) {
      
      if (!Array.isArray(notificationsByDate[date])) {
        continue;
      }
      
      const notifications = notificationsByDate[date].filter(notification => {
        if (activeTab === "all") return true
        if (activeTab === "unread") return !notification.read
        if (activeTab === "read") return notification.read
        return true
      })
      
      if (notifications.length > 0) {
        filtered[date] = notifications
      }
    }
    
    return filtered
  }

  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500 shrink-0" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500 shrink-0" />
    }
  }

  
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, "h:mm a")
  }

  const filteredNotificationsByDate = getFilteredNotificationsByDate()
  const hasFilteredNotifications = Object.keys(filteredNotificationsByDate).length > 0
  
  const unreadCount = Array.isArray(allNotifications) ? allNotifications.filter(n => !n.read).length : 0

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
                <pattern id="dash-notif-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#dash-notif-pattern)" />
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
            Stay updated with all your important messages and updates
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6 animate-fade-in-scale" style={{ animationDelay: "0.3s" }}>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="border-[#0f3a2e] text-[#0f3a2e] hover:bg-[#0f3a2e] hover:text-white font-bold transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllAsRead}
                className="bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold hover:from-[#D4A017] hover:to-[#E6B325] transition-all duration-300"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </section>
      
      <div className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

          {/* Filter Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-6 sm:p-8 mb-8 shadow-2xl border-4 border-white animate-slide-up-fade">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-[#E6B325]" />
                    All Notifications
                  </h2>
                  <p className="text-gray-600 mt-1 font-medium">
                    {unreadCount > 0 
                      ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                      : 'All caught up! No unread notifications'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#D4A017]" />
                  <span className="text-sm font-bold text-gray-700">Filter:</span>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-full">
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E6B325] data-[state=active]:to-[#D4A017] data-[state=active]:text-white font-bold rounded-full"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E6B325] data-[state=active]:to-[#D4A017] data-[state=active]:text-white font-bold rounded-full"
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger 
                    value="read"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E6B325] data-[state=active]:to-[#D4A017] data-[state=active]:text-white font-bold rounded-full"
                  >
                    Read
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          {loading ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-12 shadow-2xl border-4 border-white text-center animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
              <Loader2 className="h-12 w-12 animate-spin text-[#E6B325] mx-auto mb-4" />
              <p className="text-gray-700 font-bold text-lg">Loading notifications...</p>
            </div>
          ) : !hasFilteredNotifications ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-12 shadow-2xl border-4 border-white text-center animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325] to-[#D4A017] rounded-full blur-2xl opacity-30" />
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017] mx-auto">
                  <Bell className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Notifications</h3>
              <p className="text-gray-600 text-lg">
                {activeTab === "all" 
                  ? "You don't have any notifications yet" 
                  : `You don't have any ${activeTab} notifications`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredNotificationsByDate)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, notifications], dateIndex) => (
                  <Collapsible 
                    key={date} 
                    open={expandedDates[date]} 
                    onOpenChange={() => toggleDateExpansion(date)}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-[2rem] shadow-xl border-4 border-white overflow-hidden animate-slide-up-fade"
                    style={{ animationDelay: `${dateIndex * 100}ms` }}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50/50 transition-colors duration-300">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900 text-lg">{formatDateHeader(date)}</span>
                        <Badge className="bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none font-bold px-3 py-1">
                          {notifications.length}
                        </Badge>
                      </div>
                      {expandedDates[date] ? (
                        <ChevronDown className="h-6 w-6 text-[#D4A017]" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-[#D4A017]" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="divide-y divide-gray-200">
                        {notifications.map((notification, notifIndex) => (
                          <div 
                            key={notification.id} 
                            className={`p-6 hover:bg-gray-50/70 flex gap-4 cursor-pointer transition-all duration-300 ${!notification.read ? 'bg-[#E6B325]/5 border-l-4 border-[#E6B325]' : ''}`}
                            onClick={() => {
                              if (!notification.read) {
                                handleMarkAsRead(notification.id)
                              }
                              if (notification.link) {
                                router.push(notification.link)
                              }
                            }}
                          >
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  {notification.title}
                                  {!notification.read && (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-bold px-2 py-0.5 text-xs">New</Badge>
                                  )}
                                </h4>
                                <span className="text-sm text-gray-500 font-medium">
                                  {formatTime(notification.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
