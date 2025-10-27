"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Islamic Pattern */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="contact-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50,10 Q60,10 65,20 Q70,30 65,40 Q60,50 50,50 Q40,50 35,40 Q30,30 35,20 Q40,10 50,10 Z" 
                      fill="none" stroke="#D4A017" strokeWidth="1.5"/>
                <path d="M50,50 Q60,50 65,60 Q70,70 65,80 Q60,90 50,90 Q40,90 35,80 Q30,70 35,60 Q40,50 50,50 Z" 
                      fill="none" stroke="#D4A017" strokeWidth="1.5"/>
                <circle cx="50" cy="50" r="3" fill="#D4A017" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-pattern)" />
          </svg>
        </div>

        {/* Yellow Accent - Right Side */}
        <div className="absolute right-0 top-1/4 w-2 h-1/2 bg-gradient-to-b from-[#E6B325] to-[#D4A017]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Get In <span className="text-[#E6B325]">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="relative py-16 bg-white overflow-hidden">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="form-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
                <circle cx="50" cy="15" r="2.5" fill="#D4A017" opacity="0.4"/>
                <circle cx="50" cy="85" r="2.5" fill="#D4A017" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#form-pattern)" />
          </svg>
        </div>

        {/* Green Curved Shape - Left Side */}
        <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-gradient-to-br from-[#0f3a2e] to-[#1a4d3c] rounded-tr-[4rem] rounded-br-[4rem] overflow-hidden hidden lg:block mb-15">
          <div className="absolute right-0 top-0 bottom-0 w-32">
            <svg className="absolute right-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M100,0 Q50,50 100,100 L100,0 Z" fill="#0f3a2e" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border-8 border-white">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Send us a message</h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900 font-semibold">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-6 py-4 transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900 font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-6 py-4 transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900 font-semibold">
                      Phone <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (123) 456-7890"
                      className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-6 py-4 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-900 font-semibold">  
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry"
                      required
                      className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-6 py-4 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-900 font-semibold">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      required
                      rows={6}
                      className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-3xl px-6 py-4 transition-all duration-300 shadow-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="group relative overflow-hidden w-full px-8 py-6 text-sm font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl uppercase tracking-wide"
                  >
                    <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? "Sending..." : "Send Message"} <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[3rem] shadow-xl border-4 border-white">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017]">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Email</h3>
                    <p className="text-gray-600">alrehmatonlinequraanacademy@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0f3a2e] to-[#1a4d3c]">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Phone</h3>
                    <p className="text-gray-600">+92 324 8335750</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017]">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Office</h3>
                    <p className="text-gray-600">Sargodha, Punjab, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[3rem] shadow-xl border-4 border-white">
                <h3 className="font-bold text-gray-900 mb-6 text-2xl">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-700 pb-4 border-b border-gray-200">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="font-semibold text-[#0f3a2e]">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700 pb-4 border-b border-gray-200">
                    <span className="font-medium">Saturday</span>
                    <span className="font-semibold text-[#0f3a2e]">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Sunday</span>
                    <span className="font-semibold text-[#E6B325]">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
