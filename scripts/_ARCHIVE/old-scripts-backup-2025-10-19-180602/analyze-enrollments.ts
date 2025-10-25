import 'dotenv/config'
import { sql } from "../lib/db"

async function analyzeEnrollments() {
  try {
    console.log("🔍 Analyzing course enrollments...")

    // 1. Check total enrollments vs active enrollments
    const enrollmentStats = await sql`
      SELECT 
        course_id,
        COUNT(*) as total_enrollments,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_enrollments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_enrollments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_enrollments,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_enrollments,
        COUNT(CASE WHEN status NOT IN ('active', 'pending', 'completed', 'cancelled') THEN 1 END) as invalid_status
      FROM student_courses
      GROUP BY course_id
    `

    console.log("\n📊 Enrollment Statistics by Course:")
    for (const stat of enrollmentStats) {
      console.log(`\nCourse ID: ${stat.course_id}`)
      console.log(`- Total Enrollments: ${stat.total_enrollments}`)
      console.log(`- Active: ${stat.active_enrollments}`)
      console.log(`- Pending: ${stat.pending_enrollments}`)
      console.log(`- Completed: ${stat.completed_enrollments}`)
      console.log(`- Cancelled: ${stat.cancelled_enrollments}`)
      if (stat.invalid_status > 0) {
        console.log(`⚠️ Invalid Status Count: ${stat.invalid_status}`)
      }
    }

    // 2. Check for orphaned enrollments (no valid course or student)
    const orphanedEnrollments = await sql`
      SELECT sc.id, sc.course_id, sc.student_id
      FROM student_courses sc
      LEFT JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON sc.student_id = u.id
      WHERE c.id IS NULL OR u.id IS NULL
    `

    if (orphanedEnrollments.length > 0) {
      console.log("\n⚠️ Found orphaned enrollments:")
      for (const enrollment of orphanedEnrollments) {
        console.log(`- Enrollment ID: ${enrollment.id} (Course: ${enrollment.course_id}, Student: ${enrollment.student_id})`)
      }
    } else {
      console.log("\n✅ No orphaned enrollments found")
    }

    // 3. Check for duplicate enrollments
    const duplicateEnrollments = await sql`
      SELECT student_id, course_id, COUNT(*) as count
      FROM student_courses
      GROUP BY student_id, course_id
      HAVING COUNT(*) > 1
    `

    if (duplicateEnrollments.length > 0) {
      console.log("\n⚠️ Found duplicate enrollments:")
      for (const dup of duplicateEnrollments) {
        console.log(`- Student ${dup.student_id} in course ${dup.course_id} (${dup.count} times)`)
      }
    } else {
      console.log("\n✅ No duplicate enrollments found")
    }

    // 4. Check for inconsistent payment data
    const paymentInconsistencies = await sql`
      SELECT 
        id,
        course_id,
        student_id,
        total_fee,
        paid_amount,
        status
      FROM student_courses
      WHERE (paid_amount > total_fee)
        OR (paid_amount < 0)
        OR (total_fee <= 0)
        OR (total_fee IS NULL)
        OR (paid_amount IS NULL)
    `

    if (paymentInconsistencies.length > 0) {
      console.log("\n⚠️ Found payment inconsistencies:")
      for (const inc of paymentInconsistencies) {
        console.log(`- Enrollment ID: ${inc.id}`)
        console.log(`  Course: ${inc.course_id}, Student: ${inc.student_id}`)
        console.log(`  Total Fee: ${inc.total_fee}, Paid: ${inc.paid_amount}`)
      }
    } else {
      console.log("\n✅ No payment inconsistencies found")
    }

  } catch (error) {
    console.error("Error analyzing enrollments:", error)
  }
}

// Run the analysis
analyzeEnrollments().then(() => {
  console.log("\n✨ Analysis complete")
  process.exit(0)
}).catch(error => {
  console.error("Fatal error:", error)
  process.exit(1)
})