"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react"
import { useState } from "react"
import { islamicTheme } from "@/lib/islamic-theme"

export default function IslamicFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your newsletter subscription logic here
    setSubscribed(true)
    setTimeout(() => {
      setEmail("")
      setSubscribed(false)
    }, 3000)
  }

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="1"/>
              <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quranic Verse Section */}
        <div className="py-12 border-b border-white/10">
          <div className="text-center max-w-4xl mx-auto">
            <p 
              className="text-3xl md:text-4xl text-white mb-4 leading-relaxed"
              style={{ fontFamily: islamicTheme.fonts.arabic.primary }}
              dir="rtl"
            >
              {islamicTheme.quranicVerses[1].arabic}
            </p>
            <p className="text-lg text-emerald-100 italic mb-2">
              "{islamicTheme.quranicVerses[1].translation}"
            </p>
            <p className="text-sm text-emerald-200">
              — {islamicTheme.quranicVerses[1].reference}
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AL-REHMAT</h3>
                <p className="text-xs text-emerald-200">Online Quran Academy</p>
              </div>
            </div>
            <p className="text-emerald-100 leading-relaxed text-sm">
              Dedicated to providing quality Quranic education to students worldwide. Learn from qualified teachers in the comfort of your home.
            </p>
            <div className="flex gap-3 pt-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Services
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Courses */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-300">Our Courses</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses/noorani-qaida" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Noorani Qaida
                </Link>
              </li>
              <li>
                <Link href="/courses/quran-recitation" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Quran with Tajweed
                </Link>
              </li>
              <li>
                <Link href="/courses/hifz-quran" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Hifz Program
                </Link>
              </li>
              <li>
                <Link href="/courses/translation-tafseer" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Translation & Tafseer
                </Link>
              </li>
              <li>
                <Link href="/courses/islamic-studies-kids" className="text-emerald-100 hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full group-hover:w-2 transition-all" />
                  Islamic Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-300">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:alrehmatonlinequraanacademy@gmail.com" className="text-emerald-100 hover:text-amber-300 transition-colors text-sm">
                  alrehmatonlinequraanacademy@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+923157632415" className="text-emerald-100 hover:text-amber-300 transition-colors text-sm">
                  +92 324 8335750
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-emerald-100 text-sm">
                  Sargodha,Punjab<br />Pakistan  
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h4 className="text-sm font-semibold mb-3 text-amber-300">Subscribe to Newsletter</h4>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200 focus:border-amber-400"
                />
                <Button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={subscribed}
                >
                  {subscribed ? (
                    "Subscribed! ✓"
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-200 text-sm text-center md:text-left">
              © {currentYear} AL-REHMAT Online Quran Academy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-emerald-200 hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-emerald-200 hover:text-amber-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl" />
    </footer>
  )
}
