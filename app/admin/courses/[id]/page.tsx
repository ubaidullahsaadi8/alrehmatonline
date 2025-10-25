"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Loader2, 
  Save,
  Trash, 
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  Tag,
  DollarSign
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

interface Course {
  id: string
  title: string
  description: string
  image: string
  price: number
  duration: string
  level: string
  instructor: string
  category: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface Instructor {
  id: string
  name: string
  role: string
  status: string
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [studentCount, setStudentCount] = useState<number>(0)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    price: 0,
    duration: "",
    level: "beginner",
    instructor: "",
    category: "",
    featured: false
  })
  
  useEffect(() => {
    fetchCourseData()
  }, [params.id])
  
  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch course details
      const courseResponse = await fetch(`/api/admin/courses/${params.id}`)
      if (!courseResponse.ok) {
        throw new Error("Failed to fetch course")
      }
      const courseData = await courseResponse.json()
      setCourse(courseData)
      setFormData({
        title: courseData.title,
        description: courseData.description,
        image: courseData.image,
        price: courseData.price,
        duration: courseData.duration,
        level: courseData.level.toLowerCase(),
        instructor: courseData.instructor,
        category: courseData.category,
        featured: courseData.featured
      })
      
      // Fetch instructors assigned to this course
      const instructorsResponse = await fetch(`/api/admin/courses/${params.id}/instructors`)
      if (instructorsResponse.ok) {
        const instructorsData = await instructorsResponse.json()
        setInstructors(instructorsData)
      }
      
      // Fetch student count
      const studentsResponse = await fetch(`/api/admin/courses/${params.id}/students/count`)
      if (studentsResponse.ok) {
        const { count } = await studentsResponse.json()
        setStudentCount(count)
      }
      
    } catch (error) {
      console.error("Error fetching course data:", error)
      toast({
        title: "Error",
        description: "Failed to load course data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/admin/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update course")
      }
      
      toast({
        title: "Success",
        description: "Course has been updated successfully.",
      })
      
      fetchCourseData() // Refresh data
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${params.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete course")
      }
      
      toast({
        title: "Success",
        description: "Course has been deleted successfully.",
      })
      
      router.push("/admin/courses")
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading course details...</p>
      </div>
    )
  }
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested course could not be found.
        </p>
        <Button asChild>
          <a href="/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <a href="/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </a>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Course
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="space-y-6 md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                Update the main information for this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://"
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="pl-8"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 8 weeks"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructor">Primary Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Feature this course on homepage</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Assigned Instructors</CardTitle>
              <CardDescription>
                Instructors who can teach this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {instructors.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg">
                  <GraduationCap className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No instructors assigned to this course yet
                  </p>
                  <Button className="mt-4" variant="outline">
                    Assign Instructor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-sm text-muted-foreground">{instructor.role}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    Assign Another Instructor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={formData.image || "/placeholder.jpg"}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.duration}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.category}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{formData.level}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{studentCount} Students Enrolled</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Last Updated: {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <a href={`/admin/courses/${params.id}/students`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Students
                </a>
              </Button>
              
              <Button className="w-full" variant="outline" asChild>
                <a href={`/admin/courses/${params.id}/content`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Content
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course &quot;{course.title}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}