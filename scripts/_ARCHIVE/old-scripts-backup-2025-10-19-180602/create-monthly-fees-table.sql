-- Create monthly_fees table for tracking monthly fee payments

CREATE TABLE IF NOT EXISTS monthly_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_course_id UUID REFERENCES user_courses(id) ON DELETE CASCADE,
  month VARCHAR(20) NOT NULL, -- january, february, etc.
  year VARCHAR(4) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
  paid_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_course_id, month, year)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_fees_user_course ON monthly_fees(user_course_id);
CREATE INDEX IF NOT EXISTS idx_monthly_fees_status ON monthly_fees(status);
CREATE INDEX IF NOT EXISTS idx_monthly_fees_due_date ON monthly_fees(due_date);
