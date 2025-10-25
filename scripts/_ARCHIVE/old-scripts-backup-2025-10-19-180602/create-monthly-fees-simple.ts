import { sql } from '../lib/db'

async function createMonthlyFeesTable() {
  try {
    console.log('🚀 Creating monthly_fees table...\n')

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
    
    console.log('✅ Table created successfully')
    
    // Create indexes
    console.log('\n🔧 Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_user_course ON monthly_fees(user_course_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_status ON monthly_fees(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_due_date ON monthly_fees(due_date)`
    
    console.log('✅ Indexes created successfully')
    
    // Verify table structure
    console.log('\n🔍 Verifying table structure...')
    const result = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'monthly_fees'
      ORDER BY ordinal_position
    `
    
    console.log('\n📋 Table Columns:')
    result.forEach((col: any) => {
      console.log(`   ${col.column_name.padEnd(20)} ${col.data_type.padEnd(25)} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`)
    })
    
    console.log('\n✅ Migration completed successfully!\n')
    process.exit(0)

  } catch (error: any) {
    console.error('\n❌ Error creating table:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

createMonthlyFeesTable()
