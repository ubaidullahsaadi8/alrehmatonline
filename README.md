# 🎓 HatBrain Learning Management System (LMS)

A comprehensive, full-stack Learning Management System built with Next.js, designed for educational institutions to manage courses, students, instructors, and financial operations.

---

## 📋 Table of Contents

1. [Installation](#-installation)
2. [Database Migration](#️-database-migration)
3. [Deployment](#-deployment)
4. [Project Overview](#-project-overview)
5. [Features](#-features)
6. [Tech Stack](#️-tech-stack)
7. [Project Structure](#-project-structure)

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (we recommend [Neon](https://neon.tech) for free hosting)
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_SECRET=your-random-secret-key-here
```

**Get DATABASE_URL:**
- Sign up at [Neon.tech](https://neon.tech) (free)
- Create a new project
- Copy the connection string

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Configure Admin Credentials

Edit `database/setup-admin.ts` (line 28):

```typescript
const ADMIN_CONFIG = {
  email: "your-email@example.com",    // Change this
  password: "YourStrongPass123!",     // Change this
  name: "Your Name",                  // Change this
  username: "yourusername",           // Change this
  currency: "USD"                     // Change if needed
}
```

---

## 🗄️ Database Migration

### Step 1: Run Migration

Create all 36 database tables:

```bash
npm run db:migrate
```

**What this does:**
- ✅ Creates all 36 tables
- ✅ Sets up 110+ performance indexes
- ✅ Configures 58+ foreign key relationships
- ✅ Creates default settings
- ✅ Creates default classes (HB1, HB2)

### Step 2: Setup Admin User

```bash
npm run setup:admin
```

**What this does:**
- Shows your configured credentials
- Asks for confirmation
- Creates admin user in database
- Displays login credentials

### Step 3: Start Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

### Step 4: Login

1. Open: `http://localhost:3000/login`
2. Enter your admin credentials
3. Click "Sign In"

⚠️ **Important:** Change your password after first login!

### Additional Commands

**Reset Database (⚠️ Deletes all data):**
```bash
npm run db:reset
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
   - Deploy!

3. **Run Migration on Production:**
   ```bash
   # After deployment, run migration
   npm run db:migrate
   npm run setup:admin
   ```

### Option 2: Manual Server

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set environment variables:**
   ```bash
   export DATABASE_URL="your_production_db_url"
   export NEXTAUTH_SECRET="your_secret"
   ```

3. **Run migrations:**
   ```bash
   npm run db:migrate
   npm run setup:admin
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t hatbrain-lms .
docker run -p 3000:3000 -e DATABASE_URL="..." hatbrain-lms
```

---

## 📖 Project Overview

### What is HatBrain LMS?

HatBrain is a complete Learning Management System designed for educational institutions. It provides a comprehensive platform for managing:

- **Students** - Enrollment, progress tracking, fee management
- **Instructors** - Course assignments, student management, salary tracking
- **Courses** - Creation, management, enrollment, scheduling
- **Classes** - Virtual and physical class management
- **Finances** - Fee collection, installments, payment tracking, instructor salaries
- **Services** - Additional educational services and bookings
- **Communication** - Messages, notifications, announcements

### Who is it for?

- **Educational Institutions** - Schools, colleges, training centers
- **Online Course Providers** - E-learning platforms
- **Coaching Centers** - Tutoring and coaching institutes
- **Corporate Training** - Employee training programs

---

## ✨ Features

### 👨‍🎓 Student Features

1. **Course Enrollment**
   - Browse available courses
   - Enroll in multiple courses
   - Track enrollment status
   - View course details and schedules

2. **Dashboard**
   - Personal dashboard with course overview
   - Upcoming classes and meetings
   - Fee payment status
   - Notifications and announcements

3. **Fee Management**
   - View fee structure
   - Track payment history
   - Installment plans
   - Payment receipts

4. **Classes & Meetings**
   - Virtual class links
   - Meeting schedules
   - Class recordings (if available)
   - Attendance tracking

5. **Communication**
   - Message instructors
   - Receive notifications
   - View announcements
   - Course-specific discussions

6. **Profile Management**
   - Update personal information
   - Change password
   - Upload profile picture
   - Set preferences

### 👨‍🏫 Instructor Features

1. **Course Management**
   - Create and manage courses
   - Set course details (price, duration, level)
   - Upload course materials
   - Track enrollments

2. **Student Management**
   - View enrolled students
   - Track student progress
   - Manage student fees
   - Send individual/group messages

3. **Class Scheduling**
   - Schedule classes and meetings
   - Set virtual meeting links
   - Manage class timings
   - Track attendance

4. **Financial Tracking**
   - View salary information
   - Track payments received
   - Monthly earnings reports
   - Payment history

5. **Communication**
   - Send messages to students
   - Course announcements
   - Notifications
   - Bulk messaging

6. **Dashboard**
   - Overview of assigned courses
   - Student count per course
   - Upcoming classes
   - Recent activities

### 👨‍💼 Admin Features

1. **User Management**
   - Create/Edit/Delete users
   - Approve instructor accounts
   - Manage user roles
   - View all users
   - Reset passwords

2. **Admin Management**
   - Add new admin users
   - Edit admin credentials
   - Update admin passwords
   - Delete admin accounts

3. **Course Management**
   - Approve/Reject courses
   - Assign instructors to courses
   - Set course pricing
   - Manage course categories
   - Featured courses

4. **Financial Management**
   - Fee plan creation
   - Installment management
   - Payment tracking
   - Instructor salary management
   - Financial reports
   - Bank details management

5. **Enrollment Management**
   - Approve/Reject enrollments
   - Manual enrollment
   - Transfer students
   - Track enrollment status

6. **Service Management**
   - Create services
   - Manage service bookings
   - Service requests handling
   - Meeting bookings

7. **Communication**
   - System-wide announcements
   - Send notifications
   - Message management
   - Testimonials management

8. **Analytics & Reports**
   - Dashboard with key metrics
   - Student statistics
   - Revenue reports
   - Course performance
   - Instructor performance

9. **Settings**
   - System settings
   - Organization details
   - Email configuration
   - Currency settings
   - Default values

### 🔔 Notification System

- Real-time notifications
- Email notifications (configurable)
- Notification categories:
  - Course updates
  - Payment reminders
  - Class schedules
  - System announcements
  - Messages
- Mark as read/unread
- Notification history

### 💰 Financial Features

1. **Fee Management**
   - Multiple fee plans
   - Installment options
   - Discount management
   - Late fee penalties
   - Payment tracking

2. **Payment Processing**
   - Multiple payment methods
   - Payment history
   - Receipt generation
   - Refund management

3. **Instructor Payments**
   - Salary calculation
   - Payment schedules
   - Payment history
   - Bonus/Deductions

4. **Financial Reports**
   - Revenue reports
   - Expense tracking
   - Profit/Loss statements
   - Monthly summaries

### 📧 Communication Features

1. **Messaging System**
   - Student-Instructor messaging
   - Admin-User messaging
   - Group messaging
   - Message history

2. **Notifications**
   - System notifications
   - Email notifications
   - Push notifications (future)
   - Notification preferences

3. **Announcements**
   - Course announcements
   - System-wide announcements
   - Targeted announcements

### 🎨 Additional Features

- **Responsive Design** - Works on all devices
- **Dark Mode** - Eye-friendly interface
- **Multi-Currency** - Support for different currencies
- **Multi-Language** - Ready for internationalization
- **Search & Filter** - Advanced search capabilities
- **Export Data** - Export reports to CSV/PDF
- **Backup System** - Automatic database backups
- **Security** - Role-based access control, encrypted passwords

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **State Management:** React Context

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Neon Serverless SQL
- **Authentication:** NextAuth.js
- **Password Hashing:** bcryptjs

### Database
- **Database:** PostgreSQL
- **Tables:** 36
- **Indexes:** 110+
- **Foreign Keys:** 58+
- **Hosting:** Neon (recommended)

### Development Tools
- **Language:** TypeScript
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Version Control:** Git

---

## 📁 Project Structure

```
hatbraintech/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/        # Admin APIs
│   │   ├── student/      # Student APIs
│   │   ├── teacher/      # Teacher APIs
│   │   └── auth/         # Authentication
│   ├── admin/            # Admin pages
│   ├── student/          # Student pages
│   ├── teacher/          # Teacher pages
│   └── (auth)/           # Auth pages
├── components/            # React components
│   ├── ui/               # UI components
│   ├── admin/            # Admin components
│   ├── student/          # Student components
│   └── teacher/          # Teacher components
├── database/              # Database files
│   ├── schema.sql        # Complete schema (36 tables)
│   ├── migrate.ts        # Migration script
│   ├── setup-admin.ts    # Admin setup
│   └── reset.ts          # Reset script
├── lib/                   # Utility functions
│   ├── session.ts        # Session management
│   └── utils.ts          # Helper functions
├── public/                # Static files
├── scripts/               # Utility scripts
│   └── _ARCHIVE/         # Archived scripts
└── .env                   # Environment variables
```

---

## 📊 Database Schema

### Tables Overview (36 Total)

**Core Tables (2):**
- `users` - User accounts and authentication
- `settings` - System settings

**Course Management (8):**
- `courses` - Course information
- `enrollments` - Student enrollments
- `student_courses` - Extended enrollment data
- `course_instructors` - Instructor assignments
- `student_enrollments` - Alternative enrollment tracking
- `user_courses` - Legacy enrollment system
- `course_notifications` - Course announcements
- `monthly_fees` - Monthly fee tracking

**Class Management (3):**
- `classes` - Class information
- `student_classes` - Student-class relationships
- `class_meetings` - Meeting schedules

**Financial Management (11):**
- `fee_plans` - Fee plan definitions
- `installments` - Installment schedules
- `course_installments` - Course-specific installments
- `payment_records` - Payment history
- `bank_details` - Bank account information
- `course_bank_details` - Course payment details
- `student_fees` - Student fee records
- `instructor_salary` - Instructor salary
- `instructor_payments` - Payment history

**Services & Bookings (6):**
- `services` - Available services
- `service_bookings` - Service bookings
- `service_requests` - Service inquiries
- `course_bookings` - Course booking requests
- `course_requests` - Course inquiries
- `meeting_bookings` - Meeting bookings

**Notifications & Messaging (5):**
- `notifications` - System notifications
- `instructor_notifications` - Instructor notifications
- `notification_reads` - Read status tracking
- `messages` - User messages
- `instructor_messages` - Instructor messages

**Communication (2):**
- `contact_messages` - Contact form messages
- `testimonials` - User testimonials

**Subscribers (1):**
- `subscribers` - Newsletter subscribers

---

## 🔐 Security Features

- **Password Hashing:** bcrypt with 10 rounds
- **Session Management:** Secure session handling
- **Role-Based Access:** Admin, Instructor, Student roles
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Input sanitization
- **CSRF Protection:** Built-in Next.js protection
- **Environment Variables:** Sensitive data protection

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check auth status

### Admin APIs
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/courses` - List courses
- `POST /api/admin/courses` - Create course
- `GET /api/admin/dashboard` - Dashboard stats

### Student APIs
- `GET /api/student/courses` - My courses
- `GET /api/student/fees` - My fees
- `GET /api/student/notifications` - My notifications
- `POST /api/student/messages` - Send message

### Teacher APIs
- `GET /api/teacher/courses` - My courses
- `GET /api/teacher/students` - My students
- `POST /api/teacher/messages` - Send message
- `GET /api/teacher/salary` - My salary

---

## 🤝 Contributing

This is a proprietary project. For any issues or feature requests, please contact the development team.

---

## 📄 License

Copyright © 2025 HatBrain. All rights reserved.

---

## 📞 Support

For support, please contact:
- Email: support@hatbrain.com
- Website: https://hatbrain.com

---

## 🎉 Credits

Developed with ❤️ by the HatBrain Team

---

**Version:** 1.0.0  
**Last Updated:** January 19, 2025  
**Status:** Production Ready ✅
