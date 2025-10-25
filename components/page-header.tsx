"use client"

import React from "react"
import { Sparkles } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
}

export default function PageHeader({ title, subtitle, badge = "HatBrain Solutions" }: PageHeaderProps) {
  return (
    <div className="bg-[#1a1a1a] text-white relative pt-32 pb-20 px-8">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
          linear-gradient(to right, #444 1px, transparent 1px),
          linear-gradient(to bottom, #444 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 bg-gray-800/50 px-4 py-2 rounded-full w-max">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">{badge}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
