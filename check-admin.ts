import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"

config()

const sql = neon(process.env.DATABASE_URL!)

async function checkAdmin() {
  try {  
    console.log("\n🔍 Checking database for admin users...\n")
    
    // Check if users table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `
    
    if (tables.length === 0) {
      console.log("❌ Users table doesn't exist!")
      console.log("Run: npm run db:migrate")
      return
    }
    
    console.log("✅ Users table exists\n")
    
    // Get all users
    const users = await sql`
      SELECT id, email, name, role, user_type, active, is_approved, 
             LENGTH(password) as password_length,
             SUBSTRING(password, 1, 10) as password_prefix
      FROM users 
      ORDER BY created_at DESC
    `
    
    if (users.length === 0) {
      console.log("❌ No users found in database!")
      console.log("Run: npm run setup:admin")
      return
    }
    
    console.log(`✅ Found ${users.length} user(s):\n`)
    
    users.forEach((user: any, index: number) => {
      console.log(`--- User ${index + 1} ---`)
      console.log(`Email: ${user.email}`)
      console.log(`Name: ${user.name}`)
      console.log(`Role: ${user.role}`)
      console.log(`Type: ${user.user_type}`)
      console.log(`Active: ${user.active}`)
      console.log(`Approved: ${user.is_approved}`)
      console.log(`Password Hash: ${user.password_prefix}... (${user.password_length} chars)`)
      console.log(`Password Valid: ${user.password_prefix?.startsWith('$2') ? '✅ Yes' : '❌ No'}`)
      console.log("")
    })
    
    // Check specifically for admin users
    const admins = users.filter((u: any) => u.role === 'admin')
    
    if (admins.length === 0) {
      console.log("⚠️  No admin users found!")
      console.log("Run: npm run setup:admin")
    } else {
      console.log(`✅ Found ${admins.length} admin user(s)`)
      console.log("\nYou can login with:")
      admins.forEach((admin: any) => {
        console.log(`  Email: ${admin.email}`)
        console.log(`  Password: (check setup-admin.ts)`)
      })
    }
    
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

checkAdmin()
