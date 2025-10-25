import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    
    
    const userServices = await sql`
      SELECT 
        us.id,
        us.service_id,
        s.title,
        s.price,
        us.start_date,
        us.end_date,
        us.status,
        us.created_at
      FROM user_services us
      JOIN services s ON us.service_id = s.id
      WHERE us.user_id = ${userId}
      ORDER BY us.created_at DESC
    `
    
    // Get service payments
    const servicePayments = await sql`
      SELECT 
        sp.id,
        sp.user_service_id,
        sp.amount,
        sp.payment_date,
        sp.payment_method,
        sp.status as payment_status
      FROM service_payments sp
      JOIN user_services us ON sp.user_service_id = us.id
      WHERE us.user_id = ${userId}
    `
    
    // Combine service data with payments
    const servicesWithPayments = userServices.map(service => {
      const payments = servicePayments.filter(
        payment => payment.user_service_id === service.id
      )
      
      // Calculate total paid amount
      const totalPaid = payments.reduce((sum, payment) => {
        return payment.payment_status === 'completed' 
          ? sum + Number(payment.amount) 
          : sum
      }, 0)
      
      // Calculate remaining amount
      const remainingAmount = Number(service.price) - totalPaid
      
      return {
        ...service,
        payments,
        totalPaid,
        remainingAmount
      }
    })
    
    return NextResponse.json({ 
      services: servicesWithPayments 
    })
  } catch (error) {
    console.error("Error fetching user services:", error)
    return NextResponse.json(
      { error: "Failed to fetch user services" },
      { status: 500 }
    )
  }
}

// Assign a service to a user
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    
    // Get data from request
    const { serviceId, startDate, endDate, initialPayment } = await req.json()

    // Validate required fields
    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      )
    }

    // Check if service exists
    const serviceCheck = await sql`
      SELECT id, title, price FROM services WHERE id = ${serviceId}
    `

    if (serviceCheck.length === 0) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      )
    }

    const servicePrice = serviceCheck[0].price
    const serviceTitle = serviceCheck[0].title
    
    // Check if user already has this service
    const existingService = await sql`
      SELECT id FROM user_services 
      WHERE user_id = ${userId} AND service_id = ${serviceId} AND status != 'cancelled'
    `

    if (existingService.length > 0) {
      return NextResponse.json(
        { error: "User already has this service assigned" },
        { status: 400 }
      )
    }
    
    // Create unique ID for user service
    const userServiceId = `us-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Assign service to user
    await sql`
      INSERT INTO user_services (
        id,
        user_id,
        service_id,
        start_date,
        end_date,
        status
      ) VALUES (
        ${userServiceId},
        ${userId},
        ${serviceId},
        ${startDate ? new Date(startDate) : new Date()},
        ${endDate ? new Date(endDate) : null},
        'active'
      )
    `
    
    // Process initial payment if provided
    let paymentId
    let paymentStatus
    
    if (initialPayment && initialPayment > 0) {
      paymentId = `sp-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      paymentStatus = 'completed'
      
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
          ${initialPayment},
          NOW(),
          'cash',
          ${paymentStatus}
        )
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
        'New Service Added',
        ${`You have been assigned to ${serviceTitle} service`},
        'info',
        ${adminUser.id}
      )
    `

    return NextResponse.json({ 
      success: true,
      userServiceId,
      paymentId,
      message: "Service assigned successfully"
    })
  } catch (error) {
    console.error("Error assigning service:", error)
    return NextResponse.json(
      { error: "Failed to assign service" },
      { status: 500 }
    )
  }
}
