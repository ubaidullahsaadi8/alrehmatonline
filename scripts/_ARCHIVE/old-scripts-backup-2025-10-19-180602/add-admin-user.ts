import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function addAdmin() {
  console.log("Adding admin user...")

  const adminEmail = "wajidworstation@gmail.com"
  const adminPassword = "gshs5465"

  try {
    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1
    `

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists with email:", adminEmail)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Insert the admin user
    await sql`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES (gen_random_uuid(), ${adminEmail}, ${hashedPassword}, 'Admin User', 'admin', NOW(), NOW())
    `

    console.log("Admin user added successfully!")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)

  } catch (error) {
    console.error("Error adding admin user:", error)
  }
}

addAdmin()