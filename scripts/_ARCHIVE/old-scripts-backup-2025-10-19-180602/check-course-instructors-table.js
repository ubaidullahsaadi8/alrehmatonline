import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCoursesTable() {
  try {
    // Check if course_instructors table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'course_instructors'
      );
    `;

    console.log('Table exists?', tableExists[0].exists);

    if (tableExists[0].exists) {
      // Check table structure
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'course_instructors';
      `;

      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCoursesTable();