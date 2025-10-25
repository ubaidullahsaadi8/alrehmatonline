"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  MessageSquare, 
  Send, 
  Users, 
  BookOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface Course {
  id: string
  title: string
  student_count: number
}

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function TeacherMessagesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  
  const [messageType, setMessageType] = useState<"all" | "course" | "individual">("all")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [messageCategory, setMessageCategory] = useState("message")

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (messageType === "course" && selectedCourse) {
      fetchCourseStudents(selectedCourse)
    } else if (messageType === "individual") {
      fetchAllStudents()
    }
  }, [messageType, selectedCourse])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/teacher/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchCourseStudents = async (courseId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teacher/courses/${courseId}/students`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching course students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teacher/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!title || !message) {
      setError("Please fill in all required fields")
      return
    }

    if (messageType === "course" && !selectedCourse) {
      setError("Please select a course")
      return
    }

    if (messageType === "individual" && !selectedStudent) {
      setError("Please select a student")
      return
    }

    setSending(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        title,
        message,
        type: messageCategory,
        messageType,
        courseId: messageType === "course" ? selectedCourse : null,
        studentId: messageType === "individual" ? selectedStudent : null
      }

      const response = await fetch('/api/teacher/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setSuccess("Message sent successfully!")
        
        setTitle("")
        setMessage("")
        setSelectedCourse("")
        setSelectedStudent("")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to send message")
      }
    } catch (error) {
      setError("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white w-full">
      <Navbar />
      
      <PageHeader
        title="Send Messages"
        subtitle="Send notifications and messages to your students"
        badge="Teacher"
      />
      
      <div className="relative py-16 px-8 w-full">
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
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-[#212121] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Compose Message
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send notifications to all students, specific course students, or individual students
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">{success}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              
              <div className="space-y-4">
                <Label className="text-white text-lg">Send To:</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-students"
                      checked={messageType === "all"}
                      onCheckedChange={() => setMessageType("all")}
                    />
                    <Label htmlFor="all-students" className="text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      All My Students
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="course-students"
                      checked={messageType === "course"}
                      onCheckedChange={() => setMessageType("course")}
                    />
                    <Label htmlFor="course-students" className="text-gray-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Specific Course
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="individual-student"
                      checked={messageType === "individual"}
                      onCheckedChange={() => setMessageType("individual")}
                    />
                    <Label htmlFor="individual-student" className="text-gray-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Individual Student
                    </Label>
                  </div>
                </div>
              </div>

              
              {messageType === "course" && (
                <div>
                  <Label htmlFor="course-select" className="text-gray-300">Select Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                      <SelectValue placeholder="Choose a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} ({course.student_count} students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              
              {messageType === "individual" && (
                <div>
                  <Label htmlFor="student-select" className="text-gray-300">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              
              <div>
                <Label htmlFor="message-category" className="text-gray-300">Message Type</Label>
                <Select value={messageCategory} onValueChange={setMessageCategory}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">General Message</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="meeting_update">Meeting Update</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <div>
                <Label htmlFor="title" className="text-gray-300">Subject *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter message subject..."
                  className="bg-[#2a2a2a] border-gray-600 text-white"
                />
              </div>

              
              <div>
                <Label htmlFor="message" className="text-gray-300">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                  className="bg-[#2a2a2a] border-gray-600 text-white"
                />
              </div>

              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendMessage}
                  disabled={sending || !title || !message}
                  className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                >
                  {sending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}