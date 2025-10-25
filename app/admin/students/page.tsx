"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Plus,
  UserPlus,
  Search,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  Pencil,
  MessageSquare,
  BookOpen,
  CreditCard,
} from "lucide-react"
import Image from "next/image"

interface Student {
  id: string
  name: string
  email: string
  avatar: string | null
  country: string | null
  active: boolean
  account_status: string
  is_approved: boolean
  created_at: string
  courses_count: number
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
  const { toast } = useToast()
  
  // Counters
  const [counts, setCounts] = useState({
    pending: 0,
    active: 0,
    inactive: 0
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students")
      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }
      
      const data = await response.json()
      setStudents(data)
      
      
      setCounts({
        pending: data.filter((s: Student) => !s.is_approved).length,
        active: data.filter((s: Student) => s.active && s.is_approved).length,
        inactive: data.filter((s: Student) => !s.active && s.is_approved).length
      })
      
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Error",
        description: "Failed to load students data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'all') {
      return matchesSearch
    }
    if (filter === 'pending') {
      return matchesSearch && !student.is_approved
    }
    if (filter === 'active') {
      return matchesSearch && student.active && student.is_approved
    }
    if (filter === 'inactive') {
      return matchesSearch && !student.active && student.is_approved
    }
    
    return matchesSearch
  })

  const handleApproveStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approve: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve student')
      }

      toast({
        title: "Success",
        description: "Student has been approved successfully.",
      })

      fetchStudents() 
    } catch (error) {
      console.error("Error approving student:", error)
      toast({
        title: "Error",
        description: "Failed to approve student. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (studentId: string, currentlyActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentlyActive }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${currentlyActive ? 'deactivate' : 'activate'} student`)
      }

      toast({
        title: "Success",
        description: `Student has been ${currentlyActive ? 'deactivated' : 'activated'} successfully.`,
      })

      fetchStudents() 
    } catch (error) {
      console.error(`Error ${currentlyActive ? 'deactivating' : 'activating'} student:`, error)
      toast({
        title: "Error",
        description: `Failed to ${currentlyActive ? 'deactivate' : 'activate'} student. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading students data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students Management</h1>
          <p className="text-muted-foreground mt-1">
            View, manage, and track all student accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/admin/students/register">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Student
            </Button>
          </Link>
          <Link href="/admin/courses/assign">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Assign Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={filter} 
            onValueChange={(value) => setFilter(value as 'all' | 'active' | 'inactive' | 'pending')}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
            Pending: {counts.pending}
          </Badge>
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Active: {counts.active}
          </Badge>
          <Badge variant="outline" className="text-red-600 bg-red-50">
            Inactive: {counts.inactive}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Manage students, approve applications, and assign courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-semibold">No students found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? "No students match your search query. Try a different search term." 
                  : "There are no students in this category."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Courses</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={student.avatar || "/placeholder-user.jpg"}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {!student.is_approved ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-100">
                          Pending Approval
                        </Badge>
                      ) : student.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{student.courses_count || 0}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(student.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/students/${student.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {!student.is_approved ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleApproveStudent(student.id)}
                          >
                            <UserCheck className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={student.active 
                              ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100 hover:text-red-800" 
                              : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100 hover:text-green-800"}
                            onClick={() => handleToggleStatus(student.id, student.active)}
                          >
                            {student.active ? "Deactivate" : "Activate"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
