"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const slides = [
  {
    image: "https://images.pexels.com/photos/8923965/pexels-photo-8923965.jpeg?auto=compress&cs=tinysrgb&w=600",
    arabicQuote: "طَلَبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
    englishQuote: "Seek knowledge from the cradle to the grave.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
  {
    image: "https://images.pexels.com/photos/6209131/pexels-photo-6209131.jpeg?auto=compress&cs=tinysrgb&w=600",
    arabicQuote: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    englishQuote: "Read in the name of your Lord who created.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
  {
    image: "https://images.pexels.com/photos/8923988/pexels-photo-8923988.jpeg?auto=compress&cs=tinysrgb&w=600",
    arabicQuote: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    englishQuote: "My Lord, increase me in knowledge and understanding.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
];

export default function HeroSectionStunning() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);


  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);


  return (
    <div ref={sectionRef} className="relative min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[850px] bg-white overflow-hidden">
      {/* Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#E6B325] rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Yellow Background Shape with Organic Curves - BIGGER and FIXED */}
      <div
        style={{
          clipPath: "path('M 0 0 L 0 100 Q 15 90, 30 75 Q 50 55, 65 45 Q 80 35, 90 20 Q 95 10, 100 0 Z')",
        }}
        className="absolute left-0 top-0 bottom-0 w-[85%] sm:w-[80%] md:w-[75%] lg:w-[70%] bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] overflow-hidden shadow-2xl z-0 animate-gradient-shift"
      >
        {/* Animated Dots Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white">
                  <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse-slower" />
      </div>

      {/* White Background Shape */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="islamic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#D4A017" strokeWidth="1">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 40 40"
                    to="360 40 40"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </circle>
                <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="#D4A017" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center pb-16 sm:pb-20 md:pb-24">
          {/* LEFT SIDE - Images with 3D effects */}
          <div className="relative perspective-1000">
            <div className="relative w-full max-w-lg mx-auto lg:ml-0">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ${
                    index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute inset-0"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Large Main Image with glow effect */}
                  <div className="relative z-10 ml-auto w-[75%] sm:w-[70%] md:w-[75%] lg:w-[70%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white group hover:shadow-[#E6B325]/50 transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#E6B325]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={slide.image}
                      alt="Children Learning Quran"
                      className="w-full h-[240px] sm:h-[280px] md:h-[350px] lg:h-[450px] object-cover object-center transition-all duration-700 group-hover:scale-110"
                    />
                    {/* Sparkle effect */}
                    <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#E6B325] animate-pulse z-20" />
                  </div>

                  {/* Small Overlapping Image with float animation */}
                  <div className="absolute bottom-[-30px] sm:bottom-[-35px] md:bottom-[-20px] left-0 md:left-[-20px] w-[55%] sm:w-[52%] md:w-[50%] lg:w-[45%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white z-20 animate-float-slow group hover:shadow-[#0f3a2e]/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f3a2e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src="https://images.pexels.com/photos/6209237/pexels-photo-6209237.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt="Child Reading Quran"
                      className="w-full h-[160px] sm:h-[190px] md:h-[270px] lg:h-[310px] object-cover object-center transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Student Avatars with bounce animation */}
            <div className="hidden sm:flex absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 -space-x-2 sm:-space-x-3 z-30">
              {["1", "5", "8", "12"].map((num, idx) => (
                <div
                  key={num}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 sm:border-4 border-white overflow-hidden shadow-xl bg-white animate-bounce-slow hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img src={`https://i.pravatar.cc/150?img=${num}`} alt="Student" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Content with scroll animations */}
          <div className="relative space-y-4 sm:space-y-5 md:space-y-6 text-center md:text-right px-2 sm:px-4 md:pr-4 lg:pr-8">
            {/* Hadith Reference with fade-in */}
            <div className="mb-3 sm:mb-4 md:mb-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                {slides[currentSlide].hadith}
              </p>
            </div>

            {/* Arabic Quote with glow effect */}
            <div className="mb-4 sm:mb-5 md:mb-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight sm:leading-snug md:leading-relaxed text-shadow-glow hover:scale-105 transition-transform duration-500"
                style={{ fontFamily: "'Amiri', serif", color: "#D4A017" }}
                dir="rtl"
              >
                {slides[currentSlide].arabicQuote}
              </h1>
            </div>

            {/* English Translation with gradient */}
            <div className="mb-6 sm:mb-7 md:mb-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif text-gray-900 leading-relaxed sm:leading-snug md:leading-tight">
                {slides[currentSlide].englishQuote}
              </p>
            </div>

            {/* CTA Buttons with 3D effect */}
            <div className="hidden md:flex flex-row gap-3 lg:gap-4 xl:gap-5 justify-center md:justify-end pt-2 md:pt-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <Link href="@/signup/page">
                <Button className="group relative overflow-hidden px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-xs md:text-sm lg:text-base font-bold border-2 border-[#E6B325] text-[#E6B325] hover:text-white transition-all duration-500 rounded-full uppercase tracking-wide bg-white shadow-lg hover:shadow-2xl hover:shadow-[#E6B325]/50 transform hover:scale-110 hover:-translate-y-1">
                  <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#E6B325] to-[#D4A017] transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    OUR PACKAGES
                  </span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="group relative overflow-hidden px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-xs md:text-sm lg:text-base font-bold bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white rounded-full shadow-lg hover:shadow-2xl hover:shadow-[#0f3a2e]/50 uppercase tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 bg-size-200 animate-gradient-x">
                  <span className="absolute top-0 left-[-100%] block h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-all duration-700 group-hover:left-[100%]"></span>
                  <span className="relative z-10">REQUEST DEMO CLASS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Controls with glow */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl hover:shadow-[#E6B325]/50 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-translate-x-1 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-[#E6B325] transition-colors" />
          </button>

          <div className="flex gap-1.5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-6 sm:w-8 bg-gradient-to-r from-[#E6B325] to-[#D4A017] shadow-lg shadow-[#E6B325]/50"
                    : "w-1.5 sm:w-2 bg-gray-400 hover:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl hover:shadow-[#E6B325]/50 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:translate-x-1 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-[#E6B325] transition-colors" />
          </button>
        </div>

        {/* Mobile Buttons with pulse */}
        <div className="md:hidden absolute bottom-[-70px] sm:bottom-[-75px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
          <div className="flex flex-col gap-3">
            <Link href="/services" className="w-full">
              <Button className="w-full py-3 sm:py-3.5 border-2 border-[#E6B325] text-[#E6B325] rounded-full bg-white/90 backdrop-blur-sm font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-xl hover:shadow-[#E6B325]/30 transition-all hover:scale-105 animate-pulse-subtle">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                OUR PACKAGES
              </Button>   
            </Link>
            <Link href="@/signup/page" className="w-full">
              <Button className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] text-white rounded-full shadow-lg font-bold text-xs sm:text-sm uppercase tracking-wide hover:shadow-2xl hover:shadow-[#0f3a2e]/30 transition-all hover:scale-105">
                REQUEST DEMO CLASS
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(212, 160, 23, 0.3);
        }
        
        .bg-size-200 {
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
}
