import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseTables() {
  try {
    console.log("Checking database tables...");

    // Check if course_instructors table exists
    const courseInstructorsExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'course_instructors'
      );
    `;

    const hasInstructorsTable = courseInstructorsExists[0]?.exists || false;
    console.log("\nTable status:");
    console.log("- course_instructors exists:", hasInstructorsTable);

    if (!hasInstructorsTable) {
      console.log("\nCreating course_instructors table...");
      
      await prisma.$executeRaw`
        CREATE TABLE course_instructors (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          course_id TEXT NOT NULL,
          instructor_id TEXT NOT NULL,
          role TEXT DEFAULT 'primary',
          status TEXT DEFAULT 'active',
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT fk_course_instructors_course
              FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
          CONSTRAINT fk_course_instructors_instructor
              FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE INDEX idx_course_instructors_course_id ON course_instructors(course_id);
        CREATE INDEX idx_course_instructors_instructor_id ON course_instructors(instructor_id);
        CREATE INDEX idx_course_instructors_status ON course_instructors(status);
      `;
      
      console.log("✓ course_instructors table created");
    }

    // Check existing records
    const instructorAssignments = await prisma.$queryRaw`
      SELECT 
        ci.course_id,
        c.title as course_title,
        ci.instructor_id,
        u.name as instructor_name,
        ci.role,
        ci.status
      FROM course_instructors ci
      JOIN courses c ON ci.course_id = c.id
      JOIN users u ON ci.instructor_id = u.id
      WHERE ci.status = 'active'
      ORDER BY c.title;
    `;

    console.log("\nCurrent instructor assignments:");
    if (instructorAssignments.length === 0) {
      console.log("No active instructor assignments found");
    } else {
      instructorAssignments.forEach((assignment) => {
        console.log(`- ${assignment.course_title}: ${assignment.instructor_name} (${assignment.role})`);
      });
    }

    // Check unassigned courses
    const unassignedCourses = await prisma.$queryRaw`
      SELECT c.id, c.title 
      FROM courses c
      WHERE NOT EXISTS (
        SELECT 1 
        FROM course_instructors ci 
        WHERE ci.course_id = c.id 
        AND ci.status = 'active'
      );
    `;

    console.log("\nUnassigned courses:");
    if (unassignedCourses.length === 0) {
      console.log("All courses have instructors assigned");
    } else {
      unassignedCourses.forEach((course) => {
        console.log(`- ${course.title} (${course.id})`);
      });
    }

    console.log("\nDatabase check completed successfully!");

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseTables();