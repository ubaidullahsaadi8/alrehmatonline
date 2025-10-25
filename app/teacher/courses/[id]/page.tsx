"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Video, 
  MessageSquare, 
  Edit, 
  Save,
  ExternalLink,
  Clock,
  ArrowLeft,
  Copy,
  CheckCircle,
  DollarSign,
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Bell,
  Send
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  enrollment_date: string
  status: string
  fee_plan?: {
    id: string
    fee_type: string
    total_amount: number
    monthly_amount?: number
    currency: string
    status: string
  }
  payment_status?: string
}

interface Course {
  id: string
  title: string
  description: string
  image: string
  level: string
  category: string
  duration: string
  meeting_url?: string
  meeting_time?: string
  status: string
  student_count: number
  students: Student[]
}

export default function TeacherCourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingMeeting, setEditingMeeting] = useState(false)
  const [meetingData, setMeetingData] = useState({
    url: "",
    time: ""
  })
  const [copySuccess, setCopySuccess] = useState(false)
  const [editingBankDetails, setEditingBankDetails] = useState(false)
  const [savingBankDetails, setSavingBankDetails] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_title: "",
    account_number: "",
    iban: "",
    branch_code: "",
    payment_instructions: ""
  })
  const [notificationMessage, setNotificationMessage] = useState("")
  const [sendingNotification, setSendingNotification] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [studentNotificationMessage, setStudentNotificationMessage] = useState("")
  const [sendingStudentNotification, setSendingStudentNotification] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail()
      fetchBankDetails()
    }
  }, [courseId])

  const fetchCourseDetail = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setMeetingData({
          url: data.course.meeting_url || "",
          time: data.course.meeting_time || ""
        })
      }
    } catch (error) {
      console.error('Error fetching course detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBankDetails = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/bank-details`)
      if (response.ok) {
        const data = await response.json()
        if (data.bankDetails) {
          setBankDetails({
            bank_name: data.bankDetails.bank_name || "",
            account_title: data.bankDetails.account_title || "",
            account_number: data.bankDetails.account_number || "",
            iban: data.bankDetails.iban || "",
            branch_code: data.bankDetails.branch_code || "",
            payment_instructions: data.bankDetails.payment_instructions || ""
          })
        }
      }
    } catch (error) {
      console.error('Error fetching bank details:', error)
    }
  }

  const handleSaveMeeting = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/meeting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      })

      if (response.ok) {
        setCourse(prev => prev ? {
          ...prev,
          meeting_url: meetingData.url,
          meeting_time: meetingData.time
        } : null)
        setEditingMeeting(false)
      }
    } catch (error) {
      console.error('Error saving meeting:', error)
    }
  }

  const handleSaveBankDetails = async () => {
    try {
      setSavingBankDetails(true)
      const response = await fetch(`/api/teacher/courses/${courseId}/bank-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankDetails)
      })

      if (response.ok) {
        await fetchBankDetails()
        setEditingBankDetails(false)
      }
    } catch (error) {
      console.error('Error saving bank details:', error)
    } finally {
      setSavingBankDetails(false)
    }
  }

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substr(2, 9)
    const newLink = `https://meet.google.com/${meetingId}`
    setMeetingData(prev => ({ ...prev, url: newLink }))
  }

  const copyMeetingLink = async () => {
    if (course?.meeting_url) {
      await navigator.clipboard.writeText(course.meeting_url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300'
      case 'completed': return 'bg-blue-500/20 text-blue-300'
      case 'overdue': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300'
      case 'completed': return 'bg-blue-500/20 text-blue-300'
      case 'overdue': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const handleSendStudentNotification = async () => {
    if (!selectedStudent || !studentNotificationMessage.trim()) return

    try {
      setSendingStudentNotification(true)
      const response = await fetch(`/api/teacher/students/${selectedStudent.id}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Notification from ${course?.title}`,
          message: studentNotificationMessage,
          type: 'info'
        })
      })

      if (response.ok) {
        setStudentNotificationMessage("")
        setNotificationDialogOpen(false)
        alert('Notification sent successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Error sending notification')
    } finally {
      setSendingStudentNotification(false)
    }
  }

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) return
    
    setSendingNotification(true)
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notificationMessage.trim() })
      })

      if (response.ok) {
        setNotificationMessage("")
        alert("Notification sent to all students!")
      } else {
        alert("Failed to send notification")
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert("Error sending notification")
    } finally {
      setSendingNotification(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading course details...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-red-400">Course not found</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <div className="container py-8 mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/teacher/courses">
            <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>

        {/* Course Header */}
        <div className="mb-8">
          <PageHeader 
            title={course.title}
          />
          <p className="mb-4 text-gray-400">{course.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Badge className={getStatusColor(course.status)}>
              {course.status}
            </Badge>
            <Badge className="text-purple-300 bg-purple-500/20">
              {course.category}
            </Badge>
            <Badge className="text-blue-300 bg-blue-500/20">
              {course.level}
            </Badge>
            
            {/* Quick Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <Link href={`/teacher/courses/${courseId}/students`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  View All Students ({course.students.length})
                </Button>
              </Link>
              <Link href={`/teacher/courses/${courseId}/students`}>
                <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Course Management Panel */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Meeting Management */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Video className="w-5 h-5 text-green-400" />
                  Meeting Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingMeeting ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Meeting URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={meetingData.url}
                          onChange={(e) => setMeetingData(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="Enter meeting URL"
                          className="bg-[#2a2a2a] border-gray-600 text-white"
                        />
                        <Button 
                          onClick={generateMeetingLink}
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Meeting Time</Label>
                      <Input
                        type="time"
                        value={meetingData.time}
                        onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveMeeting} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingMeeting(false)}
                        className="text-gray-300 border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.meeting_url ? (
                      <div className="p-3 bg-[#2a2a2a] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Meeting URL</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyMeetingLink}
                            className="text-gray-300 border-gray-600"
                          >
                            {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <a 
                          href={course.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-blue-400 break-all hover:text-blue-300"
                        >
                          {course.meeting_url}
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#2a2a2a] rounded-lg text-gray-500">
                        No meeting URL set
                      </div>
                    )}
                    
                    {course.meeting_time && (
                      <div className="p-3 bg-[#2a2a2a] rounded-lg">
                        <span className="text-sm text-gray-400">Meeting Time</span>
                        <div className="text-white">{course.meeting_time}</div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => setEditingMeeting(true)}
                      variant="outline"
                      className="w-full text-gray-300 border-gray-600"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Meeting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Send Notification */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Send Notification
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Send notification to all enrolled students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Notification Message</Label>
                  <Textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message for students..."
                    className="bg-[#2a2a2a] border-gray-600 text-white min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={handleSendNotification}
                  disabled={sendingNotification || !notificationMessage.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingNotification ? "Sending..." : "Send Notification"}
                </Button>
              </CardContent>
            </Card>

            {/* Bank Details Management */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building2 className="w-5 h-5 text-yellow-400" />
                  Bank Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Payment information for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingBankDetails ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Bank Name</Label>
                      <Input
                        value={bankDetails.bank_name}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, bank_name: e.target.value }))}
                        placeholder="Enter bank name"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Account Title</Label>
                      <Input
                        value={bankDetails.account_title}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, account_title: e.target.value }))}
                        placeholder="Enter account title"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Account Number</Label>
                      <Input
                        value={bankDetails.account_number}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, account_number: e.target.value }))}
                        placeholder="Enter account number"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">IBAN (Optional)</Label>
                      <Input
                        value={bankDetails.iban}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, iban: e.target.value }))}
                        placeholder="Enter IBAN"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Branch Code (Optional)</Label>
                      <Input
                        value={bankDetails.branch_code}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, branch_code: e.target.value }))}
                        placeholder="Enter branch code"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Payment Instructions</Label>
                      <Textarea
                        value={bankDetails.payment_instructions}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, payment_instructions: e.target.value }))}
                        placeholder="Enter payment instructions or notes"
                        className="bg-[#2a2a2a] border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveBankDetails} 
                        disabled={savingBankDetails}
                        className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {savingBankDetails ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingBankDetails(false)}
                        className="text-gray-300 border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bankDetails.bank_name || bankDetails.account_number ? (
                      <>
                        {bankDetails.bank_name && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">Bank Name</span>
                            <div className="font-medium text-white">{bankDetails.bank_name}</div>
                          </div>
                        )}
                        {bankDetails.account_title && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">Account Title</span>
                            <div className="font-medium text-white">{bankDetails.account_title}</div>
                          </div>
                        )}
                        {bankDetails.account_number && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">Account Number</span>
                            <div className="font-medium text-white">{bankDetails.account_number}</div>
                          </div>
                        )}
                        {bankDetails.iban && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">IBAN</span>
                            <div className="font-medium text-white">{bankDetails.iban}</div>
                          </div>
                        )}
                        {bankDetails.branch_code && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">Branch Code</span>
                            <div className="font-medium text-white">{bankDetails.branch_code}</div>
                          </div>
                        )}
                        {bankDetails.payment_instructions && (
                          <div className="p-3 bg-[#2a2a2a] rounded-lg">
                            <span className="text-sm text-gray-400">Payment Instructions</span>
                            <div className="text-white whitespace-pre-wrap">{bankDetails.payment_instructions}</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-3 bg-[#2a2a2a] rounded-lg text-gray-500">
                        No bank details set
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => setEditingBankDetails(true)}
                      variant="outline"
                      className="w-full text-gray-300 border-gray-600 cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {bankDetails.bank_name || bankDetails.account_number ? 'Edit Bank Details' : 'Add Bank Details'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Course Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Students</span>
                  <span className="font-semibold text-white">{course.students.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Enrollments</span>
                  <span className="font-semibold text-white">
                    {course.students.filter(s => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="font-semibold text-white">{course.duration}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students List */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Enrolled Students ({course.students.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.students.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      No students enrolled yet
                    </div>
                  ) : (
                    course.students.map((student) => (
                      <div key={student.id} className="p-4 bg-[#2a2a2a] rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{student.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {student.email}
                                </div>
                                {student.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {student.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Enrollment Status */}
                            <Badge className={getStatusColor(student.status)}>
                              {student.status}
                            </Badge>
                            
                            {/* Fee Status */}
                            {student.fee_plan && (
                              <div className="flex items-center gap-1 text-sm">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">
                                  {student.fee_plan.fee_type === 'monthly' 
                                    ? `$${student.fee_plan.monthly_amount}/mo` 
                                    : `$${student.fee_plan.total_amount} total`
                                  }
                                </span>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <Dialog open={notificationDialogOpen && selectedStudent?.id === student.id} onOpenChange={(open) => {
                              setNotificationDialogOpen(open)
                              if (!open) {
                                setSelectedStudent(null)
                                setStudentNotificationMessage("")
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-purple-300 border-purple-600 hover:bg-purple-900/20"
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  <Bell className="w-4 h-4 mr-1" />
                                  Send Notification
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-[#1a1a1a] border-gray-800">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Send Notification to {student.name}</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Send a personal notification to this student
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label htmlFor="notification-message" className="text-gray-300">Message</Label>
                                    <Textarea
                                      id="notification-message"
                                      placeholder="Enter your notification message..."
                                      value={studentNotificationMessage}
                                      onChange={(e) => setStudentNotificationMessage(e.target.value)}
                                      className="bg-[#2a2a2a] border-gray-700 text-white mt-2"
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={handleSendStudentNotification}
                                      disabled={!studentNotificationMessage.trim() || sendingStudentNotification}
                                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                      {sendingStudentNotification ? (
                                        <>Sending...</>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4 mr-2" />
                                          Send Notification
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setNotificationDialogOpen(false)
                                        setSelectedStudent(null)
                                        setStudentNotificationMessage("")
                                      }}
                                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Link href={`/teacher/courses/${courseId}/students/${student.id}`}>
                              <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                                Manage Student
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Student Details */}
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-400">Enrolled: </span>
                            <span className="text-gray-300">
                              {new Date(student.enrollment_date).toLocaleDateString()}
                            </span>
                          </div>
                          {student.payment_status && (
                            <div>
                              <span className="text-gray-400">Payment: </span>
                              <Badge className={getStatusColor(student.payment_status)}>
                                {student.payment_status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}