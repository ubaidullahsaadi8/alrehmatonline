import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const { active } = await req.json()

    
    const userToUpdate = await sql`
      SELECT role FROM users WHERE id = ${userId}
    `

    if (!userToUpdate.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userToUpdate[0].role === "admin") {
      return NextResponse.json({ error: "Cannot change status of admin users" }, { status: 403 })
    }

    // Update user status
    await sql`
      UPDATE users 
      SET active = ${active}, updated_at = NOW() 
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    )
  }
}
