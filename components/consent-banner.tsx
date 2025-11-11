'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// EEA countries + UK
const EEA_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'UK', 'IS',
  'LI', 'NO'
]

export function ConsentBanner() {
  const [showConsent, setShowConsent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect user's country
    const detectCountry = async () => {
      try {
        // Try to get country from IP geolocation API
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const userCountry = data.country_code
        
        // Check if user is in EEA/UK
        if (userCountry && EEA_COUNTRIES.includes(userCountry)) {
          const consentChoice = localStorage.getItem('consent-choice')
          if (!consentChoice) {
            setShowConsent(true)
          }
        }
      } catch (error) {
        console.log('Could not detect country, showing consent banner as fallback')
        // Fallback: show banner if detection fails (safer for compliance)
        const consentChoice = localStorage.getItem('consent-choice')
        if (!consentChoice) {
          setShowConsent(true)
        }
      }
    }
    
    detectCountry()
  }, [])

  const handleAccept = () => {
    localStorage.setItem('consent-choice', 'accepted')
    setShowConsent(false)
    // Enable analytics
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'consent_update',
      analytics_storage: 'granted',
      ad_storage: 'granted',
    })
  }

  const handleReject = () => {
    localStorage.setItem('consent-choice', 'rejected')
    setShowConsent(false)
  }

  if (!mounted || !showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-[#2d5016] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col gap-4">
          {/* Content */}
          <div className="flex-1 pr-8 sm:pr-0">
            <h3 className="text-[#1a1a1a] font-bold mb-2 text-sm sm:text-base">🍪 Cookie & Consent Settings</h3>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
              We use cookies and analytics to improve your experience and understand how you use our site. 
              By clicking "Accept", you consent to our use of cookies and analytics.
            </p>
          </div>

          {/* Buttons - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
            <button
              onClick={handleReject}
              className="px-6 py-2 rounded-lg text-white bg-[#2d5016] hover:bg-[#1f3d0f] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 rounded-lg bg-[#f4c430] hover:bg-[#e6b800] text-[#1a1a1a] transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg"
            >
              Accept
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleReject}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-[#2d5016] transition-colors"
          aria-label="Close consent banner"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  )
}
