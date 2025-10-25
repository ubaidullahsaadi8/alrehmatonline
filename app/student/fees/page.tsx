"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Receipt,
  TrendingUp,
  Building,
  Copy,
  MapPin,
  Info
} from "lucide-react"

interface PaymentRecord {
  id: string
  amount: number
  payment_type: string
  status: string
  due_date: string
  paid_date?: string
  notes?: string
}

interface BankDetails {
  id: string
  bank_name: string
  account_holder_name: string
  account_number: string
  routing_number?: string
  swift_code?: string
  iban?: string
  bank_address?: string
  currency: string
}

interface FeePlan {
  id: string
  course_id: string
  course_title: string
  fee_type: 'monthly' | 'full_course'
  total_amount: number
  monthly_amount?: number
  installments_count?: number
  installment_amount?: number
  currency: string
  status: string
  created_at: string
  payment_instructions?: string
  bank_details?: BankDetails
  payment_records: PaymentRecord[]
  paid_amount: number
  remaining_amount: number
}

export default function StudentFeesPage() {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    fetchFeePlans()
  }, [])

  const fetchFeePlans = async () => {
    try {
      const response = await fetch('/api/student/fees')
      if (response.ok) {
        const data = await response.json()
        setFeePlans(data.fee_plans || [])
      }
    } catch (error) {
      console.error('Error fetching fee plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'overdue': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const calculateOverview = () => {
    const totalDue = feePlans.reduce((sum, plan) => sum + plan.remaining_amount, 0)
    const totalPaid = feePlans.reduce((sum, plan) => sum + plan.paid_amount, 0)
    const totalAmount = feePlans.reduce((sum, plan) => sum + plan.total_amount, 0)
    const overduePayments = feePlans.reduce((count, plan) => 
      count + plan.payment_records.filter(p => p.status === 'overdue').length, 0
    )

    return { totalDue, totalPaid, totalAmount, overduePayments }
  }

  const overview = calculateOverview()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="container py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading fee information...</div>
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
          title="Fee Management"
        />
        <p className="text-gray-400 mb-8">View your course fees, payment status, and payment history</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold text-white">${overview.totalAmount}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-400">${overview.totalPaid}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Amount Due</p>
                  <p className="text-2xl font-bold text-yellow-400">${overview.totalDue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-red-400">{overview.overduePayments}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Plans */}
        <div className="space-y-6">
          {feePlans.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="mb-2 text-lg font-medium text-gray-400">No Fee Plans</h3>
                <p className="text-gray-500">You don't have any fee plans set up yet.</p>
              </CardContent>
            </Card>
          ) : (
            feePlans.map((plan) => (
              <Card key={plan.id} className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        {plan.course_title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                        <span className="ml-2 text-gray-400">
                          {plan.fee_type === 'monthly' ? 'Monthly Payment Plan' : 'Full Course Payment'}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                      className="text-gray-300 border-gray-600"
                    >
                      {selectedPlan === plan.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Fee Plan Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="font-semibold text-white">{plan.currency} {plan.total_amount}</p>
                    </div>
                    <div className="p-3 bg-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-gray-400">Paid Amount</p>
                      <p className="font-semibold text-green-400">{plan.currency} {plan.paid_amount}</p>
                    </div>
                    <div className="p-3 bg-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-gray-400">Remaining</p>
                      <p className="font-semibold text-yellow-400">{plan.currency} {plan.remaining_amount}</p>
                    </div>
                    <div className="p-3 bg-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-gray-400">
                        {plan.fee_type === 'monthly' ? 'Monthly Amount' : 'Per Installment'}
                      </p>
                      <p className="font-semibold text-white">
                        {plan.currency} {plan.fee_type === 'monthly' ? plan.monthly_amount : plan.installment_amount}
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Payment Progress</span>
                      <span className="text-sm text-gray-400">
                        {Math.round((plan.paid_amount / plan.total_amount) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(plan.paid_amount / plan.total_amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Detailed Payment Records */}
                  {selectedPlan === plan.id && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Payment History</h4>
                      {plan.payment_records.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 bg-[#2a2a2a] rounded-lg">
                          No payment records yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {plan.payment_records.map((payment) => (
                            <div key={payment.id} className="p-4 bg-[#2a2a2a] rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(payment.status)}
                                  <div>
                                    <div className="font-medium text-white">
                                      {plan.currency} {payment.amount}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Due: {new Date(payment.due_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <Badge className={getStatusColor(payment.status)}>
                                    {payment.status}
                                  </Badge>
                                  {payment.paid_date && (
                                    <div className="text-sm text-gray-400 mt-1">
                                      Paid: {new Date(payment.paid_date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {payment.notes && (
                                <div className="mt-2 text-sm text-gray-400">
                                  {payment.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {plan.bank_details && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-400" />
                            Payment Bank Details
                          </h4>
                          
                          <div className="p-4 bg-[#2a2a2a] rounded-lg border border-blue-500/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Bank Name */}
                              <div className="space-y-2">
                                <label className="text-sm text-gray-400">Bank Name</label>
                                <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                  <span className="text-white font-medium">{plan.bank_details.bank_name}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(plan.bank_details!.bank_name, 'bank_name')}
                                    className="text-gray-400 hover:text-white p-1"
                                  >
                                    {copiedField === 'bank_name' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>

                              {/* Account Holder */}
                              <div className="space-y-2">
                                <label className="text-sm text-gray-400">Account Holder Name</label>
                                <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                  <span className="text-white font-medium">{plan.bank_details.account_holder_name}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(plan.bank_details!.account_holder_name, 'account_holder')}
                                    className="text-gray-400 hover:text-white p-1"
                                  >
                                    {copiedField === 'account_holder' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>

                              {/* Account Number */}
                              <div className="space-y-2">
                                <label className="text-sm text-gray-400">Account Number</label>
                                <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                  <span className="text-white font-medium font-mono">{plan.bank_details.account_number}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(plan.bank_details!.account_number, 'account_number')}
                                    className="text-gray-400 hover:text-white p-1"
                                  >
                                    {copiedField === 'account_number' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>

                              {/* Routing Number */}
                              {plan.bank_details.routing_number && (
                                <div className="space-y-2">
                                  <label className="text-sm text-gray-400">Routing Number</label>
                                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                    <span className="text-white font-medium font-mono">{plan.bank_details.routing_number}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(plan.bank_details!.routing_number!, 'routing_number')}
                                      className="text-gray-400 hover:text-white p-1"
                                    >
                                      {copiedField === 'routing_number' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* SWIFT Code */}
                              {plan.bank_details.swift_code && (
                                <div className="space-y-2">
                                  <label className="text-sm text-gray-400">SWIFT Code</label>
                                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                    <span className="text-white font-medium font-mono">{plan.bank_details.swift_code}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(plan.bank_details!.swift_code!, 'swift_code')}
                                      className="text-gray-400 hover:text-white p-1"
                                    >
                                      {copiedField === 'swift_code' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* IBAN */}
                              {plan.bank_details.iban && (
                                <div className="space-y-2">
                                  <label className="text-sm text-gray-400">IBAN</label>
                                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border">
                                    <span className="text-white font-medium font-mono">{plan.bank_details.iban}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(plan.bank_details!.iban!, 'iban')}
                                      className="text-gray-400 hover:text-white p-1"
                                    >
                                      {copiedField === 'iban' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Bank Address */}
                            {plan.bank_details.bank_address && (
                              <div className="mt-4 space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  Bank Address
                                </label>
                                <div className="flex items-start justify-between p-2 bg-[#1a1a1a] rounded border">
                                  <span className="text-white">{plan.bank_details.bank_address}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(plan.bank_details!.bank_address!, 'bank_address')}
                                    className="text-gray-400 hover:text-white p-1 ml-2"
                                  >
                                    {copiedField === 'bank_address' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Payment Instructions */}
                            {plan.payment_instructions && (
                              <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                                <div className="flex items-start gap-2">
                                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h5 className="font-medium text-blue-300 mb-1">Payment Instructions</h5>
                                    <p className="text-sm text-blue-200">{plan.payment_instructions}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Payment Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-700">
                        <Button variant="outline" className="text-gray-300 border-gray-600">
                          <Receipt className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                        <Button variant="outline" className="text-gray-300 border-gray-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}