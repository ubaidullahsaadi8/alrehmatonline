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
  ChevronLeft
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
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

interface Service {
  id: string
  title: string
  description: string
  image: string | null
  features: string[] | null
  price: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewContentDialogOpen, setIsViewContentDialogOpen] = useState(false)
  
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    content: "",
    price: "",
    featured: false
  })
  
  useEffect(() => {
    checkAuth()
    fetchServices()
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
  
  async function fetchServices() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  async function handleCreateService() {
    setActionLoading("create")
    try {
      
      const priceValue = formData.price ? parseFloat(formData.price) : null
      
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
          content: formData.content,
          price: priceValue,
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Service created successfully"
        })
        
        setIsCreateDialogOpen(false)
        resetForm()
        fetchServices()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create service",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating service:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleUpdateService() {
    if (!selectedService) return
    
    setActionLoading("update")
    try {
      
      const priceValue = formData.price ? parseFloat(formData.price) : null
      
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
          content: formData.content,
          price: priceValue,
          featured: formData.featured
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Service updated successfully"
        })
        
        setIsEditDialogOpen(false)
        resetForm()
        fetchServices()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update service",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating service:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  async function handleDeleteService() {
    if (!selectedService) return
    
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Service deleted successfully"
        })
        
        setIsDeleteDialogOpen(false)
        setServices(services.filter(s => s.id !== selectedService.id))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }
  
  function handleEditClick(service: Service) {
    setSelectedService(service)
    setFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.image || "",
      content: service.features ? service.features.join('\n') : "",
      price: service.price || "",
      featured: service.featured
    })
    setIsEditDialogOpen(true)
  }
  
  function handleDeleteClick(service: Service) {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }
  
  function handleViewContentClick(service: Service) {
    setSelectedService(service)
    setIsViewContentDialogOpen(true)
  }
  
  function resetForm() {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      content: "",
      price: "",
      featured: false
    })
  }
  
  const filteredServices = searchTerm
    ? services.filter(
        service =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : services

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your services and offerings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-8 w-full md:w-[250px] bg-white dark:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchServices()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
            resetForm()
            setIsCreateDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="h-12 w-12 mb-2 opacity-30 border-2 rounded-full border-dashed flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
          <p>No services found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              resetForm()
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first service
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {service.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {service.price ? (
                    <p className="font-semibold">${service.price}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">No price set</p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Created: {format(new Date(service.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewContentClick(service)}
                >
                  View Content
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditClick(service)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleDeleteClick(service)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Service Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service to showcase on your website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Web Development"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the service"
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
                placeholder="Detailed description of your service"
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
              onClick={handleCreateService}
              disabled={actionLoading === "create"}
            >
              {actionLoading === "create" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details for this service.
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
              onClick={handleUpdateService}
              disabled={actionLoading === "update"}
            >
              {actionLoading === "update" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Service Content Dialog */}
      <Dialog open={isViewContentDialogOpen} onOpenChange={setIsViewContentDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedService?.title}</DialogTitle>
            <DialogDescription>
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-auto">
            <div className="space-y-4 py-4">
              {selectedService?.image && (
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-auto rounded-md"
                />
              )}
              
              <div className="whitespace-pre-line">
                {selectedService?.features && selectedService.features.join('\n')}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewContentDialogOpen(false)}>
              Close
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
              This will permanently delete the service "{selectedService?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading === "delete"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              disabled={actionLoading === "delete"}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading === "delete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
