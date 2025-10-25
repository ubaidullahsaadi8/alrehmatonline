"use client"

import { Star, Quote, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data)
        } else {
          setTestimonials([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err)
        setTestimonials([])
        setLoading(false)
      })
  }, [])

  return (
    <section id="testimonials" className="relative py-20 bg-white overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="testimonials-bg-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
              <circle cx="50" cy="15" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="50" cy="85" r="2.5" fill="#D4A017" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonials-bg-pattern)" />
        </svg>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 z-10">
        <div className="flex items-center gap-2 mb-6 bg-[#E6B325]/10 px-4 py-2 rounded-full w-max mx-auto border border-[#E6B325]/20">
          <Sparkles className="w-4 h-4 text-[#E6B325]" />
          <span className="text-sm text-gray-700 font-semibold">Student Testimonials</span>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            What Our <span className="text-[#E6B325]">Students Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trusted by students learning Quran worldwide
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6B325]"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-gray-600 py-16">No testimonials available yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-2xl relative border-2 shadow-md border-gray-200 hover:border-green-200 hover:shadow-lg hover:transform hover:scale-[1.02] transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center rounded-full  bg-emerald-700 fill-emerald-700">
                  <Quote className="w-6 h-6 text-white " />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#E6B325] text-[#E6B325]" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-8 leading-relaxed">{testimonial.content}</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#E6B325]/20 to-[#D4A017]/20 border-2 border-[#E6B325]/30">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar || "/placeholder.svg"} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#E6B325] font-bold text-lg">
                        {testimonial.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
