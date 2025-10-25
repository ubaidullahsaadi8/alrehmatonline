import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from 'bcryptjs' 


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const users = await sql`
      SELECT 
        id, 
        email, 
        name, 
        role,
        active,
        currency,
        created_at as "createdAt" 
      FROM users 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// Create a new user
export async function POST(req: NextRequest) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data from request
    const { name, email, password, role, active } = await req.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = `user-${Date.now()}`

    // Insert new user
    await sql`
      INSERT INTO users (
        id, 
        name, 
        email, 
        password,
        role,
        active
      ) VALUES (
        ${id},
        ${name},
        ${email},
        ${hashedPassword},
        ${role || 'user'},
        ${active === false ? false : true}
      )
    `

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      id 
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
