"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const benefits = [
  "3 days free trial classes",
  "Your desired timings & days",
  "Tajweed Quran word by word",
  "Female Quran Teachers for kids and women",
  "Monthly assessment of children progress",
  "Fluent English speaking male and female Quran teachers",
  "Student Web portal for lessons and learning material"
]

export default function WhyChooseSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 mt-20 sm:mt-24 md:mt-28 lg:mt-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Islamic Pattern Background - Rounded Shapes */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="why-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Rounded Moroccan Lantern Shape */}
              <path d="M50,5 Q60,5 65,15 Q70,25 65,35 Q60,45 50,50 Q40,45 35,35 Q30,25 35,15 Q40,5 50,5 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              <path d="M50,50 Q60,55 65,65 Q70,75 65,85 Q60,95 50,95 Q40,95 35,85 Q30,75 35,65 Q40,55 50,50 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              {/* Rounded Circles */}
              <circle cx="50" cy="50" r="35" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
              {/* Small Decorative Dots */}
              <circle cx="50" cy="15" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="50" cy="85" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="15" cy="50" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="85" cy="50" r="2.5" fill="#D4A017" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#why-pattern)" />
        </svg>
      </div>

      {/* Yellow Accent - Right Side */}
      <div className="absolute right-0 top-1/4 w-2 h-1/2 bg-gradient-to-b from-[#E6B325] to-[#D4A017]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          
          {/* Left Image */}
          <div className="relative order-2 lg:order-1 shadow-2xl mt-8 lg:mt-0">
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/8923988/pexels-photo-8923988.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Children Learning Quran"
                className="w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-cover object-center"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8 order-1 lg:order-2">
            {/* Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why choose
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-900">
                Learn <span className="text-[#E6B325]">Qura'an</span>
              </h3>
              <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 mb-4 sm:mb-5 md:mb-6">
                Academy
              </h4>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                We take responsibility for good results. We take you step by step with your children at the highest level to learn to read the Quran online with Tajweed. The comfort of home and your selected timings, supervision of parents and guidance of expert Quran Teachers makes online Quran learning a lot easier. Therefore you can rely on us.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E6B325] flex items-center justify-center">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white font-bold" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link href="/services" className="w-full sm:w-auto">
                <Button 
                  className="w-full sm:w-auto group relative overflow-hidden px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-xs sm:text-sm font-bold border-2 border-[#E6B325] text-[#E6B325] transition-all duration-300 rounded-full uppercase tracking-wide bg-transparent"
                >
                  <span className="pointer-events-none absolute left-0 top-0 h-full w-0 bg-[#E6B325] transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">OUR SERVICES</span>
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto group relative overflow-hidden px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl uppercase tracking-wide">
                  <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                  <span className="relative z-10">REGISTER NOW</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
