# PowerShell script to move old migration files to archive folder
# This keeps the project clean and professional

Write-Host "🧹 Cleaning up old migration scripts..." -ForegroundColor Cyan

# Create archive directory if it doesn't exist
$archiveDir = "scripts\_ARCHIVE"
if (-not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
}

# List of old scripts to archive
$oldScripts = @(
    "add-admin-user.ts",
    "add-currency-column.ts",
    "add-phone-field.ts",
    "add-role-column.ts",
    "add-role-prisma.ts",
    "add-service-forms.ts",
    "analyze-enrollments.ts",
    "assign-to-teacher.ts",
    "backup-enrollments.ts",
    "check-all-users.ts",
    "check-instructors.ts",
    "check-sara-enrollment.ts",
    "check-user-type.ts",
    "create-course-instructors-table.ts",
    "create-instructor-tables.ts",
    "create-monthly-fees-simple.ts",
    "create-notification-reads-table.ts",
    "create-notifications-table.ts",
    "create-service-bookings-table.ts",
    "create-service-requests-table.ts",
    "create-student-tables.ts",
    "create-test-instructor.ts",
    "debug-meetings.ts",
    "execute-sql.ts",
    "fix-enrollments.ts",
    "fix-sara-student.ts",
    "init-database.ts",
    "init-db-course-forms.ts",
    "migrate-user-schema.ts",
    "run-migration.ts",
    "seed-courses-services.ts",
    "seed-data.ts",
    "seed-user-management.ts",
    "set-student-password.ts",
    "setup-db.ts",
    "test-course-assignment.ts",
    "test-student-email.ts",
    "test-student-login.ts",
    "test-teacher-api.ts",
    "update-course-instructors-role.ts",
    "update-database-v1.ts",
    "update-test-messages.ts"
)

$movedCount = 0

# Move each file to archive
foreach ($script in $oldScripts) {
    $sourcePath = "scripts\$script"
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $archiveDir -Force
        Write-Host "✅ Archived: $script" -ForegroundColor Green
        $movedCount++
    }
}

# Move migrations folder if exists
$migrationsFolder = "scripts\migrations"
if (Test-Path $migrationsFolder) {
    Move-Item -Path $migrationsFolder -Destination $archiveDir -Force
    Write-Host "✅ Archived: migrations folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Old scripts moved to: scripts\_ARCHIVE\" -ForegroundColor Yellow
Write-Host "🚀 Production migration: npm run db:migrate" -ForegroundColor Cyan
Write-Host "📊 Total files archived: $movedCount" -ForegroundColor Blue
Write-Host ""
