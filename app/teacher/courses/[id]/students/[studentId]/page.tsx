"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  History,
  Plus,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  MapPin,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500/20 text-green-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'overdue':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

interface PaymentRecord {
  id: string
  amount: number
  payment_type: string
  status: string
  due_date: string
  paid_date?: string
  notes?: string
  created_at: string
}

interface InstallmentSchedule {
  id: string
  installment_number: number
  amount: number
  due_date: string
  status: string
  paid_date?: string
}

interface FeePlan {
  id: string
  fee_type: 'monthly' | 'full_course' | 'complete'
  total_amount: number
  monthly_amount?: number
  installments_count?: number
  installment_amount?: number
  currency: string
  status: string
  created_at: string
  payment_records: PaymentRecord[]
  installment_schedule?: InstallmentSchedule[]
}

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  currency?: string
  enrollment_date: string
  status: string
  fee_plan?: FeePlan
}

interface Course {
  id: string
  title: string
  description: string
}

export default function StudentDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const studentId = params.studentId as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingFee, setEditingFee] = useState(false)
  const [savingFee, setSavingFee] = useState(false)
  const [addingMonthlyFee, setAddingMonthlyFee] = useState(false)
  const [showAddMonthlyFee, setShowAddMonthlyFee] = useState(false)
  const [originalFeeType, setOriginalFeeType] = useState<'monthly' | 'full_course' | null>(null)
  const [updatingInstallment, setUpdatingInstallment] = useState<string | null>(null)
  const [updatingMonthlyFee, setUpdatingMonthlyFee] = useState<string | null>(null)
  
  const [feeForm, setFeeForm] = useState({
    fee_type: 'monthly' as 'monthly' | 'full_course',
    total_amount: '',
    monthly_amount: '',
    installments_count: '1',
    currency: 'USD',
    bank_details_id: '',
    payment_instructions: ''
  })

  // State for custom installments
  const [customInstallments, setCustomInstallments] = useState<Array<{
    installment_number: number
    amount: string
    due_date: string
  }>>([])

  const [installmentError, setInstallmentError] = useState('')

  // State for adding monthly fee
  const [monthlyFeeForm, setMonthlyFeeForm] = useState({
    month: '',
    year: new Date().getFullYear().toString(),
    amount: '',
    due_date: ''
  })

  // State for monthly fees list
  const [monthlyFees, setMonthlyFees] = useState<Array<{
    id: string
    month: string
    year: string
    amount: number
    due_date: string
    status: string
    paid_date?: string
  }>>([])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    if (courseId && studentId) {
      fetchStudentDetail()
    }
  }, [courseId, studentId])

  // Fetch monthly fees when student fee plan is monthly
  useEffect(() => {
    if (student?.fee_plan && student.fee_plan.fee_type === 'monthly') {
      fetchMonthlyFees()
    }
  }, [student?.fee_plan?.fee_type])

  const fetchStudentDetail = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}`)
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        
        // Transform new API structure to match old interface
        // Only create fee_plan if total_fee is actually set (not null/undefined)
        if (data.student.fee_structure && data.student.fee_structure.total_fee != null) {
          const fs = data.student.fee_structure
          console.log('Installments from API:', data.student.installments)
          data.student.fee_plan = {
            id: data.student.enrollment_id,
            fee_type: data.student.fee_type || 'monthly',
            total_amount: fs.total_fee,
            monthly_amount: fs.monthly_amount,
            installments_count: fs.installments_count,
            installment_amount: fs.installments_count > 0 ? fs.total_fee / fs.installments_count : 0,
            currency: data.student.currency || 'USD',
            status: fs.status,
            created_at: data.student.enrollment_date,
            payment_records: data.student.payment_history || [],
            installment_schedule: data.student.installments || []
          }
          console.log('Transformed fee_plan:', data.student.fee_plan)
          console.log('Installment schedule:', data.student.fee_plan.installment_schedule)
        } else {
          // No fee plan set - teacher needs to create one
          data.student.fee_plan = null
          console.log('No fee plan set for this student')
        }
        
        setStudent(data.student)
        setCourse(data.course)
        
        // Initialize fee form with existing data OR student's currency
        const studentCurrency = data.student.currency || 'USD'
        
        if (data.student.fee_plan) {
          const fp = data.student.fee_plan
          setFeeForm({
            fee_type: fp.fee_type,
            total_amount: fp.total_amount.toString(),
            monthly_amount: fp.monthly_amount?.toString() || '',
            installments_count: fp.installments_count?.toString() || '1',
            currency: studentCurrency, // Use student's currency, not fee_plan currency
            bank_details_id: '',
            payment_instructions: ''
          })
        } else {
          // For new fee plans, set the student's currency
          setFeeForm(prev => ({
            ...prev,
            currency: studentCurrency
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching student detail:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate installments when count changes
  const handleInstallmentsCountChange = (count: string) => {
    const numCount = parseInt(count) || 0
    setFeeForm(prev => ({ ...prev, installments_count: count }))
    
    if (numCount > 0 && feeForm.fee_type === 'full_course') {
      const newInstallments = Array.from({ length: numCount }, (_, index) => ({
        installment_number: index + 1,
        amount: '',
        due_date: ''
      }))
      setCustomInstallments(newInstallments)
      setInstallmentError('')
    } else {
      setCustomInstallments([])
    }
  }

  // Update individual installment
  const updateInstallment = (index: number, field: 'amount' | 'due_date', value: string) => {
    setCustomInstallments(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      
      // Validate total amount
      if (field === 'amount') {
        const totalInstallmentsAmount = updated.reduce((sum, inst) => {
          return sum + (parseFloat(inst.amount) || 0)
        }, 0)
        
        const courseTotalFee = parseFloat(feeForm.total_amount) || 0
        
        if (totalInstallmentsAmount > courseTotalFee) {
          setInstallmentError(`Total installments amount (${totalInstallmentsAmount}) cannot exceed course total fee (${courseTotalFee})`)
        } else {
          setInstallmentError('')
        }
      }
      
      return updated
    })
  }

  const handleSaveFeePlan = async () => {
    try {
      console.log('=== Save Fee Plan Debug ===')
      console.log('student?.fee_plan:', student?.fee_plan)
      console.log('originalFeeType:', originalFeeType)
      console.log('feeForm.fee_type:', feeForm.fee_type)
      
      // Warning if updating existing fee plan with same type
      if (student?.fee_plan && originalFeeType) {
        console.log('Checking if same type...')
        if (feeForm.fee_type === originalFeeType) {
          console.log('Same type detected! Showing warning...')
          const feeTypeName = feeForm.fee_type === 'monthly' ? 'Monthly Fee' : 'Complete Fee'
          const confirmed = window.confirm(
            `⚠️ Warning: You are updating the ${feeTypeName} plan.\n\n` +
            `This will reset all previous data:\n` +
            `• All old installments will be deleted\n` +
            `• All monthly fee records will be deleted\n` +
            `• Paid amount will be reset to 0\n\n` +
            `Do you want to continue?`
          )
          console.log('User confirmed:', confirmed)
          if (!confirmed) return
        }
      }

      // Validation for installments
      if (feeForm.fee_type === 'full_course' && customInstallments.length > 0) {
        const totalInstallmentsAmount = customInstallments.reduce((sum, inst) => {
          return sum + (parseFloat(inst.amount) || 0)
        }, 0)
        
        const courseTotalFee = parseFloat(feeForm.total_amount) || 0
        
        if (totalInstallmentsAmount < courseTotalFee) {
          setInstallmentError(`Your entered installments amount (${totalInstallmentsAmount}) is less than course total fee (${courseTotalFee})`)
          return
        }
        
        if (totalInstallmentsAmount > courseTotalFee) {
          setInstallmentError(`Total installments amount (${totalInstallmentsAmount}) cannot exceed course total fee (${courseTotalFee})`)
          return
        }

        // Check if all installments have due dates
        const missingDates = customInstallments.some(inst => !inst.due_date)
        if (missingDates) {
          setInstallmentError('Please set due date for all installments')
          return
        }
      }

      setSavingFee(true)
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/fee`, {
        method: student?.fee_plan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feeForm,
          custom_installments: feeForm.fee_type === 'full_course' ? customInstallments : undefined
        })
      })

      if (response.ok) {
        await fetchStudentDetail()
        setEditingFee(false)
        setCustomInstallments([])
        setInstallmentError('')
        setOriginalFeeType(null)
        
        // If monthly fee type, fetch monthly fees
        if (feeForm.fee_type === 'monthly') {
          await fetchMonthlyFees()
        }
      }
    } catch (error) {
      console.error('Error saving fee plan:', error)
    } finally {
      setSavingFee(false)
    }
  }

  // Add monthly fee
  const handleAddMonthlyFee = async () => {
    try {
      // Validate fields
      if (!monthlyFeeForm.month || !monthlyFeeForm.amount || !monthlyFeeForm.due_date) {
        alert('Please fill all required fields: Month, Amount, and Due Date')
        return
      }

      setAddingMonthlyFee(true)
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/monthly-fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monthlyFeeForm)
      })

      if (response.ok) {
        await fetchMonthlyFees()
        setShowAddMonthlyFee(false)
        setMonthlyFeeForm({ 
          month: '', 
          year: new Date().getFullYear().toString(), 
          amount: '', 
          due_date: '' 
        })
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to add monthly fee'}`)
      }
    } catch (error) {
      console.error('Error adding monthly fee:', error)
      alert('Failed to add monthly fee. Please try again.')
    } finally {
      setAddingMonthlyFee(false)
    }
  }

  // Fetch monthly fees list
  const fetchMonthlyFees = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/monthly-fees`)
      if (response.ok) {
        const data = await response.json()
        setMonthlyFees(data.fees || [])
      }
    } catch (error) {
      console.error('Error fetching monthly fees:', error)
    }
  }

  // Update monthly fee status
  const updateMonthlyFeeStatus = async (feeId: string, status: string) => {
    try {
      setUpdatingMonthlyFee(feeId)
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/monthly-fees/${feeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paid_date: status === 'paid' ? new Date().toISOString() : null })
      })

      if (response.ok) {
        await fetchMonthlyFees()
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
    } finally {
      setUpdatingMonthlyFee(null)
    }
  }

  const updateInstallmentStatus = async (installmentId: string, status: string) => {
    try {
      setUpdatingInstallment(installmentId)
      console.log('Updating installment:', { installmentId, status })
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}/installments/${installmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          paid_date: status === 'paid' ? new Date().toISOString() : null 
        })
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        alert(`Error: ${errorData.error || 'Failed to update installment'}`)
        return
      }

      if (response.ok) {
        await fetchStudentDetail()
      } else {
        console.error('Failed to update installment status')
      }
    } catch (error) {
      console.error('Error updating installment status:', error)
    } finally {
      setUpdatingInstallment(null)
    }
  }

  const handleEditFeePlan = () => {
    console.log('=== Edit Fee Plan clicked ===')
    console.log('Current student:', student)
    console.log('Current fee_plan:', student?.fee_plan)
    
    // Initialize form with existing fee plan data
    if (student?.fee_plan) {
      const fp = student.fee_plan
      console.log('Original fee_type from DB:', fp.fee_type)
      
      // Map 'complete' to 'full_course' for the form
      const feeType = fp.fee_type === 'complete' ? 'full_course' : fp.fee_type
      console.log('Mapped fee_type:', feeType)
      
      // Store original fee type for warning comparison
      setOriginalFeeType(feeType as 'monthly' | 'full_course')
      console.log('Set originalFeeType to:', feeType)
      
      const formData = {
        fee_type: (feeType as 'monthly' | 'full_course') || 'monthly',
        total_amount: fp.total_amount?.toString() || '',
        monthly_amount: fp.monthly_amount?.toString() || '',
        installments_count: fp.installments_count?.toString() || '1',
        currency: student.currency || 'USD',
        bank_details_id: '',
        payment_instructions: ''
      }
      console.log('Setting form data:', formData)
      setFeeForm(formData)
    }
    console.log('Setting editingFee to true')
    setEditingFee(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300'
      case 'overdue': return 'bg-red-500/20 text-red-300'
      case 'active': return 'bg-blue-500/20 text-blue-300'
      case 'completed': return 'bg-purple-500/20 text-purple-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
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
          <Link href={`/teacher/courses/${courseId}`}>
            <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Student Header */}
        <div className="mb-8">
          <PageHeader 
            title={student.name}
          />
          <p className="mb-4 text-gray-400">Student in {course.title}</p>
          <div className="flex gap-2 mt-4">
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
            
            {/* Contact Info */}
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
                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{student.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
           
          </div>

          {/* Fee Management */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Fee Management
                  </div>
                  {!student.fee_plan ? (
                    <Button onClick={() => setEditingFee(true)} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Fee Plan
                    </Button>
                  ) : (
                    <Button onClick={handleEditFeePlan} variant="outline" className="text-gray-300 border-gray-600 cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Fee Plan
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingFee ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Fee Type</Label>
                        <Select 
                          value={feeForm.fee_type} 
                          onValueChange={(value: 'monthly' | 'full_course') => {
                            // Show warning if selecting same fee type as existing
                            if (student?.fee_plan && originalFeeType && value === originalFeeType) {
                              const feeTypeName = value === 'monthly' ? 'Monthly Fee' : 'Complete Fee'
                              const confirmed = window.confirm(
                                `⚠️ Warning: You are selecting the same ${feeTypeName} plan type.\n\n` +
                                `When you save, this will reset all previous data:\n` +
                                `• All old installments will be deleted\n` +
                                `• All monthly fee records will be deleted\n` +
                                `• Paid amount will be reset to 0\n\n` +
                                `Do you want to continue?`
                              )
                              if (!confirmed) return
                            }
                            setFeeForm(prev => ({ ...prev, fee_type: value }))
                          }}
                        >
                          <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly Fee</SelectItem>
                            <SelectItem value="full_course">Full Course Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Currency (Student's Currency)</Label>
                        <Input
                          type="text"
                          value={feeForm.currency}
                          readOnly
                          disabled
                          className="bg-[#1a1a1a] border-gray-600 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Currency is based on student profile</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Payment Instructions</Label>
                        <Textarea
                          value={feeForm.payment_instructions}
                          onChange={(e) => setFeeForm(prev => ({ ...prev, payment_instructions: e.target.value }))}
                          className="bg-[#2a2a2a] border-gray-600 text-white"
                          placeholder="Enter payment instructions for the student..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {feeForm.fee_type === 'monthly' ? (
                      // Monthly fee: No amount field needed
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <span className="font-semibold">Monthly Fee Plan Selected:</span> You can add individual monthly fee records after saving this plan.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-300">Total Amount</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={feeForm.total_amount}
                            onChange={(e) => setFeeForm(prev => ({ ...prev, total_amount: e.target.value }))}
                            className="bg-[#2a2a2a] border-gray-600 text-white"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Number of Installments</Label>
                          <Input
                            type="number"
                            min="1"
                            value={feeForm.installments_count}
                            onChange={(e) => handleInstallmentsCountChange(e.target.value)}
                            className="bg-[#2a2a2a] border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Auto-calculated (Equal Split)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={
                              feeForm.total_amount && feeForm.installments_count 
                                ? (parseFloat(feeForm.total_amount) / parseInt(feeForm.installments_count)).toFixed(2)
                                : ''
                            }
                            readOnly
                            className="bg-[#2a2a2a] border-gray-600 text-gray-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Custom Installments List */}
                    {feeForm.fee_type === 'full_course' && customInstallments.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Customize Installments</h3>
                          <Badge className="text-blue-300 bg-blue-500/20">
                            Total: {feeForm.currency} {customInstallments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0).toFixed(2)} / {feeForm.total_amount}
                          </Badge>
                        </div>

                        {installmentError && (
                          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                            <p className="text-sm text-red-400 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {installmentError}
                            </p>
                          </div>
                        )}

                        <div className="space-y-3">
                          {customInstallments.map((installment, index) => (
                            <div 
                              key={index}
                              className="p-4 bg-[#2a2a2a] rounded-lg space-y-3"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                                  <span className="text-sm font-bold text-blue-400">#{installment.installment_number}</span>
                                </div>
                                <span className="font-medium text-white">Installment {installment.installment_number}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm text-gray-400">Amount ({feeForm.currency})</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={installment.amount}
                                    onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                                    className="bg-[#1a1a1a] border-gray-600 text-white mt-1"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-400">Due Date</Label>
                                  <Input
                                    type="date"
                                    value={installment.due_date}
                                    onChange={(e) => updateInstallment(index, 'due_date', e.target.value)}
                                    className="bg-[#1a1a1a] border-gray-600 text-white mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveFeePlan} 
                        disabled={savingFee}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingFee ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {savingFee ? 'Saving...' : 'Save Fee Plan'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingFee(false)}
                        className="text-gray-300 border-gray-600"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {student.fee_plan ? (
                      <>
                        {/* Fee Plan Overview - Without Status */}
                        <div className="p-4 bg-[#2a2a2a] rounded-lg">
                          <div className="mb-4">
                            <h3 className="font-semibold text-white">Fee Plan Details</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                            <div>
                              <span className="text-gray-400">Fee Type:</span>
                              <div className="font-medium text-white">
                                {student.fee_plan.fee_type === 'monthly' ? 'Monthly Fee' : 'Full Course Payment'}
                              </div>
                            </div>
                            
                            {/* Total Amount - Only show for Full Course Payment */}
                            {student.fee_plan.fee_type !== 'monthly' && (
                              <div>
                                <span className="text-gray-400">Total Amount:</span>
                                <div className="text-lg font-bold text-green-400">
                                  {student.fee_plan.currency} {student.fee_plan.total_amount.toLocaleString()}
                                </div>
                              </div>
                            )}
                            
                            {(student.fee_plan.fee_type === 'full_course' || student.fee_plan.fee_type === 'complete') && (
                              <>
                                <div>
                                  <span className="text-gray-400">Installments:</span>
                                  <div className="text-lg font-bold text-blue-400">
                                    {student.fee_plan.installments_count}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Per Installment:</span>
                                  <div className="text-lg font-bold text-yellow-400">
                                    {student.fee_plan.currency} {(student.fee_plan.installment_amount || 0).toLocaleString()}
                                  </div>
                                </div>
                              </>
                            )}
                            
                            <div>
                              <span className="text-gray-400">Created:</span>
                              <div className="font-medium text-white">
                                {new Date(student.fee_plan.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Installment Schedule - Only for Full Course */}
                        {student.fee_plan.fee_type === 'complete' && student.fee_plan.installment_schedule && student.fee_plan.installment_schedule.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-white">Installment Schedule</h3>
                              <Badge className="text-blue-300 bg-blue-500/20">
                                {student.fee_plan.installment_schedule.filter(i => i.status === 'paid').length} / {student.fee_plan.installment_schedule.length} Paid
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {student.fee_plan.installment_schedule.map((installment) => (
                                <div 
                                  key={installment.id} 
                                  className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                                      <span className="font-bold text-blue-400">#{installment.installment_number}</span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">
                                        {student.fee_plan.currency} {Number(installment.amount).toLocaleString()}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        Due: {new Date(installment.due_date).toLocaleDateString()}
                                      </div>
                                      {installment.paid_date && (
                                        <div className="text-xs text-green-400">
                                          Paid: {new Date(installment.paid_date).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(installment.status)}>
                                      {installment.status}
                                    </Badge>
                                    
                                    {installment.status === 'pending' && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateInstallmentStatus(installment.id, 'paid')}
                                        disabled={updatingInstallment === installment.id}
                                        className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {updatingInstallment === installment.id ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : (
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {updatingInstallment === installment.id ? 'Updating...' : 'Mark Paid'}
                                      </Button>
                                    )}
                                    
                                    {installment.status === 'paid' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateInstallmentStatus(installment.id, 'pending')}
                                        disabled={updatingInstallment === installment.id}
                                        className="text-gray-400 border-gray-600 hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {updatingInstallment === installment.id ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : null}
                                        {updatingInstallment === installment.id ? 'Updating...' : 'Unpay'}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Monthly Fee Management - Only for Monthly Fee Type */}
                        {student.fee_plan.fee_type === 'monthly' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-white">Monthly Fee Management</h3>
                              <Button onClick={() => setShowAddMonthlyFee(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Monthly Fee
                              </Button>
                            </div>

                            {showAddMonthlyFee && (
                              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                                <h4 className="mb-4 font-medium text-white">Add Monthly Fee</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label className="text-gray-300">Month</Label>
                                    <Select 
                                      value={monthlyFeeForm.month}
                                      onValueChange={(value) => setMonthlyFeeForm(prev => ({ ...prev, month: value }))}
                                    >
                                      <SelectTrigger className="bg-[#1a1a1a] border-gray-600 text-white">
                                        <SelectValue placeholder="Select Month" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {months.map((month, index) => (
                                          <SelectItem key={index} value={month.toLowerCase()}>
                                            {month}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-gray-300">Year</Label>
                                    <Select 
                                      value={monthlyFeeForm.year}
                                      onValueChange={(value) => setMonthlyFeeForm(prev => ({ ...prev, year: value }))}
                                    >
                                      <SelectTrigger className="bg-[#1a1a1a] border-gray-600 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[0, 1, 2].map(offset => {
                                          const year = new Date().getFullYear() + offset
                                          return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label className="text-gray-300">Amount ({student.fee_plan.currency})</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={monthlyFeeForm.amount}
                                      onChange={(e) => setMonthlyFeeForm(prev => ({ ...prev, amount: e.target.value }))}
                                      className="bg-[#1a1a1a] border-gray-600 text-white"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-gray-300">Due Date</Label>
                                    <Input
                                      type="date"
                                      value={monthlyFeeForm.due_date}
                                      onChange={(e) => setMonthlyFeeForm(prev => ({ ...prev, due_date: e.target.value }))}
                                      className="bg-[#1a1a1a] border-gray-600 text-white"
                                      onFocus={(e) => {
                               
                                        if (monthlyFeeForm.month && monthlyFeeForm.year) {
                                          const monthIndex = months.findIndex(m => m.toLowerCase() === monthlyFeeForm.month)
                                          if (monthIndex !== -1) {
                                            const defaultDate = new Date(parseInt(monthlyFeeForm.year), monthIndex, 1)
                                            const formattedDate = defaultDate.toISOString().split('T')[0]
                                          
                                            if (!monthlyFeeForm.due_date) {
                                              setMonthlyFeeForm(prev => ({ ...prev, due_date: formattedDate }))
                                            }
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={handleAddMonthlyFee} 
                                    disabled={addingMonthlyFee}
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {addingMonthlyFee ? (
                                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                      <Plus className="w-3 h-3 mr-1" />
                                    )}
                                    {addingMonthlyFee ? 'Adding...' : 'Add'}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowAddMonthlyFee(false)}
                                    size="sm"
                                    className="text-gray-300 border-gray-600"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Monthly Fees List */}
                            <div className="space-y-3">
                              {monthlyFees.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 bg-[#2a2a2a] rounded-lg">
                                  No monthly fees added yet
                                </div>
                              ) : (
                                monthlyFees.map((fee) => (
                                  <div key={fee.id} className="p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20">
                                          <Calendar className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-white">
                                            {fee.month} {fee.year}
                                          </div>
                                          <div className="font-medium text-green-400">
                                            {student.fee_plan.currency} {Number(fee.amount).toLocaleString()}
                                          </div>
                                          <div className="text-sm text-gray-400">
                                            Due: {new Date(fee.due_date).toLocaleDateString()}
                                          </div>
                                          {fee.paid_date && (
                                            <div className="text-sm text-green-400">
                                              Paid: {new Date(fee.paid_date).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(fee.status)}>
                                          {fee.status}
                                        </Badge>
                                        
                                        {fee.status === 'pending' && (
                                          <Button
                                            size="sm"
                                            onClick={() => updateMonthlyFeeStatus(fee.id, 'paid')}
                                            disabled={updatingMonthlyFee === fee.id}
                                            className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            {updatingMonthlyFee === fee.id ? (
                                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                            ) : (
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                            )}
                                            {updatingMonthlyFee === fee.id ? 'Updating...' : 'Mark Paid'}
                                          </Button>
                                        )}
                                        
                                        {fee.status === 'paid' && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateMonthlyFeeStatus(fee.id, 'pending')}
                                            disabled={updatingMonthlyFee === fee.id}
                                            className="text-gray-400 border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            {updatingMonthlyFee === fee.id ? (
                                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                            ) : null}
                                            {updatingMonthlyFee === fee.id ? 'Updating...' : 'Unpay'}
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                      </>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-400">No Fee Plan Set</h3>
                        <p className="mb-4">Create a fee plan to start managing payments for this student.</p>
                        <Button onClick={() => setEditingFee(true)} className="bg-green-600 hover:bg-green-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Fee Plan
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}