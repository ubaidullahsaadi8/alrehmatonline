import 'dotenv/config'
import { sql } from "../lib/db"
import fs from 'fs/promises'
import path from 'path'

async function backupEnrollments() {
  try {
    console.log("📦 Creating backup of enrollment data...")

    // Get all enrollment data
    const enrollments = await sql`
      SELECT * FROM student_courses
    `

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../backups')
    await fs.mkdir(backupDir, { recursive: true })

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `enrollments-backup-${timestamp}.json`)

    // Save backup
    await fs.writeFile(backupPath, JSON.stringify(enrollments, null, 2))

    console.log(`✅ Backup created at: ${backupPath}`)
    return backupPath
  } catch (error) {
    console.error("Error creating backup:", error)
    throw error
  }
}

// Run the backup
backupEnrollments().then((backupPath) => {
  console.log("\n✨ Backup complete")
  process.exit(0)
}).catch(error => {
  console.error("Fatal error:", error)
  process.exit(1)
})