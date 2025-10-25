"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  Edit2,  
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface PaymentHistory {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  reference?: string
  notes?: string
}

interface FeeStructure {
  total_fee: number
  paid_amount: number
  remaining_balance: number
  due_date?: string
  status: 'paid' | 'unpaid' | 'partial'
}

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  enrollment_date: string
  status: string
  enrollment_id: string
  currency?: string
  fee_structure: FeeStructure
  payment_history: PaymentHistory[]
}

interface Course {
  id: string
  title: string
  description: string
}

export default function StudentFeeManagementPage() {
  const params = useParams()
  const { toast } = useToast()
  const courseId = params.id as string
  const studentId = params.studentId as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFeeDialog, setShowFeeDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentHistory | null>(null)
  
  const [feeForm, setFeeForm] = useState({
    total_fee: '',
    due_date: ''
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'cash',
    reference: '',
    notes: ''
  })

  useEffect(() => {
    if (courseId && studentId) {
      fetchStudentDetail()
    }
  }, [courseId, studentId])

  const fetchStudentDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Student data:', data)
      setStudent(data.student)
      setCourse(data.course)
      
      // Initialize fee form with existing data
      if (data.student.fee_structure) {
        setFeeForm({
          total_fee: data.student.fee_structure.total_fee.toString(),
          due_date: data.student.fee_structure.due_date || ''
        })
      }
    } catch (error) {
      console.error('Error fetching student detail:', error)
      toast({
        title: "Error",
        description: "Failed to load student details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFee = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeForm)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save fee')
      }

      toast({
        title: "Success",
        description: "Fee plan updated successfully"
      })
      
      await fetchStudentDetail()
      setShowFeeDialog(false)
    } catch (error: any) {
      console.error('Error saving fee:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save fee plan",
        variant: "destructive"
      })
    }
  }

  const handleAddPayment = async () => {
    try {
      const amount = parseFloat(paymentForm.amount)
      const remaining = student?.fee_structure.remaining_balance || 0
      
      if (amount > remaining) {
        toast({
          title: "Warning",
          description: `Payment amount ($${amount}) exceeds remaining balance ($${remaining})`,
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to record payment')
      }

      toast({
        title: "Success",
        description: "Payment recorded successfully"
      })
      
      await fetchStudentDetail()
      setShowPaymentDialog(false)
      setPaymentForm({ amount: '', payment_method: 'cash', reference: '', notes: '' })
    } catch (error: any) {
      console.error('Error recording payment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive"
      })
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) {
      return
    }

    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/payments/${paymentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete payment')
      }

      toast({
        title: "Success",
        description: "Payment deleted successfully"
      })
      
      await fetchStudentDetail()
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300'
      case 'partial': return 'bg-yellow-500/20 text-yellow-300'
      case 'unpaid': return 'bg-red-500/20 text-red-300'
      case 'active': return 'bg-blue-500/20 text-blue-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatCurrency = (amount: number) => {
    const currency = student?.currency || 'USD'
    return `${currency} ${amount.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading student details...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!student || !course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-red-400">Student or course not found</div>
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
          <Link href={`/teacher/courses/${courseId}/students`}>
            <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>

        {/* Student Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">{student.name}</h1>
          <p className="mb-4 text-gray-400">Fee Management - {course.title}</p>
          <div className="flex gap-2">
            <Badge className={getStatusColor(student.status)}>
              {student.status}
            </Badge>
            <Badge className="text-blue-300 bg-blue-500/20">
              Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Student Information */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-blue-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{student.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Currency: {student.currency || 'USD'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fee Management */}
          <div className="lg:col-span-2">
            {/* Fee Summary */}
            <Card className="mb-6 bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Fee Summary
                  </div>
                  <Button 
                    onClick={() => setShowFeeDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Update Fee Plan
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="p-4 bg-[#2a2a2a] rounded-lg">
                    <div className="text-sm text-gray-400">Total Fee</div>
                    <div className="mt-1 text-2xl font-bold text-white">
                      {formatCurrency(student.fee_structure.total_fee)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-lg">
                    <div className="text-sm text-gray-400">Paid Amount</div>
                    <div className="mt-1 text-2xl font-bold text-green-400">
                      {formatCurrency(student.fee_structure.paid_amount)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-lg">
                    <div className="text-sm text-gray-400">Remaining</div>
                    <div className="mt-1 text-2xl font-bold text-yellow-400">
                      {formatCurrency(student.fee_structure.remaining_balance)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-lg">
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="mt-2">
                      <Badge className={getStatusColor(student.fee_structure.status)}>
                        {student.fee_structure.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                {student.fee_structure.due_date && (
                  <div className="p-3 mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm text-yellow-400">
                      Due Date: {new Date(student.fee_structure.due_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Management */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Payment History</span>
                  <Button 
                    onClick={() => setShowPaymentDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    disabled={student.fee_structure.remaining_balance <= 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.payment_history.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p>No payment records yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {student.payment_history.map((payment) => (
                      <div key={payment.id} className="p-4 bg-[#2a2a2a] rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-xl font-bold text-white">
                                {formatCurrency(payment.amount)}
                              </div>
                              <Badge variant="outline" className="text-gray-400">
                                {payment.payment_method}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-400">
                              <div>Date: {new Date(payment.payment_date).toLocaleDateString()}</div>
                              {payment.reference && <div>Reference: {payment.reference}</div>}
                              {payment.notes && <div>Notes: {payment.notes}</div>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fee Update Dialog */}
      <Dialog open={showFeeDialog} onOpenChange={setShowFeeDialog}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Update Fee Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Total Course Fee</Label>
              <Input
                type="number"
                step="0.01"
                value={feeForm.total_fee}
                onChange={(e) => setFeeForm(prev => ({ ...prev, total_fee: e.target.value }))}
                className="bg-[#2a2a2a] border-gray-600 text-white"
                placeholder="0.00"
              />
              <p className="mt-1 text-sm text-gray-400">
                Currency: {student.currency || 'USD'}
              </p>
            </div>
            <div>
              <Label className="text-gray-300">Due Date (Optional)</Label>
              <Input
                type="date"
                value={feeForm.due_date}
                onChange={(e) => setFeeForm(prev => ({ ...prev, due_date: e.target.value }))}
                className="bg-[#2a2a2a] border-gray-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowFeeDialog(false)}
              className="text-gray-300 border-gray-600"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveFee} className="bg-green-600 hover:bg-green-700">
              Save Fee Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Record Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-sm text-blue-300">
                Remaining Balance: {formatCurrency(student.fee_structure.remaining_balance)}
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Payment Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-[#2a2a2a] border-gray-600 text-white"
                placeholder="0.00"
                max={student.fee_structure.remaining_balance}
              />
            </div>
            <div>
              <Label className="text-gray-300">Payment Method</Label>
              <select
                value={paymentForm.payment_method}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_method: e.target.value }))}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-300">Reference Number (Optional)</Label>
              <Input
                type="text"
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                className="bg-[#2a2a2a] border-gray-600 text-white"
                placeholder="Transaction reference"
              />
            </div>
            <div>
              <Label className="text-gray-300">Notes (Optional)</Label>
              <Input
                type="text"
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-[#2a2a2a] border-gray-600 text-white"
                placeholder="Payment notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              className="text-gray-300 border-gray-600"
            >
              Cancel
            </Button>
            <Button onClick={handleAddPayment} className="bg-blue-600 hover:bg-blue-700">
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  )
}
