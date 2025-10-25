import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, phone, country, password, notes } = await request.json()
    
    
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insert the new student
    const result = await sql`
      INSERT INTO users (
        name, 
        email, 
        phone,
        country,
        password,
        role,
        active,
        is_approved,
        account_status,
        notes
      ) VALUES (
        ${name},
        ${email},
        ${phone},
        ${country},
        ${hashedPassword},
        'student',
        false,
        false,
        'pending',
        ${notes}
      ) RETURNING id, name, email, role, active, is_approved, account_status, created_at
    `
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error registering student:", error)
    return NextResponse.json(
      { error: "Failed to register student" },
      { status: 500 }
    )
  }
}
