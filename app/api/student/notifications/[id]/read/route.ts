import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notificationId = params.id

    // Mark notification as read (insert or update)
    await sql`
      INSERT INTO notification_reads (notification_id, student_id)
      VALUES (${notificationId}, ${user.id})
      ON CONFLICT (notification_id, student_id) DO NOTHING
    `

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
