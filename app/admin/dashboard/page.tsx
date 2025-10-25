"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, BookOpen, Briefcase, Star, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"


interface CountStats {
  users?: number
  contactMessages?: number
  courses?: number
  services?: number
  testimonials?: number
  loading: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<CountStats>({ loading: true })
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({ ...data, loading: false })
        } else {
          console.error('Failed to fetch stats')
          setStats({ loading: false })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({ loading: false })
      }
    }
    
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Users",
      value: stats.users ?? '...',
      description: "Total registered users",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Messages",
      value: stats.contactMessages ?? '...',
      description: "Contact messages received",
      icon: MessageSquare,
      color: "text-emerald-500"
    },
    {
      title: "Courses",
      value: stats.courses ?? '...',
      description: "Active courses",
      icon: BookOpen,
      color: "text-amber-500"
    },
    {
      title: "Services",
      value: stats.services ?? '...',
      description: "Services offered",
      icon: Briefcase,
      color: "text-purple-500"
    },
    {
      title: "Testimonials",
      value: stats.testimonials ?? '...',
      description: "Client testimonials",
      icon: Star,
      color: "text-pink-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your website content and users from this central hub.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loading ? '...' : card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-6">
        <Link href="/admin/course-requests">
          <Card className="hover:border-blue-400 transition-all cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Course Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage course information requests</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/course-bookings">
          <Card className="hover:border-blue-400 transition-all cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Course Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage course enrollments and bookings</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/service-requests">
          <Card className="hover:border-blue-400 transition-all cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage service information requests</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/service-bookings">
          <Card className="hover:border-blue-400 transition-all cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Service Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage service appointments and bookings</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="recent">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-4">Overview</h2>
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="popular">Popular Items</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="recent" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                The latest actions across your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm">New contact message received</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm">New course added</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>
                Most viewed and engaged content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm">Mobile App Development</p>
                    <p className="text-xs text-muted-foreground">Most viewed service</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm">AI & Machine Learning</p>
                    <p className="text-xs text-muted-foreground">Top selling course</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm">/services</p>
                    <p className="text-xs text-muted-foreground">Most visited page</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
