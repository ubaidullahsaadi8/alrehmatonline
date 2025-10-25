"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, User, Key, AtSign, Shield } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { AdminManagement } from "@/components/admin/admin-management"


const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  avatar: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Confirm password is required." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/placeholder-user.jpg",
  })

  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: adminData.name,
      email: adminData.email,
      avatar: adminData.avatar,
    },
  })

  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Update profile form when admin data loads
  // Fetch admin settings data
  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await fetch('/api/admin/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        // Add response status logging
        console.log("Admin settings API response:", response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Admin settings data received:", data);
          
          setAdminData({
            name: data.name || "Admin User",
            email: data.email || "admin@example.com",
            avatar: data.avatar || "/placeholder-user.jpg",
          });
          
          profileForm.reset({
            name: data.name || "Admin User",
            email: data.email || "admin@example.com",
            avatar: data.avatar || "/placeholder-user.jpg",
          });
        } else {
          
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", response.status, errorData);
          
          
          if (response.status === 401) {
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });
            setTimeout(() => {
              window.location.href = "/admin/login";
            }, 2000);
            return;
          }
          
          toast({
            title: "Failed to Load Settings",
            description: errorData.error || "There was a problem loading your settings. Please refresh the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
        toast({
          title: "Failed to Load Settings",
          description: "There was a problem loading your settings. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
    
    fetchAdminData();
  }, [profileForm, toast])

  
  async function onProfileSubmit(data: ProfileFormValues) {
    setLoading(true)
    try {
      console.log("Submitting profile update:", data);
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'profile',
          data: {
            name: data.name,
            email: data.email,
            avatar: data.avatar || adminData.avatar,
          }
        })
      });
      
      console.log("Profile update response:", response.status, response.statusText);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log("Profile update successful:", responseData);
        
        
        setAdminData({
          ...adminData,
          name: data.name,
          email: data.email,
          avatar: data.avatar || adminData.avatar,
        });
        
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        
        
        if (response.status === 401 || response.status === 403) {
          toast({
            title: response.status === 401 ? "Session Expired" : "Not Authorized",
            description: errorData.error || "Please log in again with admin credentials.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
          return;
        }
        
        toast({
          title: "Update Failed",
          description: errorData.error || "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  
  async function onPasswordSubmit(data: PasswordFormValues) {
    setLoading(true)
    try {
      console.log("Submitting password update");
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password',
          data: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }
        })
      });
      
      console.log("Password update response:", response.status, response.statusText);
      
      
      const responseData = await response.json().catch(() => ({}));
      
      if (response.ok) {
        console.log("Password update successful");
        
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
        });
        
        
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error("Password update failed:", response.status, responseData);
        
        // If session expired or not authenticated, redirect to login
        if (response.status === 401 || response.status === 403) {
          toast({
            title: response.status === 401 ? "Session Expired" : "Not Authorized",
            description: responseData.error || "Please log in again with admin credentials.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
          return;
        }
        
        toast({
          title: "Update Failed",
          description: responseData.error || "Failed to update password. Please check your current password.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin")}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and set email preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-1" /> Admins
          </TabsTrigger>
          <TabsTrigger value="debug">
            <Code className="h-4 w-4 mr-1" /> Debug
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 relative">
                      <img 
                        src={adminData.avatar || "/placeholder-user.jpg"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Your name" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <AtSign className="w-4 h-4 mr-2 text-muted-foreground" />
                                <Input placeholder="your.email@example.com" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for your profile picture.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters long.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold">Password Requirements:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Minimum 8 characters long</li>
                </ul>
                <p className="mt-3 text-xs text-amber-600">
                  <strong>Note:</strong> If this is your first login, the default password is "admin123".
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins" className="mt-6">
          <AdminManagement />
        </TabsContent>
        
        <TabsContent value="debug" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Session Information</CardTitle>
              <CardDescription>
                This tab shows information about your current session to help troubleshoot issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionDebugInfo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


function SessionDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  async function fetchDebugInfo() {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/debug-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to fetch debug information")
        toast({
          title: "Error",
          description: "Could not load session debug information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching debug info:", error)
      setError("Failed to connect to debug endpoint")
      toast({
        title: "Connection Error",
        description: "Failed to connect to debug endpoint",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchDebugInfo()
  }, [])
  
  
  const formatData = (data: any) => {
    return JSON.stringify(data, null, 2)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Session Debug Information</h3>
        <Button 
          variant="outline"
          onClick={fetchDebugInfo}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      ) : debugInfo ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">User Info</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-xs font-bold mb-1">From Session</p>
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {debugInfo.userFromSession 
                    ? formatData(debugInfo.userFromSession) 
                    : "No user in session"}
                </pre>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-xs font-bold mb-1">From Headers</p>
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {debugInfo.userFromHeaders
                    ? formatData(debugInfo.userFromHeaders)
                    : "No user in headers"}
                </pre>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Session Data</h4>
            <div className="p-4 bg-muted rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {formatData(debugInfo.sessionData)}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Cookies</h4>
            <div className="p-4 bg-muted rounded-md max-h-40 overflow-y-auto">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {formatData(debugInfo.requestCookies)}
              </pre>
            </div>
          </div>
          
          <div>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Headers (Click to expand)</summary>
              <div className="p-4 bg-muted rounded-md mt-2 max-h-40 overflow-y-auto">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {formatData(debugInfo.headers)}
                </pre>
              </div>
            </details>
          </div>
          
          <div className="p-4 border border-amber-300 bg-amber-50 text-amber-800 rounded-md">
            <p className="text-sm"><strong>Time:</strong> {debugInfo.timestamp}</p>
            <p className="text-xs mt-2">
              This information is for debugging purposes only. If you're experiencing issues with authentication,
              please copy and share this information with the development team.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}
