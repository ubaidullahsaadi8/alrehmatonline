"use client"

import { useEffect, useState, useRef } from "react"
import { CheckCircle2, Sparkles, Star, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const benefits = [
  {
    text: "Certified & Experienced Quran Teachers",
    arabicText: "معلمون معتمدون وذوو خبرة",
  },
  {
    text: "One-on-One Personalized Learning",
    arabicText: "تعليم شخصي فردي",
  },
  {
    text: "Flexible Scheduling & Timing",
    arabicText: "جدولة مرنة ووقت مناسب",
  },
  {
    text: "Interactive Online Classes",
    arabicText: "فصول تفاعلية عبر الإنترنت",
  },
  {
    text: "Progress Tracking & Reports",
    arabicText: "تتبع التقدم والتقارير",
  },
  {
    text: "Affordable Pricing Plans",
    arabicText: "خطط تسعير معقولة",
  },
]

export default function WhyChooseSectionStunning() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated) return
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
        if (isInView) {
          setHasAnimated(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasAnimated])

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-14 md:py-16 lg:py-20 mt-0 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden"
    >
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots-pattern-2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#0f3a2e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern-2)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* LEFT SIDE - Content */}
          <div className="order-2 md:order-1">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 mb-5 rounded-full bg-gradient-to-r from-[#0f3a2e]/10 to-[#E6B325]/10 border border-[#E6B325]/30 ${
              hasAnimated ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-2 h-2 bg-[#E6B325] rounded-full"></div>
              <span className="text-sm font-semibold text-[#0f3a2e] uppercase tracking-wide">
                Why Choose Us
              </span>
            </div>

            {/* Arabic Heading */}
            <h2
              className={`mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f3a2e] text-shadow-3d ${
                hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
              }`}
              style={{ fontFamily: "'Amiri', serif", animationDelay: "0.2s" }}
              dir="rtl"
            >
              لماذا تختارنا
            </h2>

            {/* English Heading */}
            <h3 className={`mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight ${
              hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
            }`} style={{ animationDelay: "0.4s" }}>
              Learn Qura'an{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
                  With Excellence
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6B325] to-transparent animate-shimmer" />
              </span>
            </h3>

            {/* Description */}
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 md:mb-10 ${
              hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
            }`} style={{ animationDelay: "0.6s" }}>
              Experience the best Quran learning platform with certified teachers, personalized attention, and proven teaching methods.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={`group flex items-start gap-3 sm:gap-4 ${
                    hasAnimated ? 'animate-slide-up-fade' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] flex items-center justify-center shadow-lg shadow-[#E6B325]/30 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-subtle bg-size-200 animate-gradient-flow">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-[#0f3a2e] group-hover:translate-x-2 transition-all duration-300">
                      {benefit.text}
                    </p>
                    <p
                      className="text-xs sm:text-sm md:text-base text-[#D4A017] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ fontFamily: "'Amiri', serif" }}
                      dir="rtl"
                    >
                      {benefit.arabicText}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 ${
              hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
            }`} style={{ animationDelay: "1.4s" }}>
              <Link href="/signup" className="flex-1 sm:flex-initial">
                <Button className="w-full group relative overflow-hidden px-8 sm:px-10 md:px-12 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-700 rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(15,58,46,0.5)] transform hover:scale-110 hover:-translate-y-2 uppercase tracking-wider bg-size-200 animate-gradient-flow-slow">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
                    Start Free Trial
                  </span>
                </Button>
              </Link>
              <Link href="/services" className="flex-1 sm:flex-initial">
                <Button className="w-full group relative overflow-hidden px-8 sm:px-10 md:px-12 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-black border-3 border-[#E6B325] text-[#E6B325] hover:text-white transition-all duration-700 rounded-full uppercase tracking-wider bg-white shadow-xl hover:shadow-2xl hover:shadow-[#E6B325]/50 transform hover:scale-110 hover:-translate-y-2">
                  <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#E6B325] to-[#D4A017] transition-all duration-700 ease-out group-hover:w-full" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View Packages
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - Image with 3D effects */}
          <div className={`order-1 md:order-2 relative perspective-1000 ${
            hasAnimated ? 'animate-slide-up-fade' : 'opacity-0'
          }`} style={{ animationDelay: "0.8s" }}>
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-6 sm:border-8 border-white group-hover:shadow-[0_30px_80px_rgba(230,179,37,0.4)] transition-all duration-700 transform group-hover:scale-105 group-hover:-rotate-2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325]/20 via-transparent to-[#0f3a2e]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img
                  src="https://resala-academy.com/wp-content/uploads/2022/11/Online-Quran-female-teacher.jpg?auto=compress&cs=tinysrgb&w=600"
                  alt="Children Learning Quran"
                  className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                />
                {/* Sparkle Effects */}
                <Sparkles className="absolute top-6 right-6 w-8 h-8 text-[#E6B325] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-20" />
                <Star className="absolute bottom-6 left-6 w-7 h-7 text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow z-20" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] rounded-full p-6 sm:p-8 shadow-2xl shadow-[#E6B325]/50 animate-float-subtle bg-size-200 animate-gradient-flow">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">10K+</div>
                  <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Students</div>
                </div>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-full p-5 sm:p-6 shadow-2xl animate-float-subtle" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#E6B325] fill-[#E6B325]" />
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900">4.9</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-bold">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations Styles */}
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
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
