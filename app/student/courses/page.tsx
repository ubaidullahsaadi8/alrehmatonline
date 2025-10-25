"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  BookOpen, 
  User, 
  Video, 
  Calendar,
  Clock,
  CheckCircle,
  GraduationCap,
  Mail,
  Copy,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
  duration: string;
  price: number;
  featured: boolean;
  meeting: {
    link: string;
    time: string;
    date: string;
  };
  instructors: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  }[];
  enrollment: {
    id: string;
    status: string;
    fee: number;
    discount: number;
    enrolled_at: string;
    progress: number;
    fee_type: string;
    monthly_amount: number;
    installments_count: number;
  };
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  useEffect(() => {
    fetchStudentCourses()
  }, [])

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(link)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const fetchStudentCourses = async () => {
    try {
      const response = await fetch('/api/student/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <PageHeader
        title="My Courses"
        subtitle="View and manage your enrolled courses"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-400">Loading courses...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Courses Enrolled</h3>
              <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-purple-500/50 transition-all overflow-hidden">
                {/* Course Header */}
                <div className="relative p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-b border-[#2a2a2a]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="px-2 py-1 bg-black/50 rounded">{course.category}</span>
                      <span className="px-2 py-1 bg-black/50 rounded">{course.level}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.enrollment.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      course.enrollment.status === 'completed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {course.enrollment.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Instructors Info */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase">Instructors ({course.instructors.length})</div>
                    {course.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{instructor.name}</p>
                          <a href={`mailto:${instructor.email}`} className="text-xs text-gray-400 hover:text-purple-400 truncate block">
                            {instructor.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meeting Info */}
                  {course.meeting.link && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-300">Meeting Scheduled</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(course.meeting.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.meeting.time}
                        </span>
                      </div>
                      
                      {/* Meeting Link Display */}
                      <div className="bg-[#2a2a2a] rounded p-2 border border-[#3a3a3a]">
                        <div className="text-xs text-gray-400 mb-1">Meeting Link:</div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs text-purple-300 truncate">{course.meeting.link}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-purple-500/20"
                            onClick={() => copyMeetingLink(course.meeting.link)}
                          >
                            {copiedLink === course.meeting.link ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <a 
                          href={course.meeting.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join Now
                          </Button>
                        </a>
                        <Link href={`/student/courses/${course.id}/meeting`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Enrollment Info */}
                  <div className="pt-3 border-t border-[#2a2a2a]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Enrolled on</span>
                      <span className="text-gray-300">
                        {new Date(course.enrollment.enrolled_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/student/courses/${course.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
