"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Users, 
  Search, 
  MessageSquare, 
  BookOpen,
  Mail,
  Calendar,
  Filter
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  country?: string
  enrolled_courses: {
    course_id: string
    course_title: string
    enrolled_at: string
    progress: number
    status: string
  }[]
  total_courses: number
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    fetchTeacherStudents()
    fetchTeacherCourses()
  }, [])

  useEffect(() => {
    let filtered = students

    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    
    if (selectedCourse !== "all") {
      filtered = filtered.filter(student =>
        student.enrolled_courses.some(course => course.course_id === selectedCourse)
      )
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedCourse])

  const fetchTeacherStudents = async () => {
    try {
      const response = await fetch('/api/teacher/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
        setFilteredStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherCourses = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Loading students...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white w-full">
      <Navbar />
      
      <PageHeader
        title="My Students"
        subtitle="Manage and communicate with your enrolled students"
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
        
        <div className="relative z-10 max-w-[2000px] mx-auto">
          
          <Card className="bg-[#212121] border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Filter className="w-5 h-5" />
                Filter Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#2a2a2a] border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredStudents.length === 0 ? (
            <Card className="bg-[#212121] border-gray-700">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {students.length === 0 ? "No Students Yet" : "No Students Found"}
                </h3>
                <p className="text-gray-400">
                  {students.length === 0 
                    ? "You don't have any students enrolled in your courses yet."
                    : "No students match your current search criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="bg-[#212121] border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-16 w-16 border-2 border-blue-500/30">
                          <AvatarImage src={student.avatar || undefined} />
                          <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white">
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Mail className="w-4 h-4" />
                            {student.email}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                              {student.total_courses} Course{student.total_courses !== 1 ? 's' : ''}
                            </span>
                            {student.country && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                                {student.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      
                      <div className="flex flex-col md:flex-row gap-3">
                        <Link href={`/teacher/students/${student.id}`}>
                          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/teacher/messages?student=${student.id}`}>
                          <Button className="bg-white text-black hover:bg-gray-200">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </Link>
                      </div>
                    </div>

                    
                    {student.enrolled_courses.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-white font-semibold mb-3">Enrolled Courses:</h4>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {student.enrolled_courses.map((course) => (
                            <div key={course.course_id} className="p-3 bg-[#2a2a2a] rounded-lg">
                              <div className="text-white font-medium mb-1">{course.course_title}</div>
                              <div className="text-gray-400 text-sm mb-2">
                                Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Progress:</span>
                                <span className="text-blue-400 font-semibold">{course.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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