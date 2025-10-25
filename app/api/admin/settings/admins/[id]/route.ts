import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"

// PUT - Update admin user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const adminId = params.id
    const body = await request.json()
    const { email, password } = body

    // Check if admin exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE id = ${adminId} AND role = 'admin' LIMIT 1
    `

    if (existingAdmin.length === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    // Check if email is taken by another user
    if (email) {
      const emailCheck = await sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${adminId} LIMIT 1
      `

      if (emailCheck.length > 0) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    // Update with or without password
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      await sql`
        UPDATE users
        SET 
          email = ${email},
          password = ${hashedPassword},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${adminId}
      `
    } else {
      await sql`
        UPDATE users
        SET 
          email = ${email},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${adminId}
      `
    }

    return NextResponse.json({
      success: true,
      message: "Admin user updated successfully"
    })
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    )
  }
}

// DELETE - Delete admin user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const adminId = params.id

    // Prevent deleting yourself
    if (user.id === adminId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    // Check if admin exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE id = ${adminId} AND role = 'admin' LIMIT 1
    `

    if (existingAdmin.length === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    // Check if this is the last admin
    const adminCount = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'admin'
    `

    if (adminCount[0].count <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      )
    }

    // Delete admin
    await sql`
      DELETE FROM users WHERE id = ${adminId}
    `

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json(
      { error: "Failed to delete admin user" },
      { status: 500 }
    )
  }
}
