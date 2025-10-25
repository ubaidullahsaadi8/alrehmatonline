import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function fixSaraToStudent() {
  console.log("Converting Sara Ahmed to student user type...\n")

  const email = "sara.ahmed@example.com"
  
  try {
    // First check current status
    const before = await sql`
      SELECT id, email, name, role, user_type, active
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (before.length === 0) {
      console.log("❌ User not found with email:", email)
      return
    }

    console.log("=== BEFORE ===")
    console.log("Email:", before[0].email)
    console.log("Name:", before[0].name)
    console.log("Role:", before[0].role)
    console.log("User Type:", before[0].user_type)
    console.log("Active:", before[0].active)
    console.log()

    // Update to student
    const result = await sql`
      UPDATE users 
      SET 
        user_type = 'student',
        role = 'student',
        active = true,
        is_approved = true,
        account_status = 'active'
      WHERE email = ${email}
      RETURNING id, email, name, role, user_type, active, is_approved, account_status
    `

    if (result.length === 0) {
      console.log("❌ Update failed")
      return
    }

    console.log("=== AFTER ===")
    console.log("Email:", result[0].email)
    console.log("Name:", result[0].name)
    console.log("Role:", result[0].role)
    console.log("User Type:", result[0].user_type)
    console.log("Active:", result[0].active)
    console.log("Approved:", result[0].is_approved)
    console.log("Status:", result[0].account_status)
    console.log()
    
    console.log("✅ Successfully converted to student!")
    console.log("✅ Now this user will redirect to /student after login")

  } catch (error) {
    console.error("Error:", error)
  }
}

fixSaraToStudent()
