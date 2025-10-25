"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  ArrowLeft,
  BookOpen, 
  User, 
  Video, 
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle,
  Copy,
  Mail,
  Bell
} from "lucide-react"
import Link from "next/link"

interface Instructor {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  category: string
  duration: string
  meeting_link: string
  meeting_time: string
  meeting_date: string
  instructors: Instructor[]
  enrollment: {
    id: string
    status: string
    enrolled_at: string
  }
}

interface Notification {
  id: string
  message: string
  created_at: string
  instructor: {
    id: string
    name: string
  }
}

export default function StudentCourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails()
      fetchNotifications()
    }
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
      }
    } catch (error) {
      console.error('Error fetching course details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}/notifications`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const copyMeetingLink = () => {
    if (course?.meeting_link) {
      navigator.clipboard.writeText(course.meeting_link)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading course details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course Not Found</h2>
          <Link href="/student/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <PageHeader
        title={course.title}
        subtitle="Course Details & Information"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link href="/student/courses">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info Card */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-white mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-gray-400">{course.description}</CardDescription>
                  </div>
                  <Badge className={`${
                    course.enrollment.status === 'active' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {course.enrollment.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Category</div>
                    <div className="text-white font-medium">{course.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Level</div>
                    <div className="text-white font-medium">{course.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-white font-medium">{course.duration}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Enrolled On</div>
                    <div className="text-white font-medium">
                      {new Date(course.enrollment.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructors Card */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Instructors ({course.instructors.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.instructors.map((instructor) => (
                  <div key={instructor.id} className="flex items-center gap-4 p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{instructor.name}</div>
                      <a 
                        href={`mailto:${instructor.email}`} 
                        className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        {instructor.email}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meeting Card */}
            {course.meeting_link && (
              <Card className="bg-[#1a1a1a] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-400" />
                    Meeting Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Date</span>
                      </div>
                      <div className="text-white font-semibold">
                        {new Date(course.meeting_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Time</span>
                      </div>
                      <div className="text-white font-semibold">{course.meeting_time}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-sm font-semibold text-purple-300 mb-2">Meeting Link</div>
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 px-3 py-2 bg-[#2a2a2a] rounded text-sm text-purple-300 truncate border border-[#3a3a3a]">
                        {course.meeting_link}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        onClick={copyMeetingLink}
                      >
                        {copiedLink ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <a 
                      href={course.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Meeting Now
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications Card */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-xs text-purple-400 font-semibold">
                            {notif.instructor.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/student/account-book">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Fee Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
