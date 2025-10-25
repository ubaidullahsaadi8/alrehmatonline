import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseTables() {
  try {
    console.log("Checking database tables...");

    // Check if course_instructors table exists
    const courseInstructorsCheck = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'course_instructors'
      );
    `;

    console.log("\nTable status:");
    console.log("- course_instructors exists:", courseInstructorsCheck.rows[0].exists);

    if (!courseInstructorsCheck.rows[0].exists) {
      console.log("\nCreating course_instructors table...");
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS course_instructors (
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

        CREATE INDEX IF NOT EXISTS idx_course_instructors_course_id ON course_instructors(course_id);
        CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor_id ON course_instructors(instructor_id);
        CREATE INDEX IF NOT EXISTS idx_course_instructors_status ON course_instructors(status);
      `;
      
      console.log("✓ course_instructors table created");
    }

    // Check if courses table still has instructor column
    const courseColumnsCheck = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'courses' 
      AND column_name = 'instructor';
    `;

    console.log("\n- courses.instructor column exists:", courseColumnsCheck.rows.length > 0);

    // If instructor column exists, migrate data to course_instructors
    if (courseColumnsCheck.rows.length > 0) {
      console.log("\nMigrating instructor data to course_instructors table...");
      
      await prisma.$executeRaw`
        INSERT INTO course_instructors (course_id, instructor_id, role, status)
        SELECT 
          c.id as course_id,
          c.instructor as instructor_id,
          'primary' as role,
          'active' as status
        FROM courses c
        WHERE c.instructor IS NOT NULL 
        AND c.instructor != ''
        AND NOT EXISTS (
          SELECT 1 
          FROM course_instructors ci 
          WHERE ci.course_id = c.id 
          AND ci.instructor_id = c.instructor
        );
      `;
      
      console.log("✓ Instructor data migrated");
      
      // Don't drop the column yet as it might be used elsewhere
      console.log("\nNote: instructor column kept for backward compatibility");
    }

    // Check for any courses without instructors
    const unassignedCheck = await prisma.$queryRaw`
      SELECT COUNT(*) 
      FROM courses c
      WHERE NOT EXISTS (
        SELECT 1 
        FROM course_instructors ci 
        WHERE ci.course_id = c.id 
        AND ci.status = 'active'
      );
    `;

    console.log("\nUnassigned courses:", unassignedCheck.rows[0].count);

    console.log("\nDatabase check completed successfully!");

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseTables();