# SAFE Scripts Cleanup - Archives instead of deleting

Write-Host "=== SAFE SCRIPTS CLEANUP ===" -ForegroundColor Cyan
Write-Host "This will ARCHIVE (not delete) old scripts" -ForegroundColor Yellow
Write-Host ""

# Create archive directory
$archiveDir = "_ARCHIVE\old-scripts-backup-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
Write-Host "Creating archive directory: $archiveDir" -ForegroundColor Cyan

if (-not (Test-Path "_ARCHIVE")) {
    New-Item -ItemType Directory -Path "_ARCHIVE" | Out-Null
}

New-Item -ItemType Directory -Path $archiveDir | Out-Null

# Files to KEEP (do not archive)
$keepFiles = @(
    "tsconfig.json",
    "_ARCHIVE",
    "safe-cleanup.ps1",
    "CLEANUP_BACKUP_PLAN.md"
)

# Get all items in scripts folder
$allItems = Get-ChildItem -Path "." -Force

$archived = 0
$kept = 0

foreach ($item in $allItems) {
    $shouldKeep = $false
    
    foreach ($keepFile in $keepFiles) {
        if ($item.Name -eq $keepFile) {
            $shouldKeep = $true
            break
        }
    }
    
    if ($shouldKeep) {
        Write-Host "[KEEP] $($item.Name)" -ForegroundColor Green
        $kept++
    } else {
        try {
            Move-Item -Path $item.FullName -Destination $archiveDir -Force
            Write-Host "[ARCHIVED] $($item.Name)" -ForegroundColor Yellow
            $archived++
        } catch {
            Write-Host "[ERROR] Failed to archive $($item.Name)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== CLEANUP SUMMARY ===" -ForegroundColor Cyan
Write-Host "Archived: $archived files" -ForegroundColor Yellow
Write-Host "Kept: $kept files" -ForegroundColor Green
Write-Host ""
Write-Host "Archive location: $archiveDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== ROLLBACK INSTRUCTIONS ===" -ForegroundColor Yellow
Write-Host "To restore files, run:" -ForegroundColor Yellow
Write-Host "Move-Item '$archiveDir\*' '.' -Force" -ForegroundColor White
Write-Host ""
Write-Host "Cleanup complete! All files safely archived." -ForegroundColor Green
