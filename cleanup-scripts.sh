#!/bin/bash
# Script to move old migration files to archive folder
# This keeps the project clean and professional

echo "🧹 Cleaning up old migration scripts..."

# Create archive directory if it doesn't exist
mkdir -p scripts/_ARCHIVE

# List of old scripts to archive
OLD_SCRIPTS=(
  "add-admin-user.ts"
  "add-currency-column.ts"
  "add-phone-field.ts"
  "add-role-column.ts"
  "add-role-prisma.ts"
  "add-service-forms.ts"
  "analyze-enrollments.ts"
  "assign-to-teacher.ts"
  "backup-enrollments.ts"
  "check-all-users.ts"
  "check-instructors.ts"
  "check-sara-enrollment.ts"
  "check-user-type.ts"
  "create-course-instructors-table.ts"
  "create-instructor-tables.ts"
  "create-monthly-fees-simple.ts"
  "create-notification-reads-table.ts"
  "create-notifications-table.ts"
  "create-service-bookings-table.ts"
  "create-service-requests-table.ts"
  "create-student-tables.ts"
  "create-test-instructor.ts"
  "debug-meetings.ts"
  "execute-sql.ts"
  "fix-enrollments.ts"
  "fix-sara-student.ts"
  "init-database.ts"
  "init-db-course-forms.ts"
  "migrate-user-schema.ts"
  "run-migration.ts"
  "seed-courses-services.ts"
  "seed-data.ts"
  "seed-user-management.ts"
  "set-student-password.ts"
  "setup-db.ts"
  "test-course-assignment.ts"
  "test-student-email.ts"
  "test-student-login.ts"
  "test-teacher-api.ts"
  "update-course-instructors-role.ts"
  "update-database-v1.ts"
  "update-test-messages.ts"
)

# Move each file to archive
for script in "${OLD_SCRIPTS[@]}"; do
  if [ -f "scripts/$script" ]; then
    mv "scripts/$script" "scripts/_ARCHIVE/"
    echo "✅ Archived: $script"
  fi
done

# Move migrations folder if exists
if [ -d "scripts/migrations" ]; then
  mv "scripts/migrations" "scripts/_ARCHIVE/"
  echo "✅ Archived: migrations folder"
fi

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "📁 Old scripts moved to: scripts/_ARCHIVE/"
echo "🚀 Production migration: npm run db:migrate"
echo ""
