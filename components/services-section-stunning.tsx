"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ArrowRight, Sparkles, Star, Zap, Crown } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  image: string
  features: string[]
  price: string
  featured: boolean
}

export default function ServicesSectionStunning() {
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
    <section
      ref={sectionRef}
      id="services"
      className="relative py-12 sm:py-14 md:py-16 lg:py-20 mt-0 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden"
    >
      {/* Mega Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
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
              <pattern id="stunning-services-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
                <path d="M60 15 L90 60 L60 105 L30 60 Z" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.5" />
                <circle cx="60" cy="15" r="3" fill="#D4A017" opacity="0.5">
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="90" cy="60" r="3" fill="#0f3a2e" opacity="0.5">
                  <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stunning-services-pattern)" />
          </svg>
        </div>
        
        {/* Mega Gradient Orbs with pulse */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E6B325]/30 to-transparent rounded-full blur-3xl animate-mega-pulse" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-[#0f3a2e]/20 to-transparent rounded-full blur-3xl animate-mega-pulse-reverse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#D4A017]/10 to-transparent rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Animated Accent Lines */}
      <div className="absolute left-0 top-1/4 w-2 h-1/3 bg-gradient-to-b from-[#E6B325] to-[#D4A017] rounded-r-full animate-slide-right" />
      <div className="absolute right-0 top-1/2 w-2 h-1/4 bg-gradient-to-b from-[#D4A017] to-[#E6B325] rounded-l-full animate-slide-left" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        {/* Ultra Stunning Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          {/* Mega Badge with glow */}
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gradient-to-r from-[#E6B325]/30 via-[#D4A017]/20 to-[#E6B325]/30 border-2 border-[#E6B325]/50 w-max backdrop-blur-md shadow-2xl shadow-[#E6B325]/30 animate-glow-pulse">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4A017] animate-spin-slow" />
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6B325] animate-bounce-subtle" />
            <span className="text-xs sm:text-sm md:text-base font-black text-[#0f3a2e] uppercase tracking-widest">
              Premium Services
            </span>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A017] animate-pulse" />
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6B325] animate-spin-slow" />
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

        {/* Services Grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-700 border-4 border-white hover:border-[#E6B325]/50 flex flex-col h-full transform hover:scale-105 hover:-translate-y-4 perspective-1000 ${
                    isVisible ? 'animate-slide-up-fade' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 3D Tilt Effect Container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325]/0 via-transparent to-[#0f3a2e]/0 group-hover:from-[#E6B325]/10 group-hover:to-[#0f3a2e]/10 transition-all duration-700 pointer-events-none z-10 group-hover:animate-shimmer-wave" />
                  
                  {/* Sparkle Effects */}
                  <Sparkles className="absolute top-4 left-4 w-6 h-6 text-[#E6B325] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-20" />
                  <Sparkles className="absolute bottom-4 right-4 w-5 h-5 text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-20" style={{ animationDelay: "0.3s" }} />
                  
                  {/* Image Container with parallax */}
                  <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden flex-shrink-0 group-hover:h-60 sm:group-hover:h-68 md:group-hover:h-76 lg:group-hover:h-84 transition-all duration-700">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-1000 ease-out"
                    />
                    
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/50 transition-all duration-700" />
                    
                    {/* Mega Featured Badge */}
                    {service.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] text-white border-none py-2.5 px-5 text-xs sm:text-sm font-black shadow-2xl shadow-[#E6B325]/50 animate-glow-pulse bg-size-200 animate-gradient-flow">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 fill-white animate-spin-slow" />
                        Most Popular
                      </Badge>
                    )}
                    
                    {/* Floating Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-2xl shadow-black/30 group-hover:scale-110 group-hover:shadow-[#E6B325]/50 transition-all duration-500 animate-float-subtle">
                      <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] bg-clip-text text-transparent">
                        {service.price}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col flex-grow relative z-20">
                    {/* Title with glow */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 sm:mb-4 group-hover:text-[#0f3a2e] group-hover:text-shadow-glow transition-all duration-500 transform group-hover:scale-105">
                      {service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 line-clamp-3 min-h-[4.5rem] group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>
                    
                    {/* Features List with stagger animation */}
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 flex-grow">
                      {service.features && service.features.length > 0 ? (
                        service.features.slice(0, 3).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 sm:gap-3 text-gray-700 text-sm sm:text-base group/item transition-all duration-500"
                            style={{ transitionDelay: `${idx * 0.1}s` }}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] flex items-center justify-center group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-500 shadow-lg shadow-[#E6B325]/30 animate-pulse-subtle">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            </div>
                            <span className="leading-relaxed group-hover/item:translate-x-1 transition-transform duration-300">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2.5 sm:gap-3 text-gray-700 text-sm sm:text-base">
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6B325] mt-0.5 flex-shrink-0" />
                          <span>Service details available on request</span>
                        </li>
                      )}
                    </ul>
                    
                    {/* Mega CTA Button */}
                    <div className="mt-auto pt-5 sm:pt-6 border-t-2 border-gray-100 group-hover:border-[#E6B325]/30 transition-colors duration-500">
                      <Link href={`/services/${service.id}`} className="block">
                        <Button className="w-full group/btn relative overflow-hidden px-6 sm:px-8 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#0f3a2e]/50 transform hover:scale-110 bg-size-200 animate-gradient-flow-slow">
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                          <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                            <span className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
                            <span className="absolute bottom-0 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "0.3s" }} />
                          </span>
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Learn More
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ultra Mega View All Button */}
            <div className="text-center mt-12 sm:mt-16 md:mt-20">
              <Link href="/services">
                <Button className="group relative overflow-hidden px-10 sm:px-14 md:px-16 py-6 sm:py-7 md:py-8 text-base sm:text-lg md:text-xl font-black bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] hover:from-[#D4A017] hover:via-[#E6B325] hover:to-[#D4A017] text-white transition-all duration-700 rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(230,179,37,0.6)] transform hover:scale-110 hover:-translate-y-2 uppercase tracking-widest bg-size-200 animate-gradient-flow">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100">
                    {[...Array(6)].map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </span>
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    View All Services
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-3 transition-transform duration-300" />
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

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
    </section>
  )
}
