import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string, serviceId: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const userServiceId = params.serviceId

    
    const serviceCheck = await sql`
      SELECT id FROM user_services 
      WHERE id = ${userServiceId} AND user_id = ${userId}
    `

    if (serviceCheck.length === 0) {
      return NextResponse.json(
        { error: "Service assignment not found" },
        { status: 404 }
      )
    }

    // Get payment history
    const payments = await sql`
      SELECT 
        id,
        amount,
        payment_date,
        payment_method,
        reference,
        notes
      FROM service_payments
      WHERE user_service_id = ${userServiceId}
      ORDER BY payment_date DESC
    `

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching service payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch service payments" },
      { status: 500 }
    )
  }
}

// Add a new service payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string, serviceId: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const userServiceId = params.serviceId
    
    // Get data from request
    const { amount, paymentMethod, paymentDate, status = 'completed' } = await req.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid payment amount is required" },
        { status: 400 }
      )
    }

    // Check if service assignment exists
    const serviceCheck = await sql`
      SELECT us.id, s.title, s.price 
      FROM user_services us
      JOIN services s ON us.service_id = s.id
      WHERE us.id = ${userServiceId} AND us.user_id = ${userId}
    `

    if (serviceCheck.length === 0) {
      return NextResponse.json(
        { error: "Service assignment not found" },
        { status: 404 }
      )
    }

    const serviceTitle = serviceCheck[0].title
    
    // Create unique ID for payment
    const paymentId = `sp-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Record the payment
    await sql`
      INSERT INTO service_payments (
        id,
        user_service_id,
        amount,
        payment_date,
        payment_method,
        status
      ) VALUES (
        ${paymentId},
        ${userServiceId},
        ${amount},
        ${paymentDate ? new Date(paymentDate) : new Date()},
        ${paymentMethod || 'cash'},
        ${status}
      )
    `
    
    // Calculate total paid for this service
    const totalPaidResult = await sql`
      SELECT SUM(amount) as total_paid
      FROM service_payments
      WHERE user_service_id = ${userServiceId} AND status = 'completed'
    `
    
    const totalPaid = Number(totalPaidResult[0]?.total_paid || 0)
    const servicePrice = Number(serviceCheck[0].price || 0)
    const remainingAmount = servicePrice - totalPaid
    
    // Update payment status in user_services if fully paid
    if (remainingAmount <= 0) {
      await sql`
        UPDATE user_services
        SET payment_status = 'paid'
        WHERE id = ${userServiceId}
      `
    } else {
      await sql`
        UPDATE user_services
        SET payment_status = 'partial'
        WHERE id = ${userServiceId}
      `
    }
    
    // Create a notification for the user
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    await sql`
      INSERT INTO notifications (
        id,
        user_id,
        title,
        message,
        type,
        created_by
      ) VALUES (
        ${notificationId},
        ${userId},
        'Service Payment Received',
        ${`Your payment of $${amount} for ${serviceTitle} has been received`},
        'success',
        ${adminUser.id}
      )
    `

    return NextResponse.json({ 
      success: true,
      paymentId,
      totalPaid,
      remainingAmount,
      message: "Payment recorded successfully"
    })
  } catch (error) {
    console.error("Error recording service payment:", error)
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    )
  }
}
