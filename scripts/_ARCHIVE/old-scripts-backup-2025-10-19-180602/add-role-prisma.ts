import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Add role column to course_instructors table
    await prisma.$executeRaw`
      ALTER TABLE course_instructors 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'instructor';
    `

    // Create index for better performance
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_course_instructors_role ON course_instructors(role);
    `

    console.log('Successfully added role column to course_instructors table')
  } catch (error) {
    console.error('Error adding role column:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()