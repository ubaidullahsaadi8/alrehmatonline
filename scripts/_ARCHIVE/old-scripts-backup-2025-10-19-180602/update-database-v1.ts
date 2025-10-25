import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function updateDatabase() {
  console.log("[v1] Starting database update...")

  
  await sql`
    ALTER TABLE contact_messages 
    ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false
  `
  console.log("[v1] Added 'read' column to contact_messages table")
  
  // Add updated_at column to testimonials table
  try {
    await sql`
      ALTER TABLE testimonials
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `
    console.log("[v1] Added 'updated_at' column to testimonials table")
  } catch (error) {
    console.error("Error adding updated_at column:", error)
  }
  
  console.log("[v1] Database update completed successfully!")
}

updateDatabase().catch(error => {
  console.error("Database update failed:", error)
  process.exit(1)
})
