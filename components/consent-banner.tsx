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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-t border-[rgba(255,255,255,0.1)] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Cookie & Consent Settings</h3>
            <p className="text-gray-400 text-sm">
              We use cookies and analytics to improve your experience and understand how you use our site. 
              By clicking "Accept", you consent to our use of cookies and analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white border border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] transition-all duration-200 text-sm font-medium"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 rounded-lg bg-[#6d28d9] hover:bg-[#5b21b6] text-white transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
            >
              Accept
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleReject}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close consent banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
