"use client"

import { useEffect, useState, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ArrowRight, Sparkles, Star, Zap, Crown } from "lucide-react"
import { getCurrencyByCode } from "@/lib/currencies"

interface Service {
  id: string
  title: string
  description: string
  image: string
  features: string[]
  price: string
  currency: string
  featured: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        setIsVisible(isInView)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Stunning Hero Section */}
      <section className="relative pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots-services" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#0f3a2e" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-services)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mx-auto mb-5 rounded-full bg-gradient-to-r from-[#0f3a2e]/10 to-[#E6B325]/10 border border-[#E6B325]/30">
            <div className="w-2 h-2 bg-[#E6B325] rounded-full"></div>
            <span className="text-sm font-semibold text-[#0f3a2e] uppercase tracking-wide">
              Our Services
            </span>
          </div>

          {/* Arabic Heading with 3D effect */}
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f3a2e] animate-fade-in-scale text-shadow-3d"
            style={{ fontFamily: "'Amiri', serif", animationDelay: "0.2s" }}
            dir="rtl"
          >
            خدماتنا المميزة
          </h2>

          {/* English Heading with mega gradient */}
          <h3 className="mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 animate-fade-in-scale" style={{ animationDelay: "0.4s" }}>
            Discover Our{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
                Exceptional Services
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6B325] to-transparent animate-shimmer" />
            </span>
          </h3>

          {/* Description with fade */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 px-4 animate-fade-in-scale" style={{ animationDelay: "0.6s" }}>
            Comprehensive Quran learning solutions designed with excellence and care. Each service is crafted to provide you with the best learning experience.
          </p>
        </div>
      </section>
      
      {/* Services Section */}
      <section ref={sectionRef} className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#E6B325]/30 border-t-[#E6B325] rounded-full animate-spin" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-[#0f3a2e]/20 border-b-[#0f3a2e] rounded-full animate-spin-reverse" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#D4A017] animate-pulse" />
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {services.map((service, index) => {
                  const currencyInfo = getCurrencyByCode(service.currency || 'USD')
                  const priceDisplay = service.price ? `${currencyInfo.symbol}${service.price}` : 'Contact for pricing'
                  
                  return (
                  <div
                    key={service.id}
                    className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-700 border-4 border-white hover:border-[#E6B325]/50 flex flex-col h-full transform hover:scale-105 hover:-translate-y-4 ${
                      isVisible ? 'animate-slide-up-fade' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      backgroundColor: index % 4 === 0 ? '#D4A017' : index % 4 === 1 ? '#E6B325' : index % 4 === 2 ? '#D4A017' : '#0f3a2e'
                    }}
                  >
                    {/* Sparkle Effects */}
                    <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-20" />
                    
                    {/* Content Container */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-20">
                      {/* Price Tag at Top */}
                      <div className="text-center mb-6">
                        <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                          {priceDisplay}
                        </div>
                        <div className="text-sm text-white/80 font-semibold">
                          {currencyInfo.code} per Month
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-white/90 text-sm leading-relaxed mb-6 text-center line-clamp-2">
                        {service.description}
                      </p>
                      
                      {/* Features List with icons */}
                      <ul className="space-y-3 mb-6 flex-grow">
                        {service.features && service.features.length > 0 ? (
                          service.features.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-white text-sm group/item transition-all duration-500"
                            >
                              <div className="flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-center gap-3 text-white text-sm">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                            <span>Service details available on request</span>
                          </li>
                        )}
                      </ul>
                      
                      {/* CTA Button */}
                      <div className="mt-auto">
                        <Link href={`/services/${service.id}`} className="block">
                          <Button className="w-full group/btn relative overflow-hidden px-6 py-4 text-sm font-bold bg-white text-[#0f3a2e] hover:bg-white/90 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              Get Free Trial
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Featured Badge */}
                      {service.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white text-[#0f3a2e] border-none py-1.5 px-3 text-xs font-black shadow-lg">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </>
          )}

          <div className="mt-20">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-[3rem] p-10 max-w-4xl mx-auto relative overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E6B325] to-[#D4A017]"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  We specialize in creating tailored Quran learning solutions for unique needs. 
                  Let's discuss how we can help you achieve your learning goals.
                </p>
                <Link href="/contact">
                  <Button className="group relative overflow-hidden px-8 py-6 text-sm font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl uppercase tracking-wide">
                    <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      Contact Us <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E6B325]/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#0f3a2e]/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />

      {/* Mega Animations Styles */}
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
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        
        @keyframes mega-pulse-reverse {
          0%, 100% {
            transform: scale(1.1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes slide-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        
        @keyframes slide-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(230, 179, 37, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(230, 179, 37, 0.6);
          }
        }
        
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-flow-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer-wave {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 3s ease-in-out infinite;
        }
        
        .animate-slide-left {
          animation: slide-left 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s ease-out both;
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 3s ease infinite;
        }
        
        .animate-gradient-flow-slow {
          animation: gradient-flow-slow 5s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-shimmer-wave {
          animation: shimmer-wave 3s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-float-subtle {
          animation: float-subtle 3s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .animate-slide-up-fade {
          animation: slide-up-fade 0.8s ease-out both;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(212, 160, 23, 0.5);
        }
        
        .text-shadow-3d {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .bg-size-200 {
          background-size: 200% auto;
        }
      `}</style>
    </div>
  )
}
