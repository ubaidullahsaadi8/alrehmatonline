import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { verifyPassword } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  console.log("Admin Change Password API - Request received")
  
  try {
    
    const session = await getSession()
    console.log("Admin Change Password API - Session:", session ? `User ID: ${session.id}, Role: ${session.role}` : "No session")
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session.role !== "admin") {
      console.log("Admin Change Password API - Non-admin access attempt")
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }
    
    
    const body = await req.json()
    const { currentPassword, newPassword, userId } = body
    
    console.log("Admin Change Password API - Request body:", { 
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      userId: userId || "Missing"
    })
    
    
    if (!userId && currentPassword && newPassword) {
      console.log("Admin Change Password API - Admin changing own password")
      
      
      const adminUser = await sql`
        SELECT id, password FROM users WHERE id = ${session.id}
      `
      
      if (!adminUser.length) {
        return NextResponse.json({ error: "Admin user not found" }, { status: 404 })
      }
      
      // Verify current password
      const passwordValid = await verifyPassword(currentPassword, adminUser[0].password)
      
      if (!passwordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }
      
      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${session.id}
      `
      
      console.log("Admin Change Password API - Admin password updated successfully")
      return NextResponse.json({ success: true, message: "Password updated successfully" })
    }
    
    // Admin changing another user's password
    else if (userId && newPassword) {
      console.log("Admin Change Password API - Admin changing user password:", userId)
      
      // Check if user exists
      const userExists = await sql`SELECT id FROM users WHERE id = ${userId}`
      
      if (!userExists.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      
      // Hash and update user password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${userId}
      `
      
      console.log("Admin Change Password API - User password updated by admin")
      return NextResponse.json({ success: true, message: "User password updated successfully" })
    }
    
    else {
      console.log("Admin Change Password API - Invalid request parameters")
      return NextResponse.json({ 
        error: "Invalid request. Please provide either userId + newPassword or currentPassword + newPassword" 
      }, { status: 400 })
    }
    
  } catch (error) {
    console.error("Admin Change Password API - Error:", error)
    return NextResponse.json({ 
      error: "Failed to change password", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
