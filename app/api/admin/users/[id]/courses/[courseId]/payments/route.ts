import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string, courseId: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const userCourseId = params.courseId

    
    const enrollmentCheck = await sql`
      SELECT id FROM user_courses 
      WHERE id = ${userCourseId} AND user_id = ${userId}
    `

    if (enrollmentCheck.length === 0) {
      return NextResponse.json(
        { error: "Course enrollment not found" },
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
      FROM course_payments
      WHERE user_course_id = ${userCourseId}
      ORDER BY payment_date DESC
    `

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching course payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch course payments" },
      { status: 500 }
    )
  }
}

// Add a new course payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string, courseId: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const userCourseId = params.courseId
    
    // Get data from request
    const { amount, paymentMethod, paymentDate, status = 'completed' } = await req.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid payment amount is required" },
        { status: 400 }
      )
    }

    // Check if course enrollment exists
    const courseCheck = await sql`
      SELECT uc.id, c.title, c.price 
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      WHERE uc.id = ${userCourseId} AND uc.user_id = ${userId}
    `

    if (courseCheck.length === 0) {
      return NextResponse.json(
        { error: "Course enrollment not found" },
        { status: 404 }
      )
    }

    const courseTitle = courseCheck[0].title
    
    // Create unique ID for payment
    const paymentId = `cp-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Record the payment
    await sql`
      INSERT INTO course_payments (
        id,
        user_course_id,
        amount,
        payment_date,
        payment_method,
        status
      ) VALUES (
        ${paymentId},
        ${userCourseId},
        ${amount},
        ${paymentDate ? new Date(paymentDate) : new Date()},
        ${paymentMethod || 'cash'},
        ${status}
      )
    `
    
    // Calculate total paid for this course enrollment
    const totalPaidResult = await sql`
      SELECT SUM(amount) as total_paid
      FROM course_payments
      WHERE user_course_id = ${userCourseId} AND status = 'completed'
    `
    
    const totalPaid = Number(totalPaidResult[0]?.total_paid || 0)
    const coursePrice = Number(courseCheck[0].price || 0)
    const remainingAmount = coursePrice - totalPaid
    
    // Update payment status in user_courses if fully paid
    if (remainingAmount <= 0) {
      await sql`
        UPDATE user_courses
        SET payment_status = 'paid'
        WHERE id = ${userCourseId}
      `
    } else {
      await sql`
        UPDATE user_courses
        SET payment_status = 'partial'
        WHERE id = ${userCourseId}
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
        'Course Payment Received',
        ${`Your payment of $${amount} for ${courseTitle} has been received`},
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
    console.error("Error recording course payment:", error)
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    )
  }
}
