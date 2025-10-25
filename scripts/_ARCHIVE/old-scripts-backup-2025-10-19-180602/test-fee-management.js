// Test fee management flow
require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function testFeeManagement() {
  try {
    const studentId = '529b6962-8cd9-4202-bc16-0dc52b11c3a5'
    const courseId = 'course_1759592846908_g8dtw'
    
    console.log('Testing Fee Management Flow')
    console.log('=' .repeat(50))
    
    // 1. Get student details with currency
    console.log('\n1. Getting student details...')
    const student = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.currency,
        uc.id as enrollment_id,
        uc.total_fee,
        uc.paid_amount,
        uc.due_date
      FROM users u
      INNER JOIN student_courses sc ON u.id = sc.student_id
      WHERE u.id = ${studentId} AND uc.course_id = ${courseId}
      LIMIT 1
    `
    
    if (student.length > 0) {
      console.log('✅ Student found:')
      console.log('   Name:', student[0].name)
      console.log('   Email:', student[0].email)
      console.log('   Currency:', student[0].currency || 'USD')
      console.log('   Total Fee:', student[0].total_fee)
      console.log('   Paid Amount:', student[0].paid_amount)
      console.log('   Remaining:', Number(student[0].total_fee) - Number(student[0].paid_amount))
    } else {
      console.log('❌ Student not found')
      return
    }
    
    // 2. Get payment history
    console.log('\n2. Getting payment history...')
    const payments = await sql`
      SELECT 
        cp.id,
        cp.amount,
        cp.payment_date,
        cp.payment_method,
        cp.reference,
        cp.notes
      FROM course_payments cp
      WHERE cp.user_course_id = ${student[0].enrollment_id}
      ORDER BY cp.payment_date DESC
    `
    
    console.log(`✅ Found ${payments.length} payment(s):`)
    payments.forEach((p, i) => {
      console.log(`   ${i+1}. ${student[0].currency || 'USD'} ${p.amount} - ${p.payment_method} - ${new Date(p.payment_date).toLocaleDateString()}`)
      if (p.reference) console.log(`      Reference: ${p.reference}`)
      if (p.notes) console.log(`      Notes: ${p.notes}`)
    })
    
    console.log('\n✅ Fee management structure is working correctly!')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

testFeeManagement()
