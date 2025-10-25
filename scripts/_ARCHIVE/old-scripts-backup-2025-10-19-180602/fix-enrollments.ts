import 'dotenv/config'
import { sql } from "../lib/db"

async function fixEnrollments() {
  try {
    console.log("🔧 Starting enrollment fixes...")

    // 1. Fix invalid statuses
    const invalidStatusFix = await sql`
      UPDATE student_courses
      SET status = 'pending'
      WHERE status NOT IN ('active', 'pending', 'completed', 'cancelled')
      RETURNING id, status
    `

    if (invalidStatusFix.length > 0) {
      console.log(`\n✅ Fixed ${invalidStatusFix.length} invalid status entries`)
    }

    // 2. Remove orphaned enrollments
    const orphanedFix = await sql`
      DELETE FROM student_courses sc
      WHERE NOT EXISTS (SELECT 1 FROM courses c WHERE c.id = sc.course_id)
      OR NOT EXISTS (SELECT 1 FROM users u WHERE u.id = sc.student_id)
      RETURNING id, course_id, student_id
    `

    if (orphanedFix.length > 0) {
      console.log(`\n✅ Removed ${orphanedFix.length} orphaned enrollments`)
    }

    // 3. Fix duplicate enrollments (keep the most recent active one)
    const duplicateFix = await sql`
      WITH duplicates AS (
        SELECT student_id, course_id
        FROM student_courses
        GROUP BY student_id, course_id
        HAVING COUNT(*) > 1
      ),
      ranked_enrollments AS (
        SELECT 
          sc.id,
          sc.student_id,
          sc.course_id,
          sc.status,
          ROW_NUMBER() OVER (
            PARTITION BY sc.student_id, sc.course_id 
            ORDER BY 
              CASE WHEN sc.status = 'active' THEN 0
                   WHEN sc.status = 'pending' THEN 1
                   ELSE 2 
              END,
              sc.enrollment_date DESC
          ) as rn
        FROM student_courses sc
        INNER JOIN duplicates d 
          ON sc.student_id = d.student_id 
          AND sc.course_id = d.course_id
      )
      DELETE FROM student_courses
      WHERE id IN (
        SELECT id 
        FROM ranked_enrollments 
        WHERE rn > 1
      )
      RETURNING id
    `

    if (duplicateFix.length > 0) {
      console.log(`\n✅ Fixed ${duplicateFix.length} duplicate enrollments`)
    }

    // 4. Fix payment inconsistencies
    const paymentFix = await sql`
      UPDATE student_courses
      SET 
        paid_amount = CASE 
          WHEN paid_amount IS NULL THEN 0
          WHEN paid_amount < 0 THEN 0
          WHEN paid_amount > total_fee THEN total_fee
          ELSE paid_amount
        END,
        total_fee = CASE
          WHEN total_fee IS NULL OR total_fee <= 0 THEN
            (SELECT price FROM courses WHERE id = course_id)
          ELSE total_fee
        END
      WHERE paid_amount IS NULL
        OR paid_amount < 0
        OR paid_amount > total_fee
        OR total_fee IS NULL
        OR total_fee <= 0
      RETURNING id, total_fee, paid_amount
    `

    if (paymentFix.length > 0) {
      console.log(`\n✅ Fixed ${paymentFix.length} payment inconsistencies`)
    }

    // 5. Update completion_date for completed courses that are missing it
    const completionDateFix = await sql`
      UPDATE student_courses
      SET completion_date = updated_at
      WHERE status = 'completed'
      AND completion_date IS NULL
      RETURNING id
    `

    if (completionDateFix.length > 0) {
      console.log(`\n✅ Added missing completion dates for ${completionDateFix.length} enrollments`)
    }

    // 6. Update all active enrollments without proper payment records
    const activeEnrollmentsFix = await sql`
      UPDATE student_courses
      SET status = 'pending'
      WHERE status = 'active'
      AND paid_amount = 0
      AND created_at < NOW() - INTERVAL '24 hours'
      RETURNING id
    `

    if (activeEnrollmentsFix.length > 0) {
      console.log(`\n✅ Updated ${activeEnrollmentsFix.length} unpaid active enrollments to pending`)
    }

    console.log("\n🎉 All fixes completed successfully!")

  } catch (error) {
    console.error("Error fixing enrollments:", error)
    throw error
  }
}

// Run the fixes
fixEnrollments().then(() => {
  console.log("\n✨ All fixes complete")
  process.exit(0)
}).catch(error => {
  console.error("Fatal error:", error)
  process.exit(1)
})