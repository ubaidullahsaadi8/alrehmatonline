"use client"

import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Search, 
  RefreshCw, 
  Plus,
  Trash, 
  Star,
  PencilLine,
  UserRound
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string | null
  rating: number
  featured: boolean
  createdAt: string
}

export default function TestimonialsPage() {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar: "",
    rating: 5,
    featured: false
  })
  
  useEffect(() => {
    fetchTestimonials()
  }, [])
  
  async function fetchTestimonials() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  async function handleCreateTestimonial() {
    setActionLoading("create")
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          avatar: formData.avatar || null,
          rating: Number(formData.rating),
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial created successfully"
        })
        
        setIsCreateDialogOpen(false)
        resetForm()
        fetchTestimonials()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create testimonial",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating testimonial:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleUpdateTestimonial() {
    if (!selectedTestimonial) return
    
    setActionLoading("update")
    try {
      const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          avatar: formData.avatar || null,
          rating: Number(formData.rating),
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial updated successfully"
        })
        
        setIsEditDialogOpen(false)
        resetForm()
        fetchTestimonials()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update testimonial",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleDeleteTestimonial() {
    if (!selectedTestimonial) return
    
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully"
        })
        
        setIsDeleteDialogOpen(false)
        setTestimonials(testimonials.filter(t => t.id !== selectedTestimonial.id))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  function handleEditClick(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      avatar: testimonial.avatar || "",
      rating: testimonial.rating,
      featured: testimonial.featured
    })
    setIsEditDialogOpen(true)
  }
  
  function handleDeleteClick(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setIsDeleteDialogOpen(true)
  }
  
  function resetForm() {
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      avatar: "",
      rating: 5,
      featured: false
    })
  }
  
  const filteredTestimonials = searchTerm
    ? testimonials.filter(
        testimonial =>
          testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : testimonials

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and testimonials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search testimonials..."
              className="pl-8 w-full md:w-[250px] bg-white dark:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchTestimonials()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
            resetForm()
            setIsCreateDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="h-12 w-12 mb-2 opacity-30 border-2 rounded-full border-dashed flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
          <p>No testimonials found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              resetForm()
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first testimonial
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || undefined} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10">
                        {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {testimonial.role} at {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  {testimonial.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  {renderStarRating(testimonial.rating)}
                </div>
                <p className="text-sm line-clamp-3">{testimonial.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant={testimonial.featured ? "default" : "outline"}
                  size="sm"
                  className={testimonial.featured ? "bg-yellow-500 hover:bg-yellow-600" : "text-yellow-600 hover:text-yellow-700"}
                  onClick={() => {
                    // Toggle featured status
                    setSelectedTestimonial(testimonial);
                    setFormData({
                      ...formData,
                      name: testimonial.name,
                      role: testimonial.role,
                      company: testimonial.company,
                      content: testimonial.content,
                      avatar: testimonial.avatar || "",
                      rating: testimonial.rating,
                      featured: !testimonial.featured
                    });
                    // Immediately update
                    setTimeout(() => handleUpdateTestimonial(), 100);
                  }}
                >
                  <Star className={`h-4 w-4 mr-2 ${testimonial.featured ? "fill-white" : ""}`} />
                  {testimonial.featured ? "Featured" : "Feature"}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditClick(testimonial)}
                  >
                    <PencilLine className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleDeleteClick(testimonial)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Testimonial Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Create a new customer testimonial to display on your website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="CEO"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Acme Inc."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Testimonial</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Share your customer's experience..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (optional)</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                />
              </div>
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
              onClick={handleCreateTestimonial}
              disabled={actionLoading === "create"}
            >
              {actionLoading === "create" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Testimonial"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the details for this testimonial.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Testimonial</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-avatar">Avatar URL (optional)</Label>
                <Input
                  id="edit-avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating (1-5)</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                />
              </div>
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
              onClick={handleUpdateTestimonial}
              disabled={actionLoading === "update"}
            >
              {actionLoading === "update" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Testimonial"
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
              This will permanently delete the testimonial from "{selectedTestimonial?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading === "delete"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTestimonial}
              disabled={actionLoading === "delete"}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading === "delete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Testimonial"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
