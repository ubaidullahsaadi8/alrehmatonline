"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
    arabicQuote: "طَلَبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
    englishQuote: "Seek knowledge from the cradle to the grave.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
    arabicQuote: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    englishQuote: "Read in the name of your Lord who created.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
  {
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    arabicQuote: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    englishQuote: "My Lord, increase me in knowledge and understanding.",
    hadith: "قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  },
];

export default function HeroSectionNew() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[850px] bg-white overflow-hidden">
      {/* Yellow Background Shape */}
      <div
        style={{
          clipPath: "path('M0,0 L75%,0 Q100%,50% 75%,100% L0,100% Z')",
          isolation: "isolate",
          mixBlendMode: "normal",
        }}
        className="absolute left-0 top-0 bottom-0 w-[60%] sm:w-[55%] md:w-[50%] rounded-br-[4rem] sm:rounded-br-[5rem] md:rounded-br-[6rem] bg-gradient-to-br from-[#E6B325] via-[#D4A017] to-[#E6B325] overflow-hidden shadow-lg z-0"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* White Background Shape */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="islamic-pattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  fill="none"
                  stroke="#D4A017"
                  strokeWidth="1"
                />
                <path
                  d="M40 10 L70 40 L40 70 L10 40 Z"
                  fill="none"
                  stroke="#D4A017"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center pb-16 sm:pb-20 md:pb-24">
          {/* LEFT SIDE - Images */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto lg:ml-0">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-700 ${
                    index === currentSlide
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                >
                  {/* Large Main Image - Top Right */}
                  <div className="relative z-10 ml-auto w-[75%] sm:w-[70%] md:w-[75%] lg:w-[70%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white">
                    <img
                      src={slide.image}
                      alt="Quran Learning"
                      className="w-full h-[240px] sm:h-[280px] md:h-[350px] lg:h-[450px] object-cover transition-all duration-300"
                    />
                  </div>

                  {/* Small Overlapping Image - Bottom Left */}
                  <div className="absolute bottom-[-30px] sm:bottom-[-35px] md:bottom-[-20px] left-0 md:left-[-20px] w-[55%] sm:w-[52%] md:w-[50%] lg:w-[45%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white z-20">
                    <img
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"
                      alt="Student Learning"
                      className="w-full h-[160px] sm:h-[190px] md:h-[270px] lg:h-[310px] object-cover transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Student Avatars - Bottom Center */}
            <div className="hidden sm:flex absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 -space-x-2 sm:-space-x-3 z-30">
              {["1", "5", "8", "12"].map((num) => (
                <div
                  key={num}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 sm:border-4 border-white overflow-hidden shadow-xl bg-white"
                >
                  <img
                    src={`https://i.pravatar.cc/150?img=${num}`}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="relative space-y-4 sm:space-y-5 md:space-y-6 text-center md:text-right px-2 sm:px-4 md:pr-4 lg:pr-8">
            {/* Hadith Reference */}
            <div className="mb-3 sm:mb-4 md:mb-5">
              <p
                className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed"
                style={{ fontFamily: "'Amiri', serif" }}
                dir="rtl"
              >
                {slides[currentSlide].hadith}
              </p>
            </div>

            {/* Arabic Quote */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight sm:leading-snug md:leading-relaxed"
                style={{
                  fontFamily: "'Amiri', serif",
                  color: "#D4A017",
                }}
                dir="rtl"
              >
                {slides[currentSlide].arabicQuote}
              </h1>
            </div>

            {/* English Translation */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif text-gray-900 leading-relaxed sm:leading-snug md:leading-tight">
                {slides[currentSlide].englishQuote}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex flex-row gap-3 lg:gap-4 xl:gap-5 justify-center md:justify-end pt-2 md:pt-4">
              <Link href="/packages">
                <Button className="group relative overflow-hidden px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-xs md:text-sm lg:text-base font-bold border-2 border-[#E6B325] text-[#E6B325] hover:text-white transition-all duration-300 rounded-full uppercase tracking-wide bg-white shadow-md hover:shadow-lg">
                  <span className="absolute left-0 top-0 h-full w-0 bg-[#E6B325] transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative z-10">
                    OUR PACKAGES
                  </span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="group relative overflow-hidden px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-xs md:text-sm lg:text-base font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white rounded-full shadow-lg hover:shadow-xl uppercase tracking-wide transition-all duration-300">
                  <span className="absolute top-0 left-[-30%] block h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 group-hover:left-[130%]"></span>
                  <span className="relative z-10">REQUEST DEMO CLASS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          <div className="flex gap-1.5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-6 sm:w-8 bg-[#E6B325]" : "w-1.5 sm:w-2 bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden absolute bottom-[-70px] sm:bottom-[-75px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
          <div className="flex flex-col gap-3">
            <Link href="/packages" className="w-full">
              <Button className="w-full py-3 sm:py-3.5 border-2 border-[#E6B325] text-[#E6B325] rounded-full bg-white/90 backdrop-blur-sm font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-lg transition-all">
                OUR PACKAGES
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] text-white rounded-full shadow-lg font-bold text-xs sm:text-sm uppercase tracking-wide hover:shadow-xl transition-all">
                REQUEST DEMO CLASS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
