"use client"

import Link from "next/link"
import { MousePointer, Calendar, BookOpen } from "lucide-react"

export default function ThreeStepsSection() {
  return (
    <section className="relative mt-20 sm:mt-24 md:mt-28 lg:mt-32 py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      {/* Islamic Pattern Background - Rounded Shapes */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="steps-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Rounded Quatrefoil Shape */}
              <path d="M50,10 Q60,10 65,20 Q70,30 65,40 Q60,50 50,50 Q40,50 35,40 Q30,30 35,20 Q40,10 50,10 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              <path d="M50,50 Q60,50 65,60 Q70,70 65,80 Q60,90 50,90 Q40,90 35,80 Q30,70 35,60 Q40,50 50,50 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              <path d="M10,50 Q10,40 20,35 Q30,30 40,35 Q50,40 50,50 Q50,60 40,65 Q30,70 20,65 Q10,60 10,50 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              <path d="M50,50 Q50,40 60,35 Q70,30 80,35 Q90,40 90,50 Q90,60 80,65 Q70,70 60,65 Q50,60 50,50 Z" 
                    fill="none" stroke="#D4A017" strokeWidth="1.5"/>
              {/* Decorative Circles */}
              <circle cx="50" cy="50" r="3" fill="#D4A017" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#steps-pattern)" />
        </svg>
      </div>

      {/* Green Curved Shape - Right Side */}
      <div className="hidden lg:block absolute rounded-tl-[3rem] md:rounded-tl-[4rem] rounded-bl-[3rem] md:rounded-bl-[4rem] right-0 top-0 bottom-0 w-[35%] lg:w-[40%] bg-gradient-to-br from-[#0f3a2e] to-[#1a4d3c] overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32">
          <svg className="absolute left-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,50 0,100 L0,0 Z" fill="#0f3a2e" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Start <span className="text-[#E6B325]">Learning Quran</span>
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                Today in 3 Easy Steps
              </h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                Register yourself or register your child with us today and take your first free trial class.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-5 sm:space-y-6">
              {/* Step 1 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-[#0f3a2e] flex items-center justify-center bg-white">
                    <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0f3a2e]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#0f3a2e] mb-1.5 sm:mb-2">
                    One Click Registeration
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Simply <Link href="/signup" className="text-[#E6B325] font-semibold hover:underline">Click Here</Link> which will take you to the registration page. You can register for free online Quran classes with our online Quran teachers just by filling in your name and contact information.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-[#E6B325] flex items-center justify-center bg-white">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#E6B325]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#0f3a2e] mb-1.5 sm:mb-2">
                    Schedule Free Trial
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Upon receiving your registration. We will contact you back to set your convenience time for you for <span className="font-semibold text-[#E6B325]">Free Quran Trial Classes</span> and give you overview about our Quran teaching process.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-[#0f3a2e] flex items-center justify-center bg-white">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0f3a2e]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#0f3a2e] mb-1.5 sm:mb-2">
                    Start Taking Your First Class
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Login to our <Link href="/contact" className="text-[#E6B325] font-semibold hover:underline">Contact page</Link> with the provided credentials and start taking your first class with one of our online Qalari (Qura'an Teacher).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80"
                alt="Student Learning Quran"
                className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
