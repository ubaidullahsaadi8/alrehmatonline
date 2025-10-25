"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { ArrowLeft, Bell, User, BookOpen, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface NotificationDetail {
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

export default function NotificationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const notificationId = params.id as string
  
  const [notification, setNotification] = useState<NotificationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (notificationId) {
      fetchNotificationDetail()
      markAsRead()
    }
  }, [notificationId])

  const fetchNotificationDetail = async () => {
    try {
      const response = await fetch('/api/student/notifications')
      if (response.ok) {
        const data = await response.json()
        const notif = data.notifications.find((n: NotificationDetail) => n.id === notificationId)
        if (notif) {
          setNotification(notif)
        }
      }
    } catch (error) {
      console.error('Error fetching notification:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async () => {
    try {
      await fetch(`/api/student/notifications/${notificationId}/read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading notification...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Notification Not Found</h2>
          <Link href="/student/notifications">
            <Button>Back to Notifications</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <PageHeader
        title="Notification Detail"
        subtitle="View notification information"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/student/notifications">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notifications
          </Button>
        </Link>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    {notification.type === 'course' ? 'Course Notification' : 'Admin Notification'}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </div>
              </div>
              {notification.is_read && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Read
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Title (for admin notifications) */}
            {notification.title && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300">{notification.title}</h3>
              </div>
            )}

            {/* Message */}
            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
              <p className="text-gray-300 text-lg leading-relaxed">{notification.message}</p>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {notification.type === 'course' && notification.course && (
                <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">Course</span>
                  </div>
                  <Link 
                    href={`/student/courses/${notification.course.id}`}
                    className="text-white font-medium hover:text-purple-400 transition-colors"
                  >
                    {notification.course.title}
                  </Link>
                </div>
              )}

              <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{notification.type === 'course' ? 'Instructor' : 'From'}</span>
                </div>
                <div className="text-white font-medium">
                  {notification.type === 'course' ? notification.instructor?.name : notification.admin?.name}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Sent On</span>
                </div>
                <div className="text-white">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </div>

              {notification.read_at && (
                <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Read On</span>
                  </div>
                  <div className="text-white">
                    {new Date(notification.read_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
              {notification.type === 'course' && notification.course && (
                <Link href={`/student/courses/${notification.course.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Go to Course
                  </Button>
                </Link>
              )}
              <Link href="/student/notifications" className={notification.type === 'course' ? 'flex-1' : 'w-full'}>
                <Button variant="outline" className="w-full border-[#3a3a3a] text-gray-300 hover:bg-[#2a2a2a]">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
