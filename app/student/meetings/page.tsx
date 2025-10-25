"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  Video, 
  Calendar, 
  Clock, 
  User,
  BookOpen,
  ExternalLink,
  Copy,
  Search,
  Filter,
  CalendarDays,
  Timer,
  LinkIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Meeting {
  id: string
  course_id: string
  course_title: string
  course_category: string
  instructor_id: string
  instructor_name: string
  instructor_avatar?: string
  meeting_link?: string
  meeting_date?: string
  meeting_time?: string
  status: 'upcoming' | 'live' | 'past' | 'cancelled'
  created_at: string
}

export default function StudentMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "past">("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/student/meetings')
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
    const meetingEndTime = new Date(meetingDateTime.getTime() + 60 * 60 * 1000) // Assume 1 hour duration
    
    if (now >= meetingDateTime && now <= meetingEndTime) return 'live'
    if (now > meetingEndTime) return 'past'
    return 'upcoming'
  }

  const filteredMeetings = meetings
    .map(meeting => ({ ...meeting, status: getMeetingStatus(meeting) }))
    .filter(meeting => {
      const matchesSearch = 
        meeting.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.course_category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filter === "all" || meeting.status === filter
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      // Sort by status priority: live, upcoming, past, cancelled
      const statusPriority = { live: 0, upcoming: 1, past: 2, cancelled: 3 }
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status]
      }
      // Then sort by date
      if (a.meeting_date && b.meeting_date) {
        return new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime()
      }
      return 0
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">🔴 Live</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-500 hover:bg-blue-600">📅 Upcoming</Badge>
      case 'past':
        return <Badge variant="secondary">✅ Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive"> Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-300">Loading meetings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      <PageHeader
        title="My Meetings"
        subtitle="View meeting details for all your enrolled courses"
      />
      
      <div className="relative py-16 px-8 w-full">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        
        <div className="relative z-10 max-w-[2000px] mx-auto">
          {/* Meetings List */}
          {meetings.length === 0 ? (
            <Card className="bg-[#212121] border-gray-700">
              <CardContent className="p-8 text-center">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No meetings scheduled</h3>
                <p className="text-gray-400 mb-6">
                  Your instructors haven't scheduled any meetings yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {meetings.map((meeting) => (
                <Card key={meeting.course_id} className="bg-[#212121] border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{meeting.course_title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {meeting.instructor_name}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {meeting.meeting_link || meeting.meeting_date || meeting.meeting_time ? (
                      <div className="space-y-3">
                        {/* Meeting Link */}
                        {meeting.meeting_link && (
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm font-medium">Meeting Link</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(meeting.meeting_link!, "Meeting link")}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2">
                              <a 
                                href={meeting.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm break-all"
                              >
                                {meeting.meeting_link}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Meeting Date */}
                        {meeting.meeting_date && (
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-green-400" />
                              <span className="text-gray-400 text-sm font-medium">Meeting Date</span>
                            </div>
                            <div className="text-white font-medium">
                              {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        )}

                        {/* Meeting Time */}
                        {meeting.meeting_time && (
                          <div className="p-4 bg-[#2a2a2a] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-purple-400" />
                              <span className="text-gray-400 text-sm font-medium">Meeting Time</span>
                            </div>
                            <div className="text-white font-medium">
                              {meeting.meeting_time}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                        <h4 className="font-semibold text-yellow-400 mb-1">No Meeting Scheduled</h4>
                        <p className="text-yellow-300/70 text-sm">
                          Your instructor hasn't scheduled a meeting for this course yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}