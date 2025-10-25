import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"

// GET - Fetch all admin users
export async function GET() {
  try {
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const admins = await sql`
      SELECT 
        id,
        name,
        email,
        username,
        currency,
        account_status,
        active,
        created_at,
        updated_at
      FROM users
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

// POST - Create new admin user
export async function POST(request: Request) {
  try {
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const adminId = crypto.randomUUID()
    
    // Generate username from email
    const username = email.split('@')[0]
    const name = email.split('@')[0]

    // Create admin user
    await sql`
      INSERT INTO users (
        id, email, password, name, username, role, user_type,
        account_status, is_approved, active, currency, created_at, updated_at
      )
      VALUES (
        ${adminId},
        ${email},
        ${hashedPassword},
        ${name},
        ${username},
        'admin',
        'simple',
        'active',
        true,
        true,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        id: adminId,
        email
      }
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    )
  }
}
