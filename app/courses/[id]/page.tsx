"use client"

import { useEffect, useState, use } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Clock, BarChart3, User, CheckCircle2, ArrowLeft, Calendar as CalendarIcon, Clock as ClockIcon, AlertCircle } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  image: string
  price: number
  duration: string
  level: string
  instructor: string
  category: string
  featured: boolean
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const courseId = id;
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("09:00")
  
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load course:", err)
        setLoading(false)
      })
  }, [courseId])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  const handleCourseRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const courseRequest = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      courseId: courseId,
      message: formData.get("message")
    }

    try {
      const response = await fetch("/api/course-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseRequest)
      })

      if (response.ok) {
        setSuccessMessage("Your course information request has been submitted successfully. We'll contact you soon!")
        const target = e.target as HTMLFormElement
        target.reset()
      } else {
        const data = await response.json()
        setErrorMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting course request:", error)
      setErrorMessage("Failed to submit your request. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCourseBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    if (!date) {
      setErrorMessage("Please select a date for your course booking")
      setSubmitting(false)
      return
    }

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const courseBooking = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      courseId: courseId,
      date: date.toISOString().split("T")[0],
      time: formData.get("time"),
      message: formData.get("message")
    }

    try {
      const response = await fetch("/api/course-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseBooking)
      })

      if (response.ok) {
        setSuccessMessage("Your course has been booked successfully. We'll send you a confirmation email shortly.")
        const target = e.target as HTMLFormElement
        target.reset()
        setDate(undefined)
        setTime("09:00")
      } else {
        const data = await response.json()
        setErrorMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Error booking course:", error)
      setErrorMessage("Failed to book your course. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center text-gray-900 text-xl">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-3xl text-gray-900 mb-4">Course not found</h1>
          <Link href="/courses">
            <Button className="bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] text-white hover:from-[#1a4d3c] hover:to-[#0f3a2e]">Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const features = [
    "Lifetime access to course materials",
    "Certificate of completion",
    "Real-world projects and assignments",
    "Direct instructor support",
    "Access to exclusive community",
    "Regular content updates",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Stunning Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "#E6B325" : "#0f3a2e",
              opacity: 0.2,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}

        {/* Islamic Pattern with rotation */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="course-detail-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.6">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 60 60"
                    to="360 60 60"
                    dur="40s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="60" cy="60" r="30" fill="none" stroke="#0f3a2e" strokeWidth="1.5" opacity="0.4">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360 60 60"
                    to="0 60 60"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#course-detail-pattern)" />
          </svg>
        </div>

        {/* Mega Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E6B325]/20 to-transparent rounded-full blur-3xl animate-mega-pulse" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tl from-[#0f3a2e]/15 to-transparent rounded-full blur-3xl animate-mega-pulse-reverse" />
      </div>

      <div className="relative pt-32 pb-20 px-8">

        <div className="relative z-10 max-w-7xl mx-auto">
          <Link href="/courses">
            <Button variant="ghost" className={`text-gray-900 mb-8 hover:bg-gray-100 border border-gray-200 group transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Back to Courses
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className={`relative h-96 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transition-all duration-1000 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                {course.featured && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none py-2.5 px-5 text-xs sm:text-sm font-black shadow-2xl shadow-[#E6B325]/50 animate-glow-pulse">
                    Featured
                  </Badge>
                )}
              </div>

              <div>
                <div className={`flex flex-wrap items-center gap-2 mb-4 transition-all duration-1000 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                }`}>
                  <Badge className="bg-[#E6B325]/90 text-white backdrop-blur-sm border-none py-1.5 px-4 font-bold uppercase">
                    {course.category}
                  </Badge>
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-2 border-gray-200 py-1.5 px-4 font-bold uppercase">
                    {course.level}
                  </Badge>
                </div>

                <h1 className={`text-4xl md:text-5xl font-black text-gray-900 mb-6 transition-all duration-1000 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>{course.title}</h1>

                <p className={`text-xl text-gray-600 leading-relaxed mb-8 transition-all duration-1000 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>{course.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Clock, label: 'Duration', value: course.duration, delay: 500 },
                    { icon: BarChart3, label: 'Level', value: course.level, delay: 600 },
                    { icon: User, label: 'Instructor', value: course.instructor, delay: 700 }
                  ].map((item, index) => (
                    <div key={index} className={`group/card bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-6 text-center shadow-2xl border-4 border-white transition-all duration-1000 hover:scale-110 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ transitionDelay: `${item.delay}ms` }}>
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#E6B325]/10 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-700" />
                        <item.icon className="w-10 h-10 text-[#E6B325] mx-auto mb-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500 relative z-10" />
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">{item.label}</div>
                      <div className="text-lg font-black text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className={`bg-gradient-to-br from-gray-50 to-white rounded-[3rem] p-8 shadow-2xl border-4 border-white transition-all duration-1000 delay-800 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                  <h3 className="text-2xl font-black text-gray-900 mb-6">What You'll Learn</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700 group/item transition-all duration-500">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] flex items-center justify-center group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-500 shadow-lg shadow-[#E6B325]/30">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="leading-relaxed group-hover/item:translate-x-1 transition-transform duration-300 text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className={`bg-gradient-to-br from-gray-50 to-white rounded-[3rem] sticky top-24 overflow-hidden shadow-2xl border-4 border-white transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <div className="h-2 bg-gradient-to-r from-[#E6B325] to-[#D4A017]"></div>
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-[#0f3a2e] mb-2">${course.price}</div>
                    <div className="text-gray-600">One-time payment</div>
                  </div>

                  <Tabs defaultValue="request" className="mt-6">
                    <TabsList className="grid grid-cols-2 mb-4 bg-white">
                      <TabsTrigger value="request" className="data-[state=active]:bg-[#E6B325] data-[state=active]:text-white">
                        Course Info
                      </TabsTrigger>
                      <TabsTrigger value="booking" className="data-[state=active]:bg-[#E6B325] data-[state=active]:text-white">
                        Book Course
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="request">
                      {successMessage && (
                        <Alert className="mb-4 bg-green-50 border-2 border-green-500 text-green-900">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-900">Success!</AlertTitle>
                          <AlertDescription className="text-xs text-green-800">{successMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={handleCourseRequest} className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-900 font-semibold text-xs">Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Your Name" 
                            required 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-900 font-semibold text-xs">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            required 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-900 font-semibold text-xs">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            placeholder="+1 (234) 567-8910" 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-900 font-semibold text-xs">Message</Label>
                          <Textarea 
                            id="message" 
                            name="message" 
                            placeholder="I'm interested in learning more..." 
                            required 
                            className="min-h-20 !bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-3xl px-4 py-3 transition-all duration-300 shadow-sm resize-none"
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="group relative overflow-hidden w-full px-6 py-3 text-sm font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl" 
                          disabled={submitting}
                        >
                          <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                          <span className="relative z-10">{submitting ? "Submitting..." : "Request Course Information"}</span>
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="booking">
                      {successMessage && (
                        <Alert className="mb-4 bg-green-50 border-2 border-green-500 text-green-900">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-900">Success!</AlertTitle>
                          <AlertDescription className="text-xs text-green-800">{successMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={handleCourseBooking} className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="booking-name" className="text-gray-900 font-semibold text-xs">Name</Label>
                          <Input 
                            id="booking-name" 
                            name="name" 
                            placeholder="Your Name" 
                            required 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="booking-email" className="text-gray-900 font-semibold text-xs">Email</Label>
                          <Input 
                            id="booking-email" 
                            name="email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            required 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="booking-phone" className="text-gray-900 font-semibold text-xs">Phone Number</Label>
                          <Input 
                            id="booking-phone" 
                            name="phone" 
                            type="tel" 
                            placeholder="+1 (234) 567-8910" 
                            className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-2 transition-all duration-300 shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold text-xs">Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full !bg-white border border-gray-200 text-gray-900 justify-start text-left font-normal hover:!border-[#E6B325] rounded-full ${!date ? 'text-gray-400' : ''}`}
                                size="sm"
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {date ? format(date, "MMM d, yyyy") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                className="bg-white text-gray-900"
                                disabled={(date) => {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  return date < today
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="booking-time" className="text-gray-900 font-semibold text-xs">Preferred Time</Label>
                          <select
                            id="booking-time"
                            name="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 hover:border-[#E6B325] focus:border-[#E6B325] focus:ring-2 focus:ring-[#E6B325]/20 transition-all duration-300 shadow-sm"
                          >
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="booking-message" className="text-gray-900 font-semibold text-xs">Message (Optional)</Label>
                          <Textarea 
                            id="booking-message" 
                            name="message" 
                            placeholder="Special requirements or questions..." 
                            className="min-h-16 !bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-3xl px-4 py-3 transition-all duration-300 shadow-sm resize-none text-sm"
                            rows={2}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="group relative overflow-hidden w-full px-6 py-3 text-sm font-bold bg-gradient-to-r from-[#E6B325] to-[#D4A017] hover:from-[#D4A017] hover:to-[#E6B325] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl" 
                          disabled={submitting}
                        >
                          <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                          <span className="relative z-10">{submitting ? "Booking..." : "Book This Course"}</span>
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E6B325]" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E6B325]" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E6B325]" />
                      <span>Certificate included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translate(100px, -100px) rotate(90deg);
            opacity: 0.4;
          }
          50% {
            transform: translate(200px, 0) rotate(180deg);
            opacity: 0.2;
          }
          75% {
            transform: translate(100px, 100px) rotate(270deg);
            opacity: 0.4;
          }
        }
        
        @keyframes mega-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
        }
        
        @keyframes mega-pulse-reverse {
          0%, 100% {
            transform: scale(1.1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(230, 179, 37, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(230, 179, 37, 0.6);
          }
        }
        
        .animate-float-particle {
          animation: float-particle 15s ease-in-out infinite;
        }
        
        .animate-mega-pulse {
          animation: mega-pulse 6s ease-in-out infinite;
        }
        
        .animate-mega-pulse-reverse {
          animation: mega-pulse-reverse 8s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
