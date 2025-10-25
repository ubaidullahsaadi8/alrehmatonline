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
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  ArrowLeft,
  UserX,
  Users,
  Search,
  RefreshCw,
  Mail,
  Clock,
  Calendar
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Student {
  id: string
  name: string
  email: string
  enrollmentDate: string
  status: string
}

interface Course {
  id: string
  title: string
}

export default function CourseStudentsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [removing, setRemoving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [params.id])

  async function fetchData(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      // Fetch course details
      const courseRes = await fetch(`/api/admin/courses/${params.id}`)
      if (!courseRes.ok) throw new Error("Failed to fetch course")
      const courseData = await courseRes.json()
      setCourse(courseData)

      // Fetch enrolled students
      const studentsRes = await fetch(`/api/admin/courses/${params.id}/students`)
      if (!studentsRes.ok) throw new Error("Failed to fetch students")
      const studentsData = await studentsRes.json()
      setStudents(studentsData)

    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load course students",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function handleRemoveStudent() {
    if (!selectedStudent) return

    try {
      setRemoving(true)
      
      const response = await fetch(
        `/api/admin/courses/${params.id}/students/${selectedStudent.id}`, 
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to remove student")
      }

      toast({
        title: "Success",
        description: "Student removed from course successfully"
      })

      // Remove student from local state
      setStudents(students.filter(s => s.id !== selectedStudent.id))
      setIsDeleteDialogOpen(false)

    } catch (error) {
      console.error("Error removing student:", error)
      toast({
        title: "Error",
        description: "Failed to remove student from course",
        variant: "destructive"
      })
    } finally {
      setRemoving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground mt-2">Loading students...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Course not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  // Filter students based on search term
  const filteredStudents = searchTerm
    ? students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : students

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Students</h1>
            <p className="text-muted-foreground">
              Manage students enrolled in {course.title}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-[250px] bg-white dark:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>
                {students.length} students enrolled in this course
              </CardDescription>
            </div>
            {filteredStudents.length !== students.length && (
              <Badge variant="secondary">
                Showing {filteredStudents.length} of {students.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No students enrolled yet</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No students match your search</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-4 group hover:bg-muted/50 rounded-lg px-4 -mx-4 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{student.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary"
                        className={student.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <UserX className="h-4 w-4 mr-2 text-red-500" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedStudent?.name} from this course?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStudent}
              disabled={removing}
              className="bg-red-600 hover:bg-red-700"
            >
              {removing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Remove Student"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}