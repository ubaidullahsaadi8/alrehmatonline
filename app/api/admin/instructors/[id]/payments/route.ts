import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Fetching payment history for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to access instructor payment history")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const paymentHistory = await sql`
      SELECT 
        id,
        instructor_id,
        amount,
        payment_type,
        payment_method,
        payment_date,
        reference,
        notes,
        status,
        created_at
      FROM instructor_payments
      WHERE instructor_id = ${instructorId}
      ORDER BY payment_date DESC
    `
    
    console.log(`Found ${paymentHistory ? paymentHistory.length : 0} payment records for instructor ${instructorId}`)
    return NextResponse.json(paymentHistory || [])
  } catch (error) {
    console.error("Error fetching instructor payment history:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructor payment history" }, 
      { status: 500 }
    )
  }
}

/**
 * API endpoint for adding a payment record for an instructor
 * POST /api/admin/instructors/[id]/payments
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Adding payment record for instructor: ${instructorId}`)
    
    // Check for admin authorization
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to add instructor payment record")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { amount, paymentType, paymentMethod, reference, notes } = body
    
    if (!amount || !paymentType || !paymentMethod) {
      return NextResponse.json(
        { error: "Amount, payment type, and payment method are required" }, 
        { status: 400 }
      )
    }
    
    // Create a new payment record
    const paymentId = crypto.randomUUID()
    
    const newPayment = await sql`
      INSERT INTO instructor_payments (
        id,
        instructor_id,
        amount,
        payment_type,
        payment_method,
        payment_date,
        reference,
        notes,
        status,
        created_at,
        created_by,
        updated_at
      )
      VALUES (
        ${paymentId},
        ${instructorId},
        ${amount},
        ${paymentType},
        ${paymentMethod},
        CURRENT_TIMESTAMP,
        ${reference || null},
        ${notes || null},
        'completed',
        CURRENT_TIMESTAMP,
        ${user.id},
        CURRENT_TIMESTAMP
      )
      RETURNING id, instructor_id, amount, payment_type, payment_method, payment_date, reference, notes, status
    `
    
    if (!newPayment || newPayment.length === 0) {
      return NextResponse.json(
        { error: "Failed to create payment record" }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Payment record added successfully",
      payment: newPayment[0]
    })
  } catch (error) {
    console.error("Error adding instructor payment record:", error)
    return NextResponse.json(
      { error: "Failed to add instructor payment record" }, 
      { status: 500 }
    )
  }
}
