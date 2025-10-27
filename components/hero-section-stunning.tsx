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
    <div ref={sectionRef} className="relative min-h-[500px] md:min-h-[550px] lg:min-h-[600px] bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#0f3a2e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1 space-y-4 md:space-y-5">
            {/* Hadith Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0f3a2e]/10 to-[#E6B325]/10 rounded-full border border-[#E6B325]/30">
              <div className="w-2 h-2 bg-[#E6B325] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#0f3a2e]">Prophetic Wisdom</span>
            </div>

            {/* Arabic Quote */}
            <div>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] bg-clip-text text-transparent leading-tight mb-4"
                style={{ fontFamily: "'Amiri', serif" }}
                dir="rtl"
              >
                {slides[currentSlide].arabicQuote}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                "{slides[currentSlide].englishQuote}"
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/signup" className="cursor-pointer">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white px-8 py-5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/courses" className="cursor-pointer">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#E6B325] to-[#D4A017] hover:from-[#D4A017] hover:to-[#E6B325] text-white px-8 py-5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  View Courses
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-8 pt-3 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#E6B325] to-[#D4A017] bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image (Smaller) */}
          <div className="order-1 lg:order-2 relative max-w-sm md:max-w-md mx-auto lg:mx-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  <img
                    src={slide.image}
                    alt="Children Learning Quran"
                    className="w-full h-[280px] md:h-[350px] lg:h-[400px] object-cover object-center"
                  />
                  {/* Overlay Gradient with 2 colors */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f3a2e]/30 via-[#E6B325]/10 to-transparent"></div>
                </div>
              </div>
            ))}
            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === currentSlide ? "w-8 bg-gradient-to-r from-[#0f3a2e] to-[#E6B325]" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements with 2 colors */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-[#E6B325]/20 to-[#D4A017]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-[#0f3a2e]/10 to-[#1a4d3c]/5 rounded-full blur-3xl"></div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
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
