require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const fs = require('fs').promises;
const path = require('path');

async function addRoleColumn() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Add role column if it doesn't exist
    await sql`
      ALTER TABLE course_instructors 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'instructor'
    `;
    
    // Update existing records
    await sql`
      UPDATE course_instructors 
      SET role = 'instructor' 
      WHERE role IS NULL
    `;
    
    console.log('Successfully added role column to course_instructors table');
  } catch (error) {
    console.error('Error adding role column:', error);
    process.exit(1);
  }
}

addRoleColumn();