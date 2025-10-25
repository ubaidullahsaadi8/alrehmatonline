import { PrismaClient } from '@prisma/client'
import { sql } from '@/lib/db'

export async function createServiceRequestsTable() {
  try {
    console.log('Creating service_requests table if it does not exist...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS service_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        service_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('Service requests table created or verified')
    return true
  } catch (error) {
    console.error('Error creating service_requests table:', error)
    return false
  }
}


if (require.main === module) {
  createServiceRequestsTable()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}
