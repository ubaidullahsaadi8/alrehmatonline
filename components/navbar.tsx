"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Bell,
  X,
  BookOpen,
  Phone,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import NotificationBell from "./notification-bell";
import CurrencyBadge from "./currency-badge";
import SimpleDropdown from "./simple-dropdown";
import SimpleMenuItem, { SimpleMenuDivider } from "./simple-menu-item";
import "@/styles/islamic-pattern.css";
import Image from "next/image";
import logo from "../public/logo.png"



export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Top Contact Bar - Clean & Simple */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f3a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between">
            {/* Quranic Verse */}
            <div className="hidden md:flex items-center gap-2 text-[#E6B325] font-amiri text-sm">
              <BookOpen className="w-4 h-4" />
              <span>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</span>
            </div>
            
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a href="mailto:info@learnquraan.com" className="flex items-center gap-2 text-white/90 hover:text-[#E6B325] transition-colors text-sm">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">info@learnquraan.com</span>
              </a>
              <a href="tel:+448085310303" className="flex items-center gap-2 text-white/90 hover:text-[#E6B325] transition-colors text-sm">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+44 808 5310 303</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Clean & Professional */}
      <header className={`fixed top-[0px] left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between" >
          {/* Logo - Just PNG */}
          <Link href="/" className="flex items-center">
            <Image 
              src={logo} 
              alt="LearnQuraan Logo"    
              width={140} 
              height={55} 
              className="h-9 md:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-[#0f3a2e] hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/testimonials"
              className="px-4 py-2 text-gray-700 hover:text-[#0f3a2e] hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2 text-gray-700 hover:text-[#0f3a2e] hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 text-gray-700 hover:text-[#0f3a2e] hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-gray-700 hover:text-[#0f3a2e] hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full" />
            ) : user ? (
              <>
                <NotificationBell />
                <SimpleDropdown
                  align="right"
                  trigger={
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#0f3a2e] to-[#1a4d3c] flex items-center justify-center border-2 border-[#E6B325]">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {getInitials(user.name)}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-700 font-semibold text-sm">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  }
                >
                  <Link href="/dashboard">
                    <SimpleMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </SimpleMenuItem>
                  </Link>
                  <SimpleMenuDivider />
                  <SimpleMenuItem
                    onClick={logout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </SimpleMenuItem>
                </SimpleDropdown>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signup">
                  <Button className="bg-[#0f3a2e] hover:bg-[#1a4d3c] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#E6B325] hover:bg-[#D4A017] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

        </div>
      </header>

      {/* Offcanvas Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Offcanvas Mobile Menu - Fully Responsive */}
      <div className={`fixed top-0 right-0 h-full w-[85%] sm:w-[70%] md:w-96 bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Offcanvas Header - Responsive */}
        <div className="relative bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] p-3 sm:p-4 md:p-5 border-b-4 border-[#E6B325]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image 
                src={logo} 
                alt="LearnQuraan Logo" 
                width={100} 
                height={35} 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
          <p className="text-white/80 text-[10px] sm:text-xs mt-1 sm:mt-2">Online Quran Academy</p>
        </div>

        {/* Offcanvas Navigation - Responsive */}
        <nav className="flex flex-col p-3 sm:p-4 md:p-5 space-y-1.5 sm:space-y-2 overflow-y-auto h-[calc(100%-160px)] sm:h-[calc(100%-170px)] md:h-[calc(100%-180px)]">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325] group-hover:bg-white transition-colors"></div>
            Home
          </Link>
          <Link
            href="/testimonials"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325] group-hover:bg-white transition-colors"></div>
            Reviews
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325] group-hover:bg-white transition-colors"></div>
            Courses
          </Link>
          <Link
            href="/services"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325] group-hover:bg-white transition-colors"></div>
            Services
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325] group-hover:bg-white transition-colors"></div>
            Contact
          </Link>

          {loading ? (
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg mt-4" />
          ) : user ? (
            <>
              <div className="border-t border-gray-300 pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#0f3a2e] hover:to-[#1a4d3c] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-[#E6B325]" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : null}
        </nav>

        {/* Offcanvas Footer - Auth Buttons - Responsive */}
        {!user && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 border-t-2 border-gray-200 bg-white space-y-2 sm:space-y-2.5 md:space-y-3">
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                Sign Up
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full bg-gradient-to-r from-[#E6B325] to-[#D4A017] hover:from-[#D4A017] hover:to-[#E6B325] text-white py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
