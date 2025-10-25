import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function createNotificationsTable() {
  try {
    console.log('Creating course_notifications table...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS course_notifications (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    console.log('Creating indexes...')
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_notifications_course_id 
      ON course_notifications(course_id)
    `
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_notifications_created_at 
      ON course_notifications(created_at DESC)
    `
    
    console.log('✅ Table and indexes created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating table:', error)
    process.exit(1)
  }
}

createNotificationsTable()
