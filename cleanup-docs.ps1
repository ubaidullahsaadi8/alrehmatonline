# Cleanup all documentation files except README.md

Write-Host "=== DOCUMENTATION CLEANUP ===" -ForegroundColor Cyan
Write-Host ""

$docsToDelete = @(
    "ADMIN_MANAGEMENT_FEATURE.md",
    "ADMIN_SETUP_README.md",
    "CLEANUP_COMPLETE.md",
    "CRITICAL_FIX_REPORT.md",
    "CURRENCY-README.md",
    "CUSTOM_INSTALLMENTS_FEATURE.md",
    "DEPLOYMENT.md",
    "ELEVENTH_ANALYSIS_SUPER_DEEP.md",
    "FIFTH_ANALYSIS_COMPLETE.md",
    "FINAL_VERIFICATION.md",
    "FOURTH_ANALYSIS_FINAL.md",
    "MIGRATION_CLEANUP_PLAN.md",
    "NINTH_ANALYSIS_FINAL.md",
    "PRODUCTION_READY.md",
    "PROJECT_FINAL_STATUS.md",
    "PROJECT_SUMMARY.md",
    "SCRIPTS_ANALYSIS.md",
    "SCRIPTS_CLEANUP_COMPLETE.md",
    "SETUP_GUIDE.md",
    "SEVENTH_FINAL_ANALYSIS.md",
    "SIXTH_ANALYSIS_DEEPDIVE.md",
    "START_HERE.md",
    "STUDENT_LOGIN_FIX.md",
    "TENTH_ANALYSIS_ABSOLUTE_FINAL.md",
    "TWELFTH_ANALYSIS_ULTIMATE.md",
    "password-fixes.md"
)

$deleted = 0

foreach ($doc in $docsToDelete) {
    if (Test-Path $doc) {
        Remove-Item $doc -Force
        Write-Host "[DELETED] $doc" -ForegroundColor Green
        $deleted++
    }
}

Write-Host ""
Write-Host "=== CLEANUP SUMMARY ===" -ForegroundColor Cyan
Write-Host "Deleted: $deleted documentation files" -ForegroundColor Green
Write-Host "Kept: README.md" -ForegroundColor Green
Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
