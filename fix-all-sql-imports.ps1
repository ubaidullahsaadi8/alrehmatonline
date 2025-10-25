# Fix all SQL imports to use lazy loading from lib/db

Write-Host "Fixing SQL imports in API routes..." -ForegroundColor Cyan
Write-Host ""

$files = @(
    "app\api\student\notifications\route.ts",
    "app\api\student\notifications\[id]\read\route.ts",
    "app\api\student\courses\[id]\route.ts",
    "app\api\student\meetings\route.ts",
    "app\api\student\courses\[id]\notifications\route.ts",
    "app\api\student\fees\route.ts",
    "app\api\teacher\courses\[id]\notifications\route.ts",
    "app\api\teacher\courses\[id]\meeting\route.ts",
    "app\api\debug\student-courses\route.ts",
    "app\api\admin\settings\admins\[id]\route.ts",
    "app\api\admin\settings\admins\route.ts"
)

$fixed = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace the import and const sql lines
        $newContent = $content -replace "import \{ neon \} from ['\`"]@neondatabase/serverless['\`"]", "import { sql } from '@/lib/db'"
        $newContent = $newContent -replace "import \{ neon \} from ['\`"]@/neondatabase/serverless['\`"]", "import { sql } from '@/lib/db'"
        $newContent = $newContent -replace "const sql = neon\(process\.env\.DATABASE_URL!\)", ""
        
        # Clean up extra blank lines
        $newContent = $newContent -replace "\n\n\n+", "`n`n"
        
        Set-Content $file $newContent -NoNewline
        Write-Host "[FIXED] $file" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "[NOT FOUND] $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Fixed: $fixed files" -ForegroundColor Green
Write-Host ""
Write-Host "All files now use: import { sql } from '@/lib/db'" -ForegroundColor Green
