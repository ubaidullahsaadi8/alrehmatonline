"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LucideIcon, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Briefcase, 
  Star, 
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"

interface NavItemProps {
  href: string
  icon: LucideIcon
  title: string
  isActive?: boolean
}

function NavItem({ href, icon: Icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md px-3 py-2 transition-all",
        isActive && "bg-gray-800 text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  )
}

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const routes = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: Users,
      title: "Users",
    },
    {
      href: "/admin/instructors",
      icon: Users,
      title: "Instructors",
    },
    {
      href: "/admin/students",
      icon: Users,
      title: "Students",
    },
    {
      href: "/admin/messages",
      icon: MessageSquare,
      title: "Contact Messages",
    },
    {
      href: "/admin/courses",
      icon: BookOpen,
      title: "Courses",
    },
    {
      href: "/admin/course-requests",
      icon: MessageSquare,
      title: "Course Requests",
    },
    {
      href: "/admin/course-bookings",
      icon: BookOpen,
      title: "Course Bookings",
    },
    {
      href: "/admin/services",
      icon: Briefcase,
      title: "Services",
    },
    {
      href: "/admin/service-requests",
      icon: MessageSquare,
      title: "Service Requests",
    },
    {
      href: "/admin/service-bookings",
      icon: Briefcase,
      title: "Service Bookings",
    },
    {
      href: "/admin/testimonials",
      icon: Star,
      title: "Testimonials",
    },
    {
      href: "/admin/password-tools",
      icon: Settings,
      title: "Password Tools",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      title: "Settings",
    }
  ]
  
  const isActive = (href: string) => {
    
    if (href === "/admin" && pathname === "/admin") {
      return true;
    }
    
    return pathname === href || (pathname !== "/admin" && pathname.startsWith(href))
  }
  
  const navigation = (
    <div className="w-full space-y-6 pt-6">
      <div className="px-3">
        <h2 className="mb-2 px-3 text-lg font-semibold text-white tracking-tight">
          Admin Panel
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              title={route.title}
              isActive={isActive(route.href)}
            />
          ))}
          <Button
            variant="ghost"
            className="flex w-full items-center gap-x-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md px-3 py-2"
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex">
      {}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 bg-gray-900 border-gray-800 w-64 overflow-hidden">
          <ScrollArea className="h-full">
            {navigation}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {}
      <div className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          {navigation}
        </ScrollArea>
      </div>

      <div className="flex flex-col w-full min-h-screen lg:ml-64">
        {}
        <header className="h-16 border-b border-gray-800 bg-gray-900 sticky top-0 z-30">
          <div className="h-full flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-300"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-bold text-white hidden sm:block">
                HatBrain Admin
              </h1>
            </div>

            <div className="flex items-center gap-x-4">
              {user && (
                <div className="flex items-center gap-x-2">
                  <div className="text-sm text-gray-300 text-right hidden md:block">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                    <AvatarFallback className="bg-gray-700 text-gray-200">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </header>

        {}
        <main className="flex-1 bg-gray-100 dark:bg-gray-950">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
