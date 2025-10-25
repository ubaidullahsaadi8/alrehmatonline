"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Eye,
  Search,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Instructor {
  id: string
  name: string
  email: string
  country: string
  education: string
  is_approved: boolean
  active: boolean
  account_status: string
  courses_count: number
  created_at: string
  avatar: string | null
}

export default function InstructorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/instructors")
      if (!response.ok) {
        throw new Error("Failed to fetch instructors")
      }
      const data = await response.json()
      setInstructors(data)
    } catch (error) {
      console.error("Error fetching instructors:", error)
      toast({
        title: "Error",
        description: "Failed to load instructors. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  
  const filteredInstructors = instructors.filter((instructor) => {
    const query = searchQuery.toLowerCase()
    return (
      instructor.name.toLowerCase().includes(query) ||
      instructor.email.toLowerCase().includes(query) ||
      instructor.country.toLowerCase().includes(query)
    )
  })

  
  const handleApproval = async (instructorId: string, approve: boolean) => {
    setProcessingId(instructorId)
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approve }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${approve ? "approve" : "reject"} instructor`)
      }

      
      setInstructors((prevInstructors) =>
        prevInstructors.map((instructor) =>
          instructor.id === instructorId
            ? {
                ...instructor,
                is_approved: approve,
                active: approve, 
                account_status: approve ? "active" : "rejected",
              }
            : instructor
        )
      )

      toast({
        title: "Success",
        description: `Instructor ${approve ? "approved" : "rejected"} successfully.`,
        variant: "default",
      })
    } catch (error) {
      console.error(`Error ${approve ? "approving" : "rejecting"} instructor:`, error)
      toast({
        title: "Error",
        description: `Failed to ${approve ? "approve" : "reject"} instructor. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  
  const toggleActiveStatus = async (instructorId: string, makeActive: boolean) => {
    setProcessingId(instructorId)
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: makeActive }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${makeActive ? "activate" : "deactivate"} instructor`)
      }

      
      setInstructors((prevInstructors) =>
        prevInstructors.map((instructor) =>
          instructor.id === instructorId
            ? {
                ...instructor,
                active: makeActive,
                account_status: makeActive ? "active" : "inactive",
              }
            : instructor
        )
      )

      toast({
        title: "Success",
        description: `Instructor ${makeActive ? "activated" : "deactivated"} successfully.`,
        variant: "default",
      })
    } catch (error) {
      console.error(`Error ${makeActive ? "activating" : "deactivating"} instructor:`, error)
      toast({
        title: "Error",
        description: `Failed to ${makeActive ? "activate" : "deactivate"} instructor. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeColor = (status: string, isApproved: boolean) => {
    if (!isApproved) return "bg-yellow-100 text-yellow-800"
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructors Management</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-full max-w-md">
          <Input
            placeholder="Search instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="ghost" className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending: {instructors.filter((i) => !i.is_approved).length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active: {instructors.filter((i) => i.active && i.is_approved).length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Inactive: {instructors.filter((i) => !i.active && i.is_approved).length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructors List</CardTitle>
          <CardDescription>
            Manage instructors, approve applications, and assign courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInstructors.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No instructors found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={instructor.avatar || "/placeholder-user.jpg"}
                            alt={instructor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {instructor.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{instructor.education || "N/A"}</TableCell>
                    <TableCell>{instructor.country || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(
                          instructor.account_status,
                          instructor.is_approved
                        )}
                      >
                        {!instructor.is_approved
                          ? "Pending Approval"
                          : instructor.account_status.charAt(0).toUpperCase() +
                            instructor.account_status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {instructor.courses_count || 0}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(instructor.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/instructors/${instructor.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>

                        {!instructor.is_approved && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => handleApproval(instructor.id, true)}
                              disabled={processingId === instructor.id}
                            >
                              {processingId === instructor.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleApproval(instructor.id, false)}
                              disabled={processingId === instructor.id}
                            >
                              {processingId === instructor.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                              <span className="sr-only">Reject</span>
                            </Button>
                          </>
                        )}

                        {instructor.is_approved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={instructor.active ? "text-red-600" : "text-green-600"}
                            onClick={() =>
                              toggleActiveStatus(instructor.id, !instructor.active)
                            }
                            disabled={processingId === instructor.id}
                          >
                            {processingId === instructor.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : instructor.active ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {instructor.active ? "Deactivate" : "Activate"}
                            </span>
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
