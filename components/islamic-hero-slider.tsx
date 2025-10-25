"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Users, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { islamicTheme } from "@/lib/islamic-theme"

const slides = [
  {
    title: "Learn Quran Online",
    titleArabic: "تعلم القرآن عبر الإنترنت",
    subtitle: "With Qualified & Experienced Teachers",
    description: "Join thousands of students worldwide in their journey to learn and understand the Holy Quran",
    cta: "Start Free Trial",
    ctaLink: "/signup",
    image: "/hero/quran-learning.jpg",
    verse: islamicTheme.quranicVerses[0]
  },
  {
    title: "Hifz Program",
    titleArabic: "برنامج الحفظ",
    subtitle: "Memorize the Quran with Expert Guidance",
    description: "Structured memorization program with proven techniques and continuous revision support",
    cta: "Enroll Now",
    ctaLink: "/courses/hifz-quran",
    image: "/hero/hifz-program.jpg",
    verse: islamicTheme.quranicVerses[1]
  },
  {
    title: "Tajweed Mastery",
    titleArabic: "إتقان التجويد",
    subtitle: "Perfect Your Quran Recitation",
    description: "Learn the rules of Tajweed and recite the Quran beautifully with proper pronunciation",
    cta: "Learn More",
    ctaLink: "/courses/quran-recitation",
    image: "/hero/tajweed.jpg",
    verse: islamicTheme.quranicVerses[2]
  }
]

export default function IslamicHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative h-[90vh] min-h-[600px] overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900">
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-teal-800/90 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
            <div className="max-w-3xl space-y-8 animate-fade-in">
              {/* Arabic Title */}
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 text-right"
                style={{ fontFamily: islamicTheme.fonts.arabic.primary }}
                dir="rtl"
              >
                {slide.titleArabic}
              </h2>

              {/* English Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-emerald-100 font-light">
                {slide.subtitle}
              </p>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                {slide.description}
              </p>

              {/* Quranic Verse */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-2xl">
                <p 
                  className="text-2xl md:text-3xl text-white text-right mb-3 leading-relaxed"
                  style={{ fontFamily: islamicTheme.fonts.arabic.primary }}
                  dir="rtl"
                >
                  {slide.verse.arabic}
                </p>
                <p className="text-sm text-emerald-100 italic mb-1">
                  "{slide.verse.translation}"
                </p>
                <p className="text-xs text-emerald-200">
                  — {slide.verse.reference}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={slide.ctaLink}>
                  <Button 
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {slide.cta}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-emerald-900 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span className="text-sm">Expert Teachers</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span className="text-sm">1000+ Students</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm">Certified Program</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-sm">Flexible Timing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-10 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-10 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-12 h-3 bg-amber-500"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
    </div>
  )
}
