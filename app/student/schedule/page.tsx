"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Calendar, 
  Clock, 
  Video,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CalendarDays
} from "lucide-react"
import Link from "next/link"

interface ScheduleEvent {
  id: string
  title: string
  type: 'meeting' | 'assignment' | 'exam' | 'course'
  course_id: string
  course_title: string
  course_category: string
  instructor_name: string
  date: string
  time?: string
  duration?: number
  meeting_link?: string
  description?: string
  status: 'upcoming' | 'live' | 'past' | 'cancelled'
}

export default function StudentSchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const { toast } = useToast()

  useEffect(() => {
    fetchSchedule()
  }, [currentDate])

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/student/schedule')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load schedule",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventStatus = (event: ScheduleEvent): 'upcoming' | 'live' | 'past' | 'cancelled' => {
    const now = new Date()
    const eventDate = new Date(`${event.date} ${event.time || '00:00'}`)
    const eventEndTime = new Date(eventDate.getTime() + (event.duration || 60) * 60 * 1000)
    
    if (now >= eventDate && now <= eventEndTime) return 'live'
    if (now > eventEndTime) return 'past'
    return 'upcoming'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">🔴 Live</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-500 hover:bg-blue-600">📅 Upcoming</Badge>
      case 'past':
        return <Badge variant="secondary">✅ Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">❌ Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Video className="h-4 w-4" />
      case 'assignment':
        return <BookOpen className="h-4 w-4" />
      case 'exam':
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0]
    return event.date === today
  })

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return eventDate >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading schedule...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <PageHeader
        title="Course Schedule"
        subtitle="View your course meetings, assignments, and important dates"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{events.length}</div>
              <div className="text-xs text-gray-600">Total Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{todayEvents.length}</div>
              <div className="text-xs text-gray-600">Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">
                {events.filter(e => e.type === 'meeting').length}
              </div>
              <div className="text-xs text-gray-600">Meetings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">
                {events.filter(e => e.type === 'assignment').length}
              </div>
              <div className="text-xs text-gray-600">Assignments</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatDate(currentDate)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())}>
                      Today
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border rounded ${
                        day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            new Date().getDate() === day && 
                            new Date().getMonth() === currentDate.getMonth() && 
                            new Date().getFullYear() === currentDate.getFullYear()
                              ? 'text-blue-600 bg-blue-100 rounded px-1'
                              : 'text-gray-700'
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {getEventsForDate(day).slice(0, 2).map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`text-xs p-1 rounded truncate ${
                                  event.type === 'meeting' 
                                    ? 'bg-purple-100 text-purple-700'
                                    : event.type === 'assignment'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {getEventsForDate(day).length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{getEventsForDate(day).length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Upcoming Events */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Events</CardTitle>
              </CardHeader>
              <CardContent>
                {todayEvents.length === 0 ? (
                  <p className="text-gray-600 text-sm">No events scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{event.title}</div>
                          <div className="text-xs text-gray-600">{event.course_title}</div>
                          {event.time && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(getEventStatus(event))}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-600 text-sm">No upcoming events</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{event.title}</div>
                            <div className="text-xs text-gray-600 mb-1">{event.course_title}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString()}
                              {event.time && (
                                <>
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getTypeIcon(event.type)}
                          </div>
                        </div>
                        {event.meeting_link && event.type === 'meeting' && (
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(event.meeting_link, '_blank')}
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Join
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/student/courses" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Courses
                  </Button>
                </Link>
                <Link href="/student/meetings" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Video className="mr-2 h-4 w-4" />
                    View All Meetings
                  </Button>
                </Link>
                <Link href="/student/instructors" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Contact Instructors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}