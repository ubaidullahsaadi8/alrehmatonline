const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function createStudent(email, name, password) {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await sql`
      INSERT INTO users (
        id,
        email,
        name,
        password,
        user_type,
        created_at,
        updated_at
      ) VALUES (
        ${crypto.randomUUID()},
        ${email},
        ${name},
        ${hashedPassword},
        'student',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING id, email, name
    `;

    console.log('Successfully created student:', user[0]);
    return user[0];

  } catch (error) {
    console.error('Error creating student:', error);
  }
}

// Get command line arguments
const email = process.argv[2];
const name = process.argv[3] || email.split('@')[0];
const password = process.argv[4] || 'password123';

if (!email) {
  console.error('Usage: node create-student.js <email> [name] [password]');
  process.exit(1);
}

createStudent(email, name, password);