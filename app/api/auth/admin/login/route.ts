import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("Admin login attempt:", { email })

    
    const user = await getUserByEmail(email)
    
    if (!user) {
      console.log("Admin login failed: User not found", { email })
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log("Admin login failed: Invalid password", { email })
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    
    if (user.role !== "admin") {
      console.log("Admin login failed: Not an admin", { email, role: user.role })
      return NextResponse.json(
        { error: "Unauthorized: Admin access only" },
        { status: 403 }
      )
    }

    
    console.log("Creating session for admin:", user.id)
    await createSession(user.id)

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
