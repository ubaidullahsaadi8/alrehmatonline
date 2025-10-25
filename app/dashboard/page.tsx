import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { signOut } from "../actions/auth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageHeader from "@/components/page-header"
import { ArrowRight, Settings, Briefcase } from "lucide-react"
import NotificationsWrapper from "./notifications-wrapper"

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  // Redirect users to their appropriate dashboards
  if (user.role === "admin") {
    redirect("/admin")
  } else if (user.user_type === "instructor" && user.is_approved) {
    redirect("/teacher")
  } else if (user.user_type === "student") {
    redirect("/student")
  } else if (user.user_type === "simple") {
    // Keep simple users here - this is their dashboard
  } else if (user.user_type === "instructor" && !user.is_approved) {
    // Keep instructors here if not approved yet
  } else {
    // Fallback for any other user types
    redirect("/login")
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white w-full">
      <Navbar />
      
      <PageHeader
        title="User Dashboard"
        subtitle="Manage your account, courses, and preferences"
        badge="My Account"
      />
      
      <div className="relative py-16 px-8 w-full">
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
        
        <div className="relative z-10 max-w-[2000px] mx-auto">
          <div className="bg-[#212121] rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-blue-500/30">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                <p className="text-gray-300 mb-3">{user.email}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    Premium Member
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    Active Account
                  </span>
                </div>
              </div>
              
              <form action={signOut}>
                <Button variant="outline" type="submit" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <div className="bg-[#212121] rounded-xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Services</h3>
              <p className="text-gray-400 mb-6">Explore our range of services and solutions for your business needs</p>
              <Link href="/services">
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2">
                  View Services <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-[#212121] rounded-xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Account Settings</h3>
              <p className="text-gray-400 mb-6">Update your profile, preferences and notification settings</p>
              <Link href="/dashboard/settings">
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2">
                  Manage Settings <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-[#212121] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-medium text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Account Status</span>
                  <span className="font-medium text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Membership</span>
                  <span className="font-medium text-blue-400">Premium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Next Billing</span>
                  <span className="font-medium text-white">November 5, 2025</span>
                </div>
              </div>
            </div>
          
            {}
            <div className="notifications-container">
              <NotificationsWrapper />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
