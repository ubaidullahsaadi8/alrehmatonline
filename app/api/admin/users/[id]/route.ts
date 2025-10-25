import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from 'bcryptjs' 


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    
    const users = await sql`
      SELECT 
        id, 
        email, 
        name, 
        role,
        active,
        avatar,
        phone,
        whatsapp,
        telegram,
        secondary_email,
        address,
        notes,
        currency,
        created_at,
        updated_at,
        last_login
      FROM users 
      WHERE id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// Update a user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const currentUser = await getSession()
    
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Check if user exists
    const existingUsers = await sql`SELECT id, role FROM users WHERE id = ${userId}`
    
    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const existingUser = existingUsers[0]
    
    // Get user data from request
    const { 
      name, 
      email, 
      password, 
      role, 
      active,
      phone,
      whatsapp,
      telegram,
      secondary_email,
      address,
      notes,
      currency
    } = await req.json()

    // Don't allow changing the role of an admin user unless you're updating yourself
    if (existingUser.role === "admin" && 
        role && 
        role !== "admin" && 
        currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Cannot change role of another admin user" },
        { status: 403 }
      )
    }

    // Handle password update if provided
    let updatePasswordQuery = sql``
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatePasswordQuery = sql`password = ${hashedPassword},`
    }

    // Validate currency if provided
    if (currency) {
      const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
      if (!validCurrencies.includes(currency)) {
        return NextResponse.json(
          { error: "Invalid currency" },
          { status: 400 }
        )
      }
    }
    
    // Update user
    await sql`
      UPDATE users
      SET 
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        ${updatePasswordQuery}
        role = COALESCE(${role}, role),
        active = COALESCE(${active}, active),
        phone = ${phone},
        whatsapp = ${whatsapp},
        telegram = ${telegram},
        secondary_email = ${secondary_email},
        address = ${address},
        notes = ${notes},
        currency = COALESCE(${currency}, currency),
        updated_at = NOW()
      WHERE id = ${userId}
    `

    return NextResponse.json({ 
      success: true, 
      message: "User updated successfully" 
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Don't allow deleting an admin user
    const userToDelete = await sql`
      SELECT role FROM users WHERE id = ${userId}
    `

    if (!userToDelete.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userToDelete[0].role === "admin") {
      return NextResponse.json({ error: "Cannot delete admin users" }, { status: 403 })
    }

    // Delete the user
    await sql`
      DELETE FROM users 
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
