import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourses() {
  try {
    // Get all courses
    console.log("\nChecking all courses:");
    const allCourses = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        instructor: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    console.log("All courses:", allCourses);

    // Get unassigned courses
    console.log("\nChecking unassigned courses:");
    const unassignedCourses = await prisma.courses.findMany({
      where: {
        instructor: ''
      },
      select: {
        id: true,
        title: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    console.log("Unassigned courses:", unassignedCourses);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses();