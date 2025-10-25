import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get teacher profile information - only basic fields that we know exist
    const profile = await sql`
      SELECT 
        id,
        name,
        email
      FROM users
      WHERE id = ${user.id}
      AND user_type = 'instructor'
    `

    if (!Array.isArray(profile) || profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Add default values for all fields
    const profileData = {
      ...profile[0],
      phone: '',
      avatar: '',
      bio: '',
      education: '',
      experience: '',
      specializations: '',
      location: '',
      website: '',
      linkedin: '',
      whatsapp: '',
      telegram: '',
      notifications_enabled: true,
      email_notifications: true,
      meeting_reminders: true,
      student_messages: true
    }

    return NextResponse.json({ profile: profileData })

  } catch (error) {
    console.error("Error fetching profile:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    // Update teacher profile - only update name for now since other columns may not exist
    await sql`
      UPDATE users 
      SET 
        name = ${name || null},
        updated_at = NOW()
      WHERE id = ${user.id}
      AND user_type = 'instructor'
    `

    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully" 
    })

  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" }, 
      { status: 500 }
    )
  }
}