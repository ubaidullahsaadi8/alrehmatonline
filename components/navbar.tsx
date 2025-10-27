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
import logo from "../public/white-logo.png"



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
      {/* Top Contact Bar */}
<div className="bg-[#dfb12c] px-4 sm:px-6 lg:px-8 py-1.5">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center text-sm">
    {/* Quranic Verse - Only show on md and up */}
    <div className="text-white font-amiri text-lg hidden md:block">
      <span>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</span>
    </div>

    {/* Contact Info */}
    <div
      className="
        flex items-center bg-[#D6A219] p-2 rounded-full 
        w-full sm:w-auto mt-2 md:mt-0 
        justify-center sm:justify-between md:justify-end 
        gap-4 sm:gap-6
      "
    >
      {/* Email - Always visible */}
      <div className="flex items-center gap-2 text-white text-sm font-medium justify-center">
        <Mail className="w-4 h-4" />
        <span>info@learnquraan.com</span>
      </div>

      {/* Phone - Visible from 480px and up */}
      <div className="hidden [@media(min-width:480px)]:flex items-center gap-2 text-white text-sm font-medium">
        <Phone className="w-4 h-4" />
        <span>+44 808 5310 303 (UK)</span>
      </div>
    </div>
  </div>
</div>





      <div className="decorative-border"></div>

      {/* Main Header */}
      <header className="islamic-pattern px-4 sm:px-6 lg:px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-18 md:h-20 flex items-center">
              <Image src={logo} alt="LearnQuraan logo" width={180} height={60} priority className="h-full w-auto object-contain" sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px" />
            </div>
            {/* <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-tight font-poppins">
                LearnQura'an
              </span>
              <span className="text-xs text-white font-medium">
                and the Arabic online
              </span>
            </div> */}
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-[#DFB12C] transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DFB12C] after:transition-all after:duration-300 hover:after:w-full font-poppins"
            >
              HOME
            </Link>
            <Link
              href="/testimonials"
              className="text-white hover:text-[#DFB12C] transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DFB12C] after:transition-all after:duration-300 hover:after:w-full font-poppins"
            >
              REVIEWS
            </Link>
            <Link
              href="/courses"
              className="text-white hover:text-[#DFB12C] transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DFB12C] after:transition-all after:duration-300 hover:after:w-full font-poppins"
            >
              COURSES
            </Link>

            <Link
              href="/services"
              className="text-white hover:text-[#DFB12C] transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DFB12C] after:transition-all after:duration-300 hover:after:w-full font-poppins"
            >
              SERVICES
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-[#DFB12C] transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DFB12C] after:transition-all after:duration-300 hover:after:w-full font-poppins"
            >
              CONTACT US
            </Link>
          </nav>

          {/* Login Button */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-20 bg-white/20 animate-pulse rounded-full" />
            ) : user ? (
              <>
                <NotificationBell />
                <SimpleDropdown
                  align="right"
                  trigger={
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#2D7A4F] font-bold text-xs">
                            {getInitials(user.name)}
                          </span>
                        )}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-white" />
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
                  <Button className="bg-[#0f3a2e] hover:bg-[#1a4d3c] text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300">
                    SIGN UP
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#DFB12C] hover:bg-[#D6A219] text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300">
                    LOGIN
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
  className="lg:hidden text-[#DFB12C] hover:text-[#D6A219] transition-colors"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  aria-label="Toggle menu"
>
  {mobileMenuOpen ? (
    <X className="w-6 h-6 text-[#DFB12C] hover:text-[#D6A219]" />
  ) : (
    <Menu className="w-6 h-6 text-[#DFB12C] hover:text-[#D6A219]" />
  )}
</button>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#D4AF37] border-t mt-2 rounded-2xl border-black/10">
  <nav className="flex flex-col px-4 py-4 space-y-2">
    <Link
      href="/"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      HOME
    </Link>
    <Link
      href="/about"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      ABOUT
    </Link>
    <Link
      href="/services"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      SERVICES
    </Link>
    <Link
      href="/blog"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      BLOG
    </Link>
    <Link
      href="/packages"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      PACKAGES
    </Link>
    <Link
      href="/contact"
      className="text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
      onClick={() => setMobileMenuOpen(false)}
    >
      CONTACT
    </Link>

    {loading ? (
      <div className="h-10 w-full animate-pulse rounded mt-4" />
    ) : user ? (
      <>
        <div className="border-t border-black/10 pt-4 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-800 hover:text-[#0F3B2E] hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:translate-x-2 hover:bg-black/5 font-medium py-2 px-4 rounded transition-all duration-300 ease-in-out mt-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </>
    ) : (
      <div className="border-t border-black/10 pt-4 mt-4 space-y-2">
        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
          <Button className="w-full bg-[#0F3B2E] hover:bg-[#1a4d3c] text-white rounded-full py-2 font-bold">
            SIGN UP
          </Button>
        </Link>
        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
          <Button className="w-full bg-[#DFB12C] hover:bg-[#D6A219] text-white rounded-full py-2 font-bold">
            LOGIN
          </Button>
        </Link>
      </div>
    )}
  </nav>
</div>

        )}
      </header>
    </>
  );
}
