import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user_courses table structure
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_courses'
      ORDER BY ordinal_position
    `

    return NextResponse.json({ columns })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
