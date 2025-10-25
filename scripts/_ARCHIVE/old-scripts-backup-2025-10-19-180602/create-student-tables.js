require('dotenv').config();
const { Pool } = require('pg');

async function createStudentTables() {
  console.log("Connecting to database...");
  
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connected to database successfully!");
    
    
    console.log("Creating student_courses table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_courses (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES users(id),
        course_id TEXT NOT NULL REFERENCES courses(id),
        status TEXT NOT NULL DEFAULT 'enrolled',
        fee DECIMAL NOT NULL,
        discount INTEGER DEFAULT 0,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    
    console.log("Creating student_fees table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_fees (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES users(id),
        course_id TEXT REFERENCES courses(id),
        amount DECIMAL NOT NULL,
        discount INTEGER DEFAULT 0,
        description TEXT,
        due_date TIMESTAMP,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    
    console.log("Creating student_payments table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_payments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES users(id),
        fee_id TEXT REFERENCES student_fees(id),
        amount DECIMAL NOT NULL,
        method TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        reference TEXT,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("All student tables created successfully!");
  } catch (error) {
    console.error("Error creating student tables:", error);
  } finally {
    await pool.end();
    console.log("Database connection closed");
  }
}

createStudentTables().catch(console.error);
