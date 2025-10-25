import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTeachers() {
  try {
    const teachers = await prisma.users.findMany({
      where: {
        OR: [
          { user_type: 'instructor' },
          { role: 'instructor' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        user_type: true,
        role: true
      }
    });

    console.log('\nTeachers:');
    console.log('=========');
    
    teachers.forEach(teacher => {
      console.log(`\nID: ${teacher.id}`);
      console.log(`Name: ${teacher.name}`);
      console.log(`Email: ${teacher.email}`);
      console.log(`Type: ${teacher.user_type}`);
      console.log(`Role: ${teacher.role}`);
      console.log('---------');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTeachers();