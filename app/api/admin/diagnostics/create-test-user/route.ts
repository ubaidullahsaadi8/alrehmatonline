import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { hashPassword } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"


export async function POST(req: NextRequest) {
  try {
    
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const testPassword = "testpassword123"
    const userId = uuidv4()
    const hashedPassword = await hashPassword(testPassword)
    
    await sql`
      INSERT INTO users (
        id, name, email, password, role, active, created_at, updated_at
      ) VALUES (
        ${userId}, 
        'Test User', 
        'test_user_${Date.now()}@example.com',
        ${hashedPassword},
        'user',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `
    
    // Get the created user
    const user = await sql`
      SELECT id, name, email, 
             length(password) as password_length,
             substring(password from 1 for 10) as password_prefix
      FROM users
      WHERE id = ${userId}
    `
    
    if (!user.length) {
      throw new Error("Failed to create test user")
    }
    
    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: user[0],
      testPassword 
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json({ 
      error: "Failed to create test user", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
