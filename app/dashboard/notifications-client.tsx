'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, XCircle, Info, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  link?: string
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user/notifications?limit=3')
        
        if (response.ok) {
          const data = await response.json()
          
          console.log('Notifications API response:', data)
          
          
          setNotifications(Array.isArray(data) ? data : [])
        } else {
          console.error('Failed to fetch notifications', {
            status: response.status,
            statusText: response.statusText
          })
          
          
          try {
            const errorBody = await response.json()
            console.error('Error response body:', errorBody)
          } catch (e) {
            console.error('Could not parse error response')
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${id}`, {
        method: 'PUT',
      })
      
      if (response.ok) {
        
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="bg-[#212121] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-400" />
            Recent Notifications
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-[#2a2a2a] rounded-lg"></div>
          <div className="h-20 bg-[#2a2a2a] rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#212121] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Bell className="mr-2 h-5 w-5 text-blue-400" />
          Recent Notifications
        </h3>
        <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
          {notifications.filter(n => !n.read).length} Unread
        </Badge>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Bell className="h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-center">
              You don't have any notifications yet
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg ${!notification.read ? 'bg-blue-900/10 border border-blue-900/20' : 'bg-[#2a2a2a]'} 
                hover:bg-[#323232] cursor-pointer transition-colors duration-200`}
              onClick={() => {
                if (!notification.read) {
                  handleMarkAsRead(notification.id)
                }
                if (notification.link) {
                  window.location.href = notification.link
                }
              }}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-white">
                      {notification.title}
                      {!notification.read && <span className="ml-2 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">New</span>}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <Link href="/dashboard/notifications">
          <Button variant="ghost" className="w-full justify-center text-gray-300 hover:text-white hover:bg-[#2a2a2a]">
            View All Notifications
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
