# Migration Files Cleanup Script

Write-Host "=== MIGRATION FILES CLEANUP ===" -ForegroundColor Cyan
Write-Host ""

$itemsToDelete = @(
    "app\api\migrations",
    "migrations",
    "scripts\migrations",
    "prisma\migrations",
    "scripts\apply-installments-migration.js",
    "scripts\apply-migration.js",
    "scripts\apply-migration.sh",
    "scripts\apply-student-courses-migration.js",
    "scripts\run-meeting-migration.js",
    "scripts\run-migration.ts",
    "scripts\run-migrations.sh",
    "scripts\run-teacher-student-migration.js"
)

$deleted = 0
$notFound = 0

foreach ($item in $itemsToDelete) {
    if (Test-Path $item) {
        try {
            Remove-Item -Path $item -Recurse -Force -ErrorAction Stop
            Write-Host "[DELETED] $item" -ForegroundColor Green
            $deleted++
        } catch {
            Write-Host "[ERROR] Failed to delete $item" -ForegroundColor Red
        }
    } else {
        Write-Host "[NOT FOUND] $item" -ForegroundColor Yellow
        $notFound++
    }
}

Write-Host ""
Write-Host "=== CLEANUP SUMMARY ===" -ForegroundColor Cyan
Write-Host "Deleted: $deleted" -ForegroundColor Green
Write-Host "Not Found: $notFound" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== REMAINING MIGRATION FILES ===" -ForegroundColor Cyan
Write-Host "[KEEP] database/migrate.ts" -ForegroundColor Green
Write-Host "[KEEP] database/setup-admin.ts" -ForegroundColor Green
Write-Host "[KEEP] database/reset.ts" -ForegroundColor Green
Write-Host "[KEEP] database/schema.sql" -ForegroundColor Green
Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
