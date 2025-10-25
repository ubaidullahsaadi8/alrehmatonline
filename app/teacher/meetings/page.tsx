"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Video, 
  Calendar, 
  Clock, 
  Users,
  BookOpen,
  ExternalLink,
  Copy,
  Edit,
  Save,
  X,
  Plus,
  CalendarDays,
  Timer,
  LinkIcon
} from "lucide-react"
import Link from "next/link"

interface Meeting {
  id: string
  course_id: string
  course_title: string
  course_category: string
  meeting_link?: string
  meeting_date?: string
  meeting_time?: string
  duration?: number
  description?: string
  student_count: number
  status: 'upcoming' | 'live' | 'past' | 'cancelled'
  created_at: string
}

export default function TeacherMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null)
  const [savingMeeting, setSavingMeeting] = useState<string | null>(null)
  const [meetingData, setMeetingData] = useState({
    link: "",
    date: "",
    time: "",
    duration: "60",
    description: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/teacher/meetings')
      if (response.ok) {
        const data = await response.json()
        setMeetings(data.meetings || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load meetings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching meetings:', error)
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting.course_id)
    setMeetingData({
      link: meeting.meeting_link || "",
      date: meeting.meeting_date || "",
      time: meeting.meeting_time || "",
      duration: meeting.duration?.toString() || "60",
      description: meeting.description || ""
    })
  }

  const handleSaveMeeting = async (courseId: string) => {
    setSavingMeeting(courseId)
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/meeting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Meeting updated successfully",
        })
        
        // Update the meetings list
        setMeetings(meetings.map(meeting => 
          meeting.course_id === courseId 
            ? { 
                ...meeting, 
                meeting_link: meetingData.link,
                meeting_date: meetingData.date,
                meeting_time: meetingData.time,
                duration: parseInt(meetingData.duration),
                description: meetingData.description
              }
            : meeting
        ))
        setEditingMeeting(null)
      } else {
        throw new Error('Failed to update meeting')
      }
    } catch (error) {
      console.error('Error saving meeting:', error)
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingMeeting(null)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const joinMeeting = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank')
    }
  }

  const getMeetingStatus = (meeting: Meeting): 'upcoming' | 'live' | 'past' | 'cancelled' => {
    if (!meeting.meeting_date || !meeting.meeting_time) return 'cancelled'
    
    const now = new Date()
    const meetingDateTime = new Date(`${meeting.meeting_date} ${meeting.meeting_time}`)
    const meetingEndTime = new Date(meetingDateTime.getTime() + (meeting.duration || 60) * 60 * 1000)
    
    if (now >= meetingDateTime && now <= meetingEndTime) return 'live'
    if (now > meetingEndTime) return 'past'
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
        return <Badge variant="destructive">❌ Not Scheduled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading meetings...</p>
          </div>
        </div>
      </div>
    )
  }

  const upcomingMeetings = meetings.filter(m => getMeetingStatus(m) === 'upcoming')
  const liveMeetings = meetings.filter(m => getMeetingStatus(m) === 'live')
  const pastMeetings = meetings.filter(m => getMeetingStatus(m) === 'past')
  const unscheduledMeetings = meetings.filter(m => getMeetingStatus(m) === 'cancelled')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <PageHeader
        title="Course Meetings"
        subtitle="Schedule and manage meetings for all your courses"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Meeting Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{meetings.length}</div>
              <div className="text-xs text-gray-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-6 w-6 bg-red-500 rounded-full mx-auto mb-2 animate-pulse" />
              <div className="text-lg font-bold text-gray-900">{liveMeetings.length}</div>
              <div className="text-xs text-gray-600">Live Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{upcomingMeetings.length}</div>
              <div className="text-xs text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">
                {meetings.reduce((acc, m) => acc + m.student_count, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Students</div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings List */}
        {meetings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Found</h3>
              <p className="text-gray-600 mb-6">You don't have any courses assigned yet.</p>
              <Link href="/teacher/courses">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {meetings.map((meeting) => {
              const status = getMeetingStatus(meeting)
              const isEditing = editingMeeting === meeting.course_id
              const isSaving = savingMeeting === meeting.course_id

              return (
                <Card key={meeting.course_id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{meeting.course_title}</CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <Badge variant="outline">{meeting.course_category}</Badge>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {meeting.student_count} students
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        {!isEditing ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMeeting(meeting)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveMeeting(meeting.course_id)}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMeeting(null)}
                              disabled={isSaving}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {isEditing ? (
                      /* Edit Mode */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`link-${meeting.course_id}`}>Meeting Link</Label>
                            <Input
                              id={`link-${meeting.course_id}`}
                              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                              value={meetingData.link}
                              onChange={(e) => setMeetingData({...meetingData, link: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`date-${meeting.course_id}`}>Date</Label>
                              <Input
                                id={`date-${meeting.course_id}`}
                                type="date"
                                value={meetingData.date}
                                onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`time-${meeting.course_id}`}>Time</Label>
                              <Input
                                id={`time-${meeting.course_id}`}
                                type="time"
                                value={meetingData.time}
                                onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`duration-${meeting.course_id}`}>Duration (minutes)</Label>
                            <Input
                              id={`duration-${meeting.course_id}`}
                              type="number"
                              placeholder="60"
                              value={meetingData.duration}
                              onChange={(e) => setMeetingData({...meetingData, duration: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`description-${meeting.course_id}`}>Description</Label>
                            <Textarea
                              id={`description-${meeting.course_id}`}
                              placeholder="Meeting agenda or notes..."
                              value={meetingData.description}
                              onChange={(e) => setMeetingData({...meetingData, description: e.target.value})}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      meeting.meeting_date && meeting.meeting_time && meeting.meeting_link ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Meeting Schedule */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Schedule
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-blue-800">
                                <CalendarDays className="h-4 w-4" />
                                <span className="font-medium">Date:</span>
                                <span>{new Date(meeting.meeting_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-blue-800">
                                <Timer className="h-4 w-4" />
                                <span className="font-medium">Time:</span>
                                <span>{meeting.meeting_time}</span>
                              </div>
                              {meeting.duration && (
                                <div className="flex items-center gap-2 text-blue-800">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">Duration:</span>
                                  <span>{meeting.duration} minutes</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Meeting Link */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              Meeting Link
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white border rounded px-3 py-2 text-sm font-mono break-all">
                                  {meeting.meeting_link}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(meeting.meeting_link!, "Meeting link")}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => joinMeeting(meeting.meeting_link!)}
                                  className={status === 'live' 
                                    ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                                    : "bg-green-600 hover:bg-green-700"
                                  }
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  {status === 'live' ? 'Join Live Meeting' : 'Start Meeting'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => copyToClipboard(meeting.meeting_link!, "Meeting link")}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                          <Calendar className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                          <h4 className="font-semibold text-yellow-900 mb-2">Meeting Not Scheduled</h4>
                          <p className="text-yellow-800 text-sm mb-4">
                            Set up a meeting time and link for your students.
                          </p>
                          <Button
                            onClick={() => handleEditMeeting(meeting)}
                            variant="outline"
                            className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </Button>
                        </div>
                      )
                    )}

                    {/* Description */}
                    {!isEditing && meeting.description && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Meeting Notes</h4>
                        <p className="text-gray-700 text-sm">{meeting.description}</p>
                      </div>
                    )}

                    {/* Quick Actions */}
                    {!isEditing && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Link href={`/teacher/courses`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Course
                          </Button>
                        </Link>
                        <Link href={`/teacher/students`}>
                          <Button variant="outline">
                            <Users className="mr-2 h-4 w-4" />
                            View Students
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}