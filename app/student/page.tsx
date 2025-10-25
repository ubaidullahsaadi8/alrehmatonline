import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { signOut } from "../actions/auth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowRight, BookOpen, Calendar, User, Video, DollarSign, Settings, Sparkles, GraduationCap, TrendingUp } from "lucide-react"
import NotificationCard from "@/components/notification-card"
import ClientWrapper from "./client-wrapper"

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  if (user.user_type !== "student") {
    redirect("/login")
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-white w-full">
        <Navbar />
        
        {/* Stunning Hero Section */}
        <section className="relative pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5 overflow-hidden">
          {/* Mega Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float-particle"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 2 === 0 ? "#E6B325" : "#0f3a2e",
                  opacity: 0.2,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`,
                }}
              />
            ))}

            {/* Islamic Pattern with rotation */}
            <div className="absolute inset-0 opacity-[0.03]">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="student-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.6">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 60 60"
                        to="360 60 60"
                        dur="40s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="60" cy="60" r="30" fill="none" stroke="#0f3a2e" strokeWidth="1.5" opacity="0.4">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 60 60"
                        to="0 60 60"
                        dur="30s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#student-pattern)" />
              </svg>
            </div>
            
            {/* Mega Gradient Orbs with pulse */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E6B325]/30 to-transparent rounded-full blur-3xl animate-mega-pulse" />
            <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-[#0f3a2e]/20 to-transparent rounded-full blur-3xl animate-mega-pulse-reverse" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10">
            {/* Mega Badge */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-3 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gradient-to-r from-[#E6B325]/30 via-[#D4A017]/20 to-[#E6B325]/30 border-2 border-[#E6B325]/50 w-max backdrop-blur-md shadow-2xl shadow-[#E6B325]/30 animate-glow-pulse">
              <Sparkles className="w-5 h-5 text-[#D4A017] animate-spin-slow" />
              <GraduationCap className="w-5 h-5 text-[#E6B325] animate-bounce-subtle" />
              <span className="text-sm font-black text-[#0f3a2e] uppercase tracking-widest">
                Student Dashboard
              </span>
              <TrendingUp className="w-5 h-5 text-[#D4A017] animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 text-center mb-4 animate-fade-in-scale">
              Welcome Back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B325] via-[#D4A017] to-[#E6B325] animate-gradient-flow bg-size-200">
                {user.name.split(' ')[0]}
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 text-center px-4 animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
              Access your courses, track progress, and connect with instructors
            </p>
          </div>
        </section>
      
      <div className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-[#0f3a2e]/5 via-white to-[#E6B325]/5">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Profile Card */}
          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-8 mb-8 shadow-2xl border-4 border-white hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-700 animate-slide-up-fade">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B325] to-[#D4A017] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <Avatar className="relative h-24 w-24 border-4 border-white shadow-xl">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-[#E6B325] to-[#D4A017] text-white font-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4 text-lg">{user.email}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-[#E6B325] to-[#D4A017] text-white rounded-full text-sm font-bold shadow-lg">
                    Student
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg">
                    Active
                  </span>
                  {user.country && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg">
                      {user.country}
                    </span>
                  )}
                </div>
              </div>
              
              <form action={signOut}>
                <Button className="group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl font-bold">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                  <span className="relative z-10">Sign Out</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {[
              { icon: BookOpen, title: 'My Courses', desc: 'View enrolled courses and track your progress', href: '/student/courses', gradient: 'from-[#E6B325] to-[#D4A017]', delay: 0 },
              { icon: User, title: 'My Instructors', desc: 'View your instructors and send messages', href: '/student/instructors', gradient: 'from-[#0f3a2e] to-[#1a4d3c]', delay: 100 },
              { icon: Video, title: 'Meetings', desc: 'Join course meetings and view schedules', href: '/student/meetings', gradient: 'from-[#E6B325] to-[#D4A017]', delay: 200 },
              { icon: Calendar, title: 'Schedule', desc: 'View your course schedule and important dates', href: '/student/schedule', gradient: 'from-[#0f3a2e] to-[#1a4d3c]', delay: 400 },
              { icon: DollarSign, title: 'Account Book', desc: 'View fee details and payment status for all courses', href: '/student/account-book', gradient: 'from-[#E6B325] to-[#D4A017]', delay: 500 },
              { icon: Settings, title: 'Settings', desc: 'Manage your account and reset your password', href: '/student/settings', gradient: 'from-[#0f3a2e] to-[#1a4d3c]', delay: 600 }
            ].map((card, index) => (
              <div
                key={index}
                className={`group/card bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-8 shadow-2xl border-4 border-white hover:shadow-[0_20px_60px_rgba(230,179,37,0.3)] transition-all duration-700 hover:scale-105 hover:-translate-y-3 animate-slide-up-fade ${index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                style={{ animationDelay: `${card.delay}ms` }}
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br ${card.gradient} shadow-xl group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover/card:text-[#0f3a2e] transition-colors duration-300">{card.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{card.desc}</p>
                <Link href={card.href} className="block">
                  <Button className="w-full group/btn relative overflow-hidden px-6 py-4 bg-gradient-to-r from-[#0f3a2e] via-[#1a4d3c] to-[#0f3a2e] hover:from-[#1a4d3c] hover:via-[#0f3a2e] hover:to-[#1a4d3c] text-white transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl font-bold bg-size-200 animate-gradient-flow-slow">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {card.title} <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            ))}
            
            {/* Notification Card - Special Position */}
            <div className="animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
              <NotificationCard />
            </div>
          </div>

          {/* Learning Overview */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-[3rem] p-8 shadow-2xl border-4 border-white animate-slide-up-fade" style={{ animationDelay: '700ms' }}>
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Learning Overview</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { value: '0', label: 'Enrolled Courses', gradient: 'from-[#E6B325] to-[#D4A017]' },
                { value: '0%', label: 'Average Progress', gradient: 'from-[#0f3a2e] to-[#1a4d3c]' },
                { value: '0', label: 'Upcoming Meetings', gradient: 'from-[#E6B325] to-[#D4A017]' },
                { value: '0', label: 'New Messages', gradient: 'from-[#0f3a2e] to-[#1a4d3c]' }
              ].map((stat, index) => (
                <div key={index} className="text-center group/stat">
                  <div className="relative inline-block mb-3">
                    <div className={`text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-500`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
    </ClientWrapper>
  )
}