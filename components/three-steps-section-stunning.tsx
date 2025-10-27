"use client"

import { useEffect, useState, useRef } from "react"
import { BookOpen, UserPlus, GraduationCap, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Choose Your Course",
    titleArabic: "اختر دورتك",
    description: "Select from our comprehensive range of Quran courses tailored to your level and goals.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Book Free Trial",
    titleArabic: "احجز تجربة مجانية",
    description: "Experience our teaching methodology with a complimentary trial class with expert tutors.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Start Learning",
    titleArabic: "ابدأ التعلم",
    description: "Begin your Quran learning journey with personalized lessons and dedicated support.",
  },
]

export default function ThreeStepsSectionStunning() {
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
      className="relative py-12 sm:py-14 md:py-16 lg:py-20 mt-0 bg-gradient-to-br from-white via-[#E6B325]/5 to-white overflow-hidden"
    >
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#0f3a2e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mx-auto mb-5 rounded-full bg-gradient-to-r from-[#0f3a2e]/10 to-[#E6B325]/10 border border-[#E6B325]/30">
            <div className="w-2 h-2 bg-[#E6B325] rounded-full"></div>
            <span className="text-sm font-semibold text-[#0f3a2e] uppercase tracking-wide">
              Simple Process
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
            ابدأ التعلم اليوم
          </h2>

          {/* English Heading */}
          <h3 className={`mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 ${
            hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
          }`} style={{ animationDelay: "0.4s" }}>
            Start Learning Quran Today in{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
                3 Easy Steps
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6B325] to-transparent animate-shimmer" />
            </span>
          </h3>

          {/* Description */}
          <p className={`max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 px-4 ${
            hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'
          }`} style={{ animationDelay: "0.6s" }}>
            Begin your journey to mastering the Quran with our simple and effective three-step process
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-8 lg:gap-12 mb-12 sm:mb-16 md:mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-xl hover:shadow-2xl hover:shadow-[#E6B325]/30 transition-all duration-700 border-4 border-white hover:border-[#E6B325]/40 transform hover:scale-105 hover:-translate-y-4 ${
                  hasAnimated ? 'animate-slide-up-fade' : 'opacity-0'
                }`}
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325]/0 via-transparent to-[#0f3a2e]/0 group-hover:from-[#E6B325]/5 group-hover:to-[#0f3a2e]/5 transition-all duration-700 rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none" />

                {/* Sparkle Effects */}
                <Sparkles className="absolute top-4 right-4 w-5 h-5 text-[#E6B325] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                {/* Step Number */}
                <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] flex items-center justify-center shadow-2xl shadow-[#E6B325]/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-subtle bg-size-200 animate-gradient-flow">
                  <span className="text-2xl sm:text-3xl font-black text-white">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="mb-6 sm:mb-8 mt-8 sm:mt-10 flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#E6B325]/20 to-[#D4A017]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#E6B325]/30">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#D4A017] group-hover:text-[#E6B325] transition-colors duration-300" />
                  </div>
                </div>

                {/* Arabic Title */}
                <h4
                  className="text-lg sm:text-xl md:text-2xl font-bold text-[#0f3a2e] mb-2 sm:mb-3 text-center group-hover:text-shadow-glow transition-all duration-300"
                  style={{ fontFamily: "'Amiri', serif" }}
                  dir="rtl"
                >
                  {step.titleArabic}
                </h4>

                {/* English Title */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 sm:mb-4 text-center group-hover:scale-105 transition-transform duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-center group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>

                {/* Connecting Arrow (except last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 z-20">
                    <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-[#E6B325] to-[#D4A017] relative animate-pulse-subtle">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-[#D4A017]" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className={`text-center ${hasAnimated ? 'animate-fade-in-scale' : 'opacity-0'}`} style={{ animationDelay: "1.6s" }}>
          <Link href="/signup">
            <Button className="group relative overflow-hidden px-10 sm:px-12 md:px-16 py-6 sm:py-7 md:py-8 text-base sm:text-lg md:text-xl font-black bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-700 rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(15,58,46,0.5)] transform hover:scale-110 hover:-translate-y-2 uppercase tracking-widest bg-size-200 animate-gradient-flow-slow">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
                Get Started Now
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Animations Styles */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.15;
          }
          25% {
            transform: translate(80px, -80px) rotate(90deg);
            opacity: 0.3;
          }
          50% {
            transform: translate(160px, 0) rotate(180deg);
            opacity: 0.15;
          }
          75% {
            transform: translate(80px, 80px) rotate(270deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  )
}
