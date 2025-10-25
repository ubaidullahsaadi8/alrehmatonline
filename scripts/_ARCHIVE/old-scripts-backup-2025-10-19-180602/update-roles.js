const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    const result = await pool.query(`
      UPDATE course_instructors SET role = 'instructor' WHERE role IS NULL
    `);
    console.log('Updated records:', result.rowCount);
  } catch (error) {
    console.error('Error updating records:', error);
  } finally {
    await pool.end();
  }
}

main();