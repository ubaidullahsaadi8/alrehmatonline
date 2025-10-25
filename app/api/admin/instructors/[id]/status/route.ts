import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Changing status for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to change instructor status")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const body = await req.json()
    const { active = false } = body
    
    console.log(`Admin ${user.id} is setting instructor ${instructorId} to ${active ? "active" : "inactive"}`)
    
    
    const result = await sql`
      UPDATE users
      SET 
        active = ${active},
        account_status = ${active ? 'active' : 'inactive'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${instructorId} AND user_type = 'instructor'
      RETURNING id, email, name, user_type, active, account_status
    `
    
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update instructor status or instructor not found" }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Instructor ${active ? "activated" : "deactivated"} successfully`,
      instructor: result[0]
    })
  } catch (error) {
    console.error("Error changing instructor status:", error)
    return NextResponse.json(
      { error: "Failed to change instructor status" }, 
      { status: 500 }
    )
  }
}
