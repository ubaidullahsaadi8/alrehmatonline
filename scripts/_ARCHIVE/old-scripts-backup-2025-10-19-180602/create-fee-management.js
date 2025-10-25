const { neon } = require('@neondatabase/serverless');

require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function createFeeManagementTables() {
  console.log('🔄 Creating fee management tables...');
  
  try {
    // Create fee_plans table
    console.log('Creating fee_plans table...');
    await sql`
      CREATE TABLE IF NOT EXISTS fee_plans (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fee_type VARCHAR(20) NOT NULL CHECK (fee_type IN ('monthly', 'full_course')),
        total_amount DECIMAL(10,2) NOT NULL,
        monthly_amount DECIMAL(10,2), -- For monthly fees
        installments_count INTEGER DEFAULT 1, -- For full course with installments
        installment_amount DECIMAL(10,2), -- Amount per installment for full course
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, course_id)
      )
    `;

    // Create payment_records table
    console.log('Creating payment_records table...');
    await sql`
      CREATE TABLE IF NOT EXISTS payment_records (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        fee_plan_id TEXT NOT NULL REFERENCES fee_plans(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('monthly', 'installment', 'full')),
        payment_method VARCHAR(50),
        transaction_id TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'failed')),
        due_date DATE,
        paid_date TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create installment_schedule table (for full course payments with installments)
    console.log('Creating installment_schedule table...');
    await sql`
      CREATE TABLE IF NOT EXISTS installment_schedule (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        fee_plan_id TEXT NOT NULL REFERENCES fee_plans(id) ON DELETE CASCADE,
        installment_number INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
        paid_date TIMESTAMP,
        payment_record_id TEXT REFERENCES payment_records(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create payment_history table (for audit trail)
    console.log('Creating payment_history table...');
    await sql`
      CREATE TABLE IF NOT EXISTS payment_history (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        fee_plan_id TEXT NOT NULL REFERENCES fee_plans(id) ON DELETE CASCADE,
        payment_record_id TEXT REFERENCES payment_records(id),
        student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'paid', 'overdue', 'cancelled'
        amount DECIMAL(10,2),
        previous_status VARCHAR(20),
        new_status VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_fee_plans_student_course ON fee_plans(student_id, course_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_fee_plans_instructor ON fee_plans(instructor_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_records_fee_plan ON payment_records(fee_plan_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_records_student ON payment_records(student_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_installment_schedule_fee_plan ON installment_schedule(fee_plan_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_installment_schedule_due_date ON installment_schedule(due_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_history_fee_plan ON payment_history(fee_plan_id)`;

    console.log('✅ Fee management tables created successfully!');

    // Add some sample fee data
    console.log('🔄 Adding sample fee data...');
    
    // Get sample data
    const students = await sql`SELECT id FROM users WHERE user_type = 'student' LIMIT 2`;
    const instructors = await sql`SELECT id FROM users WHERE user_type = 'instructor' LIMIT 1`;
    const courses = await sql`SELECT id FROM courses LIMIT 2`;

    if (students.length > 0 && instructors.length > 0 && courses.length > 0) {
      const studentId1 = students[0].id;
      const studentId2 = students.length > 1 ? students[1].id : students[0].id;
      const instructorId = instructors[0].id;
      const courseId1 = courses[0].id;
      const courseId2 = courses.length > 1 ? courses[1].id : courses[0].id;

      // Create a monthly fee plan
      const [monthlyFeePlan] = await sql`
        INSERT INTO fee_plans (student_id, course_id, instructor_id, fee_type, total_amount, monthly_amount, currency)
        VALUES (${studentId1}, ${courseId1}, ${instructorId}, 'monthly', 500.00, 50.00, 'USD')
        RETURNING id
      `;

      // Create a full course fee plan with installments
      const [fullCourseFeePlan] = await sql`
        INSERT INTO fee_plans (student_id, course_id, instructor_id, fee_type, total_amount, installments_count, installment_amount, currency)
        VALUES (${studentId2}, ${courseId2}, ${instructorId}, 'full_course', 1200.00, 3, 400.00, 'USD')
        RETURNING id
      `;

      // Create monthly payment record
      await sql`
        INSERT INTO payment_records (fee_plan_id, student_id, course_id, instructor_id, amount, payment_type, status, due_date)
        VALUES (${monthlyFeePlan.id}, ${studentId1}, ${courseId1}, ${instructorId}, 50.00, 'monthly', 'pending', CURRENT_DATE + INTERVAL '30 days')
      `;

      // Create installment schedule for full course
      const installmentDates = [
        'CURRENT_DATE + INTERVAL \'7 days\'',
        'CURRENT_DATE + INTERVAL \'37 days\'',
        'CURRENT_DATE + INTERVAL \'67 days\''
      ];

      for (let i = 0; i < 3; i++) {
        await sql`
          INSERT INTO installment_schedule (fee_plan_id, installment_number, amount, due_date)
          VALUES (${fullCourseFeePlan.id}, ${i + 1}, 400.00, ${installmentDates[i]})
        `;
      }

      console.log('✅ Sample fee data added successfully!');
    }

  } catch (error) {
    console.error('❌ Error creating fee management tables:', error);
  }
}

// Run the migration
createFeeManagementTables().then(() => {
  console.log('🎉 Fee management migration completed!');
  process.exit(0);
});