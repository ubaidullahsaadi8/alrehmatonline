import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    const { id: studentId } = await params
    console.log(`Fetching payment history for student: ${studentId}`)
    
    
    const checkTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'student_payments'
      ) as exists
    `
    
    const tableExists = checkTable[0]?.exists
    
    if (!tableExists) {
      console.log("student_payments table does not exist yet, returning empty array")
      return NextResponse.json([], { status: 200 })
    }
    
    const result = await sql`
      SELECT 
        sp.id,
        sp.amount,
        sp.method,
        sp.status,
        sp.reference,
        sp.description,
        sp.date,
        sp.created_at,
        sf.id as fee_id,
        sf.course_id,
        c.title as course_title
      FROM 
        student_payments sp
      LEFT JOIN
        student_fees sf ON sp.fee_id = sf.id
      LEFT JOIN
        courses c ON sf.course_id = c.id
      WHERE 
        sp.student_id = ${studentId}
      ORDER BY 
        sp.date DESC
    `
    
    console.log(`Found ${result.length} payment records for student ${studentId}`)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching student payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch student payments" },
      { status: 500 }
    )
  }
}
