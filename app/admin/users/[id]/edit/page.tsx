"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Save, Lock, Key } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CurrencySelector from "@/components/currency-selector"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  phone: string | null
  whatsapp: string | null
  telegram: string | null
  secondary_email: string | null
  address: string | null
  notes: string | null
  active: boolean
  created_at: string
  last_login: string | null
  currency: string | null
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  
  
  
  const userId = params.id;
  
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    secondary_email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    address: "",
    notes: "",
    role: "user",
    active: true,
    currency: "USD"
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          secondary_email: userData.secondary_email || "",
          phone: userData.phone || "",
          whatsapp: userData.whatsapp || "",
          telegram: userData.telegram || "",
          address: userData.address || "",
          notes: userData.notes || "",
          role: userData.role || "user",
          active: userData.active ?? true,
          currency: userData.currency || "USD"
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, toast])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSaving(true)
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      toast({
        title: "Success",
        description: "User profile updated successfully.",
      })
      
      
      router.push(`/admin/users/${userId}`)
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }
    
    setChangingPassword(true)
    
    try {
      const response = await fetch(`/api/admin/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          newPassword: passwordData.newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to change password")
      }

      toast({
        title: "Success",
        description: "Password updated successfully.",
      })
      
      
      setPasswordData({
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading user information...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <User className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested user could not be found.</p>
        <Button asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users List
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 container max-w-3xl py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={`/admin/users/${userId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={user.avatar || "/placeholder-user.jpg"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_email">Secondary Email</Label>
                  <Input
                    id="secondary_email"
                    name="secondary_email"
                    type="email"
                    value={formData.secondary_email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram Username</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="PKR">Pakistani Rupee (PKR)</SelectItem>
                      <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                      <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    All prices will be shown to the user in their selected currency
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">User is active</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/admin/users/${userId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Separate Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Change the user's password. As an admin, you can set a new password without knowing the current one.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={changingPassword || !passwordData.newPassword}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
