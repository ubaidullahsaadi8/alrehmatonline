"use client"

import React, { useState } from 'react'
import { cn } from "@/lib/utils"

interface RotatingCardProps {
  className?: string
  frontContent: React.ReactNode
  backContent: React.ReactNode
}

export default function RotatingCard({ 
  className, 
  frontContent, 
  backContent 
}: RotatingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full perspective-1000", 
        className
      )}
      onClick={handleFlip}
    >
      <div 
        className={cn(
          "relative w-full h-full duration-700 preserve-3d transition-all transform-style-3d cursor-pointer",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front side */}
        <div 
          className="absolute inset-0 backface-hidden"
        >
          {frontContent}
        </div>

        {}
        <div 
          className="absolute inset-0 rotate-y-180 backface-hidden"
        >
          {backContent}
        </div>
      </div>
    </div>
  )
}
