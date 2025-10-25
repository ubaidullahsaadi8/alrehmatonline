import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function checkAllUsers() {
  console.log("Checking all users...")

  try {
    const users = await sql`
      SELECT id, email, name, role, user_type, account_status, is_approved, active
      FROM users 
      ORDER BY created_at DESC
    `

    if (users.length === 0) {
      console.log("No users found in database")
      return
    }

    console.log(`\n=== Found ${users.length} users ===\n`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   User Type: ${user.user_type || "(null)"}`)
      console.log(`   Active: ${user.active}`)
      console.log(`   Approved: ${user.is_approved}`)
      console.log(`   Status: ${user.account_status || "(null)"}`)
      
      // Determine redirect
      if (user.role === "admin") {
        console.log(`   ✓ Redirects to: /admin`)
      } else if (user.user_type === "instructor" && user.is_approved) {
        console.log(`   ✓ Redirects to: /teacher`)
      } else if (user.user_type === "student") {
        console.log(`   ✓ Redirects to: /student`)
      } else if (user.user_type === "instructor" && !user.is_approved) {
        console.log(`   ⚠ Instructor pending approval - cannot login`)
      } else {
        console.log(`   ⚠ Redirects to: /dashboard (may not exist)`)
      }
      console.log()
    })

  } catch (error) {
    console.error("Error checking users:", error)
  }
}

checkAllUsers()
