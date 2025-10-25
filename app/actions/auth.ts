"use server"

import { 
  createUser, 
  getUserByEmail, 
  getUserByUsername,
  verifyPassword 
} from "@/lib/auth"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const name = (formData.get("name") || formData.get("1_name")) as string
  const email = (formData.get("email") || formData.get("1_email")) as string
  const password = (formData.get("password") || formData.get("1_password")) as string
  const confirmPassword = formData.get("confirmPassword") as string
  const username = formData.get("username") as string || undefined
  const userType = formData.get("userType") as string || "simple"
  const role = formData.get("role") as string || "user"
  const currency = formData.get("currency") as string || "USD"
  const country = formData.get("country") as string || undefined
  const education = formData.get("education") as string || undefined

  
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All required fields must be completed" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  
  if (userType === "instructor" && !education) {
    return { error: "Education details are required for instructor accounts" }
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { error: "Email already exists" }
  }

  
  if (username) {
    const existingUsername = await getUserByUsername(username)
    if (existingUsername) {
      return { error: "Username already exists" }
    }
  }

  try {
    console.log("Signup attempt:", { name, email, userType, role, country, currency })
    const user = await createUser(
      email,
      password,
      name,
      username,
      userType,
      currency,
      country,
      education,
      role
    )
    
    if (!user || !user.id) {
      console.error("User creation returned invalid data:", user)
      return { error: "Failed to create account: Invalid user data" }
    }
    
    
    if (userType === "instructor") {
      
      return { success: true }
    } else {
      
      await createSession(user.id)
      return { success: true, redirectTo: "/student" }
    }
  } catch (error: any) {
    console.error("Signup error details:", error.message || error)
    return { error: `Failed to create account: ${error.message || "Unknown error"}` }
  }
}

export async function signIn(formData: FormData, isAdminLogin: boolean = false) {
  // Handle both regular form fields and Next.js prefixed fields
  const email = (formData.get("email") || formData.get("1_email")) as string
  const password = (formData.get("password") || formData.get("1_password")) as string

  console.log("Sign in attempt:", { 
    email: email ? "provided" : "missing", 
    password: password ? "provided" : "missing",
    isAdminLogin 
  })

  if (!email || !password) {
    console.log("Missing credentials")
    return { error: "All fields are required" }
  }

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      console.log("User not found:", email)
      return { error: "Invalid email or password" }
    }
    
    console.log("User found:", { 
      email: user.email, 
      role: user.role, 
      user_type: user.user_type,
      active: user.active,
      is_approved: user.is_approved 
    })

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log("Invalid password for user:", email)
      return { error: "Invalid email or password" }
    }

    console.log("Password verified successfully")
    
    // Check admin access
    if (isAdminLogin && user.role !== "admin") {
      console.log("Non-admin trying to access admin login:", { role: user.role })
      return { error: "Unauthorized: Admin access only" }
    }
    
    // Check if account is active (except for admins)
    if (!isAdminLogin && !user.active && user.role !== "admin") {
      console.log("Inactive account trying to login:", { 
        user_type: user.user_type, 
        is_approved: user.is_approved 
      })
      
      if (user.user_type === "instructor" && !user.is_approved) {
        return { 
          error: "Your instructor account is pending approval. You will be notified via email once approved.",
          pendingApproval: true
        }
      } else {
        return { error: "Your account has been deactivated. Please contact support." }
      }
    }

    // Check instructor approval status
    if (user.user_type === "instructor" && !user.is_approved && user.role !== "admin") {
      console.log("Unapproved instructor trying to login")
      return { 
        error: "Your instructor account is pending approval. You will be notified via email once approved.",
        pendingApproval: true
      }
    }

    console.log("Creating session for user:", user.id)
    await createSession(user.id)
    
    // Determine redirect path based on user role and type
    let redirectTo = "/dashboard";
    
    console.log("User details for redirect:", {
      role: user.role,
      user_type: user.user_type,
      is_approved: user.is_approved,
      isAdminLogin
    })
    
    if (isAdminLogin) {
      redirectTo = "/admin";
      console.log("Redirecting to admin (isAdminLogin=true)")
    } else if (user.role === "admin") {
      redirectTo = "/admin";
      console.log("Redirecting to admin (role=admin)")
    } else if (user.user_type === "instructor" && user.is_approved) {
      redirectTo = "/teacher";
      console.log("Redirecting to teacher (instructor + approved)")
    } else if (user.user_type === "student") {
      redirectTo = "/student";
      console.log("Redirecting to student dashboard")
    } else if (user.user_type === "simple") {
      redirectTo = "/dashboard";
      console.log("Redirecting to simple user dashboard")
    } else {
      console.log("No matching redirect condition! Defaulting to:", redirectTo)
      console.log("User type:", user.user_type)
    }
    
    console.log("Login successful, final redirectTo:", redirectTo)
    return { success: true, redirectTo }
  } catch (error: any) {
    console.error("Login error details:", error.message || error)
    return { error: `Failed to sign in: ${error.message || "Unknown error"}` }
  }
}

export async function signOut() {
  await deleteSession()
  redirect("/")
}
