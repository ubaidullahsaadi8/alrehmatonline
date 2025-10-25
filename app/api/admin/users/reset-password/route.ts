import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { hashPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  console.log("Admin Direct Password Reset API - Starting")
  
  try {
    
    const session = await getSession()
    console.log("Admin Direct Password Reset API - Session check:", 
      session ? `User ID: ${session.id}, Role: ${session.role}` : "No session")
    
    if (!session || session.role !== "admin") {
      console.log("Admin Direct Password Reset API - Not authorized")
      return NextResponse.json({ error: "Unauthorized, admin access required" }, { status: 401 })
    }
    
    
    const body = await req.json()
    const { userId, newPassword } = body
    
    console.log("Admin Direct Password Reset API - Request data:", {
      hasUserId: !!userId,
      hasNewPassword: !!newPassword,
      newPasswordLength: newPassword?.length
    })
    
    
    if (!userId || !newPassword) {
      console.log("Admin Direct Password Reset API - Missing required fields")
      return NextResponse.json({
        error: "User ID and new password are required"
      }, { status: 400 })
    }
    
    
    const userExists = await sql`SELECT id, email FROM users WHERE id = ${userId}`
    
    if (!userExists.length) {
      console.log("Admin Direct Password Reset API - User not found:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    console.log("Admin Direct Password Reset API - User found, resetting password for:", userExists[0].email)
    
    // Generate new password hash using bcrypt directly to ensure consistency
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // First output hash info for diagnostics
    console.log("Admin Direct Password Reset API - New password hash info:", {
      hashPrefix: hashedPassword.substring(0, 10) + "...",
      hashLength: hashedPassword.length,
      isBcryptFormat: hashedPassword.startsWith("$2") ? "Yes" : "No"
    })
    
    // Update user password
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId}
    `
    
    console.log("Admin Direct Password Reset API - Password reset successful")
    
    // Get updated user info (without password)
    const updatedUser = await sql`
      SELECT id, email, name, role
      FROM users
      WHERE id = ${userId}
    `
    
    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      user: updatedUser[0]
    })
    
  } catch (error) {
    console.error("Admin Direct Password Reset API - Error:", error)
    return NextResponse.json({
      error: "Failed to reset password",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
