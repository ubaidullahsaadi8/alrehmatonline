import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, serviceId: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const serviceId = params.serviceId
    
    
    const { status, endDate } = await req.json()

    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    
    const serviceCheck = await sql`
      SELECT id FROM user_services 
      WHERE id = ${serviceId} AND user_id = ${userId}
    `

    if (serviceCheck.length === 0) {
      return NextResponse.json(
        { error: "Service assignment not found" },
        { status: 404 }
      )
    }

    // Update status and potentially end date
    await sql`
      UPDATE user_services
      SET 
        status = ${status},
        updated_at = NOW(),
        end_date = CASE 
          WHEN ${endDate} IS NOT NULL THEN ${new Date(endDate)}
          WHEN ${status} = 'completed' AND end_date IS NULL THEN NOW()
          ELSE end_date
        END
      WHERE id = ${serviceId}
    `

    // Create a notification for the user about the status change
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Get service title for the notification
    const serviceData = await sql`
      SELECT s.title 
      FROM user_services us
      JOIN services s ON us.service_id = s.id
      WHERE us.id = ${serviceId}
    `
    
    const serviceTitle = serviceData[0]?.title || "your service"
    
    let notificationTitle, notificationMessage, notificationType
    
    switch(status) {
      case 'active':
        notificationTitle = 'Service Activated'
        notificationMessage = `Your ${serviceTitle} service is now active.`
        notificationType = 'success'
        break
      case 'completed':
        notificationTitle = 'Service Completed'
        notificationMessage = `Your ${serviceTitle} service has been completed.`
        notificationType = 'success'
        break
      case 'cancelled':
        notificationTitle = 'Service Cancelled'
        notificationMessage = `Your ${serviceTitle} service has been cancelled.`
        notificationType = 'warning'
        break
      default:
        notificationTitle = 'Service Status Updated'
        notificationMessage = `The status of your ${serviceTitle} service has been updated to ${status}.`
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
      message: "Service status updated successfully"
    })
  } catch (error) {
    console.error("Error updating service status:", error)
    return NextResponse.json(
      { error: "Failed to update service status" },
      { status: 500 }
    )
  }
}
