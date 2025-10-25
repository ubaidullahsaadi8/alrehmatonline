import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function checkUser() {
  console.log("Checking user data...")

  const userEmail = "wajidworstation@gmail.com"

  try {
    const user = await sql`
      SELECT id, email, name, role, user_type, account_status, is_approved, active
      FROM users 
      WHERE email = ${userEmail} 
      LIMIT 1
    `

    if (user.length === 0) {
      console.log("User not found with email:", userEmail)
      return
    }

    console.log("\n=== User Data ===")
    console.log(JSON.stringify(user[0], null, 2))
    console.log("\n=== Analysis ===")
    console.log("Role:", user[0].role)
    console.log("User Type:", user[0].user_type || "(null/undefined)")
    console.log("Is Approved:", user[0].is_approved)
    console.log("Is Active:", user[0].active)
    console.log("Account Status:", user[0].account_status || "(null/undefined)")
    
    console.log("\n=== Redirect Logic ===")
    if (user[0].role === "admin") {
      console.log("✓ Should redirect to: /admin")
    } else if (user[0].user_type === "instructor" && user[0].is_approved) {
      console.log("✓ Should redirect to: /teacher")
    } else if (user[0].user_type === "student") {
      console.log("✓ Should redirect to: /student")
    } else {
      console.log("⚠ Would redirect to: /dashboard (default - may not exist)")
      console.log("  User type is:", user[0].user_type || "null/undefined")
    }

  } catch (error) {
    console.error("Error checking user:", error)
  }
}

checkUser()
