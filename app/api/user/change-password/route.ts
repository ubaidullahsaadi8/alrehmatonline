import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { verifyPassword, updateUserById, getUserById } from "@/lib/auth"

export async function POST(req: NextRequest) {
  console.log("Change Password API - Request received")
  
  try {
    
    const session = await getSession()
    console.log("Change Password API - Session check:", session ? `User ID: ${session.id}` : "No session")
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const body = await req.json()
    const { currentPassword, newPassword } = body
    
    console.log("Change Password API - Request body received:", { 
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      currentPasswordLength: currentPassword?.length,
      newPasswordLength: newPassword?.length
    })
    
    if (!currentPassword || !newPassword) {
      console.log("Change Password API - Missing required fields")
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }
    
    
    console.log("Change Password API - Getting user by ID:", session.id)
    const user = await getUserById(session.id)
    
    if (!user) {
      console.log("Change Password API - User not found for ID:", session.id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    console.log("Change Password API - User found:", { 
      id: user.id, 
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    })
    
    
    console.log("Change Password API - Verifying current password")
    
    
    if (!user.password || !user.password.startsWith('$2')) {
      console.error(`Change Password API - User password has invalid format: ${user.password?.substring(0, 10)}... (length: ${user.password?.length})`)
      return NextResponse.json(
        { 
          error: "User password has invalid format. Please contact an administrator.", 
          details: "Password hash format is not bcrypt compatible"
        },
        { status: 400 }
      )
    }
    
    
    const passwordValid = await verifyPassword(currentPassword, user.password)
    
    console.log("Change Password API - Password verification result:", passwordValid)
    
    if (!passwordValid) {
      
      try {
        const bcrypt = require('bcryptjs')
        const directResult = await bcrypt.compare(currentPassword, user.password)
        console.log("Change Password API - Direct bcrypt verification:", directResult)
        
        if (directResult !== passwordValid) {
          console.error("Change Password API - Inconsistency detected between verification methods!")
        }
      } catch (verifyError) {
        console.error("Change Password API - Error during direct verification:", verifyError)
      }
      
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }
    
    
    console.log("Change Password API - Hashing new password and updating directly")
    try {
      
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${session.id}
      `
      
      console.log("Change Password API - Password updated successfully")
      
      return NextResponse.json({
        success: true,
        message: "Password updated successfully"
      })
    } catch (dbError) {
      console.error("Change Password API - Database error during update:", dbError)
      return NextResponse.json(
        { error: "Failed to update password in database" }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Change Password API - Uncaught error:", error)
    return NextResponse.json(
      { error: "Failed to change password", details: String(error) },
      { status: 500 }
    )
  }
}
