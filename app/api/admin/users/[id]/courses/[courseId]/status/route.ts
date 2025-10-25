import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, courseId: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const courseId = params.courseId
    
    
    const { status } = await req.json()

    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    
    const enrollmentCheck = await sql`
      SELECT id FROM user_courses 
      WHERE id = ${courseId} AND user_id = ${userId}
    `

    if (enrollmentCheck.length === 0) {
      return NextResponse.json(
        { error: "Course enrollment not found" },
        { status: 404 }
      )
    }

    // Update status
    await sql`
      UPDATE user_courses
      SET 
        status = ${status},
        updated_at = NOW(),
        completion_date = CASE 
          WHEN ${status} = 'completed' THEN NOW()
          ELSE completion_date
        END
      WHERE id = ${courseId}
    `

    // Create a notification for the user about the status change
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Get course title for the notification
    const enrollmentData = await sql`
      SELECT c.title 
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      WHERE uc.id = ${courseId}
    `
    
    const courseTitle = enrollmentData[0]?.title || "your course"
    
    let notificationTitle, notificationMessage, notificationType
    
    switch(status) {
      case 'active':
        notificationTitle = 'Course Activated'
        notificationMessage = `Your enrollment in ${courseTitle} is now active.`
        notificationType = 'success'
        break
      case 'completed':
        notificationTitle = 'Course Completed'
        notificationMessage = `Congratulations! You have completed ${courseTitle}.`
        notificationType = 'success'
        break
      case 'cancelled':
        notificationTitle = 'Course Cancelled'
        notificationMessage = `Your enrollment in ${courseTitle} has been cancelled.`
        notificationType = 'warning'
        break
      default:
        notificationTitle = 'Course Status Updated'
        notificationMessage = `The status of your enrollment in ${courseTitle} has been updated to ${status}.`
        notificationType = 'info'
    }
    
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
        ${notificationTitle},
        ${notificationMessage},
        ${notificationType},
        ${adminUser.id}
      )
    `

    return NextResponse.json({ 
      success: true,
      message: "Course status updated successfully"
    })
  } catch (error) {
    console.error("Error updating course status:", error)
    return NextResponse.json(
      { error: "Failed to update course status" },
      { status: 500 }
    )
  }
}
