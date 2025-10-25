import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { approveInstructor } from "@/lib/auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Processing approval action for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to approve/reject instructor")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const body = await req.json()
    const { approve = false } = body
    
    console.log(`Admin ${user.id} is ${approve ? "approving" : "rejecting"} instructor ${instructorId}`)
    
    if (approve) {
      
      const result = await approveInstructor(instructorId, true)
      
      if (!result.success) {
        console.error("Failed to approve instructor:", result.error)
        return NextResponse.json(
          { error: result.error || "Failed to approve instructor" }, 
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: "Instructor approved successfully",
        instructor: result.user
      })
    } else {
      
      const result = await sql`
        UPDATE users
        SET 
          is_approved = false,
          active = false,
          account_status = 'rejected'
        WHERE id = ${instructorId} AND user_type = 'instructor'
        RETURNING id, email, name, user_type, is_approved, active, account_status
      `
      
      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: "Failed to reject instructor or instructor not found" }, 
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: "Instructor rejected successfully",
        instructor: result[0]
      })
    }
  } catch (error) {
    console.error("Error processing instructor approval:", error)
    return NextResponse.json(
      { error: "Failed to process instructor approval" }, 
      { status: 500 }
    )
  }
}
