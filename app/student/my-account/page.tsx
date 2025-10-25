"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  BookOpen, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Clock,
  Download,
  CreditCard,
  Building2,
  FileText,
  Loader2
} from "lucide-react"

interface FeeDetail {
  id: string
  installment_number?: number
  month?: number
  year?: number
  amount: number
  due_date: string
  status: string
  paid_date?: string
  created_at: string
}

interface Enrollment {
  enrollment_id: string
  course_id: string
  enrollment_status: string
  enrollment_date: string
  course_title: string
  course_description: string
  course_image: string
  category: string
  level: string
  fee_plan_id: string | null
  fee_type: string | null
  total_fee: number | null
  monthly_amount: number | null
  paid_amount: number | null
  currency: string | null
  fee_status: string | null
  installments_count: number | null
  bank_name: string | null
  account_title: string | null
  account_number: string | null
  iban: string | null
  branch_code: string | null
  payment_instructions: string | null
  fee_details: FeeDetail[]
}

export default function StudentMyAccountPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingChallan, setDownloadingChallan] = useState<string | null>(null)

  useEffect(() => {
    fetchMyAccount()
  }, [])

  const fetchMyAccount = async () => {
    try {
      const response = await fetch('/api/student/my-account')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error('Error fetching account:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadChallan = async (enrollment: Enrollment, feeDetail: FeeDetail) => {
    try {
      setDownloadingChallan(feeDetail.id)
      
      const response = await fetch('/api/student/generate-challan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment,
          feeDetail
        })
      })

      if (response.ok) {
        const html = await response.text()
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(html)
          printWindow.document.close()
          
          // Wait for content to load then trigger print
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 250)
          }
        }
      }
    } catch (error) {
      console.error('Error downloading challan:', error)
      alert('Failed to download challan')
    } finally {
      setDownloadingChallan(null)
    }
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

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[month - 1]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
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
        <PageHeader 
          title="My Account"
        />
        <p className="mt-2 text-gray-400">View your enrolled courses and manage fee payments</p>

        <div className="mt-8 space-y-8">
          {enrollments.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">No enrolled courses yet</p>
              </CardContent>
            </Card>
          ) : (
            enrollments.map((enrollment) => (
              <Card key={enrollment.enrollment_id} className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-white">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        {enrollment.course_title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-gray-400">
                        {enrollment.course_description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getStatusColor(enrollment.enrollment_status)}>
                          {enrollment.enrollment_status}
                        </Badge>
                        <Badge className="text-purple-300 bg-purple-500/20">
                          {enrollment.category}
                        </Badge>
                        <Badge className="text-blue-300 bg-blue-500/20">
                          {enrollment.level}
                        </Badge>
                      </div>
                    </div>
                    {enrollment.fee_plan_id && (
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Total Fee</div>
                        <div className="text-2xl font-bold text-green-400">
                          {enrollment.currency} {enrollment.total_fee?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          Paid: {enrollment.currency} {enrollment.paid_amount?.toLocaleString()}
                        </div>
                        <Badge className={getStatusColor(enrollment.fee_status || 'pending')} >
                          {enrollment.fee_status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {enrollment.fee_plan_id && (
                  <CardContent>
                    {/* Bank Details Section */}
                    {enrollment.bank_name && (
                      <div className="p-4 mb-6 rounded-lg bg-[#2a2a2a]">
                        <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                          <Building2 className="w-5 h-5 text-yellow-400" />
                          Bank Details for Payment
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <span className="text-sm text-gray-400">Bank Name:</span>
                            <div className="font-medium text-white">{enrollment.bank_name}</div>
                          </div>
                          {enrollment.account_title && (
                            <div>
                              <span className="text-sm text-gray-400">Account Title:</span>
                              <div className="font-medium text-white">{enrollment.account_title}</div>
                            </div>
                          )}
                          {enrollment.account_number && (
                            <div>
                              <span className="text-sm text-gray-400">Account Number:</span>
                              <div className="font-medium text-white">{enrollment.account_number}</div>
                            </div>
                          )}
                          {enrollment.iban && (
                            <div>
                              <span className="text-sm text-gray-400">IBAN:</span>
                              <div className="font-medium text-white">{enrollment.iban}</div>
                            </div>
                          )}
                        </div>
                        {enrollment.payment_instructions && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-400">Instructions:</span>
                            <div className="text-white whitespace-pre-wrap">{enrollment.payment_instructions}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fee Details */}
                    <div>
                      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                        <CreditCard className="w-5 h-5 text-green-400" />
                        {enrollment.fee_type === 'monthly' ? 'Monthly Fees' : 'Installments'}
                      </h3>
                      
                      <div className="space-y-3">
                        {enrollment.fee_details.map((fee) => (
                          <div 
                            key={fee.id} 
                            className="flex items-center justify-between p-4 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                fee.status === 'paid' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                              }`}>
                                {fee.status === 'paid' ? (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Clock className="w-5 h-5 text-yellow-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {enrollment.fee_type === 'monthly' 
                                    ? `${getMonthName(fee.month!)} ${fee.year}`
                                    : `Installment ${fee.installment_number}`
                                  }
                                </div>
                                <div className="text-sm text-gray-400">
                                  Due: {new Date(fee.due_date).toLocaleDateString()}
                                  {fee.paid_date && ` • Paid: ${new Date(fee.paid_date).toLocaleDateString()}`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-white">
                                  {enrollment.currency} {fee.amount.toLocaleString()}
                                </div>
                                <Badge className={getStatusColor(fee.status)}>
                                  {fee.status}
                                </Badge>
                              </div>
                              
                              <Button
                                size="sm"
                                onClick={() => downloadChallan(enrollment, fee)}
                                disabled={downloadingChallan === fee.id}
                                className="bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:opacity-50"
                              >
                                {downloadingChallan === fee.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4 mr-2" />
                                )}
                                {downloadingChallan === fee.id ? 'Generating...' : 'Download Challan'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
