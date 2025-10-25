Write-Host "Fixing all SQL imports..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "app\api" -Filter "*.ts" -Recurse
$fixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -like "*const sql = neon(process.env.DATABASE_URL!)*") {
        # Replace neon import with sql import
        $content = $content -replace "import \{ neon \} from ['\`"]@neondatabase/serverless['\`"]", "import { sql } from '@/lib/db'"
        
        # Remove const sql line
        $content = $content -replace "const sql = neon\(process\.env\.DATABASE_URL!\)", ""
        
        # Clean up extra newlines
        $content = $content -replace "`r`n`r`n`r`n+", "`r`n`r`n"
        
        Set-Content $file.FullName $content -NoNewline
        Write-Host "[FIXED] $($file.FullName)" -ForegroundColor Green
        $fixed++
    }
}

Write-Host ""
Write-Host "Fixed $fixed files" -ForegroundColor Green
