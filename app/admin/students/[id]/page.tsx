"use client"

import React, { use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  ArrowLeft,
  Book,
  BookOpen,
  Calendar,
  CreditCard,
  Edit,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react"

async function getStudent(id) {
  const url = `/api/admin/students/${id}`
  try {
    const res = await fetch(url, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
      throw new Error("Failed to fetch student")
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching student:", error)
    return null
  }
}

async function getStudentCourses(id) {
  const url = `/api/admin/students/${id}/courses`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
      throw new Error("Failed to fetch student courses")
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return []
  }
}

async function getStudentPayments(id) {
  const url = `/api/admin/students/${id}/payments`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
      throw new Error("Failed to fetch student payments")
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching student payments:", error)
    return []
  }
}

const messageFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

const feeFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Fee amount must be a positive number",
  }),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
  discount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Discount must be between 0 and 100",
  }).optional(),
})

const paymentFormSchema = z.object({
  feeId: z.string().min(1, "Fee is required"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Payment amount must be a positive number",
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Payment date is required"),
  reference: z.string().optional(),
})

const courseAssignmentSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
})

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
  active: boolean;
  account_status: string;
  is_approved: boolean;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: string;
  fee: number;
  discount?: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference?: string;
  description?: string;
  date: string;
  created_at: string;
}

interface AvailableCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  fee?: number;
  duration?: string;
  instructor?: string;
  status?: string;
  level?: string;
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  const studentIdRef = React.useRef(id)
  
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [student, setStudent] = React.useState<Student | null>(null)
  const [courses, setCourses] = React.useState<Course[]>([])
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  
  // Course assignment states
  const [availableCourses, setAvailableCourses] = React.useState<AvailableCourse[]>([])
  const [assignCourseOpen, setAssignCourseOpen] = React.useState(false)
  const [loadingCourses, setLoadingCourses] = React.useState(false)
  
  
  const messageForm = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  })
  
  const feeForm = useForm({
    resolver: zodResolver(feeFormSchema),
    defaultValues: {
      courseId: "",
      amount: "",
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
      discount: "0",
    },
  })
  
  const paymentForm = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      feeId: "",
      amount: "",
      paymentMethod: "cash",
      date: new Date().toISOString().split("T")[0],
      reference: "",
    },
  })

  const courseAssignmentForm = useForm({
    resolver: zodResolver(courseAssignmentSchema),
    defaultValues: {
      courseId: "",
      status: "enrolled",
      notes: "",
    },
  })

  React.useEffect(() => {
    let isMounted = true; // Use this flag to prevent state updates after unmount
    
    // Use the stable id from the ref to prevent re-renders
    const studentId = studentIdRef.current;
    
    async function loadStudentData() {
      if (!studentId) {
        console.error("Missing student ID");
        setLoading(false);
        return;
      }
      
      try {
        
        const studentData = await getStudent(studentId);
        
        if (!studentData) {
          if (isMounted) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load student data",
            });
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setStudent(studentData);
          
          
          const [coursesData, paymentsData] = await Promise.all([
            getStudentCourses(studentId),
            getStudentPayments(studentId)
          ]);
          
          if (isMounted) {
            setCourses(coursesData || []);
            setPayments(paymentsData || []);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error loading student data:", error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load student data",
          });
          setLoading(false);
        }
      }
    }
    
    setLoading(true);
    loadStudentData();
    
    
    return () => {
      isMounted = false;
    }
  }, [toast])

  // Fetch available courses for assignment
  const fetchAvailableCourses = async () => {
    try {
      setLoadingCourses(true)
      const response = await fetch('/api/admin/courses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const coursesData = await response.json()
      console.log('Available courses data:', coursesData)
      
      // Filter out courses already assigned to this student
      const enrolledCourseIds = courses.map(course => course.id)
      const filteredCourses = (coursesData || []).filter((course: AvailableCourse) => 
        !enrolledCourseIds.includes(course.id)
      )
      
      setAvailableCourses(filteredCourses)
    } catch (error) {
      console.error('Error fetching available courses:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available courses",
      })
    } finally {
      setLoadingCourses(false)
    }
  }

  // Open course assignment modal
  const openCourseAssignmentModal = () => {
    setAssignCourseOpen(true)
    fetchAvailableCourses()
  }

  // Handle course assignment
  const onAssignCourse = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/students/${id}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: data.courseId,
          status: data.status,
          notes: data.notes,
        }),
      })

      if (!response.ok) {
        // Get the actual error message from the API
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to assign course`)
      }

      const result = await response.json()
      
      toast({
        title: "Course Assigned",
        description: "Course has been successfully assigned to the student",
      })
      
      // Refresh student courses
      const updatedCourses = await getStudentCourses(id)
      setCourses(updatedCourses || [])
      
      // Reset form and close modal
      courseAssignmentForm.reset()
      setAssignCourseOpen(false)
    } catch (error) {
      console.error('Error assigning course:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign course to student",
      })
    }
  }

  const onSendMessage = (data: any) => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to the student",
    })
    messageForm.reset()
    setDialogOpen(false)
  }

  const onAssignFee = (data: any) => {
    const amount = parseFloat(data.amount)
    const discount = parseFloat(data.discount || "0")
    
    toast({
      title: "Fee assigned",
      description: `Fee of $${amount} assigned to the student with ${discount}% discount`,
    })
    feeForm.reset()
  }

  const onRecordPayment = (data: any) => {
    const amount = parseFloat(data.amount)
    
    toast({
      title: "Payment recorded",
      description: `Payment of $${amount} has been recorded`,
    })
    paymentForm.reset()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const calculateTotalPaid = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  const calculateTotalFees = () => {
    return courses.reduce((total, course) => {
      const discountedFee = course.fee * (1 - (course.discount || 0) / 100)
      return total + discountedFee
    }, 0)
  }

  const calculateRemainingBalance = () => {
    return calculateTotalFees() - calculateTotalPaid()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading student data...</p>
      </div>
    )
  }

  if (!student) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={student.avatar || "/placeholder-user.jpg"}
                  alt={student.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-center">{student.name}</CardTitle>
            <CardDescription className="text-center">{student.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
              )}
              {student.country && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{student.country}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(student.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                <span>{courses.length} Courses Enrolled</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Account Status</h4>
                <div>
                  {student.is_approved ? (
                    student.active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Inactive
                      </Badge>
                    )
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Pending Approval
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Total Fees:</div>
                  <div className="font-medium text-right">{formatCurrency(calculateTotalFees())}</div>
                  <div className="text-muted-foreground">Total Paid:</div>
                  <div className="font-medium text-right text-green-600">{formatCurrency(calculateTotalPaid())}</div>
                  <div className="text-muted-foreground">Balance:</div>
                  <div className="font-medium text-right text-red-600">{formatCurrency(calculateRemainingBalance())}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Message to {student.name}</DialogTitle>
                  <DialogDescription>
                    This message will be sent to the student's email address.
                  </DialogDescription>
                </DialogHeader>
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(onSendMessage)} className="space-y-4">
                    <FormField
                      control={messageForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={messageForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Type your message here..." rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Send Message</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Enrolled Courses</h2>
                <Dialog open={assignCourseOpen} onOpenChange={setAssignCourseOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={openCourseAssignmentModal}>
                      <Plus className="mr-2 h-4 w-4" />
                      Assign New Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Assign Course to Student</DialogTitle>
                      <DialogDescription>
                        Select a course to assign to {student.name}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...courseAssignmentForm}>
                      <form onSubmit={courseAssignmentForm.handleSubmit(onAssignCourse)} className="space-y-4">
                        <FormField
                          control={courseAssignmentForm.control}
                          name="courseId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Course</FormLabel>
                              <FormControl>
                                <Select 
                                  onValueChange={field.onChange}
                                  disabled={loadingCourses}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Choose a course"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {loadingCourses ? (
                                      <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">Loading courses...</span>
                                      </div>
                                    ) : availableCourses.length === 0 ? (
                                      <div className="flex items-center justify-center py-2">
                                        <span className="text-sm text-muted-foreground">No available courses</span>
                                      </div>
                                    ) : (
                                      availableCourses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                          <div className="flex flex-col">
                                            <span className="font-medium">{course.title}</span>
                                            <span className="text-sm text-muted-foreground">
                                              {course.category} - ${course.price || course.fee || 0}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={courseAssignmentForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enrollment Status</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="enrolled">Enrolled</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={courseAssignmentForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any additional notes..." rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setAssignCourseOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loadingCourses}>
                            {loadingCourses ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              "Assign Course"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {courses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No Courses Enrolled</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                      This student is not enrolled in any courses yet. Use the "Assign New Course" button to add a course.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">{course.category}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                course.status === "completed" ? "bg-green-100 text-green-800" :
                                course.status === "in_progress" ? "" : "bg-gray-100 text-gray-800"
                              }>
                                {course.status === "completed" ? "Completed" :
                                 course.status === "in_progress" ? "In Progress" : "Enrolled"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {course.discount ? (
                                <div>
                                  <span className="text-muted-foreground line-through mr-1">{formatCurrency(course.fee)}</span>
                                  <span className="font-medium">{formatCurrency(course.fee * (1 - course.discount/100))}</span>
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                                    {course.discount}% off
                                  </Badge>
                                </div>
                              ) : (
                                <span>{formatCurrency(course.fee)}</span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(course.start_date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <CreditCard className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Assign Fee</DialogTitle>
                                      <DialogDescription>
                                        Assign a fee for {course.title}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Form {...feeForm}>
                                      <form onSubmit={feeForm.handleSubmit(onAssignFee)} className="space-y-4">
                                        <FormField
                                          control={feeForm.control}
                                          name="amount"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Fee Amount</FormLabel>
                                              <FormControl>
                                                <Input placeholder="0.00" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={feeForm.control}
                                          name="dueDate"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Due Date</FormLabel>
                                              <FormControl>
                                                <Input type="date" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={feeForm.control}
                                          name="discount"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Discount (%)</FormLabel>
                                              <FormControl>
                                                <Input placeholder="0" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={feeForm.control}
                                          name="description"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Description</FormLabel>
                                              <FormControl>
                                                <Input placeholder="Fee description" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <DialogFooter>
                                          <Button type="submit">Assign Fee</Button>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
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
            
            <TabsContent value="payments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Payment History</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record New Payment</DialogTitle>
                      <DialogDescription>
                        Record a payment made by {student.name}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onRecordPayment)} className="space-y-4">
                        <FormField
                          control={paymentForm.control}
                          name="feeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fee</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a fee" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {}
                                    <SelectItem value="fee1">Course fee - Web Development</SelectItem>
                                    <SelectItem value="fee2">Course fee - Data Science</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Method</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reference</FormLabel>
                              <FormControl>
                                <Input placeholder="Payment reference" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Record Payment</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No Payment Records</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                        This student has no payment records yet. Use the "Record Payment" button to add a payment.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Course/Fee</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.description}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{payment.method}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
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
    </div>
  )
}
