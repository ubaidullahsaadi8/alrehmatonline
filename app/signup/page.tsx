"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signUp } from "../actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  Search,
  X
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { countries, searchCountries } from "@/lib/countries"
import { currencies } from "@/lib/currencies"

export default function SignUpPage() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<string>("simple")
  const [role, setRole] = useState<string>("user")
  const [showSuccess, setShowSuccess] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countries)

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // Handle country search filtering
  useEffect(() => {
    setFilteredCountries(searchCountries(searchQuery));
  }, [searchQuery]);
  
  // Sync role with userType
  useEffect(() => {
    // Set appropriate role based on selected user type
    if (userType === "instructor") {
      setRole("instructor");
    } else if (userType === "student") {
      setRole("student");
    } else {
      setRole("user");
    }
  }, [userType]);

  
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setUsernameAvailable(false);
      return;
    }

    
    const validPattern = /^[a-z0-9]+$/;
    if (!validPattern.test(username)) {
      setUsernameError("Username can only contain lowercase letters and numbers");
      setUsernameAvailable(false);
      return;
    }

    setUsernameLoading(true);
    
    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();
      
      if (data.available) {
        setUsernameAvailable(true);
        setUsernameError("");
      } else {
        setUsernameError("Username already taken");
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("Error checking username availability");
      setUsernameAvailable(false);
    } finally {
      setUsernameLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    
    if (username && !usernameAvailable) {
      setError(usernameError || "Please enter a valid username");
      return;
    }
    
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await signUp(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        if (userType === "instructor") {
          
          setShowSuccess(true);
          setLoading(false);
        } else if (result?.redirectTo) {
          
          window.location.href = result.redirectTo;
        }
      }
    } catch (error) {
      console.error("Signup error:", error)
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
            <pattern id="signup-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
              <circle cx="50" cy="15" r="2.5" fill="#D4A017" opacity="0.4"/>
              <circle cx="50" cy="85" r="2.5" fill="#D4A017" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signup-pattern)" />
        </svg>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="bg-gradient-to-br from-gray-50 to-white w-full max-w-2xl p-8 rounded-[3rem] mt-16 shadow-2xl border-4 border-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join Online Quran and start your journey</p>
          </div>
          
          {showSuccess ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-2 border-green-500 text-green-900 rounded-2xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for signing up as an instructor! Your application has been received.
                  <p className="mt-2">Your account is currently inactive and pending admin approval. You will receive an email within 24 hours once your account has been reviewed and approved.</p>
                  <p className="mt-2">After approval, you'll be able to log in and access your instructor dashboard.</p>
                </AlertDescription>
              </Alert>
              
              <div className="text-center mt-6">
                <Button 
                  asChild
                  className="group relative overflow-hidden px-6 py-3 text-base font-bold bg-gradient-to-r from-[#0f3a2e] to-[#1a4d3c] hover:from-[#1a4d3c] hover:to-[#0f3a2e] text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
                >
                  <Link href="/login">
                    <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-1/3 bg-white/20 blur-md -skew-x-12 transition-all duration-700 ease-out group-hover:left-[130%]"></span>
                    <span className="relative z-10">Go to Login</span>
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Tabs 
                defaultValue="simple" 
                value={userType}
                onValueChange={(value) => {
                  setUserType(value);
                  
                  if (value === "instructor") {
                    setRole("instructor");
                  } else if (value === "student") {
                    setRole("student");
                  } else {
                    setRole("user");
                  }
                }}
                className="mb-4"
              >
                <TabsList className="grid grid-cols-3 mb-4 bg-white">
                  <TabsTrigger value="simple" className="data-[state=active]:bg-[#E6B325] data-[state=active]:text-white">Simple Account</TabsTrigger>
                  <TabsTrigger value="student" className="data-[state=active]:bg-[#E6B325] data-[state=active]:text-white">Student</TabsTrigger>
                  <TabsTrigger value="instructor" className="data-[state=active]:bg-[#E6B325] data-[state=active]:text-white">Instructor</TabsTrigger>
                </TabsList>
                
                <input type="hidden" name="userType" value={userType} />
                
                <TabsContent value="simple" className="mt-0">
                  <p className="text-sm text-gray-600 mb-4">
                    Create a standard account to access courses and services.
                  </p>
                </TabsContent>
                
                <TabsContent value="student" className="mt-0">
                  <p className="text-sm text-gray-600 mb-4">
                    Create a student account to enroll in courses and access learning materials.
                  </p>
                </TabsContent>
                
                <TabsContent value="instructor" className="mt-0">
                  <p className="text-sm text-gray-600 mb-4">
                    Apply to become an instructor and teach courses. Your application will be reviewed by an admin.
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-semibold">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    disabled={loading}
                    className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-semibold">Email *</Label>
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
                
                {}
                <input type="hidden" name="role" value={role} />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="username" className="text-gray-900 font-semibold">Username (optional)</Label>
                    {username && (
                      <span className={`text-xs font-semibold ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameLoading 
                          ? 'Checking...' 
                          : usernameAvailable 
                            ? 'Available' 
                            : usernameError}
                      </span>
                    )}
                  </div>
                  <Input 
                    id="username" 
                    name="username" 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      setUsername(value);
                      if (value.length >= 3) {
                        checkUsername(value);
                      } else {
                        setUsernameAvailable(false);
                        setUsernameError("");
                      }
                    }}
                    disabled={loading}
                    className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-600">
                    Leave empty for auto-generated username. Only lowercase letters and numbers allowed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-900 font-semibold">Country *</Label>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full h-12 px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 hover:border-[#E6B325] transition-all duration-300 shadow-sm"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      {selectedCountry ? (
                        <div className="flex items-center">
                          <span className="mr-2">{countries.find(c => c.code === selectedCountry)?.flag}</span>
                          <span>{countries.find(c => c.code === selectedCountry)?.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select your country</span>
                      )}
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <input type="hidden" name="country" value={selectedCountry} required />
                    
                    {showCountryDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="text"
                              placeholder="Search countries..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 pr-8 py-1 !bg-gray-50 border border-gray-200 text-gray-900 text-sm w-full rounded-full"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900"
                            onClick={() => {
                              setSelectedCountry(country.code);
                              setShowCountryDropdown(false);
                            }}
                          >
                            <span className="mr-2">{country.flag}</span>
                            <span>{country.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 font-semibold">Password *</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold">Confirm Password *</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`!bg-white border text-gray-900 placeholder:text-gray-400 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 py-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      !passwordsMatch && confirmPassword ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {!passwordsMatch && confirmPassword && (
                    <p className="text-red-600 text-xs font-semibold">Passwords do not match</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-gray-900 font-semibold">Preferred Currency *</Label>
                  <Select name="currency" required disabled={loading} defaultValue="USD">
                    <SelectTrigger className="!bg-white border border-gray-200 text-gray-900 hover:!border-[#E6B325] focus:!border-[#E6B325] focus:ring-2 focus:!ring-[#E6B325]/20 rounded-full px-4 h-12 transition-all duration-300 shadow-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 text-gray-900 rounded-2xl">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="hover:bg-gray-100">
                          {currency.symbol} - {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    Only admin can change your currency later.
                  </p>
                </div>
              </div>
              
              {}
              {userType === "instructor" && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Education & Qualifications</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-gray-900 font-semibold">Education *</Label>
                      <textarea
                        id="education"
                        name="education"
                        placeholder="Enter your educational qualifications, degrees, certifications, etc."
                        required
                        disabled={loading}
                        rows={4}
                        className="w-full !bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:border-[#E6B325] focus:border-[#E6B325] focus:ring-2 focus:ring-[#E6B325]/20 rounded-3xl p-4 transition-all duration-300 shadow-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-2 border-red-400 text-red-900 rounded-2xl">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
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
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
              </Button>
              
              <div className="mt-6 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <Link href="/login" className="text-[#E6B325] hover:text-[#D4A017] font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
