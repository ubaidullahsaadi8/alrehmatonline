import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Creating monthly_fees table...')

    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_course_id UUID REFERENCES user_courses(id) ON DELETE CASCADE,
        month VARCHAR(20) NOT NULL,
        year VARCHAR(4) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        paid_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_course_id, month, year)
      )
    `
    
    console.log('✅ Table created')
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_user_course ON monthly_fees(user_course_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_status ON monthly_fees(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_due_date ON monthly_fees(due_date)`
    
    console.log('✅ Indexes created')
    
    // Verify table structure
    const result = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'monthly_fees'
      ORDER BY ordinal_position
    `
    
    return NextResponse.json({
      success: true,
      message: 'monthly_fees table created successfully',
      columns: result
    })

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
