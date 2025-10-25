-- Add missing columns to users table for teacher profiles
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS meeting_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS student_messages BOOLEAN DEFAULT true;

-- Add missing columns to courses table for meetings
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS meeting_link TEXT,
ADD COLUMN IF NOT EXISTS meeting_date DATE,
ADD COLUMN IF NOT EXISTS meeting_time TEXT,
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS instructor_id TEXT,
ADD COLUMN IF NOT EXISTS meeting_description TEXT;

-- Create messages table for student-teacher communication
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    course_id TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create student_enrollments table for course enrollment tracking
CREATE TABLE IF NOT EXISTS student_enrollments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    enrolled_at TIMESTAMP DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    UNIQUE(student_id, course_id)
);

-- Create course_instructors table for instructor-course relationships
CREATE TABLE IF NOT EXISTS course_instructors (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    instructor_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(instructor_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_course_id ON messages(course_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_instructor_id ON student_enrollments(instructor_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_course_id ON student_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor_id ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course_id ON course_instructors(course_id);

-- Update existing notifications table to include sender information
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS sender_id TEXT,
ADD COLUMN IF NOT EXISTS sender_type TEXT DEFAULT 'system',
ADD COLUMN IF NOT EXISTS sender_name TEXT,
ADD COLUMN IF NOT EXISTS course_title TEXT;

-- Create foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Add foreign key constraints for messages table
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_sender_id_fkey') THEN
        ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_recipient_id_fkey') THEN
        ALTER TABLE messages ADD CONSTRAINT messages_recipient_id_fkey 
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_course_id_fkey') THEN
        ALTER TABLE messages ADD CONSTRAINT messages_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key constraints for student_enrollments table
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'student_enrollments_student_id_fkey') THEN
        ALTER TABLE student_enrollments ADD CONSTRAINT student_enrollments_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'student_enrollments_instructor_id_fkey') THEN
        ALTER TABLE student_enrollments ADD CONSTRAINT student_enrollments_instructor_id_fkey 
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'student_enrollments_course_id_fkey') THEN
        ALTER TABLE student_enrollments ADD CONSTRAINT student_enrollments_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key constraints for course_instructors table
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_instructors_instructor_id_fkey') THEN
        ALTER TABLE course_instructors ADD CONSTRAINT course_instructors_instructor_id_fkey 
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_instructors_course_id_fkey') THEN
        ALTER TABLE course_instructors ADD CONSTRAINT course_instructors_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
    END IF;
END $$;