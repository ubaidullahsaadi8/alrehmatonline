require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function createMonthlyFeesTable() {
  try {
    console.log('Creating monthly_fees table...')

    await sql`
      CREATE TABLE IF NOT EXISTS monthly_fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_course_id TEXT NOT NULL,
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

    console.log('✅ monthly_fees table created successfully')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_user_course ON monthly_fees(user_course_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_status ON monthly_fees(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_fees_due_date ON monthly_fees(due_date)`

    console.log('✅ Indexes created successfully')

    // Verify table
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'monthly_fees'
      ORDER BY ordinal_position
    `

    console.log('\n📋 Table structure:')
    result.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`)
    })

    console.log('\n✅ Migration completed successfully!')

  } catch (error) {
    console.error('❌ Error creating table:', error.message)
    process.exit(1)
  }
}

createMonthlyFeesTable()
