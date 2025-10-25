"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { ArrowLeft, DollarSign, Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface SalaryRecord {
  id: string
  month: number
  year: number
  amount: string
  status: string
  payment_date: string | null
  notes: string | null
  created_at: string
}

interface TeacherInfo {
  id: string
  name: string
  email: string
  currency: string
}

export default function AccountBookPage() {
  const router = useRouter()
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([])
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch salary records with teacher info
      const salaryResponse = await fetch(`/api/teacher/salary`)
      if (salaryResponse.ok) {
        const data = await salaryResponse.json()
        setTeacherInfo(data.teacher)
        setSalaryRecords(data.salaryRecords)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months[month - 1] || ""
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: teacherInfo?.currency || 'USD'
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredRecords = filter === "all" 
    ? salaryRecords 
    : salaryRecords.filter(record => record.status === filter)

  const totalPaid = salaryRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)

  const totalPending = salaryRecords
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading account book...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <PageHeader
        title="Account Book"
        subtitle="View your salary records and payment history"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link href="/teacher">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(totalPaid.toString())}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {salaryRecords.filter(r => r.status === 'paid').length} payments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(totalPending.toString())}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {salaryRecords.filter(r => r.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {salaryRecords.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Records Table */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Salary Records</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete history of your salary payments
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "" : "border-[#3a3a3a] text-gray-300"}
                >
                  All
                </Button>
                <Button
                  variant={filter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("paid")}
                  className={filter === "paid" ? "" : "border-[#3a3a3a] text-gray-300"}
                >
                  Paid
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                  className={filter === "pending" ? "" : "border-[#3a3a3a] text-gray-300"}
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Records Found</h3>
                <p className="text-sm text-gray-500">
                  {filter === "all" 
                    ? "No salary records have been added yet." 
                    : `No ${filter} records found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
                      <TableHead className="text-gray-400">Period</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Payment Date</TableHead>
                      <TableHead className="text-gray-400">Notes</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {getMonthName(record.month)} {record.year}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatCurrency(record.amount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {record.payment_date ? formatDate(record.payment_date) : "-"}
                        </TableCell>
                        <TableCell className="text-gray-400 max-w-[200px] truncate">
                          {record.notes || "-"}
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {formatDate(record.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
