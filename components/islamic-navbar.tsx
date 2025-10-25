"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, ChevronDown, Bell, X, BookOpen, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import NotificationBell from "./notification-bell"
import CurrencyBadge from "./currency-badge"
import SimpleDropdown from "./simple-dropdown"
import SimpleMenuItem, { SimpleMenuDivider } from "./simple-menu-item"

export default function IslamicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading, logout } = useAuth()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-emerald-900 text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+923157632415" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
              <Phone className="w-4 h-4" />
              <span>+92 315 7632415</span>
            </a>
            <a href="mailto:info@alrehmat-quran.com" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
              <Mail className="w-4 h-4" />
              <span>info@alrehmat-quran.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-200">🕌 Learn Quran from the comfort of your home</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-emerald-900 leading-tight">
                  AL-REHMAT
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  Online Quran Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/services" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/#testimonials" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {loading ? (
                <div className="flex gap-3">
                  <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-10 w-32 bg-emerald-200 animate-pulse rounded-lg" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <CurrencyBadge />
                  <NotificationBell />
                  <SimpleDropdown 
                    align="right"
                    trigger={
                      <div className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border-2 border-emerald-600">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-emerald-700 font-semibold text-sm">{getInitials(user.name)}</span>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    }
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <SimpleMenuItem className="flex">     
                       <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                         <User display="inline" className="mr-2 h-4 w-4" />
                          <h4 >My Profile</h4>
                       </div>
                      </SimpleMenuItem>
                    </Link>
                    <SimpleMenuDivider />
                    <SimpleMenuItem onClick={logout} className="text-red-600 hover:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </SimpleMenuItem>
                  </SimpleDropdown>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                      Start Free Trial
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="flex flex-col px-4 py-6 space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-emerald-600 font-medium py-2 px-4 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className="text-gray-700 hover:text-emerald-600 font-medium py-2 px-4 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-emerald-600 font-medium py-2 px-4 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/#testimonials" 
                className="text-gray-700 hover:text-emerald-600 font-medium py-2 px-4 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-emerald-600 font-medium py-2 px-4 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {loading ? (
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg mt-4" />
              ) : user ? (
                <>
                  <div className="flex border-t border-gray-200 pt-4 mt-4">
                    <Link 
                      href="/dashboard" 
                      className="flex-row items-center gap-2 text-gray-700 hover:text-red-500 font-medium py-2 px-4 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 font-medium py-2 px-4 hover:bg-red-50 rounded-lg transition-colors mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
