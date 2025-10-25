-- Create course_requests table
CREATE TABLE IF NOT EXISTS course_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  course_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_requests_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create course_bookings table
CREATE TABLE IF NOT EXISTS course_bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  course_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_bookings_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
