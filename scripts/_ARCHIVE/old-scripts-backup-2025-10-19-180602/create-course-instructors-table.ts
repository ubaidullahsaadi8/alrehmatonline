import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
import fs from 'fs'

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function createCourseInstructorsTable() {
  try {
    console.log("Creating course_instructors table...")

    // Read the SQL file
    const sqlContent = fs.readFileSync('./scripts/create-course-instructors-table.sql', 'utf-8')

    // Execute the SQL
    await sql.unsafe(sqlContent)

    console.log("course_instructors table created successfully!")
  } catch (error) {
    console.error("Error creating table:", error)
  }
}

createCourseInstructorsTable()