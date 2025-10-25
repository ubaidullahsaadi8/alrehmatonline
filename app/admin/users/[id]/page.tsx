"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  BookOpen,
  Briefcase,
  Clock,
  Calendar,
  CreditCard,
  PlusCircle,
  FileEdit,
  Trash2,
  Bell,
  Send,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Loader2,
  ChevronDown,
  BellRing
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"


interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  phone: string | null
  whatsapp: string | null
  telegram: string | null
  secondary_email: string | null
  address: string | null
  notes: string | null
  active: boolean
  created_at: string
  last_login: string | null
  currency: string | null
}

interface Course {
  id: string
  title: string
  status: string
  enrollment_date: string
  completion_date: string | null
  total_fee: number
  paid_amount: number
  due_date: string | null
  course_details: {
    image: string
    description: string
    duration: string
    level: string
    instructor: string
    category: string
  }
}

interface Service {
  id: string
  title: string
  status: string
  start_date: string
  end_date: string | null
  total_fee: number
  paid_amount: number
  due_date: string | null
  service_details: {
    image: string
    description: string
    features: string[]
  }
}

interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  reference: string | null
  notes: string | null
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

interface CourseToAssign {
  id: string
  title: string
  price: number
  duration: string
  instructor: string
}

interface ServiceToAssign {
  id: string
  title: string
  price: string
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const userId = id;
  
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userCourses, setUserCourses] = useState<Course[]>([])
  const [userServices, setUserServices] = useState<Service[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [addingCourse, setAddingCourse] = useState(false)
  const [addingService, setAddingService] = useState(false)
  const [addingPayment, setAddingPayment] = useState<{ type: 'course' | 'service', id: string } | null>(null)
  const [sendingNotification, setSendingNotification] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<CourseToAssign[]>([])
  const [availableServices, setAvailableServices] = useState<ServiceToAssign[]>([])
  const [selectedTab, setSelectedTab] = useState("profile")
  const [paymentHistory, setPaymentHistory] = useState<{ 
    course: Record<string, Payment[]>,
    service: Record<string, Payment[]> 
  }>({
    course: {},
    service: {}
  })

  
  const [newCourse, setNewCourse] = useState({
    courseId: "",
    status: "pending",
    totalFee: 0,
    paidAmount: 0,
    dueDate: ""
  })
  
  const [newService, setNewService] = useState({
    serviceId: "",
    status: "pending",
    totalFee: 0,
    paidAmount: 0,
    dueDate: ""
  })
  
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    paymentMethod: "cash",
    reference: "",
    notes: ""
  })
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info"
  })

  
  useEffect(() => {
    fetchUserData()
    fetchAvailableCourses()
    fetchAvailableServices()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      
      
      
      
      const userResponse = await fetch(`/api/admin/users/${userId}`)
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }
      const userData = await userResponse.json()
      setUser(userData)

      
      const coursesResponse = await fetch(`/api/admin/users/${userId}/courses`)
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setUserCourses(coursesData)
        
        
        const coursePayments: Record<string, Payment[]> = {}
        for (const course of coursesData) {
          const paymentsResponse = await fetch(`/api/admin/users/${userId}/courses/${course.id}/payments`)
          if (paymentsResponse.ok) {
            const paymentsData = await paymentsResponse.json()
            coursePayments[course.id] = paymentsData
          }
        }
        setPaymentHistory(prev => ({ ...prev, course: coursePayments }))
      }

      
      const servicesResponse = await fetch(`/api/admin/users/${userId}/services`)
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setUserServices(servicesData)
        
        
        const servicePayments: Record<string, Payment[]> = {}
        for (const service of servicesData) {
          const paymentsResponse = await fetch(`/api/admin/users/${userId}/services/${service.id}/payments`)
          if (paymentsResponse.ok) {
            const paymentsData = await paymentsResponse.json()
            servicePayments[service.id] = paymentsData
          }
        }
        setPaymentHistory(prev => ({ ...prev, service: servicePayments }))
      }

      
      const notificationsResponse = await fetch(`/api/admin/users/${userId}/notifications`)
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        
        setNotifications(Array.isArray(notificationsData) ? notificationsData : [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      console.log("Fetching available courses");
      const response = await fetch("/api/admin/courses")
      
      console.log("Courses API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json()
        console.log("Available courses data:", data);
        
        
        const coursesArray = Array.isArray(data) ? data : [];
        console.log(`Setting ${coursesArray.length} available courses`);
        
        setAvailableCourses(coursesArray);
        
        
        if (coursesArray.length === 0) {
          toast({
            title: "No Courses Found",
            description: "There are no courses available to assign.",
            variant: "default",
          });
        }
      } else {
        
        const errorText = await response.text();
        console.error("Error response from courses API:", errorText);
        
        toast({
          title: "Error",
          description: "Failed to load available courses.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load available courses. Please try again.",
        variant: "destructive",
      });
    }
  }

  const fetchAvailableServices = async () => {
    try {
      console.log("Fetching available services");
      const response = await fetch("/api/admin/services")
      
      console.log("Services API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json()
        console.log("Available services data:", data);
        
        
        const servicesArray = Array.isArray(data) ? data : [];
        console.log(`Setting ${servicesArray.length} available services`);
        
        setAvailableServices(servicesArray);
        
        
        if (servicesArray.length === 0) {
          toast({
            title: "No Services Found",
            description: "There are no services available to assign.",
            variant: "default",
          });
        }
      } else {
        
        const errorText = await response.text();
        console.error("Error response from services API:", errorText);
        
        toast({
          title: "Error",
          description: "Failed to load available services.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load available services. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/users/${userId}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: newCourse.courseId,
          status: newCourse.status,
          totalFee: newCourse.totalFee,
          paidAmount: newCourse.paidAmount,
          dueDate: newCourse.dueDate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add course")
      }

      toast({
        title: "Success",
        description: "Course has been assigned to the user.",
      })
      
      setAddingCourse(false)
      
      fetchUserData()
    } catch (error) {
      console.error("Error adding course:", error)
      toast({
        title: "Error",
        description: "Failed to assign course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/users/${userId}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: newService.serviceId,
          status: newService.status,
          totalFee: newService.totalFee,
          paidAmount: newService.paidAmount,
          dueDate: newService.dueDate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add service")
      }

      toast({
        title: "Success",
        description: "Service has been assigned to the user.",
      })
      
      setAddingService(false)
      
      fetchUserData()
    } catch (error) {
      console.error("Error adding service:", error)
      toast({
        title: "Error",
        description: "Failed to assign service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addingPayment) return
    
    try {
      const endpoint = addingPayment.type === 'course' 
        ? `/api/admin/users/${userId}/courses/${addingPayment.id}/payments` 
        : `/api/admin/users/${userId}/services/${addingPayment.id}/payments`
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: newPayment.amount,
          paymentMethod: newPayment.paymentMethod,
          reference: newPayment.reference,
          notes: newPayment.notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to record payment")
      }

      toast({
        title: "Success",
        description: "Payment has been recorded successfully.",
      })
      
      setAddingPayment(null)
      
      fetchUserData()
    } catch (error) {
      console.error("Error recording payment:", error)
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/users/${userId}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send notification")
      }

      toast({
        title: "Success",
        description: "Notification has been sent to the user.",
      })
      
      setSendingNotification(false)
      
      setNewNotification({
        title: "",
        message: "",
        type: "info"
      })
      
      fetchUserData()
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateCourseStatus = async (courseId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/courses/${courseId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update course status")
      }

      toast({
        title: "Success",
        description: "Course status has been updated.",
      })
      
      
      fetchUserData()
    } catch (error) {
      console.error("Error updating course status:", error)
      toast({
        title: "Error",
        description: "Failed to update course status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateServiceStatus = async (serviceId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/services/${serviceId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update service status")
      }

      toast({
        title: "Success",
        description: "Service status has been updated.",
      })
      
      
      fetchUserData()
    } catch (error) {
      console.error("Error updating service status:", error)
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      })
    }
  }

  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case 'completed':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case 'cancelled':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'info':
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  
  const handleCourseChange = (courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId)
    if (course) {
      setNewCourse({
        ...newCourse,
        courseId,
        totalFee: course.price,
        paidAmount: 0
      })
    }
  }

  
  const handleServiceChange = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId)
    if (service) {
      
      const priceNumber = parseFloat(service.price.replace(/[^0-9.]/g, ''))
      setNewService({
        ...newService,
        serviceId,
        totalFee: priceNumber,
        paidAmount: 0
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading user information...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested user could not be found.</p>
        <Button asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users List
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setSendingNotification(true)}
          >
            <Bell className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
          
          <Button onClick={() => router.push(`/admin/users/${userId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={user.avatar || "/placeholder-user.jpg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <Badge
                className={`${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {user.active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                    {user.whatsapp && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
                
                {user.telegram && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Telegram: {user.telegram}</span>
                  </div>
                )}
                
                {user.secondary_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Secondary: {user.secondary_email}</span>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-0">
            <div className="text-sm text-muted-foreground w-full">
              <div className="flex justify-between items-center py-1 border-t">
                <span>Member since</span>
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t">
                <span>Last login</span>
                <span>{user.last_login ? formatDate(user.last_login) : "Never"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t">
                <span>Currency</span>
                <span>{user.currency || "USD"}</span>
              </div>
            </div>
            
            {user.notes && (
              <div className="mt-4 border-t pt-4 w-full">
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted-foreground">{user.notes}</p>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="services">
                <Briefcase className="h-4 w-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <BellRing className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Enrolled Courses</h2>
                <Button size="sm" onClick={() => setAddingCourse(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Assign Course
                </Button>
              </div>
              
              {userCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Courses</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                    This user is not enrolled in any courses. Assign a course to get started.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setAddingCourse(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Assign First Course
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48">
                          <Image
                            src={course.course_details.image || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <Badge className={`mb-2 ${getStatusColor(course.status)}`}>
                                  {course.status}
                                </Badge>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>
                                  {course.course_details.description.substring(0, 100)}...
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Select onValueChange={(value) => updateCourseStatus(course.id, value)}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => setAddingPayment({ type: 'course', id: course.id })}
                                  >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Record Payment
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Course
                                  </Button>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Duration: {course.course_details.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Instructor: {course.course_details.instructor}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Enrolled: {formatDate(course.enrollment_date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Completion: {formatDate(course.completion_date)}</span>
                              </div>
                            </div>
                            
                            <div className="bg-muted p-3 rounded-md">
                              <div className="flex justify-between font-medium">
                                <span>Payment Progress:</span>
                                <span>
                                  {formatCurrency(course.paid_amount)} / {formatCurrency(course.total_fee)}
                                </span>
                              </div>
                              <div className="h-2 bg-muted-foreground/20 rounded-full mt-2 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (course.paid_amount / course.total_fee) * 100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>
                                  {Math.round((course.paid_amount / course.total_fee) * 100)}% Complete
                                </span>
                                <span>
                                  Balance: {formatCurrency(course.total_fee - course.paid_amount)}
                                </span>
                              </div>
                            </div>
                            
                            {}
                            {paymentHistory.course[course.id] && paymentHistory.course[course.id].length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Payment History</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Method</TableHead>
                                      <TableHead>Reference</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {paymentHistory.course[course.id].map((payment) => (
                                      <TableRow key={payment.id}>
                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{payment.payment_method}</Badge>
                                        </TableCell>
                                        <TableCell>{payment.reference || "-"}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Services</h2>
                <Button size="sm" onClick={() => setAddingService(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Assign Service
                </Button>
              </div>
              
              {userServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <Briefcase className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Services</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                    This user has not been assigned any services. Assign a service to get started.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setAddingService(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Assign First Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48">
                          <Image
                            src={service.service_details.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <Badge className={`mb-2 ${getStatusColor(service.status)}`}>
                                  {service.status}
                                </Badge>
                                <CardTitle>{service.title}</CardTitle>
                                <CardDescription>
                                  {service.service_details.description.substring(0, 100)}...
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Select onValueChange={(value) => updateServiceStatus(service.id, value)}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => setAddingPayment({ type: 'service', id: service.id })}
                                  >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Record Payment
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Service
                                  </Button>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Start Date: {formatDate(service.start_date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>End Date: {formatDate(service.end_date)}</span>
                              </div>
                            </div>
                            
                            <div className="bg-muted p-3 rounded-md">
                              <div className="flex justify-between font-medium">
                                <span>Payment Progress:</span>
                                <span>
                                  {formatCurrency(service.paid_amount)} / {formatCurrency(service.total_fee)}
                                </span>
                              </div>
                              <div className="h-2 bg-muted-foreground/20 rounded-full mt-2 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (service.paid_amount / service.total_fee) * 100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>
                                  {Math.round((service.paid_amount / service.total_fee) * 100)}% Complete
                                </span>
                                <span>
                                  Balance: {formatCurrency(service.total_fee - service.paid_amount)}
                                </span>
                              </div>
                            </div>
                            
                            {}
                            {paymentHistory.service[service.id] && paymentHistory.service[service.id].length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Payment History</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Method</TableHead>
                                      <TableHead>Reference</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {paymentHistory.service[service.id].map((payment) => (
                                      <TableRow key={payment.id}>
                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{payment.payment_method}</Badge>
                                        </TableCell>
                                        <TableCell>{payment.reference || "-"}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <Button size="sm" onClick={() => setSendingNotification(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
              
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <BellRing className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Notifications</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                    No notifications have been sent to this user.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSendingNotification(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send First Notification
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={`${notification.read ? '' : 'border-primary'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                          </div>
                          {!notification.read && (
                            <Badge>Unread</Badge>
                          )}
                        </div>
                        <CardDescription>
                          {formatDate(notification.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{notification.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Course Dialog */}
      <Dialog open={addingCourse} onOpenChange={setAddingCourse}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Course to User</DialogTitle>
            <DialogDescription>
              Select a course and set enrollment details for {user.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCourse}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Select Course</Label>
                <Select
                  value={newCourse.courseId}
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses && availableCourses.length > 0 ? (
                      availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} - {formatCurrency(course.price)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableCourses.length === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    No courses available. Please add courses first.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Enrollment Status</Label>
                <Select
                  value={newCourse.status}
                  onValueChange={(value) => setNewCourse({ ...newCourse, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalFee">Total Fee</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalFee"
                      type="number"
                      placeholder="Total fee"
                      className="pl-8"
                      value={newCourse.totalFee}
                      onChange={(e) => setNewCourse({ ...newCourse, totalFee: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Initial Payment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="paidAmount"
                      type="number"
                      placeholder="Initial payment"
                      className="pl-8"
                      value={newCourse.paidAmount}
                      onChange={(e) => setNewCourse({ ...newCourse, paidAmount: parseFloat(e.target.value) })}
                      max={newCourse.totalFee}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newCourse.dueDate}
                  onChange={(e) => setNewCourse({ ...newCourse, dueDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingCourse(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Service Dialog */}
      <Dialog open={addingService} onOpenChange={setAddingService}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Service to User</DialogTitle>
            <DialogDescription>
              Select a service and set details for {user.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Select Service</Label>
                <Select
                  value={newService.serviceId}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices && availableServices.length > 0 ? (
                      availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title} - {service.price}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-services" disabled>
                        No services available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableServices.length === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    No services available. Please add services first.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Service Status</Label>
                <Select
                  value={newService.status}
                  onValueChange={(value) => setNewService({ ...newService, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalFee">Total Fee</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalFee"
                      type="number"
                      placeholder="Total fee"
                      className="pl-8"
                      value={newService.totalFee}
                      onChange={(e) => setNewService({ ...newService, totalFee: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Initial Payment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="paidAmount"
                      type="number"
                      placeholder="Initial payment"
                      className="pl-8"
                      value={newService.paidAmount}
                      onChange={(e) => setNewService({ ...newService, paidAmount: parseFloat(e.target.value) })}
                      max={newService.totalFee}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newService.dueDate}
                  onChange={(e) => setNewService({ ...newService, dueDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingService(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={!!addingPayment} onOpenChange={(open) => !open && setAddingPayment(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {addingPayment?.type === 'course' ? 'course' : 'service'}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Payment amount"
                    className="pl-8"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={newPayment.paymentMethod}
                  onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number (Optional)</Label>
                <Input
                  id="reference"
                  placeholder="Transaction reference"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this payment"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingPayment(null)}>
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={sendingNotification} onOpenChange={setSendingNotification}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Notification to {user.name}</DialogTitle>
            <DialogDescription>
              This notification will appear in the user's profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendNotification}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Notification message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setSendingNotification(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Notification</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
