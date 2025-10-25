import { PrismaClient } from '@prisma/client';
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.");
  process.exit(1);
}

console.log("DATABASE_URL is configured:", process.env.DATABASE_URL ? "YES" : "NO");
const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Adding instructor management tables...');

  try {
    
    await sql`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        instructor_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ classes table created or already exists');
    
    // Create student_classes table
    await sql`
      CREATE TABLE IF NOT EXISTS student_classes (
        id VARCHAR(255) PRIMARY KEY,
        student_id VARCHAR(255) NOT NULL,
        class_id VARCHAR(255) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        UNIQUE(student_id, class_id)
      )
    `;
    console.log('✅ student_classes table created or already exists');
    
    // Create class_meetings table
    await sql`
      CREATE TABLE IF NOT EXISTS class_meetings (
        id VARCHAR(255) PRIMARY KEY,
        class_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        meeting_link TEXT NOT NULL,
        meeting_date DATE NOT NULL,
        meeting_time VARCHAR(50) NOT NULL,
        duration INT DEFAULT 60,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ class_meetings table created or already exists');

    // Create instructor_salary table
    await sql`
      CREATE TABLE IF NOT EXISTS instructor_salary (
        id VARCHAR(255) PRIMARY KEY,
        instructor_id VARCHAR(255) NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_date TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(instructor_id, month, year)
      )
    `;
    console.log('✅ instructor_salary table created or already exists');

    // Create instructor_payments table
    await sql`
      CREATE TABLE IF NOT EXISTS instructor_payments (
        id VARCHAR(255) PRIMARY KEY,
        instructor_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reference VARCHAR(255),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ instructor_payments table created or already exists');
    
    // Create instructor_notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS instructor_notifications (
        id VARCHAR(255) PRIMARY KEY,
        instructor_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'message',
        send_to_all BOOLEAN DEFAULT false,
        class_id VARCHAR(255),
        student_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ instructor_notifications table created or already exists');

    // Check if there are any instructors in the database
    const instructors = await sql`
      SELECT id, name, email FROM users WHERE user_type = 'instructor' LIMIT 5
    `;
    
    if (instructors.length === 0) {
      console.log("No instructors found in database. Creating a test instructor...");
      
      // Create a test instructor
      const instructorId = crypto.randomUUID();
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      await sql`
        INSERT INTO users (
          id, email, password, name, username, user_type, role, 
          account_status, is_approved, active, created_at, updated_at,
          currency, country, education
        )
        VALUES (
          ${instructorId}, 
          'instructor@example.com', 
          ${hashedPassword}, 
          'Test Instructor', 
          'testinstructor', 
          'instructor', 
          'user', 
          'pending', 
          false, 
          false, 
          CURRENT_TIMESTAMP, 
          CURRENT_TIMESTAMP,
          'USD',
          'United States',
          'PhD in Education'
        )
      `;
      console.log("✅ Test instructor created with email: instructor@example.com and password: test123");
    } else {
      console.log(`Found ${instructors.length} instructors in database:`, 
        instructors.map(i => `${i.name} (${i.email})`).join(', '));
    }
    
    console.log('Instructor management tables setup complete');
  } catch (error) {
    console.error('Error creating instructor management tables:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    
  });
