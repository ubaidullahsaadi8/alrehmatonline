import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function testStudentLogin() {
  console.log("Testing student login flow...\n")

  // Check if student exists
  const email = "student@gamil.com"
  const password = "password123" // You'll need to know the actual password
  
  try {
    const users = await sql`
      SELECT id, email, name, role, user_type, account_status, is_approved, active, password
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      console.log("❌ Student not found with email:", email)
      return
    }

    const user = users[0]
    console.log("=== User Data ===")
    console.log("Email:", user.email)
    console.log("Name:", user.name)
    console.log("Role:", user.role)
    console.log("User Type:", user.user_type)
    console.log("Active:", user.active)
    console.log("Approved:", user.is_approved)
    console.log("Status:", user.account_status)
    console.log()

    // Test password (optional, comment out if you don't know the password)
    // const isValidPassword = await bcrypt.compare(password, user.password)
    // console.log("Password test:", isValidPassword ? "✓ Valid" : "❌ Invalid")
    // console.log()

    // Check redirect logic
    console.log("=== Login Flow Check ===")
    
    if (!user.active) {
      console.log("❌ Login would fail: Account is not active")
      return
    }
    
    if (user.user_type === "instructor" && !user.is_approved) {
      console.log("❌ Login would fail: Instructor not approved")
      return
    }

    console.log("✓ Login should succeed")
    
    let redirectTo = "/dashboard"
    if (user.role === "admin") {
      redirectTo = "/admin"
    } else if (user.user_type === "instructor" && user.is_approved) {
      redirectTo = "/teacher"
    } else if (user.user_type === "student") {
      redirectTo = "/student"
    }
    
    console.log("✓ Should redirect to:", redirectTo)
    
    if (redirectTo === "/student") {
      console.log("✓ Correct redirect for student!")
    } else {
      console.log("⚠ Warning: Not redirecting to /student")
    }

  } catch (error) {
    console.error("Error:", error)
  }
}

testStudentLogin()
