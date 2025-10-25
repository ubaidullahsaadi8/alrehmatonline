-- Create course_instructors table to assign courses to instructors
CREATE TABLE IF NOT EXISTS course_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- active, inactive
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, instructor_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_course_instructors_course_id ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor_id ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_status ON course_instructors(status);