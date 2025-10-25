require('dotenv').config();
const { Pool } = require('pg');

async function checkTestimonialsTable() {
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connected to the database successfully!");

    
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'testimonials'
      );
    `;
    const tableExistsResult = await pool.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0].exists;

    if (tableExists) {
      console.log("✅ Testimonials table exists");

      
      const tableSchemaQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials'
        ORDER BY ordinal_position;
      `;
      const tableSchemaResult = await pool.query(tableSchemaQuery);
      console.log("✅ Testimonials table schema:");
      console.table(tableSchemaResult.rows);

      
      const countQuery = `SELECT COUNT(*) FROM testimonials;`;
      const countResult = await pool.query(countQuery);
      console.log(`✅ Total testimonials: ${countResult.rows[0].count}`);

      
      if (parseInt(countResult.rows[0].count) > 0) {
        const sampleQuery = `SELECT * FROM testimonials LIMIT 5;`;
        const sampleResult = await pool.query(sampleQuery);
        console.log("✅ Sample testimonials:");
        console.table(sampleResult.rows);
      } else {
        console.log("❌ No testimonials found in the table");
      }
    } else {
      console.log("❌ Testimonials table does not exist");
    }

  } catch (error) {
    console.error("Error checking testimonials table:", error);
  } finally {
    
    await pool.end();
    console.log("Database connection closed");
  }
}

checkTestimonialsTable();
