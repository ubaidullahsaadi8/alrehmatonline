'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Briefcase,
  BookOpen,
  Star,
  Settings,
} from 'lucide-react'

const adminLinks = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Instructors',
    href: '/admin/instructors',
    icon: Users
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: Briefcase
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpen
  },
  {
    name: 'Testimonials',
    href: '/admin/testimonials',
    icon: Star
  },
  {
    name: 'Messages',
    href: '/admin/messages',
    icon: Mail
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {adminLinks.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href)
          
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            <span>{link.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
