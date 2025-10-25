"use client"

import { useState } from "react"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      console.log("Admin login attempt:", { email })

    
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Admin login successful:", data)
        
        try {
          const checkResponse = await fetch("/api/auth/check")
          if (checkResponse.ok) {
            const userData = await checkResponse.json()
            console.log("Session verified:", userData)
          
            if (userData && userData.role === "admin") {
              window.location.href = "/admin"
            } else {
              setError("Failed to create admin session")
            }
          } else {
            setError("Failed to verify session")
          }
        } catch (checkError) {
          console.error("Session verification error:", checkError)
          setError("Failed to verify admin session")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Admin login failed:", errorData)
        setError(errorData.error || "Invalid credentials")
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">Access HatBrain admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@example.com"
                defaultValue="admin@example.com"
                required 
                disabled={loading} 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                defaultValue="admin123"
                placeholder="••••••••" 
                required 
                disabled={loading} 
                className="bg-gray-700 border-gray-600 text-white"
              />
              <div className="text-xs text-center text-gray-400 mt-1">
                Default credentials: admin@example.com / admin123
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Return to <Link href="/" className="text-blue-400 hover:underline">main site</Link>
          </div>
        </CardContent>
      </Card>
  )
}
