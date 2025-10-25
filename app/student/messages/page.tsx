"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { 
  MessageSquare, 
  Send, 
  User,
  Clock,
  Search,
  RefreshCw,
  CheckCircle,
  Circle,
  ArrowLeft,
  Mail
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Message {
  id: string
  subject: string
  content: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  recipient_id: string
  recipient_name: string
  read: boolean
  created_at: string
  course_id?: string
  course_title?: string
}

interface Instructor {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function StudentMessagesPage() {
  const searchParams = useSearchParams()
  const preSelectedInstructor = searchParams.get('instructor')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(preSelectedInstructor)
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    recipient_id: preSelectedInstructor || ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
    fetchInstructors()
  }, [])

  useEffect(() => {
    if (preSelectedInstructor) {
      setSelectedInstructor(preSelectedInstructor)
      setNewMessage(prev => ({ ...prev, recipient_id: preSelectedInstructor }))
    }
  }, [preSelectedInstructor])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/student/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/student/instructors')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.instructors || [])
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.subject.trim() || !newMessage.content.trim() || !newMessage.recipient_id) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/student/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        })
        setNewMessage({ subject: "", content: "", recipient_id: selectedInstructor || "" })
        fetchMessages() // Refresh messages
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/student/messages/${messageId}/read`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        ))
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesInstructor = !selectedInstructor || 
      message.sender_id === selectedInstructor || 
      message.recipient_id === selectedInstructor

    return matchesSearch && matchesInstructor
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <PageHeader
        title="Messages"
        subtitle="Communicate with your instructors and stay updated"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Instructors & Compose */}
          <div className="space-y-6">
            {/* Compose New Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={sendMessage} className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">To Instructor</Label>
                    <select
                      id="recipient"
                      className="w-full p-2 border rounded-md"
                      value={newMessage.recipient_id}
                      onChange={(e) => {
                        setNewMessage({ ...newMessage, recipient_id: e.target.value })
                        setSelectedInstructor(e.target.value)
                      }}
                      required
                    >
                      <option value="">Select an instructor</option>
                      {instructors.map(instructor => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      placeholder="Enter message subject"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      placeholder="Type your message here..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full">
                    {sending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Instructor Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filter by Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedInstructor === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedInstructor(null)}
                    className="w-full justify-start"
                  >
                    All Instructors
                  </Button>
                  {instructors.map(instructor => (
                    <Button
                      key={instructor.id}
                      variant={selectedInstructor === instructor.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedInstructor(instructor.id)}
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {instructor.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {searchTerm || selectedInstructor ? "No messages found" : "No messages yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedInstructor
                      ? "Try adjusting your search or filter" 
                      : "Start a conversation with your instructors by sending a message"
                    }
                  </p>
                  {(searchTerm || selectedInstructor) && (
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => setSearchTerm("")} variant="outline">
                        Clear Search
                      </Button>
                      <Button onClick={() => setSelectedInstructor(null)} variant="outline">
                        Show All
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !message.read ? 'border-blue-200 bg-blue-50/50' : ''
                    }`}
                    onClick={() => !message.read && markAsRead(message.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {message.sender_avatar ? (
                            <Image
                              src={message.sender_avatar}
                              alt={message.sender_name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {message.subject}
                              {!message.read && (
                                <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <span>From: {message.sender_name}</span>
                              {message.course_title && (
                                <Badge variant="outline" className="text-xs">
                                  {message.course_title}
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{message.content}</p>
                      {!message.read && (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(message.id)
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Read
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}