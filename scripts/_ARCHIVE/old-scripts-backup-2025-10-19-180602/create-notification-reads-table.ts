import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function createNotificationReadsTable() {
  try {
    console.log('Creating notification_reads table...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS notification_reads (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        notification_id TEXT NOT NULL REFERENCES course_notifications(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        read_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(notification_id, student_id)
      )
    `
    
    console.log('Creating indexes...')
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notification_reads_student 
      ON notification_reads(student_id)
    `
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notification_reads_notification 
      ON notification_reads(notification_id)
    `
    
    console.log('✅ Table and indexes created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating table:', error)
    process.exit(1)
  }
}

createNotificationReadsTable()
