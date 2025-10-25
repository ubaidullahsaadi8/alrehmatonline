import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTableStructure() {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'student_courses';
    `;
    console.log('Table structure:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableStructure();