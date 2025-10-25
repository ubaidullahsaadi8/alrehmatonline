import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function setStudentPassword() {
  const email = "student@gamil.com"
  const newPassword = "student123"
  
  console.log("Setting password for student account...")
  console.log("Email:", email)
  console.log("New Password:", newPassword)
  console.log()

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const result = await sql`
    UPDATE users 
    SET password = ${hashedPassword}
    WHERE email = ${email}
    RETURNING id, email, name, user_type, role
  `

  if (result.length === 0) {
    console.log("❌ Student not found!")
    return
  }

  console.log("✅ Password updated successfully!")
  console.log()
  console.log("=== Login Credentials ===")
  console.log("Email:", result[0].email)
  console.log("Password:", newPassword)
  console.log("User Type:", result[0].user_type)
  console.log("Role:", result[0].role)
  console.log()
  console.log("✅ Now login at http://localhost:3000/login")
  console.log("✅ Should redirect to: /student")
}

setStudentPassword()
