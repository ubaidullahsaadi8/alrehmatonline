const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Get database URL from environment
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function addDashboardFeatures() {
  console.log('🔄 Adding dashboard features to database...');
  
  try {
    // Create tables individually to avoid SQL syntax issues
    console.log('Creating messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Creating student_enrollments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS student_enrollments (
        id SERIAL PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        UNIQUE(student_id, course_id)
      )
    `;
    
    console.log('Creating course_instructors table...');
    await sql`
      CREATE TABLE IF NOT EXISTS course_instructors (
        id SERIAL PRIMARY KEY,
        instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        UNIQUE(instructor_id, course_id)
      )
    `;
    
    console.log('Adding notification preferences to users...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
        "email_notifications": true,
        "sms_notifications": false,
        "push_notifications": true,
        "meeting_reminders": true,
        "message_notifications": true
      }'::jsonb
    `;
    
    console.log('Adding phone to users...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20)
    `;
    
    console.log('Adding bio to users...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bio TEXT
    `;
    
    console.log('Adding meeting_url to courses...');
    await sql`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS meeting_url VARCHAR(500)
    `;
    
    console.log('Adding meeting_time to courses...');
    await sql`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS meeting_time TIMESTAMP
    `;
    
    console.log('Adding status to courses...');
    await sql`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'
    `;
    
    console.log('Creating indexes...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON student_enrollments(student_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_student_enrollments_course ON student_enrollments(course_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor ON course_instructors(instructor_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id)
    `;
    
    console.log('✅ Dashboard features added successfully!');
    
    // Add some sample data for testing
    console.log('🔄 Adding sample enrollment data...');
    
    // Get a sample student and instructor
    const students = await sql`
      SELECT id FROM users WHERE user_type = 'student' LIMIT 1
    `;
    
    const instructors = await sql`
      SELECT id FROM users WHERE user_type = 'instructor' LIMIT 1
    `;
    
    const courses = await sql`
      SELECT id FROM courses LIMIT 3
    `;
    
    if (students.length > 0 && instructors.length > 0 && courses.length > 0) {
      const studentId = students[0].id;
      const instructorId = instructors[0].id;
      
      // Create course-instructor relationships
      for (const course of courses) {
        await sql`
          INSERT INTO course_instructors (instructor_id, course_id, status)
          VALUES (${instructorId}, ${course.id}, 'active')
          ON CONFLICT (instructor_id, course_id) DO NOTHING
        `;
        
        // Create student enrollments
        await sql`
          INSERT INTO student_enrollments (student_id, instructor_id, course_id, status, progress)
          VALUES (${studentId}, ${instructorId}, ${course.id}, 'active', ${Math.floor(Math.random() * 100)})
          ON CONFLICT (student_id, course_id) DO NOTHING
        `;
        
        // Update course with meeting info if course has meeting_url column
        await sql`
          UPDATE courses 
          SET meeting_url = 'https://zoom.us/j/123456789'
          WHERE id = ${course.id}
        `;
      }
      
      // Add sample message
      await sql`
        INSERT INTO messages (subject, content, from_user_id, to_user_id)
        VALUES (
          'Welcome to the course!',
          'Hello! Welcome to our course. I am excited to have you as a student. Please feel free to reach out if you have any questions.',
          ${instructorId},
          ${studentId}
        )
        ON CONFLICT DO NOTHING
      `;
      
      console.log('✅ Sample data added successfully!');
    } else {
      console.log('⚠️  No sample users found. Create some users first to add sample data.');
    }
    
  } catch (error) {
    console.error('❌ Error adding dashboard features:', error);
  }
}

// Run the migration
addDashboardFeatures().then(() => {
  console.log('🎉 Dashboard features migration completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});