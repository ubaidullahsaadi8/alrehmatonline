#!/usr/bin/env node

const { Client } = require('pg');

async function createSampleData() {
  try {
    // Read environment variables
    require('dotenv').config();
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();
    console.log('Connected to database');

    // 1. Create a sample instructor if doesn't exist
    await client.query(`
      INSERT INTO users (id, email, password, name, user_type, role, is_approved, active, education)
      VALUES (
        'instructor-sample-1',
        'teacher@example.com',
        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
        'John Smith',
        'instructor',
        'user',
        true,
        true,
        'Master''s in Computer Science'
      )
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('Sample instructor created');

    // 2. Create a sample student if doesn't exist
    await client.query(`
      INSERT INTO users (id, email, password, name, user_type, role, active, country)
      VALUES (
        'student-sample-1',
        'student@example.com',
        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
        'Alice Johnson',
        'student',
        'user',
        true,
        'United States'
      )
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('Sample student created');

    // 3. Create sample courses if they don't exist
    await client.query(`
      INSERT INTO courses (id, title, description, image, price, duration, level, instructor, category, featured)
      VALUES (
        'course-web-development',
        'Full Stack Web Development',
        'Learn to build modern web applications with React, Node.js, and databases',
        '/images/web-dev.jpg',
        499.99,
        '12 weeks',
        'intermediate',
        'John Smith',
        'Programming',
        true
      )
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query(`
      INSERT INTO courses (id, title, description, image, price, duration, level, instructor, category, featured)
      VALUES (
        'course-data-science',
        'Data Science Fundamentals',
        'Introduction to data analysis, statistics, and machine learning',
        '/images/data-science.jpg',
        399.99,
        '10 weeks',
        'beginner',
        'John Smith',
        'Data Science',
        false
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('Sample courses created');

    // 4. Assign instructor to courses
    await client.query(`
      INSERT INTO course_instructors (course_id, instructor_id, assigned_at, status)
      VALUES 
        ('course-web-development', 'instructor-sample-1', NOW(), 'active'),
        ('course-data-science', 'instructor-sample-1', NOW(), 'active')
      ON CONFLICT (course_id, instructor_id) DO NOTHING
    `);
    console.log('Instructor assigned to courses');

    // 5. Enroll student in courses
    await client.query(`
      INSERT INTO student_enrollments (student_id, course_id, instructor_id, enrolled_at, status, progress)
      VALUES 
        ('student-sample-1', 'course-web-development', 'instructor-sample-1', NOW(), 'active', 25),
        ('student-sample-1', 'course-data-science', 'instructor-sample-1', NOW(), 'active', 10)
      ON CONFLICT (student_id, course_id) DO NOTHING
    `);
    console.log('Student enrolled in courses');

    // 6. Add sample meeting info
    await client.query(`
      UPDATE courses 
      SET 
        meeting_link = 'https://meet.google.com/sample-meeting-link',
        meeting_time = '14:00',
        meeting_date = CURRENT_DATE + INTERVAL '1 day'
      WHERE id IN ('course-web-development', 'course-data-science')
    `);
    console.log('Meeting information added');

    // 7. Create sample instructor message
    await client.query(`
      INSERT INTO instructor_messages (instructor_id, student_id, course_id, title, message, type)
      VALUES (
        'instructor-sample-1',
        'student-sample-1',
        'course-web-development',
        'Welcome to Web Development Course',
        'Welcome to the Full Stack Web Development course! We''ll be covering React, Node.js, and database integration. Please check the meeting link for our first session tomorrow.',
        'message'
      )
    `);

    // 8. Create corresponding notification
    await client.query(`
      INSERT INTO notifications (id, user_id, title, message, type, sender_id, sender_type, created_by)
      VALUES (
        gen_random_uuid(),
        'student-sample-1',
        'Welcome to Web Development Course',
        'Welcome to the Full Stack Web Development course! We''ll be covering React, Node.js, and database integration. Please check the meeting link for our first session tomorrow.',
        'message',
        'instructor-sample-1',
        'instructor',
        'instructor-sample-1'
      )
    `);
    console.log('Sample message and notification created');

    await client.end();
    console.log('Sample data creation completed successfully!');
    
    console.log('\n=== Test Accounts ===');
    console.log('Instructor: teacher@example.com / password');
    console.log('Student: student@example.com / password');
    console.log('(Both use "password" as the password)');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData();