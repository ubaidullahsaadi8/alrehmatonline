import { PrismaClient } from '@prisma/client'
import { sql } from '@/lib/db'

export async function createServiceBookingsTable() {
  try {
    console.log('Creating service_bookings table if it does not exist...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS service_bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT,
        service_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('Service bookings table created or verified')
    return true
  } catch (error) {
    console.error('Error creating service_bookings table:', error)
    return false
  }
}


if (require.main === module) {
  createServiceBookingsTable()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}
