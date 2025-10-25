"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  BookOpen,
  Copy,
  CheckCircle,
  ExternalLink,
  Mail,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface CourseData {
  id: string
  title: string
  description: string
  category: string
  level: string
  meeting: {
    link: string
    time: string
    date: string
  }
  instructor: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  enrollment: {
    status: string
    enrolled_at: string
  }
}

export default function MeetingDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch('/api/student/courses')
      if (response.ok) {
        const data = await response.json()
        const foundCourse = data.courses.find((c: CourseData) => c.id === courseId)
        setCourse(foundCourse || null)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyMeetingLink = () => {
    if (course?.meeting.link) {
      navigator.clipboard.writeText(course.meeting.link)
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
            <p className="text-lg text-gray-400">Loading meeting details...</p>
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
        title="Meeting Details"
        subtitle="View your course meeting information"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/student/courses">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Course Info Card */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2">{course.title}</CardTitle>
                  <p className="text-gray-400">{course.description}</p>
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
                  <div className="text-sm text-gray-400">Enrollment Status</div>
                  <div className="text-white font-medium capitalize">{course.enrollment.status}</div>
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

          {/* Instructor Card */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white">{course.instructor.name}</div>
                  <a 
                    href={`mailto:${course.instructor.email}`} 
                    className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {course.instructor.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Card */}
          {course.meeting.link && (
            <Card className="bg-[#1a1a1a] border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-400" />
                  Meeting Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meeting Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {new Date(course.meeting.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {course.meeting.time}
                    </div>
                  </div>
                </div>

                {/* Meeting Link */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="text-sm font-semibold text-purple-300 mb-3">Meeting Link</div>
                  <div className="flex items-center gap-3 mb-4">
                    <code className="flex-1 px-3 py-2 bg-[#2a2a2a] rounded text-sm text-purple-300 break-all border border-[#3a3a3a]">
                      {course.meeting.link}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      onClick={copyMeetingLink}
                    >
                      {copiedLink ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <a 
                    href={course.meeting.link} 
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

                {/* Instructions */}
                <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                  <div className="text-sm font-semibold text-white mb-2">Instructions</div>
                  <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    <li>Click "Join Meeting Now" to open the meeting in a new tab</li>
                    <li>Make sure you have a stable internet connection</li>
                    <li>Test your audio and video before joining</li>
                    <li>Join a few minutes early to avoid delays</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
