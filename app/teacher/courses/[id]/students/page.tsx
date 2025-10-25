"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Users, 
  User,
  Mail,
  Phone,
  DollarSign,
  MessageSquare,
  ArrowLeft,
  Search,
  Filter,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar
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
  last_payment_date?: string
  total_paid?: number
  outstanding_amount?: number
}

interface Course {
  id: string
  title: string
  description: string
  student_count: number
}

export default function CourseStudentsPage() {
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [message, setMessage] = useState({
    subject: "",
    content: ""
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourseAndStudents()
    }
  }, [courseId])

  useEffect(() => {
    filterStudentsList()
  }, [students, searchTerm, filterStatus])

  const fetchCourseAndStudents = async () => {
    try {
      console.log('Fetching course and students for:', courseId)
      const response = await fetch(`/api/teacher/courses/${courseId}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched data:', data)
        setCourse(data.course)
        setStudents(data.course.students || [])
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error fetching course and students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterStudentsList = () => {
    let filtered = [...students]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      if (filterStatus === "payment_pending") {
        filtered = filtered.filter(s => s.payment_status === 'pending' || s.payment_status === 'overdue')
      } else {
        filtered = filtered.filter(s => s.status === filterStatus)
      }
    }

    setFilteredStudents(filtered)
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  const handleSendMessage = async () => {
    if (!message.subject || !message.content || selectedStudents.length === 0) {
      alert("Please fill all fields and select at least one student")
      return
    }

    setSending(true)
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_ids: selectedStudents,
          subject: message.subject,
          content: message.content
        })
      })

      if (response.ok) {
        alert(`Message sent to ${selectedStudents.length} student(s)`)
        setShowMessageDialog(false)
        setMessage({ subject: "", content: "" })
        setSelectedStudents([])
      } else {
        alert("Failed to send message")
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert("Error sending message")
    } finally {
      setSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'completed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'suspended': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPaymentStatusIcon = (status?: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading students...</div>
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
          <div className="mb-6">
            <Link href="/teacher/courses">
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="mb-4 text-xl text-red-400">Course not found</div>
            <p className="text-gray-400">Course ID: {courseId}</p>
            <p className="mt-2 text-sm text-gray-500">
              Check the browser console (F12) for more details
            </p>
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
          <Link href={`/teacher/courses/${courseId}`}>
            <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <PageHeader 
            title={`Students in ${course.title}`}
          />
          <p className="mt-2 text-gray-400">
            Manage student enrollments, fees, and communications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-white">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {students.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Payment Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {students.filter(s => s.payment_status === 'pending' || s.payment_status === 'overdue').length}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">With Fee Plans</p>
                  <p className="text-2xl font-bold text-white">
                    {students.filter(s => s.fee_plan).length}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-[#1a1a1a] border-gray-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#2a2a2a] border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "" : "text-gray-300 border-gray-600"}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  className={filterStatus === "active" ? "" : "text-gray-300 border-gray-600"}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "payment_pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("payment_pending")}
                  className={filterStatus === "payment_pending" ? "" : "text-gray-300 border-gray-600"}
                >
                  Payment Pending
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      disabled={selectedStudents.length === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message ({selectedStudents.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Send Message to Students</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Send a message to {selectedStudents.length} selected student(s)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Subject</Label>
                        <Input
                          value={message.subject}
                          onChange={(e) => setMessage(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter message subject"
                          className="bg-[#2a2a2a] border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Message</Label>
                        <Textarea
                          value={message.content}
                          onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter your message..."
                          className="bg-[#2a2a2a] border-gray-600 text-white"
                          rows={6}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={sending}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {sending ? 'Sending...' : 'Send Message'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowMessageDialog(false)}
                          className="text-gray-300 border-gray-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Students List ({filteredStudents.length})
              </div>
              {filteredStudents.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleSelectAll}
                  className="text-gray-300 border-gray-600"
                >
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="mb-2 text-lg">No students found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 bg-[#2a2a2a] rounded-lg border-2 transition-colors ${
                      selectedStudents.includes(student.id) 
                        ? 'border-blue-500' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-5 h-5 mt-1 bg-gray-700 border-gray-600 rounded cursor-pointer"
                      />

                      {/* Student Avatar */}
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{student.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
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
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Link href={`/teacher/courses/${courseId}/students/${student.id}`}>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Manage Fee
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Student Details Grid */}
                        <div className="grid grid-cols-2 gap-4 p-3 mt-3 rounded-lg bg-[#1a1a1a] md:grid-cols-4">
                          <div>
                            <span className="text-xs text-gray-400">Status</span>
                            <div className="mt-1">
                              <Badge className={getStatusColor(student.status)}>
                                {student.status}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400">Enrolled</span>
                            <div className="flex items-center gap-1 mt-1 text-sm text-white">
                              <Calendar className="w-3 h-3" />
                              {new Date(student.enrollment_date).toLocaleDateString()}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400">Fee Plan</span>
                            <div className="mt-1 text-sm text-white">
                              {student.fee_plan ? (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3 text-green-400" />
                                  {student.fee_plan.fee_type === 'monthly' 
                                    ? `${student.fee_plan.currency} ${student.fee_plan.monthly_amount}/mo` 
                                    : `${student.fee_plan.currency} ${student.fee_plan.total_amount} total`
                                  }
                                </div>
                              ) : (
                                <span className="text-gray-500">Not set</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400">Payment Status</span>
                            <div className="mt-1">
                              {student.payment_status ? (
                                <Badge className={getStatusColor(student.payment_status)}>
                                  <span className="flex items-center gap-1">
                                    {getPaymentStatusIcon(student.payment_status)}
                                    {student.payment_status}
                                  </span>
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-500">N/A</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Payment Summary (if available) */}
                        {(student.total_paid !== undefined || student.outstanding_amount !== undefined) && (
                          <div className="flex gap-4 p-2 mt-2 text-sm bg-[#1a1a1a] rounded">
                            {student.total_paid !== undefined && (
                              <div>
                                <span className="text-gray-400">Total Paid: </span>
                                <span className="font-medium text-green-400">
                                  {student.fee_plan?.currency} {student.total_paid}
                                </span>
                              </div>
                            )}
                            {student.outstanding_amount !== undefined && student.outstanding_amount > 0 && (
                              <div>
                                <span className="text-gray-400">Outstanding: </span>
                                <span className="font-medium text-yellow-400">
                                  {student.fee_plan?.currency} {student.outstanding_amount}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
