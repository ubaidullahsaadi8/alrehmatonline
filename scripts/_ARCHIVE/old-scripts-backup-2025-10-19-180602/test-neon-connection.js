// Test Neon database connection
require('dotenv').config()

async function testConnection() {
  console.log('Testing Neon Database Connection...\n')
  
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file!')
    return
  }
  
  console.log('✅ DATABASE_URL found')
  console.log('URL starts with:', process.env.DATABASE_URL.substring(0, 30) + '...')
  
  try {
    const { neon } = require('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    
    console.log('\nTesting simple query...')
    const result = await sql`SELECT 1 as test, NOW() as current_time`
    
    console.log('✅ Database connection successful!')
    console.log('Test result:', result[0])
    
    console.log('\nTesting users table...')
    const users = await sql`SELECT COUNT(*) as count FROM users`
    console.log(`✅ Users table accessible: ${users[0].count} users`)
    
  } catch (error) {
    console.error('\n❌ Database connection failed!')
    console.error('Error:', error.message)
    
    if (error.message.includes('Control plane request failed')) {
      console.error('\n🔴 Neon Database Issues:')
      console.error('   1. Database might be sleeping (free tier)')
      console.error('   2. Rate limit exceeded')
      console.error('   3. Network connectivity issue')
      console.error('   4. Database URL expired or invalid')
      console.error('\n💡 Solutions:')
      console.error('   - Wait 1-2 minutes and try again')
      console.error('   - Check Neon dashboard: https://console.neon.tech')
      console.error('   - Refresh your connection string')
    }
  }
}

testConnection()
