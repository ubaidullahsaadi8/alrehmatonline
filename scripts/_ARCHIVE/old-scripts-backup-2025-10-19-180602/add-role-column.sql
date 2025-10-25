-- Add role column to course_instructors table
ALTER TABLE course_instructors 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'instructor';

-- Update all existing records to have the default role
UPDATE course_instructors 
SET role = 'instructor' 
WHERE role IS NULL;