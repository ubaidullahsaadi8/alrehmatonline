"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Video, 
  MessageSquare, 
  Edit, 
  Save,
  ExternalLink,
  Clock
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  image: string
  level: string
  category: string
  duration: string
  meeting_link?: string
  meeting_time?: string
  meeting_date?: string
  student_count: number
  students: any[]
}

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null)
  const [meetingData, setMeetingData] = useState({
    link: "",
    time: "",
    date: ""
  })

  useEffect(() => {
    fetchTeacherCourses()
  }, [])

  const fetchTeacherCourses = async () => {
    try {
      console.log('Fetching teacher courses...')
      const response = await fetch('/api/teacher/courses')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched courses data:', data)
        setCourses(data.courses || [])
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMeeting = (course: Course) => {
    setEditingMeeting(course.id)
    setMeetingData({
      link: course.meeting_link || "",
      time: course.meeting_time || "",
      date: course.meeting_date || ""
    })
  }

  const handleSaveMeeting = async (courseId: string) => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/meeting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      })

      if (response.ok) {
        
        setCourses(courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                meeting_link: meetingData.link,
                meeting_time: meetingData.time,
                meeting_date: meetingData.date
              }
            : course
        ))
        setEditingMeeting(null)
      }
    } catch (error) {
      console.error('Error saving meeting:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-white">Loading courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white w-full">
      <Navbar />
      
      <PageHeader
        title="My Courses"
        subtitle="Manage your assigned courses, students, and meetings"
        badge="Teacher"
      />
      
      <div className="relative w-full px-8 py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        
        <div className="relative z-10 max-w-[2000px] mx-auto">
          {courses.length === 0 ? (
            <Card className="bg-[#212121] border-gray-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-bold text-white">No Courses Assigned</h3>
                <p className="text-gray-400">You don't have any courses assigned yet. Contact admin to get courses assigned to you.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              {courses.map((course) => (
                <Card key={course.id} className="bg-[#212121] border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-xl text-white">{course.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {course.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-1 text-sm text-blue-300 rounded bg-blue-500/20">
                          {course.level}
                        </span>
                        <span className="px-2 py-1 text-sm text-purple-300 rounded bg-purple-500/20">
                          {course.category}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    
                    <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{course.student_count} Students</span>
                      </div>
                      <Link href={`/teacher/courses/${course.id}/students`}>
                        <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                          View Students
                        </Button>
                      </Link>
                    </div>

                    
                    <div className="p-4 bg-[#2a2a2a] rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-white">Meeting Information</span>
                        </div>
                        {editingMeeting === course.id ? (
                          <Button
                            size="sm"
                            onClick={() => handleSaveMeeting(course.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMeeting(course)}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {editingMeeting === course.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="meeting-link" className="text-gray-300">Meeting Link</Label>
                            <Input
                              id="meeting-link"
                              value={meetingData.link}
                              onChange={(e) => setMeetingData({...meetingData, link: e.target.value})}
                              placeholder="https://meet.google.com/..."
                              className="bg-[#1a1a1a] border-gray-600 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="meeting-date" className="text-gray-300">Date</Label>
                              <Input
                                id="meeting-date"
                                type="date"
                                value={meetingData.date}
                                onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                                className="bg-[#1a1a1a] border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="meeting-time" className="text-gray-300">Time</Label>
                              <Input
                                id="meeting-time"
                                type="time"
                                value={meetingData.time}
                                onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                                className="bg-[#1a1a1a] border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {course.meeting_link ? (
                            <div className="flex items-center gap-3">
                              <ExternalLink className="w-4 h-4 text-blue-400" />
                              <a 
                                href={course.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 truncate hover:text-blue-300"
                              >
                                {course.meeting_link}
                              </a>
                            </div>
                          ) : (
                            <div className="text-gray-500">No meeting link set</div>
                          )}
                          
                          {course.meeting_date && course.meeting_time ? (
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">
                                {new Date(course.meeting_date).toLocaleDateString()} at {course.meeting_time}
                              </span>
                            </div>
                          ) : (
                            <div className="text-gray-500">No meeting time set</div>
                          )}
                        </div>
                      )}
                    </div>

                    
                    <div className="flex gap-3">
                      <Link href={`/teacher/courses/${course.id}/messages`} className="flex-1">
                        <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-700">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </Link>
                      <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                        <Button className="w-full text-black bg-white hover:bg-gray-200">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Manage Course
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}