'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/page-header'
import { BookOpen, Calendar, DollarSign, Mail, AlertCircle, CheckCircle, Clock, Download, Building2, Loader2 } from 'lucide-react'

interface MonthlyFee {
  id: string
  month: string
  year: string
  amount: number
  due_date: string
  status: string
  paid_date?: string
}

interface Installment {
  id: string
  installment_number: number
  amount: number
  due_date: string
  status: string
  paid_date?: string
}

interface FeePlan {
  fee_type: 'monthly' | 'full_course' | 'complete'
  currency: string
  total_amount: number
  installments_count?: number
  payment_instructions?: string
  created_at: string
}

interface BankDetails {
  bank_name: string
  account_title: string
  account_number: string
  iban?: string
  branch_code?: string
  payment_instructions?: string
}

interface CourseWithFees {
  course_id: string
  course_title: string
  instructor_name: string
  instructor_email: string
  enrollment_date: string
  fee_plan?: FeePlan
  bank_details?: BankDetails
  installments?: Installment[]
  monthly_fees?: MonthlyFee[]
}

export default function AccountBookPage() {
  const [courses, setCourses] = useState<CourseWithFees[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingChallan, setDownloadingChallan] = useState<string | null>(null)

  useEffect(() => {
    fetchAccountBook()
  }, [])

  const fetchAccountBook = async () => {
    try {
      const response = await fetch('/api/student/account-book')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching account book:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/20 text-green-300'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'overdue':
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateTotalPaid = (items: (Installment | MonthlyFee)[]) => {
    return items
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + Number(item.amount), 0)
  }

  const calculateTotalDue = (items: (Installment | MonthlyFee)[]) => {
    return items
      .filter(item => item.status !== 'paid')
      .reduce((sum, item) => sum + Number(item.amount), 0)
  }

  const downloadChallan = async (course: CourseWithFees, feeDetail: Installment | MonthlyFee) => {
    try {
      setDownloadingChallan(feeDetail.id)
      
      const response = await fetch('/api/student/generate-challan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment: {
            course_title: course.course_title,
            category: 'N/A',
            level: 'N/A',
            fee_type: course.fee_plan?.fee_type,
            currency: course.fee_plan?.currency,
            bank_name: course.bank_details?.bank_name,
            account_title: course.bank_details?.account_title,
            account_number: course.bank_details?.account_number,
            iban: course.bank_details?.iban,
            branch_code: course.bank_details?.branch_code,
            payment_instructions: course.bank_details?.payment_instructions
          },
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

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <PageHeader title="Account Book" />
        <div className="text-center text-gray-400 py-12">Loading your account book...</div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto">
      <PageHeader title="Account Book" />
      <p className="text-gray-400 mt-2 mb-6">View your fee details for all enrolled courses</p>

      <div className="space-y-6 mt-8">
        {courses.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No enrolled courses found</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.course_id} className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      {course.course_title}
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-1">
                      Instructor: {course.instructor_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Enrolled: {formatDate(course.enrollment_date)}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {course.fee_plan?.fee_type === 'monthly' ? 'Monthly Fee' : 'Full Course Payment'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {!course.fee_plan ? (
                  // No fee plan created
                  <div className="flex items-start gap-4 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-400 mb-2">Fee Plan Not Created</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Please contact your instructor to create a fee plan for this course.
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a 
                          href={`mailto:${course.instructor_email}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {course.instructor_email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Bank Details Section */}
                    {course.bank_details && course.bank_details.bank_name && (
                      <div className="p-4 rounded-lg bg-[#2a2a2a] border border-yellow-500/30">
                        <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                          <Building2 className="w-5 h-5 text-yellow-400" />
                          Bank Details for Payment
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <span className="text-sm text-gray-400">Bank Name:</span>
                            <div className="font-medium text-white">{course.bank_details.bank_name}</div>
                          </div>
                          {course.bank_details.account_title && (
                            <div>
                              <span className="text-sm text-gray-400">Account Title:</span>
                              <div className="font-medium text-white">{course.bank_details.account_title}</div>
                            </div>
                          )}
                          {course.bank_details.account_number && (
                            <div>
                              <span className="text-sm text-gray-400">Account Number:</span>
                              <div className="font-medium text-white">{course.bank_details.account_number}</div>
                            </div>
                          )}
                          {course.bank_details.iban && (
                            <div>
                              <span className="text-sm text-gray-400">IBAN:</span>
                              <div className="font-medium text-white">{course.bank_details.iban}</div>
                            </div>
                          )}
                        </div>
                        {course.bank_details.payment_instructions && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-400">Instructions:</span>
                            <div className="text-white whitespace-pre-wrap">{course.bank_details.payment_instructions}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fee Plan Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {course.fee_plan.fee_type !== 'monthly' && (
                        <div className="p-4 bg-[#2a2a2a] rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-green-400">
                            {course.fee_plan.currency} {course.fee_plan.total_amount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {course.installments && course.installments.length > 0 && (
                        <>
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Paid Amount</p>
                            <p className="text-2xl font-bold text-blue-400">
                              {course.fee_plan.currency} {calculateTotalPaid(course.installments).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Outstanding</p>
                            <p className="text-2xl font-bold text-yellow-400">
                              {course.fee_plan.currency} {calculateTotalDue(course.installments).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}

                      {course.monthly_fees && course.monthly_fees.length > 0 && (
                        <>
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Paid Amount</p>
                            <p className="text-2xl font-bold text-blue-400">
                              {course.fee_plan.currency} {calculateTotalPaid(course.monthly_fees).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Outstanding</p>
                            <p className="text-2xl font-bold text-yellow-400">
                              {course.fee_plan.currency} {calculateTotalDue(course.monthly_fees).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Payment Instructions */}
                    {course.fee_plan.payment_instructions && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2 text-sm">Payment Instructions</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {course.fee_plan.payment_instructions}
                        </p>
                      </div>
                    )}

                    {/* Installments List */}
                    {course.installments && course.installments.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Installments</h3>
                          <Badge className="bg-blue-500/20 text-blue-300">
                            {course.installments.filter(i => i.status === 'paid').length} / {course.installments.length} Paid
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {course.installments
                            .sort((a, b) => a.installment_number - b.installment_number)
                            .map((installment) => (
                            <div 
                              key={installment.id}
                              className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                                  <span className="font-bold text-blue-400">#{installment.installment_number}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    {course.fee_plan?.currency} {Number(installment.amount).toLocaleString()}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Due: {formatDate(installment.due_date)}</span>
                                  </div>
                                  {installment.paid_date && (
                                    <div className="flex items-center gap-2 text-xs text-green-400 mt-1">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Paid: {formatDate(installment.paid_date)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(installment.status)}>
                                  {installment.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => downloadChallan(course, installment)}
                                  disabled={downloadingChallan === installment.id}
                                  className="bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:opacity-50"
                                >
                                  {downloadingChallan === installment.id ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                  )}
                                  {downloadingChallan === installment.id ? 'Generating...' : 'Challan'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Monthly Fees List */}
                    {course.monthly_fees && course.monthly_fees.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Monthly Fees</h3>
                          <Badge className="bg-blue-500/20 text-blue-300">
                            {course.monthly_fees.filter(f => f.status === 'paid').length} / {course.monthly_fees.length} Paid
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {course.monthly_fees
                            .sort((a, b) => {
                              const dateA = new Date(parseInt(a.year), new Date(Date.parse(a.month + " 1, 2000")).getMonth())
                              const dateB = new Date(parseInt(b.year), new Date(Date.parse(b.month + " 1, 2000")).getMonth())
                              return dateB.getTime() - dateA.getTime()
                            })
                            .map((fee) => (
                            <div 
                              key={fee.id}
                              className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                                  <Calendar className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    {fee.month.charAt(0).toUpperCase() + fee.month.slice(1)} {fee.year}
                                  </p>
                                  <p className="text-lg font-bold text-green-400 mt-1">
                                    {course.fee_plan?.currency} {Number(fee.amount).toLocaleString()}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Due: {formatDate(fee.due_date)}</span>
                                  </div>
                                  {fee.paid_date && (
                                    <div className="flex items-center gap-2 text-xs text-green-400 mt-1">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Paid: {formatDate(fee.paid_date)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(fee.status)}>
                                  {fee.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => downloadChallan(course, fee)}
                                  disabled={downloadingChallan === fee.id}
                                  className="bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:opacity-50"
                                >
                                  {downloadingChallan === fee.id ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                  )}
                                  {downloadingChallan === fee.id ? 'Generating...' : 'Challan'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
