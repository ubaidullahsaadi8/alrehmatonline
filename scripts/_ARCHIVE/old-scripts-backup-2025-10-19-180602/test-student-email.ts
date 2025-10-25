import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function checkStudentEmail() {
  const email = "student@gamil.com"
  
  const result = await sql`
    SELECT id, email, name, user_type, role, active, is_approved, account_status
    FROM users 
    WHERE email = ${email}
    LIMIT 1
  `

  console.log("Student user data:")
  console.log(result[0])
  
  // Test redirect logic
  const user = result[0]
  let redirectTo = "/dashboard"
  
  if (user.role === "admin") {
    redirectTo = "/admin"
  } else if (user.user_type === "instructor" && user.is_approved) {
    redirectTo = "/teacher"
  } else if (user.user_type === "student") {
    redirectTo = "/student"
  }
  
  console.log("\nRedirect would be:", redirectTo)
}

checkStudentEmail()
