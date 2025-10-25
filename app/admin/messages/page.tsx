"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, Search, RefreshCw, Mail, Trash, 
  ChevronDown, ChevronRight, Calendar, User, Phone, MessageSquare 
} from "lucide-react"
import { format, parseISO, isSameDay } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string 
  subject: string
  message: string
  createdAt: string
  read: boolean
}

interface GroupedMessages {
  [date: string]: ContactMessage[]
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>({})
  const [expandedDates, setExpandedDates] = useState<{[key: string]: boolean}>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  useEffect(() => {
    fetchMessages()
  }, [])

  // Group messages by date whenever messages or search term changes
  useEffect(() => {
    const filtered = searchTerm
      ? messages.filter(
          message =>
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : messages;
    
    groupMessagesByDate(filtered);
  }, [messages, searchTerm]);
  
  // Group messages by date
  const groupMessagesByDate = (messagesList: ContactMessage[]) => {
    const grouped: GroupedMessages = {};

    messagesList.forEach(message => {
      // Parse date and format as key
      const messageDate = parseISO(message.createdAt);
      const dateKey = format(messageDate, 'yyyy-MM-dd');
      const displayDate = format(messageDate, 'MMMM d, yyyy');

      if (!grouped[displayDate]) {
        grouped[displayDate] = [];
      }
      grouped[displayDate].push(message);

      // If it's today, expand it by default
      const isToday = isSameDay(messageDate, new Date());
      if (isToday && !expandedDates[displayDate]) {
        setExpandedDates(prev => ({ ...prev, [displayDate]: true }));
      }
    });

    // Sort each group by time (newest first)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    setGroupedMessages(grouped);
  };

  // Toggle date expansion
  const toggleDateExpansion = (date: string) => {
    setExpandedDates(prev => ({ 
      ...prev, 
      [date]: !prev[date] 
    }));
  };
  
  async function fetchMessages() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        console.error('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleMarkAsRead(id: string) {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })
      
      if (response.ok) {
        setMessages(messages.map(message => 
          message.id === id ? { ...message, read: true } : message
        ))
      } else {
        console.error('Failed to mark message as read')
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  async function handleDeleteMessage(id: string) {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setMessages(messages.filter(message => message.id !== id))
        setDeleteMessageId(null)
      } else {
        console.error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage messages from the contact form
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 w-full md:w-[250px] bg-white dark:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchMessages()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading messages...</p>
        </div>
      ) : Object.keys(groupedMessages).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Mail className="h-12 w-12 mb-2 opacity-30" />
          <p>No messages found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {Object.keys(groupedMessages).sort((a, b) => {
                
                return new Date(b).getTime() - new Date(a).getTime();
              }).map((date) => (
                <div key={date}>
                  {}
                  <div 
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => toggleDateExpansion(date)}
                  >
                    <div className="flex items-center">
                      {expandedDates[date] ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                      )}
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="font-medium">{date}</span>
                      <Badge variant="outline" className="ml-3">
                        {groupedMessages[date].length}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-600">
                        {groupedMessages[date].filter(m => !m.read).length} New
                      </Badge>
                    </div>
                  </div>
                  
                  {}
                  {expandedDates[date] && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {groupedMessages[date].map((message) => (
                        <div 
                          key={message.id}
                          className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                            !message.read ? "font-semibold bg-blue-50/50 dark:bg-blue-900/10" : ""
                          }`}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (!message.read) {
                              handleMarkAsRead(message.id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={!message.read ? "font-semibold" : ""}>
                                  {message.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(message.createdAt), "h:mm a")}
                                </span>
                                {!message.read && (
                                  <Badge className="ml-2 bg-blue-500">New</Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-muted-foreground truncate">
                                {message.subject}
                              </div>
                              
                              <p className="text-sm mt-1 line-clamp-1 max-w-[500px]">
                                {message.message}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-red-600 dark:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteMessageId(message.id);
                              }}
                              disabled={actionLoading === message.id}
                            >
                              {actionLoading === message.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && format(parseISO(selectedMessage.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
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
                        <p className="font-medium">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-500 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <a href={`tel:${selectedMessage.phone}`} className="text-blue-500 hover:underline">
                            {selectedMessage.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Message Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>
                        {format(parseISO(selectedMessage.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{selectedMessage.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {selectedMessage.read ? (
                          <Badge variant="outline" className="bg-gray-500/20 text-gray-600 border-gray-600">Read</Badge>
                        ) : (
                          <Badge className="bg-blue-500">New</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  className="text-red-600 dark:text-red-400" 
                  onClick={() => {
                    setDeleteMessageId(selectedMessage.id)
                    setSelectedMessage(null)
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </Button>
                  
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteMessageId} onOpenChange={(open) => !open && setDeleteMessageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading === deleteMessageId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMessageId && handleDeleteMessage(deleteMessageId)}
              disabled={actionLoading === deleteMessageId}
            >
              {actionLoading === deleteMessageId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Message"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
