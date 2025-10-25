"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { User, Mail, BookOpen, Search } from "lucide-react"

interface Instructor {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  courses: {
    id: string
    title: string
  }[]
}

export default function StudentInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/student/instructors')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.instructors || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load instructors",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
      toast({
        title: "Error",
        description: "Failed to load instructors",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.courses.some(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading instructors...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <PageHeader
        title="My Instructors"
        subtitle="View all instructors teaching your enrolled courses"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search instructors or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Total Count */}
        <div className="mb-6">
          <p className="text-gray-400">Showing <span className="font-semibold text-white">{filteredInstructors.length}</span> instructor{filteredInstructors.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Instructors Grid */}
        {filteredInstructors.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm ? "No instructors found" : "No instructors assigned"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "You haven't been assigned any instructors yet"
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} variant="outline" className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => (
              <Card key={instructor.id} className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate text-white">{instructor.name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href={`mailto:${instructor.email}`} className="text-sm hover:text-purple-400 truncate transition-colors">
                      {instructor.email}
                    </a>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-300">Courses ({instructor.courses.length})</h4>
                    <div className="space-y-1.5">
                      {instructor.courses.map((course) => (
                        <div key={course.id} className="flex items-start gap-2 p-2 bg-[#2a2a2a] rounded text-sm border border-[#3a3a3a] hover:border-purple-500/30 transition-colors">
                          <BookOpen className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 line-clamp-2">{course.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}