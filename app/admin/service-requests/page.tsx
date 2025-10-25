"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, Search, Mail, Phone, Calendar, User, FileText, X, Check, ArrowLeft } from "lucide-react"

interface ServiceRequest {
  id: string
  name: string
  email: string
  phone: string | null
  courseId: string | null
  serviceId: string | null
  message: string
  status: string
  createdAt: string
}

interface Course {
  id: string
  title: string
}

interface Service {
  id: string
  title: string
}

export default function ServiceRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [filter, setFilter] = useState("all")
  
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        const response = await fetch("/api/service-requests")
        if (response.ok) {
          const data = await response.json()
          setRequests(data)
          setFilteredRequests(data)
        }

        
        const coursesResponse = await fetch("/api/courses")
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(Array.isArray(coursesData) ? coursesData : coursesData.courses || [])
        }

        
        const servicesResponse = await fetch("/api/services")
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(Array.isArray(servicesData) ? servicesData : servicesData.services || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  
  useEffect(() => {
    if (filter === "all") {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter(request => request.status === filter))
    }
  }, [filter, requests])

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        
        setRequests(prev => 
          prev.map(request => 
            request.id === requestId ? { ...request, status } : request
          )
        )
        
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest({ ...selectedRequest, status })
        }
      }
    } catch (error) {
      console.error("Error updating request status:", error)
    }
  }

  const getCourseTitle = (courseId: string | null) => {
    if (!courseId) return "N/A"
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : "Unknown Course"
  }

  const getServiceTitle = (serviceId: string | null) => {
    if (!serviceId) return "N/A"
    const service = services.find(s => s.id === serviceId)
    return service ? service.title : "Unknown Service"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-600">Pending</Badge>
      case "contacted":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-600">Contacted</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-600">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-600">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading service requests...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin")}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">
            Manage and respond to service information requests.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
            </span>
          </div>
        </div>
        
        <TabsContent value={filter} className="mt-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-60">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No service requests found</p>
                {filter !== "all" && (
                  <Button variant="ghost" onClick={() => setFilter("all")} className="mt-2">
                    View all requests
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(request.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell className="max-w-[180px] truncate">
                          <a href={`mailto:${request.email}`} className="text-blue-500 hover:underline">
                            {request.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {request.phone ? (
                            <a href={`tel:${request.phone}`} className="text-blue-500 hover:underline">
                              {request.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">
                          {request.courseId ? (
                            <span>Course: {getCourseTitle(request.courseId)}</span>
                          ) : request.serviceId ? (
                            <span>Service: {getServiceTitle(request.serviceId)}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">General inquiry</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedRequest(request)
                                setOpenDialog(true)
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <span>
                  Submitted on {format(new Date(selectedRequest.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedRequest.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <a href={`mailto:${selectedRequest.email}`} className="text-blue-500 hover:underline">
                          {selectedRequest.email}
                        </a>
                      </div>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <a href={`tel:${selectedRequest.phone}`} className="text-blue-500 hover:underline">
                            {selectedRequest.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Request Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Related To</p>
                      {selectedRequest.courseId ? (
                        <p>Course: {getCourseTitle(selectedRequest.courseId)}</p>
                      ) : selectedRequest.serviceId ? (
                        <p>Service: {getServiceTitle(selectedRequest.serviceId)}</p>
                      ) : (
                        <p>General inquiry</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <Select
                  defaultValue={selectedRequest.status}
                  onValueChange={(value) => handleStatusChange(selectedRequest.id, value)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="space-x-2">
                  <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedRequest.email}`}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
