"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Loader2, Search, Mail, Phone, Calendar, Clock, User, FileText, ArrowLeft } from "lucide-react"

interface ServiceBooking {
  id: string
  name: string
  email: string
  phone: string | null
  serviceId: string
  date: string
  time: string
  message: string | null
  status: string
  createdAt: string
}

interface Service {
  id: string
  title: string
}

export default function ServiceBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<ServiceBooking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [filter, setFilter] = useState("all")
  

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        const response = await fetch("/api/service-bookings")
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
          setFilteredBookings(data)
        }

        
        const servicesResponse = await fetch("/api/services")
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(Array.isArray(servicesData) ? servicesData : servicesData.services || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  
  useEffect(() => {
    if (filter === "all") {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filter))
    }
  }, [filter, bookings])

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/service-bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
       
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? { ...booking, status } : booking
          )
        )
        
   
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status })
        }
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const getServiceTitle = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    return service ? service.title : "Unknown Service"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-600">Pending</Badge>
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-600">Confirmed</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-600">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-600">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy")
    } catch (e) {
      console.error("Invalid date format:", dateStr)
      return dateStr
    }
  }

  const formatTime = (timeStr: string) => {
    try {
     
      const [hours, minutes] = timeStr.split(":")
      const date = new Date()
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      return format(date, "h:mm a")
    } catch (e) {
      console.error("Invalid time format:", timeStr)
      return timeStr
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading service bookings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin")}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Service Bookings</h1>
          <p className="text-muted-foreground">
            Manage and organize scheduled service bookings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </span>
          </div>
        </div>
        
        <TabsContent value={filter} className="mt-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-60">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No service bookings found</p>
                {filter !== "all" && (
                  <Button variant="ghost" onClick={() => setFilter("all")} className="mt-2">
                    View all bookings
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(booking.date)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatTime(booking.time)}
                        </TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell className="max-w-[180px] truncate">
                          <a href={`mailto:${booking.email}`} className="text-blue-500 hover:underline">
                            {booking.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {booking.phone ? (
                            <a href={`tel:${booking.phone}`} className="text-blue-500 hover:underline">
                              {booking.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">
                          {getServiceTitle(booking.serviceId)}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedBooking(booking)
                                setOpenDialog(true)
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <span>
                  Requested on {format(new Date(selectedBooking.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedBooking.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <a href={`mailto:${selectedBooking.email}`} className="text-blue-500 hover:underline">
                          {selectedBooking.email}
                        </a>
                      </div>
                    </div>
                    {selectedBooking.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <a href={`tel:${selectedBooking.phone}`} className="text-blue-500 hover:underline">
                            {selectedBooking.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(selectedBooking.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{formatTime(selectedBooking.time)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p>{getServiceTitle(selectedBooking.serviceId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedBooking.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {selectedBooking.message && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Message / Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{selectedBooking.message}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between items-center">
                <Select
                  defaultValue={selectedBooking.status}
                  onValueChange={(value) => handleStatusChange(selectedBooking.id, value)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="space-x-2">
                  <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedBooking.email}`}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Client
                  </Button>
                  
                  {}
                  <Button
                    onClick={() => {
                      const dateTime = `${selectedBooking.date}T${selectedBooking.time}:00`;
                      const endDateTime = new Date(new Date(dateTime).getTime() + 60*60*1000).toISOString();
                      
                      const event = {
                        text: `Service Booking: ${getServiceTitle(selectedBooking.serviceId)} with ${selectedBooking.name}`,
                        dates: `${dateTime}/${endDateTime}`,
                        details: `Service booking for ${getServiceTitle(selectedBooking.serviceId)}\n\n` +
                                 `${selectedBooking.message || ''}`
                      };
                      
                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${encodeURIComponent(event.dates.replace(/[-:]/g, ''))}&details=${encodeURIComponent(event.details)}`;
                      
                      window.open(googleCalendarUrl, '_blank');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
