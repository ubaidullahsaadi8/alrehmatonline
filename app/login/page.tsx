"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "../actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert"
import { 
  AlertCircle, 
  Loader2, 
  Info 
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Image from "next/image"
import logo from "@/public/login-logo.png"

export default function LoginPage() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [isPendingApproval, setIsPendingApproval] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsPendingApproval(false)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await signIn(formData)

      if (result?.error) {
        setError(result.error)
        
        // Show special message for pending instructor accounts
        if (result.pendingApproval) {
          setIsPendingApproval(true)
        }
        
        setLoading(false)
      } else if (result?.success && result?.redirectTo) {
        // Handle successful login with client-side navigation
        window.location.href = result.redirectTo
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      
      {/* Islamic Pattern Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="login-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
              <circle cx="50" cy="15" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="50" cy="85" r="2.5" fill="#D4A017" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-pattern)" />
        </svg>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="bg-gradient-to-br from-gray-50 to-white w-full max-w-md md:max-w-lg lg:max-w-xl p-8 rounded-[3rem] mt-16 shadow-2xl border-4 border-white">
          <div className="text-center mb-8">
            <Link href="/" className="h-32 w-full flex items-center justify-center mb-4">
              <Image src={logo} alt="LearnQuraan logo" width={180} height={80} priority className="h-full w-auto object-contain" sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px" />
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Online Quran account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                disabled={loading}
                className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={loading}
                className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            {isPendingApproval ? (
              <Alert className="bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-2xl">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Your instructor account is pending approval. You will be notified via email once approved.
                </AlertDescription>
              </Alert>
            ) : error ? (
              <Alert variant="destructive" className="bg-red-50 border-2 border-red-400 text-red-900 rounded-2xl">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            ) : null}
            
            <Button 
              type="submit" 
              className="group relative overflow-hidden w-full px-6 py-3 text-base font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-700">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#E6B325] hover:text-[#D4A017] font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
