const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function checkMeetingData() {
  const studentId = '98a92c53-6d0b-43b0-845f-373e8a5e18fc'; // student1
  const courseId = 'course_1759592846908_g8dtw';

  console.log('Checking meeting data...\n');

  try {
    // Check student_courses table
    console.log('1. Student enrollment with meeting data:');
    const enrollment = await sql`
      SELECT 
        id,
        student_id,
        course_id,
        status,
        meeting_link,
        meeting_date,
        meeting_time,
        updated_at
      FROM student_courses
      WHERE student_id = ${studentId}
      AND course_id = ${courseId}
    `;
    console.table(enrollment);

    // Check what the API query would return
    console.log('\n2. What the API query returns:');
    const apiResult = await sql`
      SELECT 
        sc.id as enrollment_id,
        sc.course_id,
        sc.meeting_link,
        sc.meeting_date,
        sc.meeting_time,
        c.title as course_title,
        c.category as course_category,
        c.instructor_id,
        u.name as instructor_name,
        u.avatar as instructor_avatar
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE sc.student_id = ${studentId}
      AND sc.status = 'active'
    `;
    console.table(apiResult);

    console.log(`\n✅ Found ${apiResult.length} meeting(s) for student`);
    
    if (apiResult.length === 0) {
      console.log('\n⚠️  No meetings found. Possible reasons:');
      console.log('   - Student enrollment status is not "active"');
      console.log('   - Meeting information not yet added by instructor');
      console.log('   - Course ID mismatch');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMeetingData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
