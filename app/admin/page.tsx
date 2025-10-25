"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Mail, BookOpen, Briefcase, RefreshCw, Star, Calendar, FileText, Database } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalMessages: number
  totalCourses: number
  totalServices: number
  totalTestimonials: number
  activeUsers: number
  featuredServices: number
  featuredCourses: number
  featuredTestimonials: number
  recentMessages: number
  unreadMessages: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalCourses: 0,
    totalServices: 0,
    totalTestimonials: 0,
    activeUsers: 0,
    featuredServices: 0,
    featuredCourses: 0,
    featuredTestimonials: 0,
    recentMessages: 0,
    unreadMessages: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])
  
  async function checkAuth() {
    try {
      console.log("Checking auth status...")
      const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store"
      })
      
      if (!response.ok) {
        console.log("Admin page: Auth check failed with status:", response.status)
        router.push("/admin/login")
        return
      }
      
      
      const userData = await response.json()
      console.log("Admin page: Auth check result:", userData)
      
      if (!userData) {
        console.log("Admin page: No user data returned")
        router.push("/admin/login")
        return
      }
      
      if (userData.role !== "admin") {
        console.log("Admin page: User is not an admin, role:", userData.role)
        router.push("/admin/login")
        return
      } 
      
      console.log("Admin page: User is authenticated as admin")
    } catch (error) {
      console.error("Admin page: Auth check error:", error)
      router.push("/admin/login")
    }
  }
  
  async function fetchStats() {
    setLoading(true)
    try {
      console.log("Fetching dashboard stats...")
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Dashboard stats received:", data)
        setStats(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch dashboard stats', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website metrics and content
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchStats()}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Stats
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading dashboard stats...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {stats.activeUsers} active
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400"
                    onClick={() => router.push('/admin/users')}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalMessages}</div>
                  <div className="p-2 bg-green-100 text-green-700 rounded-full dark:bg-green-900 dark:text-green-300">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {stats.unreadMessages > 0 ? (
                      <span className="text-green-600 font-medium">{stats.unreadMessages} unread</span>
                    ) : (
                      <span>{stats.recentMessages} new this week</span>
                    )}
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-green-600 dark:text-green-400"
                    onClick={() => router.push('/admin/messages')}
                  >
                    View all
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalServices}</div>
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-full dark:bg-amber-900 dark:text-amber-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {stats.featuredServices} featured
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-amber-600 dark:text-amber-400"
                    onClick={() => router.push('/admin/services')}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalCourses}</div>
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-full dark:bg-purple-900 dark:text-purple-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {stats.featuredCourses} featured
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-purple-600 dark:text-purple-400"
                    onClick={() => router.push('/admin/courses')}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalTestimonials}</div>
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-full dark:bg-rose-900 dark:text-rose-300">
                    <Star className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {stats.featuredTestimonials} featured
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-rose-600 dark:text-rose-400"
                    onClick={() => router.push('/admin/testimonials')}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>
                  Distribution of your website content
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Services</span>
                      <span className="text-sm font-medium">{stats.totalServices}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.totalServices / (stats.totalServices + stats.totalCourses + stats.totalTestimonials)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Courses</span>
                      <span className="text-sm font-medium">{stats.totalCourses}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.totalCourses / (stats.totalServices + stats.totalCourses + stats.totalTestimonials)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Testimonials</span>
                      <span className="text-sm font-medium">{stats.totalTestimonials}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.totalTestimonials / (stats.totalServices + stats.totalCourses + stats.totalTestimonials)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used management actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      className="h-auto py-4 justify-start"
                      onClick={() => router.push('/admin/messages')}
                    >
                      <Mail className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Messages</p>
                        <p className="text-xs text-muted-foreground">
                          View contact form submissions
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => router.push('/admin/services')}
                    >
                      <Briefcase className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Add Service</p>
                        <p className="text-xs text-muted-foreground">
                          Create a new service offering
                        </p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      className="h-auto py-4 justify-start"
                      onClick={() => router.push('/admin/courses')}
                    >
                      <BookOpen className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Add Course</p>
                        <p className="text-xs text-muted-foreground">
                          Create a new course
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => router.push('/admin/testimonials')}
                    >
                      <Star className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Add Testimonial</p>
                        <p className="text-xs text-muted-foreground">
                          Create a new testimonial
                        </p>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Overview of recent actions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {}
            <div className="py-8 text-center text-muted-foreground">
              <p>Activity tracking coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used management actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/messages')}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Messages</p>
                    <p className="text-xs text-muted-foreground">
                      View date-grouped messages
                    </p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Database className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">
                      Manage admin credentials
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/course-requests')}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Course Requests</p>
                    <p className="text-xs text-muted-foreground">
                      Manage course requests
                    </p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/course-bookings')}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Course Bookings</p>
                    <p className="text-xs text-muted-foreground">
                      Manage course bookings
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/messages')}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Contact Messages</p>
                    <p className="text-xs text-muted-foreground">
                      View contact form submissions
                    </p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/admin/services')}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Manage Services</p>
                    <p className="text-xs text-muted-foreground">
                      Update service offerings
                    </p>
                  </div>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full py-4 justify-center text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                onClick={async () => {
                  try {
                    if (confirm("Are you sure you want to run database migrations? This will update your database schema.")) {
                      const response = await fetch("/api/admin/migrate", {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        }
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        alert(`Migration successful: ${data.message}`);
                      } else {
                        const errorData = await response.json();
                        alert(`Migration failed: ${errorData.error || "Unknown error"}`);
                      }
                    }
                  } catch (error) {
                    console.error("Error running migration:", error);
                    alert("Migration failed. Check console for details.");
                  }
                }}
              >
                <RefreshCw className="h-5 w-5 mr-3" />
                <div className="text-center">
                  <p className="font-medium">Run Database Migrations</p>
                  <p className="text-xs text-muted-foreground">
                    Update database schema for course requests and bookings
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
