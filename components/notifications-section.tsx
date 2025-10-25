import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  link?: string
}

export default function NotificationsSection({
  notifications,
  onMarkAsRead
}: {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  if (notifications.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium mb-1">All caught up!</p>
          <p className="text-muted-foreground text-center">
            You don't have any notifications right now.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`${notification.read ? '' : 'border-primary'}`}
            onClick={() => {
              if (!notification.read) {
                onMarkAsRead(notification.id)
              }
              if (notification.link) {
                window.location.href = notification.link
              }
            }}
          >
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(notification.type)}
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="text-xs">New</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(notification.created_at)}
              </p>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
