"use client"

import React, { useState, useEffect, use } from "react"
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
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"


interface Instructor {
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
  is_approved: boolean
  account_status: string
  education: string
  country: string
  created_at: string
  last_login: string | null
  currency: string | null
}

interface Course {
  id: string
  title: string
  status: string
  start_date: string
  end_date: string | null
  image: string | null
  description: string
  level: string
  duration: string
  category: string
  students_count: number
}

interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  payment_type: string
  reference: string | null
  notes: string | null
  status: string
}

interface Salary {
  id: string
  month: string
  year: number
  amount: number
  payment_date: string | null
  status: string
  notes: string | null
}

interface CourseToAssign {
  id: string
  title: string
  description: string
  image: string | null
  level: string
  duration: string
}

export default function InstructorDetailPage({ params }: { params: { id: string } }) {
  
  const { id } = React.use(params);
  const instructorId = id;

  const router = useRouter()
  const { toast } = useToast()
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([])
  const [salaryHistory, setSalaryHistory] = useState<Salary[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [addingCourse, setAddingCourse] = useState(false)
  const [addingSalary, setAddingSalary] = useState(false)
  const [addingPayment, setAddingPayment] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<CourseToAssign[]>([])
  const [selectedTab, setSelectedTab] = useState("profile")
  const [processingApproval, setProcessingApproval] = useState(false)
  const [processingStatus, setProcessingStatus] = useState(false)

  
  const [newCourse, setNewCourse] = useState({
    courseId: "",
    startDate: "",
    endDate: "",
  })
  
  const [newSalary, setNewSalary] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: 0,
    status: "pending",
    notes: ""
  })
  
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    paymentType: "salary", 
    paymentMethod: "bank_transfer",
    reference: "",
    notes: ""
  })
  
  const [newMessage, setNewMessage] = useState({
    title: "",
    message: "",
    type: "info"
  })

  
  useEffect(() => {
    fetchInstructorData()
    fetchAvailableCourses()
  }, [instructorId])

  const fetchInstructorData = async () => {
    setLoading(true)
    try {
      
      const instructorResponse = await fetch(`/api/admin/instructors/${instructorId}`)
      if (!instructorResponse.ok) {
        throw new Error("Failed to fetch instructor data")
      }
      const instructorData = await instructorResponse.json()
      setInstructor(instructorData)

      
      const coursesResponse = await fetch(`/api/admin/instructors/${instructorId}/courses`)
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setInstructorCourses(coursesData)
      }

      
      const salaryResponse = await fetch(`/api/admin/instructors/${instructorId}/salary`)
      if (salaryResponse.ok) {
        const salaryData = await salaryResponse.json()
        setSalaryHistory(salaryData)
      }

      
      const paymentsResponse = await fetch(`/api/admin/instructors/${instructorId}/payments`)
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json()
        setPaymentHistory(paymentsData)
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error)
      toast({
        title: "Error",
        description: "Failed to load instructor data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses/unassigned")
      if (response.ok) {
        const data = await response.json()
        setAvailableCourses(data)
      }
    } catch (error) {
      console.error("Error fetching available courses:", error)
    }
  }

  const handleApproveInstructor = async () => {
    if (!instructor) return
    
    setProcessingApproval(true)
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approve: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve instructor")
      }

      setInstructor((prev) => prev ? {
        ...prev,
        is_approved: true,
        active: true,
        account_status: "active"
      } : null)

      toast({
        title: "Success",
        description: "Instructor has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving instructor:", error)
      toast({
        title: "Error",
        description: "Failed to approve instructor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingApproval(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!instructor) return
    
    setProcessingStatus(true)
    const newActiveStatus = !instructor.active
    
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: newActiveStatus,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${newActiveStatus ? 'activate' : 'deactivate'} instructor`)
      }

      setInstructor((prev) => prev ? {
        ...prev,
        active: newActiveStatus,
        account_status: newActiveStatus ? "active" : "inactive"
      } : null)

      toast({
        title: "Success",
        description: `Instructor has been ${newActiveStatus ? 'activated' : 'deactivated'} successfully.`,
      })
    } catch (error) {
      console.error(`Error ${instructor.active ? 'deactivating' : 'activating'} instructor:`, error)
      toast({
        title: "Error",
        description: `Failed to ${instructor.active ? 'deactivate' : 'activate'} instructor. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setProcessingStatus(false)
    }
  }

  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: newCourse.courseId,
          startDate: newCourse.startDate,
          endDate: newCourse.endDate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign course")
      }

      toast({
        title: "Success",
        description: "Course has been assigned to the instructor successfully.",
      })
      
      setAddingCourse(false)
      
      fetchInstructorData()
    } catch (error) {
      console.error("Error assigning course:", error)
      toast({
        title: "Error",
        description: "Failed to assign course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/salary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: newSalary.month,
          year: newSalary.year,
          amount: newSalary.amount,
          status: newSalary.status,
          notes: newSalary.notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add salary record")
      }

      toast({
        title: "Success",
        description: "Salary record has been added successfully.",
      })
      
      setAddingSalary(false)
      
      fetchInstructorData()
    } catch (error) {
      console.error("Error adding salary record:", error)
      toast({
        title: "Error",
        description: "Failed to add salary record. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: newPayment.amount,
          paymentType: newPayment.paymentType,
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
      
      setAddingPayment(false)
      
      fetchInstructorData()
    } catch (error) {
      console.error("Error recording payment:", error)
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newMessage.title,
          message: newMessage.message,
          type: newMessage.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast({
        title: "Success",
        description: "Message has been sent successfully.",
      })
      
      setSendingMessage(false)
      setNewMessage({
        title: "",
        message: "",
        type: "info"
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateSalaryStatus = async (salaryId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/salary/${salaryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update salary status")
      }

      toast({
        title: "Success",
        description: "Salary status has been updated successfully.",
      })
      
      
      setSalaryHistory((prev) => 
        prev.map((salary) => 
          salary.id === salaryId ? { ...salary, status } : salary
        )
      )
    } catch (error) {
      console.error("Error updating salary status:", error)
      toast({
        title: "Error",
        description: "Failed to update salary status. Please try again.",
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
      currency: instructor?.currency || 'USD'
    }).format(amount)
  }

  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return monthNames[month - 1]
  }

  const getStatusBadgeColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800"
      case 'paid':
        return "bg-green-100 text-green-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'unpaid':
        return "bg-red-100 text-red-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading instructor information...</p>
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Instructor Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested instructor could not be found.</p>
        <Button asChild>
          <Link href="/admin/instructors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Instructors List
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/instructors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Instructors
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          {!instructor.is_approved && (
            <Button
              onClick={handleApproveInstructor}
              disabled={processingApproval}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {processingApproval ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve Instructor
            </Button>
          )}
          
          {instructor.is_approved && (
            <Button
              variant={instructor.active ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={processingStatus}
            >
              {processingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : instructor.active ? (
                <XCircle className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {instructor.active ? "Deactivate" : "Activate"} Instructor
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setSendingMessage(true)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          
          <Button onClick={() => router.push(`/admin/instructors/${instructorId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={instructor.avatar || "/placeholder-user.jpg"}
                alt={instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle>{instructor.name}</CardTitle>
              <CardDescription>{instructor.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={instructor.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {instructor.active ? "Active" : "Inactive"}
                </Badge>
                
                <Badge
                  className={instructor.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {instructor.is_approved ? "Approved" : "Pending Approval"}
                </Badge>
                
                <Badge variant="outline">
                  Instructor
                </Badge>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{instructor.email}</span>
                </div>
                
                {instructor.education && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{instructor.education}</span>
                  </div>
                )}
                
                {instructor.country && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{instructor.country}</span>
                  </div>
                )}
                
                {instructor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{instructor.phone}</span>
                    {instructor.whatsapp && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/${instructor.whatsapp.replace(/\D/g, '')}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
                
                {instructor.telegram && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Telegram: {instructor.telegram}</span>
                  </div>
                )}
                
                {instructor.secondary_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Secondary: {instructor.secondary_email}</span>
                  </div>
                )}
                
                {instructor.address && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{instructor.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-0">
            <div className="text-sm text-muted-foreground w-full">
              <div className="flex justify-between items-center py-1 border-t">
                <span>Joined</span>
                <span>{formatDate(instructor.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t">
                <span>Last login</span>
                <span>{instructor.last_login ? formatDate(instructor.last_login) : "Never"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t">
                <span>Currency</span>
                <span>{instructor.currency || "USD"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t">
                <span>Courses</span>
                <span>{instructorCourses.length}</span>
              </div>
            </div>
            
            {instructor.notes && (
              <div className="mt-4 border-t pt-4 w-full">
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted-foreground">{instructor.notes}</p>
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
              <TabsTrigger value="salary">
                <DollarSign className="h-4 w-4 mr-2" />
                Salary
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Instructor Courses</h2>
                <Button size="sm" onClick={() => setAddingCourse(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Assign Course
                </Button>
              </div>
              
              {instructorCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Courses</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                    This instructor is not teaching any courses yet. Assign a course to get started.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setAddingCourse(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Assign First Course
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {instructorCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative w-full h-32">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getStatusBadgeColor(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{course.students_count} Students</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Start: {formatDate(course.start_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>End: {formatDate(course.end_date)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-auto"
                          asChild
                        >
                          <Link href={`/admin/courses/${course.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="salary" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Salary Management</h2>
                <Button size="sm" onClick={() => setAddingSalary(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Salary Record
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Salary History</CardTitle>
                  <CardDescription>
                    Manage monthly salary records for this instructor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {salaryHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                      <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No Salary Records</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                        No salary records have been added for this instructor yet.
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => setAddingSalary(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add First Salary Record
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salaryHistory.map((salary) => (
                          <TableRow key={salary.id}>
                            <TableCell>
                              {getMonthName(salary.month)} {salary.year}
                            </TableCell>
                            <TableCell>{formatCurrency(salary.amount)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(salary.status)}>
                                {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {salary.payment_date ? formatDate(salary.payment_date) : "-"}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={salary.notes || ""}>
                              {salary.notes || "-"}
                            </TableCell>
                            <TableCell>
                              {salary.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateSalaryStatus(salary.id, "paid")}
                                  >
                                    Mark Paid
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateSalaryStatus(salary.id, "cancelled")}
                                    className="text-red-500"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                              {(salary.status === "paid" || salary.status === "cancelled") && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                >
                                  <Link href={`/admin/instructors/${instructorId}/salary/${salary.id}`}>
                                    Details
                                  </Link>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Payment Records</h2>
                <Button size="sm" onClick={() => setAddingPayment(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Track all payments to and from the instructor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                      <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No Payment Records</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                        No payment records have been added for this instructor yet.
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => setAddingPayment(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add First Payment Record
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {payment.payment_type === "salary" ? "Salary Payment" : "Fee/Due"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.payment_method}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{payment.reference || "-"}</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={payment.notes || ""}>
                              {payment.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Course Dialog */}
      <Dialog open={addingCourse} onOpenChange={setAddingCourse}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Course to Instructor</DialogTitle>
            <DialogDescription>
              Select a course and set details for {instructor.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignCourse}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Select Course</Label>
                <Select
                  value={newCourse.courseId}
                  onValueChange={(value) => 
                    setNewCourse({ ...newCourse, courseId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.length > 0 ? (
                      availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} - {course.level}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>
                        No available courses to assign
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCourse.startDate}
                    onChange={(e) => 
                      setNewCourse({ ...newCourse, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCourse.endDate}
                    onChange={(e) => 
                      setNewCourse({ ...newCourse, endDate: e.target.value })
                    }
                  />
                </div>
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

      {/* Add Salary Dialog */}
      <Dialog open={addingSalary} onOpenChange={setAddingSalary}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Salary Record</DialogTitle>
            <DialogDescription>
              Create a new salary record for {instructor.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSalary}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select
                    value={newSalary.month.toString()}
                    onValueChange={(value) => 
                      setNewSalary({ ...newSalary, month: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newSalary.year}
                    onChange={(e) => 
                      setNewSalary({ ...newSalary, year: parseInt(e.target.value) })
                    }
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Salary amount"
                    className="pl-8"
                    value={newSalary.amount}
                    onChange={(e) => 
                      setNewSalary({ ...newSalary, amount: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newSalary.status}
                  onValueChange={(value) => 
                    setNewSalary({ ...newSalary, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this salary record"
                  value={newSalary.notes}
                  onChange={(e) => 
                    setNewSalary({ ...newSalary, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingSalary(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Salary Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={addingPayment} onOpenChange={setAddingPayment}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a new payment for {instructor.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={newPayment.paymentType}
                  onValueChange={(value) => 
                    setNewPayment({ ...newPayment, paymentType: value as 'salary' | 'due' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary Payment (To Instructor)</SelectItem>
                    <SelectItem value="due">Fee/Due (From Instructor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Payment amount"
                    className="pl-8"
                    value={newPayment.amount}
                    onChange={(e) => 
                      setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={newPayment.paymentMethod}
                  onValueChange={(value) => 
                    setNewPayment({ ...newPayment, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">Reference (Optional)</Label>
                <Input
                  id="reference"
                  placeholder="Transaction reference or ID"
                  value={newPayment.reference}
                  onChange={(e) => 
                    setNewPayment({ ...newPayment, reference: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this payment"
                  value={newPayment.notes}
                  onChange={(e) => 
                    setNewPayment({ ...newPayment, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingPayment(false)}>
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={sendingMessage} onOpenChange={setSendingMessage}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Message to {instructor.name}</DialogTitle>
            <DialogDescription>
              This message will be sent to the instructor's dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendMessage}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Message Title</Label>
                <Input
                  id="title"
                  placeholder="Enter message title"
                  value={newMessage.title}
                  onChange={(e) => 
                    setNewMessage({ ...newMessage, title: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here"
                  value={newMessage.message}
                  onChange={(e) => 
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Message Type</Label>
                <Select
                  value={newMessage.type}
                  onValueChange={(value) => 
                    setNewMessage({ ...newMessage, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
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
              <Button variant="outline" type="button" onClick={() => setSendingMessage(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
