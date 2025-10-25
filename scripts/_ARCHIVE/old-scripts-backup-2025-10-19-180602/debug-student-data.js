require('dotenv').config();
const { Pool } = require('pg');

async function debugStudentData() {
  console.log("Connecting to database...");
  
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connected to database successfully!");
    
    
    console.log("\n=== CHECKING STUDENT USERS ===");
    const studentsQuery = await pool.query(`
      SELECT id, name, email, role FROM users 
      WHERE role = 'student'
    `);
    
    console.log(`Found ${studentsQuery.rows.length} students in the database:`);
    console.table(studentsQuery.rows);
    
    if (studentsQuery.rows.length === 0) {
      console.log("No student users found. Please run seed-student-data script first.");
      return;
    }
    
    const studentId = studentsQuery.rows[0].id;
    
    
    console.log("\n=== CHECKING STUDENT_COURSES TABLE ===");
    
    try {
      const coursesTableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'student_courses'
        ) as exists
      `);
      
      if (!coursesTableCheck.rows[0].exists) {
        console.log("student_courses table does not exist. Please run create-student-tables script first.");
      } else {
        console.log("student_courses table exists!");
        
        
        const coursesQuery = await pool.query(`
          SELECT sc.*, c.title 
          FROM student_courses sc
          JOIN courses c ON sc.course_id = c.id
          WHERE sc.student_id = $1
        `, [studentId]);
        
        console.log(`Found ${coursesQuery.rows.length} courses for student ${studentId}:`);
        console.table(coursesQuery.rows);
      }
    } catch (error) {
      console.error("Error checking student_courses table:", error.message);
    }
    
    
    console.log("\n=== CHECKING STUDENT_FEES TABLE ===");
    
    try {
      const feesTableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'student_fees'
        ) as exists
      `);
      
      if (!feesTableCheck.rows[0].exists) {
        console.log("student_fees table does not exist. Please run create-student-tables script first.");
      } else {
        console.log("student_fees table exists!");
        
        
        const feesQuery = await pool.query(`
          SELECT sf.*, c.title 
          FROM student_fees sf
          LEFT JOIN courses c ON sf.course_id = c.id
          WHERE sf.student_id = $1
        `, [studentId]);
        
        console.log(`Found ${feesQuery.rows.length} fees for student ${studentId}:`);
        console.table(feesQuery.rows);
      }
    } catch (error) {
      console.error("Error checking student_fees table:", error.message);
    }
    
    
    console.log("\n=== CHECKING STUDENT_PAYMENTS TABLE ===");
    
    try {
      const paymentsTableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'student_payments'
        ) as exists
      `);
      
      if (!paymentsTableCheck.rows[0].exists) {
        console.log("student_payments table does not exist. Please run create-student-tables script first.");
      } else {
        console.log("student_payments table exists!");
        
        
        const paymentsQuery = await pool.query(`
          SELECT * FROM student_payments
          WHERE student_id = $1
        `, [studentId]);
        
        console.log(`Found ${paymentsQuery.rows.length} payments for student ${studentId}:`);
        console.table(paymentsQuery.rows);
      }
    } catch (error) {
      console.error("Error checking student_payments table:", error.message);
    }
    
  } catch (error) {
    console.error("Error debugging student data:", error);
  } finally {
    await pool.end();
    console.log("\nDatabase connection closed");
  }
}

debugStudentData().catch(console.error);
