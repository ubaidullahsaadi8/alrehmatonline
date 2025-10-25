import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, salaryId: string } }
) {
  try {
    const { id: instructorId, salaryId } = params
    console.log(`Updating salary record ${salaryId} for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to update instructor salary record")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" }, 
        { status: 400 }
      )
    }
    
    
    const paymentDate = status === "paid" ? new Date().toISOString() : null
    
    const updatedSalary = await sql`
      UPDATE instructor_salary
      SET 
        status = ${status},
        payment_date = ${paymentDate},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${salaryId} AND instructor_id = ${instructorId}
      RETURNING id, instructor_id, month, year, amount, status, payment_date, notes
    `
    
    if (!updatedSalary || updatedSalary.length === 0) {
      return NextResponse.json(
        { error: "Failed to update salary record or record not found" }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Salary status updated to ${status}`,
      salary: updatedSalary[0]
    })
  } catch (error) {
    console.error("Error updating instructor salary record:", error)
    return NextResponse.json(
      { error: "Failed to update instructor salary record" }, 
      { status: 500 }
    )
  }
}
