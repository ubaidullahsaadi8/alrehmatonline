import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"


dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

console.log("DATABASE_URL is configured:", process.env.DATABASE_URL ? "YES" : "NO")

const sql = neon(process.env.DATABASE_URL)

async function addServiceTables() {
  console.log("[v0] Adding service request and meeting booking tables...")

  
  await sql`
    CREATE TABLE IF NOT EXISTS service_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service_id TEXT,
      course_id TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create meeting_bookings table
  await sql`
    CREATE TABLE IF NOT EXISTS meeting_bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      course_id TEXT,
      service_id TEXT,
      date DATE NOT NULL,
      time TIME NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  console.log("[v0] Service tables created successfully!")

  // Add example data
  const serviceRequestId = crypto.randomUUID()
  const meetingBookingId = crypto.randomUUID()

  await sql`
    INSERT INTO service_requests (id, name, email, phone, course_id, message, status)
    VALUES (${serviceRequestId}, 'Test User', 'test@example.com', '+1234567890', 'course-1', 'I am interested in the Full Stack Web Development course. Please provide more information.', 'pending')
    ON CONFLICT (id) DO NOTHING
  `

  await sql`
    INSERT INTO meeting_bookings (id, name, email, phone, course_id, date, time, message, status)
    VALUES (${meetingBookingId}, 'Jane Smith', 'jane@example.com', '+9876543210', 'course-2', '2025-10-10', '14:00:00', 'I would like to discuss the AI & Machine Learning course.', 'pending')
    ON CONFLICT (id) DO NOTHING
  `

  console.log("[v0] Example data added successfully!")
}

addServiceTables()
  .then(() => console.log("Script completed successfully!"))
  .catch(error => console.error("Error:", error))
