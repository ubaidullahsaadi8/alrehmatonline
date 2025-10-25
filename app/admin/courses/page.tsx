"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Search, 
  RefreshCw, 
  Plus, 
  Trash, 
  PencilLine, 
  Image, 
  Star,
  X,
  Clock,
  GraduationCap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { format } from "date-fns"

interface Course {
  id: string
  title: string
  description: string
  image: string | null
  content?: string | null  
  price: number | string | null
  duration: string | null
  level: string | null
  instructor: string | null
  category: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function CoursesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    content: "",
    price: "",
    duration: "",
    level: "beginner",
    instructor: "",
    category: "",
    featured: false
  })
  
  useEffect(() => {
    checkAuth()
    fetchCourses()
  }, [])
  
  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/check")
      if (!response.ok) {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }
  
  async function fetchCourses() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  async function handleCreateCourse() {
    setActionLoading("create")
    try {
      
      const priceValue = formData.price ? parseFloat(formData.price) : null
      
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.imageUrl || null,  
          content: formData.content,
          price: priceValue,
          duration: formData.duration || null,
          level: formData.level || null,
          instructor: formData.instructor || "TBD",
          category: formData.category || "General",
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Course created successfully"
        })
        
        setIsCreateDialogOpen(false)
        resetForm()
        fetchCourses()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create course",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleUpdateCourse() {
    if (!selectedCourse) return
    
    setActionLoading("update")
    try {
      
      const priceValue = formData.price ? parseFloat(formData.price) : null
      
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.imageUrl || null, 
          content: formData.content,
          price: priceValue,
          duration: formData.duration || null,
          level: formData.level || null,
          instructor: formData.instructor || "TBD",
          category: formData.category || "General",
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Course updated successfully"
        })
        
        setIsEditDialogOpen(false)
        resetForm()
        fetchCourses()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update course",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating course:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleDeleteCourse() {
    if (!selectedCourse) return
    
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully"
        })
        
        setIsDeleteDialogOpen(false)
        setCourses(courses.filter(c => c.id !== selectedCourse.id))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  function handleEditClick(course: Course) {
    setSelectedCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.image || "",
      content: course.content || "",
      price: course.price ? String(course.price) : "",
      duration: course.duration || "",
      level: course.level || "beginner",
      instructor: course.instructor || "",
      category: course.category || "",
      featured: course.featured
    })
    setIsEditDialogOpen(true)
  }
  
  function handleDeleteClick(course: Course) {
    setSelectedCourse(course)
    setIsDeleteDialogOpen(true)
  }
  
  function resetForm() {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      content: "",
      price: "",
      duration: "",
      level: "beginner",
      instructor: "",
      category: "",
      featured: false
    })
  }
  
  function getLevelBadge(level: string | null) {
    if (!level) return null
    
    switch (level.toLowerCase()) {
      case 'beginner':
        return <Badge className="bg-green-500 hover:bg-green-600">Beginner</Badge>
      case 'intermediate':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Intermediate</Badge>
      case 'advanced':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Advanced</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }
  
  const filteredCourses = searchTerm
    ? courses.filter(
        course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and training programs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-full md:w-[250px] bg-white dark:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchCourses()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
            resetForm()
            setIsCreateDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="h-12 w-12 mb-2 opacity-30 border-2 rounded-full border-dashed flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p>No courses found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              resetForm()
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {course.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.level && getLevelBadge(course.level)}
                  {course.duration && (
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  {course.price ? (
                    <p className="font-semibold">${typeof course.price === 'number' ? course.price.toFixed(2) : parseFloat(String(course.price)).toFixed(2)}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">No price set</p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Created: {format(new Date(course.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/admin/courses/${course.id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditClick(course)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleDeleteClick(course)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course to showcase on your website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Advanced JavaScript Masterclass"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the course"
                className="resize-none"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. 99.99"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (optional)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g. 8 weeks"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select 
                  value={formData.level}
                  onValueChange={(value) => setFormData({...formData, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  placeholder="e.g. John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Detailed description of your course"
                rows={6}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
              />
              <Label htmlFor="featured">Feature on homepage</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCourse}
              disabled={actionLoading === "create"}
            >
              {actionLoading === "create" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the details for this course.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Short Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="resize-none"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (optional)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (optional)</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select 
                  value={formData.level}
                  onValueChange={(value) => setFormData({...formData, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input
                  id="edit-instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  placeholder="e.g. John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Full Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
              />
              <Label htmlFor="edit-featured">Feature on homepage</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCourse}
              disabled={actionLoading === "update"}
            >
              {actionLoading === "update" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course "{selectedCourse?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading === "delete"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={actionLoading === "delete"}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading === "delete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
