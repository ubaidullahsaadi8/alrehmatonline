"use client"

import { useEffect, useState, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Clock, User, ArrowRight, Sparkles, Star, Zap, Crown, BookOpen } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  image?: string
  imageUrl?: string  
  price: number | string
  duration: string
  level: string
  instructor: string
  category: string
  featured: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        
        const coursesData = data.courses || data;
        
        const coursesArray = Array.isArray(coursesData) ? coursesData : [];
        setCourses(coursesArray);
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load courses:", err)
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
              <pattern id="dots-courses" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#0f3a2e" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-courses)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mx-auto mb-5 rounded-full bg-gradient-to-r from-[#0f3a2e]/10 to-[#E6B325]/10 border border-[#E6B325]/30">
            <div className="w-2 h-2 bg-[#E6B325] rounded-full"></div>
            <span className="text-sm font-semibold text-[#0f3a2e] uppercase tracking-wide">
              Our Courses
            </span>
          </div>

          {/* Arabic Heading with 3D effect */}
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f3a2e] animate-fade-in-scale text-shadow-3d"
            style={{ fontFamily: "'Amiri', serif", animationDelay: "0.2s" }}
            dir="rtl"
          >
            دورات القرآن الكريم
          </h2>

          {/* English Heading with mega gradient */}
          <h3 className="mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 animate-fade-in-scale" style={{ animationDelay: "0.4s" }}>
            Master the{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
                Quran
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6B325] to-transparent animate-shimmer" />
            </span>
          </h3>

          {/* Description with fade */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 px-4 animate-fade-in-scale" style={{ animationDelay: "0.6s" }}>
            Master Quranic recitation with our expert-led courses. Learn Tajweed, memorization, and deep understanding of the Holy Quran.
          </p>
        </div>
      </section>
      
      {/* Courses Section */}
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
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No courses available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {courses.map((course, index) => (
                  <div
                    key={course.id}
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
                        src={course.image || course.imageUrl || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-1000 ease-out"
                      />
                      
                      {/* Animated Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/50 transition-all duration-700" />
                      
                      {/* Mega Featured Badge */}
                      {course.featured && (
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] text-white border-none py-2.5 px-5 text-xs sm:text-sm font-black shadow-2xl shadow-[#E6B325]/50 animate-glow-pulse bg-size-200 animate-gradient-flow">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 fill-white animate-spin-slow" />
                          Featured
                        </Badge>
                      )}
                      
                      {/* Floating Price Tag */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-2xl shadow-black/30 group-hover:scale-110 group-hover:shadow-[#E6B325]/50 transition-all duration-500 animate-float-subtle">
                        <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] bg-clip-text text-transparent">
                          ${typeof course.price === 'number' 
                             ? course.price.toFixed(2)
                             : typeof course.price === 'string' 
                               ? parseFloat(course.price).toFixed(2) 
                               : '0.00'}
                        </span>
                      </div>
                      
                      {/* Category & Level Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                        <Badge className="bg-[#E6B325]/90 text-white backdrop-blur-sm border-none py-1.5 px-3 text-xs font-bold uppercase">
                          {course.category}
                        </Badge>
                        <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-none py-1.5 px-3 text-xs font-bold uppercase">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col flex-grow relative z-20">
                      {/* Title with glow */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 sm:mb-4 group-hover:text-[#0f3a2e] group-hover:text-shadow-glow transition-all duration-500 transform group-hover:scale-105">
                        {course.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 line-clamp-3 min-h-[4.5rem] group-hover:text-gray-700 transition-colors duration-300">
                        {course.description}
                      </p>
                      
                      {/* Course Info */}
                      <div className="flex items-center gap-4 mb-6 sm:mb-7 pb-5 border-b-2 border-gray-100 group-hover:border-[#E6B325]/30 transition-colors duration-500">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6B325] to-[#D4A017] flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f3a2e] to-[#1a4d3c] flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold">{course.instructor}</span>
                        </div>
                      </div>
                      
                      {/* Mega CTA Button */}
                      <div className="mt-auto">
                        <Link href={`/courses/${course.id}`} className="block">
                          <Button className="w-full group/btn relative overflow-hidden px-6 sm:px-8 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#0f3a2e]/50 transform hover:scale-110 bg-size-200 animate-gradient-flow-slow">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                            <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                              <span className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
                              <span className="absolute bottom-0 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "0.3s" }} />
                            </span>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              View Course
                              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 mb-3 bg-[#E6B325]/10 px-4 py-2 rounded-full">
              <Badge className="bg-[#E6B325]/20 text-[#D4A017] hover:bg-[#E6B325]/30 border-none">
                Coming Soon
              </Badge>
              <span className="text-gray-700">New courses being added weekly</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team of expert Quran teachers is constantly developing new courses. 
              Contact us to suggest topics or discuss custom learning plans.
            </p>
            <Link href="/contact">
              <Button className="group relative overflow-hidden px-8 py-6 text-sm font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl uppercase tracking-wide mx-auto">
                <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                <span className="relative z-10 flex items-center gap-2">
                  Request a Course <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
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
