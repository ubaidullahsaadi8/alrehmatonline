require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

async function seedStudentData() {
  console.log("Connecting to database...");
  
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connected to database successfully!");
    
    
    const studentQuery = await pool.query(`
      SELECT id, name, email FROM users 
      WHERE role = 'student' 
      LIMIT 1
    `);
    
    if (studentQuery.rows.length === 0) {
      console.log("No student users found. Creating a sample student...");
      
      const studentId = `student-${Date.now()}`;
      await pool.query(`
        INSERT INTO users (
          id, name, email, password, role, active, is_approved, created_at
        ) VALUES (
          $1, 'Sample Student', 'student@example.com', 'password123', 'student', true, true, NOW()
        )
      `, [studentId]);
      
      console.log("Created sample student with ID:", studentId);
    }
    
    
    const studentResult = await pool.query(`
      SELECT id, name, email FROM users 
      WHERE role = 'student' 
      LIMIT 1
    `);
    
    const student = studentResult.rows[0];
    console.log("Using student:", student);
    
    
    const coursesQuery = await pool.query(`
      SELECT id, title, price FROM courses
      LIMIT 2
    `);
    
    if (coursesQuery.rows.length === 0) {
      console.log("No courses found. Creating sample courses...");
      
      
      const courseId1 = uuidv4();
      const courseId2 = uuidv4();
      
      await pool.query(`
        INSERT INTO courses (
          id, title, description, image, price, duration, level, instructor, category, created_at
        ) VALUES (
          $1, 'Web Development Fundamentals', 'Learn the basics of web development', '/placeholder.jpg', 299.99, '8 weeks', 'Beginner', 'John Doe', 'Development', NOW()
        )
      `, [courseId1]);
      
      await pool.query(`
        INSERT INTO courses (
          id, title, description, image, price, duration, level, instructor, category, created_at
        ) VALUES (
          $2, 'Advanced JavaScript', 'Master JavaScript programming', '/placeholder.jpg', 399.99, '10 weeks', 'Advanced', 'Jane Smith', 'Programming', NOW()
        )
      `, [courseId2]);
      
      console.log("Created sample courses");
    }
    
    
    const courses = await pool.query(`
      SELECT id, title, price FROM courses
      LIMIT 2
    `);
    
    console.log("Using courses:", courses.rows);
    
    
    console.log("Creating student course enrollments...");
    
    for (const course of courses.rows) {
      
      const existingEnrollment = await pool.query(`
        SELECT id FROM student_courses 
        WHERE student_id = $1 AND course_id = $2
      `, [student.id, course.id]);
      
      if (existingEnrollment.rows.length === 0) {
        const studentCourseId = uuidv4();
        const fee = course.price;
        const discount = Math.floor(Math.random() * 20); 
        const status = ['enrolled', 'in_progress', 'completed'][Math.floor(Math.random() * 3)]; 
        
        await pool.query(`
          INSERT INTO student_courses (
            id, student_id, course_id, status, fee, discount, start_date, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, NOW(), NOW()
          )
        `, [studentCourseId, student.id, course.id, status, fee, discount]);
        
        console.log(`Enrolled student in course "${course.title}" with ${discount}% discount`);
      } else {
        console.log(`Student already enrolled in course "${course.title}"`);
      }
    }
    
    
    console.log("Creating student fees...");
    
    
    const studentCourses = await pool.query(`
      SELECT sc.id, sc.course_id, sc.fee, c.title 
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = $1
    `, [student.id]);
    
    for (const course of studentCourses.rows) {
      const feeId = uuidv4();
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      await pool.query(`
        INSERT INTO student_fees (
          id, student_id, course_id, amount, description, due_date, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW()
        )
      `, [feeId, student.id, course.course_id, course.fee, `Fee for ${course.title}`, dueDate]);
      
      console.log(`Created fee for course "${course.title}"`);
    }
    
    
    console.log("Creating student payments...");
    
    
    const studentFees = await pool.query(`
      SELECT id, amount, course_id FROM student_fees
      WHERE student_id = $1
    `, [student.id]);
    
    for (const fee of studentFees.rows) {
      const paymentId = uuidv4();
      const paymentAmount = fee.amount * 0.5; 
      const paymentMethods = ['cash', 'credit_card', 'bank_transfer', 'paypal'];
      const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      
      const courseQuery = await pool.query(`
        SELECT title FROM courses WHERE id = $1
      `, [fee.course_id]);
      
      const courseTitle = courseQuery.rows[0]?.title || 'Course';
      
      await pool.query(`
        INSERT INTO student_payments (
          id, student_id, fee_id, amount, method, reference, description, date, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
        )
      `, [paymentId, student.id, fee.id, paymentAmount, method, `REF-${Date.now()}`, `Payment for ${courseTitle}`]);
      
      console.log(`Created payment of $${paymentAmount} for fee ID ${fee.id}`);
    }
    
    console.log("Student data seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding student data:", error);
  } finally {
    await pool.end();
    console.log("Database connection closed");
  }
}

seedStudentData().catch(console.error);
