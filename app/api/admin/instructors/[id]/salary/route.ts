import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Fetching salary history for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to access instructor salary history")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const salaryHistory = await sql`
      SELECT 
        id,
        instructor_id,
        month,
        year,
        amount,
        status,
        payment_date,
        notes,
        created_at
      FROM instructor_salary
      WHERE instructor_id = ${instructorId}
      ORDER BY year DESC, month DESC
    `
    
    console.log(`Found ${salaryHistory ? salaryHistory.length : 0} salary records for instructor ${instructorId}`)
    return NextResponse.json(salaryHistory || [])
  } catch (error) {
    console.error("Error fetching instructor salary history:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructor salary history" }, 
      { status: 500 }
    )
  }
}

/**
 * API endpoint for adding a salary record for an instructor
 * POST /api/admin/instructors/[id]/salary
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Adding salary record for instructor: ${instructorId}`)
    
    // Check for admin authorization
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to add instructor salary record")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { month, year, amount, status, notes } = body
    
    if (!month || !year || !amount) {
      return NextResponse.json(
        { error: "Month, year, and amount are required" }, 
        { status: 400 }
      )
    }
    
    // Create a new salary record
    const salaryId = crypto.randomUUID()
    const paymentDate = status === "paid" ? new Date().toISOString() : null
    
    const newSalary = await sql`
      INSERT INTO instructor_salary (
        id,
        instructor_id,
        month,
        year,
        amount,
        status,
        payment_date,
        notes,
        created_at,
        created_by,
        updated_at
      )
      VALUES (
        ${salaryId},
        ${instructorId},
        ${month},
        ${year},
        ${amount},
        ${status || "pending"},
        ${paymentDate},
        ${notes || null},
        CURRENT_TIMESTAMP,
        ${user.id},
        CURRENT_TIMESTAMP
      )
      RETURNING id, instructor_id, month, year, amount, status, payment_date, notes, created_at
    `
    
    if (!newSalary || newSalary.length === 0) {
      return NextResponse.json(
        { error: "Failed to create salary record" }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Salary record added successfully",
      salary: newSalary[0]
    })
  } catch (error) {
    console.error("Error adding instructor salary record:", error)
    return NextResponse.json(
      { error: "Failed to add instructor salary record" }, 
      { status: 500 }
    )
  }
}
