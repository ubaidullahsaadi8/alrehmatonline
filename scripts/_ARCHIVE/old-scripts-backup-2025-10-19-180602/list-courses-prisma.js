import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listCourses() {
  try {
    const courses = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        instructor: true
      }
    });

    console.log('\nAvailable courses:');
    console.log('===================');
    
    for (const course of courses) {
      console.log(`\nID: ${course.id}`);
      console.log(`Title: ${course.title}`);
      console.log(`Description: ${course.description}`);
      console.log(`Price: ${course.price}`);
      console.log(`Instructor: ${course.instructor}`);
      console.log('-------------------');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCourses();