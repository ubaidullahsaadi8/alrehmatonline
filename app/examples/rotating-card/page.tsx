"use client"

import React from 'react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RotatingCard from "@/components/ui/rotating-card"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function RotatingCardExample() {
  
  const testimonial = {
    id: "1",
    name: "Waqas Sharif",
    role: "CEO",
    company: "Apexvim",
    content: "Partnering with Hatbrain was one of the best decisions we've made. Their team delivered a custom software solution that streamlined our entire operations. From day one, they understood our industry needs and executed flawlessly. We're now faster, more efficient, and better equipped for growth.",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    featured: false
  }

  return (
    <div>
      <Navbar />
      
      <main className="min-h-screen bg-[#1a1a1a] text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Rotating <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Testimonial Cards</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Click on the card to see it rotate and reveal more information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {}
            <div className="h-[400px] w-full">
              <RotatingCard
                frontContent={
                  <Card className="w-full h-full bg-[#212121] p-8 rounded-xl flex flex-col">
                    <div className="mb-4 text-yellow-400 flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-8 leading-relaxed flex-grow line-clamp-6">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 text-xs text-gray-400">
                      Click to flip
                    </div>
                  </Card>
                }
                backContent={
                  <Card className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold mb-4">About {testimonial.name}</h3>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-300">
                          <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        <span>Position: {testimonial.role}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-300">
                          <path fillRule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                        </svg>
                        <span>Company: {testimonial.company}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-300">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <span>Rating: {testimonial.rating}/5</span>
                      </li>
                    </ul>
                    
                    <div className="mt-auto text-center">
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm font-medium">
                        Contact {testimonial.name}
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 text-xs text-white/70">
                      Click to flip back
                    </div>
                  </Card>
                }
              />
            </div>
            
            {}
            <div className="h-[400px] w-full">
              <RotatingCard
                frontContent={
                  <Card className="w-full h-full bg-[#212121] overflow-hidden rounded-xl relative">
                    <div className="absolute inset-0">
                      <Image
                        src="/artificial-intelligence-integration.jpg"
                        alt="AI Integration"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-[#212121]/70 to-transparent" />
                    </div>
                    
                    <div className="relative p-8 flex flex-col h-full">
                      <div className="mb-4 mt-auto">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                          FEATURED
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">AI Integration Services</h3>
                      <p className="text-gray-300 mb-4">
                        Seamlessly integrate AI capabilities into your existing software
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-white">$1,999</div>
                        <div className="text-sm text-gray-400">Starting from</div>
                      </div>
                      
                      <div className="absolute top-2 right-2 text-xs text-white bg-black/30 px-2 py-1 rounded">
                        Click to flip
                      </div>
                    </div>
                  </Card>
                }
                backContent={
                  <Card className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-900 p-8 rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold mb-4">AI Integration Details</h3>
                    
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-300 shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>Custom AI model integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-300 shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>Data processing and optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-300 shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>API development and documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-300 shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>Full training and implementation support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-300 shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>6 months of post-integration support</span>
                      </li>
                    </ul>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="text-2xl font-bold text-white">$1,999</div>
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg text-blue-800 text-sm font-medium">
                        Get Started
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 text-xs text-white bg-black/30 px-2 py-1 rounded">
                      Click to flip back
                    </div>
                  </Card>
                }
              />
            </div>
            
            {}
            <div className="h-[400px] w-full">
              <RotatingCard
                frontContent={
                  <Card className="w-full h-full bg-[#212121] overflow-hidden rounded-xl relative flex flex-col items-center justify-center text-center p-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 mb-6">
                      <Image
                        src="/professional-man.jpg"
                        alt="Team Member"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-1">Ahmad Khan</h3>
                    <div className="text-blue-400 mb-4">Lead Developer</div>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3">
                      Over 8 years of experience in building scalable web applications and leading development teams.
                    </p>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 text-xs text-white bg-black/30 px-2 py-1 rounded">
                      Click to flip
                    </div>
                  </Card>
                }
                backContent={
                  <Card className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900 p-8 rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold mb-4">Ahmad Khan</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-indigo-300">Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">React</span>
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">Next.js</span>
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">TypeScript</span>
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">Node.js</span>
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">AWS</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-indigo-300">Education</h4>
                        <p className="text-sm">
                          BS Computer Science, FAST-NUCES
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-indigo-300">Experience</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Lead Developer at Hatbrain (Current)</li>
                          <li>• Senior Developer at TechFusion (2019-2022)</li>
                          <li>• Frontend Developer at CodeCraft (2017-2019)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex justify-center">
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm text-white text-sm font-medium">
                        Contact Ahmad
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 text-xs text-white bg-black/30 px-2 py-1 rounded">
                      Click to flip back
                    </div>
                  </Card>
                }
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
