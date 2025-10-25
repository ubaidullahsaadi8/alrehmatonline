# HatBrain Database Documentation

## Overview

This directory contains the production-ready database schema and migration scripts for the HatBrain Learning Management System.

## Files

- **`schema.sql`** - Complete database schema with all tables, indexes, and relationships
- **`migrate.ts`** - Production migration script (safe to run multiple times)
- **`reset.ts`** - Development reset script (⚠️ deletes all data)
- **`README.md`** - This documentation file

## Quick Start

### First Time Setup

1. Make sure your `.env` file has the `DATABASE_URL` set:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

2. Run the migration:
   ```bash
   npm run db:migrate
   ```

3. The migration will:
   - ✅ Test database connection
   - ✅ Create backup of existing data
   - ✅ Create all tables and indexes
   - ✅ Seed default admin user
   - ✅ Verify all tables were created

### Default Admin Credentials

After migration, you can login with:
- **Email:** `admin@hatbrain.com`
- **Password:** `admin123`

⚠️ **Important:** Change the admin password immediately after first login!

## Database Schema

### Core Tables

#### Users
Main user authentication and profile management
- Supports multiple user types: `simple`, `student`, `instructor`
- Roles: `user`, `admin`
- Account status tracking and approval workflow

#### Courses
Course catalog and management
- Course details, pricing, and metadata
- Instructor assignment
- Featured courses support

#### Enrollments & Student Courses
Student-Course relationships (two tables for compatibility)
- `enrollments` - Basic enrollment tracking
- `student_courses` - Extended enrollment with meeting info
- Enrollment status tracking
- Progress monitoring
- Meeting links and schedules
- One student can enroll in multiple courses

#### Course Instructors
Instructor-Course assignments
- Multiple instructors per course support
- Role and status tracking
- Assignment history

#### Monthly Fees
Monthly fee tracking for enrolled students
- Linked to student course enrollments
- Monthly billing cycles
- Payment status and history
- Multi-currency support

### Class Management

#### Classes
Instructor-led classes
- Each instructor can create multiple classes
- Class descriptions and metadata

#### Student Classes
Student enrollment in classes
- Many-to-many relationship
- Status tracking (active/inactive)

#### Class Meetings
Scheduled online meetings
- Meeting links and scheduling
- Duration and description

### Financial Management

#### Student Fees
Monthly fee tracking for students
- Amount, due date, payment status
- Payment method and notes
- Unique per student per month

#### Instructor Salary
Monthly salary management for instructors
- Amount, payment status
- Payment tracking and notes

#### Instructor Payments
Payment history for instructors
- Multiple payment types support
- Reference and audit trail

### Services

#### Services
Service catalog
- Service descriptions and pricing
- Featured services support

#### Service Bookings
Customer service booking requests
- Contact information
- Scheduling and status tracking

### Communication

#### Instructor Notifications
Notifications sent by instructors
- Can target specific students or all students
- Class-specific or general notifications

#### Notification Reads
Track which students have read notifications
- Prevents duplicate notifications
- Read timestamp tracking

#### Contact Messages
Public contact form submissions
- Customer inquiries and messages

#### Testimonials
Customer testimonials and reviews
- Rating system
- Featured testimonials support

### System

#### Settings
Global system settings
- Organization name and branding
- Theme colors
- Single row configuration

## Commands

### Production Commands

```bash
# Run migration (safe to run multiple times)
npm run db:migrate

# This will:
# - Create all tables if they don't exist
# - Add indexes for performance
# - Seed default data
# - Verify everything is set up correctly
```

### Development Commands

```bash
# Reset database (⚠️ DELETES ALL DATA)
npm run db:reset

# Then run migration again
npm run db:migrate
```

## Migration Features

### ✅ Idempotent
- Safe to run multiple times
- Uses `CREATE TABLE IF NOT EXISTS`
- Skips existing tables and indexes

### ✅ Backup Creation
- Automatically backs up users table before migration
- Backup table named with timestamp

### ✅ Error Handling
- Comprehensive error messages
- Graceful handling of existing objects
- Detailed progress logging

### ✅ Verification
- Checks all critical tables exist
- Validates database connection
- Confirms successful migration

## Database Indexes

Indexes are created for optimal query performance:

- User lookups (email, username, user_type, role)
- Course searches (category, featured)
- Enrollment queries (student_id, course_id)
- Class management (instructor_id, student_id)
- Financial queries (status, due_date, payment_date)
- Notification queries (created_at, student_id)

## Relationships

### Foreign Keys

All relationships use foreign keys with appropriate cascade rules:

- `ON DELETE CASCADE` - Child records deleted when parent is deleted
- `ON DELETE SET NULL` - Foreign key set to NULL when parent is deleted

### Unique Constraints

- User email and username must be unique
- Student can only enroll in a course once
- Student can only join a class once
- One fee record per student per month
- One salary record per instructor per month

## Best Practices

### For Production Deployment

1. **Always backup** before running migrations
2. **Test migrations** in staging environment first
3. **Review schema.sql** before deployment
4. **Monitor migration** progress and logs
5. **Verify data** after migration completes

### For Development

1. Use `db:reset` to start fresh when needed
2. Keep `DATABASE_URL` in `.env` (never commit)
3. Test with sample data after migration
4. Document any schema changes

## Troubleshooting

### Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Migration Fails

1. Check DATABASE_URL is correct
2. Ensure database exists
3. Verify user has CREATE TABLE permissions
4. Check logs for specific error messages

### Table Already Exists

This is normal! The migration is idempotent and will skip existing tables.

### Missing Tables

If verification fails:
1. Check error logs
2. Manually inspect database
3. Run `db:reset` and `db:migrate` again

## Support

For issues or questions:
1. Check this README
2. Review error logs
3. Inspect `schema.sql` for table definitions
4. Contact development team

## Version History

### v1.0.0 (2025-01-19)
- Initial production-ready schema
- Complete migration system
- All core features implemented
- Comprehensive documentation

---

**Last Updated:** January 19, 2025  
**Schema Version:** 1.0.0  
**Status:** Production Ready ✅
