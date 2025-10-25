"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ArrowRight, Sparkles, Star } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  image: string
  features: string[]
  price: string
  featured: boolean
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        const servicesData = data.services || data
        const servicesArray = Array.isArray(servicesData) ? servicesData : []
        setServices(servicesArray)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load services:", err)
        setLoading(false)
      })
  }, [])

  return (
    <section id="services" className="relative py-12 sm:py-16 md:py-20 mt-20 sm:mt-24 md:mt-28 lg:mt-32 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Islamic Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="home-services-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.6"/>
                <circle cx="60" cy="60" r="30" fill="none" stroke="#0f3a2e" strokeWidth="1.5" opacity="0.4"/>
                <path d="M60 15 L90 60 L60 105 L30 60 Z" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.5"/>
                <circle cx="60" cy="15" r="3" fill="#D4A017" opacity="0.5"/>
                <circle cx="90" cy="60" r="3" fill="#0f3a2e" opacity="0.5"/>
                <circle cx="60" cy="105" r="3" fill="#D4A017" opacity="0.5"/>
                <circle cx="30" cy="60" r="3" fill="#0f3a2e" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#home-services-pattern)" />
          </svg>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#E6B325]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#0f3a2e]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Yellow Accent Lines */}
      <div className="absolute left-0 top-1/4 w-2 h-1/3 bg-gradient-to-b from-[#E6B325] to-[#D4A017] rounded-r-full"></div>
      <div className="absolute right-0 top-1/2 w-2 h-1/4 bg-gradient-to-b from-[#D4A017] to-[#E6B325] rounded-l-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gradient-to-r from-[#E6B325]/20 to-[#D4A017]/20 border-2 border-[#E6B325]/30 w-max backdrop-blur-sm">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A017] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-[#0f3a2e] uppercase tracking-wider">
              Our Premium Services
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A017] animate-pulse" />
          </div>

          {/* Arabic Heading */}
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f3a2e]"
            style={{ fontFamily: "'Amiri', serif" }}
            dir="rtl"
          >
            خدماتنا المميزة
          </h2>

          {/* English Heading */}
          <h3 className="mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Discover Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient">
              Exceptional Services
            </span>
          </h3>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 px-4">
            Comprehensive Quran learning solutions designed with excellence and care. Each service is crafted to provide you with the best learning experience.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#E6B325]/30 border-t-[#E6B325] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#0f3a2e]/20 border-b-[#0f3a2e] rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white hover:border-[#E6B325]/30 flex flex-col h-full transform hover:scale-[1.02] hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325]/0 via-transparent to-[#0f3a2e]/0 group-hover:from-[#E6B325]/5 group-hover:to-[#0f3a2e]/5 transition-all duration-500 pointer-events-none z-10"></div>
                  
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden flex-shrink-0">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Featured Badge */}
                    {service.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white border-none py-2 px-4 text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-white" />
                        Most Popular
                      </Badge>
                    )}
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#0f3a2e]">{service.price}</span>
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col flex-grow relative z-20">
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-[#0f3a2e] transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 line-clamp-3 min-h-[4.5rem]">
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 flex-grow">
                      {service.features && service.features.length > 0 ? (
                        service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-gray-700 text-sm sm:text-base group/item">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017] flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            </div>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2.5 sm:gap-3 text-gray-700 text-sm sm:text-base">
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6B325] mt-0.5 flex-shrink-0" />
                          <span>Service details available on request</span>
                        </li>
                      )}
                    </ul>
                    
                    {/* CTA Button */}
                    <div className="mt-auto pt-5 sm:pt-6 border-t-2 border-gray-100">
                      <Link href={`/services/${service.id}`} className="block">
                        <Button className="w-full group/btn relative overflow-hidden px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-2xl">
                          <span className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-all duration-700 ease-out group-hover/btn:left-[100%]"></span>
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Learn More
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Services Button */}
            <div className="text-center mt-12 sm:mt-16 md:mt-20">
              <Link href="/services">
                <Button className="group relative overflow-hidden px-8 sm:px-10 md:px-12 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] hover:from-[#D4A017] hover:via-[#E6B325] hover:to-[#D4A017] text-white transition-all duration-500 rounded-full shadow-2xl hover:shadow-[#E6B325]/50 transform hover:scale-105 uppercase tracking-wider">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    View All Services
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
