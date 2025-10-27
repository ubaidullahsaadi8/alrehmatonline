'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'

export default function NotificationBell() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/user/notifications/count')
        
        if (response.ok) {
          const data = await response.json()
          setCount(data.count || 0)
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }

    
    fetchNotificationCount()

    
    const interval = setInterval(fetchNotificationCount, 30000) 

    return () => clearInterval(interval)
  }, [user])

  if (!mounted) return null;

  // All users go to same notification page
  const notificationLink = '/dashboard/notifications'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            href={notificationLink} 
            className="relative inline-flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={`${count} notifications`}
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center bg-red-500 text-white px-1 font-bold rounded-full">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-900 text-white border-none shadow-lg">
          <p className="text-sm">{count === 0 ? 'No new notifications' : count === 1 ? '1 notification' : `${count} notifications`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
