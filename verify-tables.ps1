# Table Verification Script
Write-Host "=== SCHEMA TABLES ===" -ForegroundColor Cyan

$schemaContent = Get-Content "database\schema.sql" -Raw
$schemaTables = [regex]::Matches($schemaContent, 'CREATE TABLE IF NOT EXISTS ([a-z_]+)') | 
    ForEach-Object { $_.Groups[1].Value } | 
    Sort-Object -Unique

Write-Host "Total tables in schema: $($schemaTables.Count)" -ForegroundColor Green
$schemaTables | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

Write-Host "`n=== CODE USAGE ===" -ForegroundColor Cyan

# Get all table references from API files
$apiFiles = Get-ChildItem -Path "app\api" -Filter "*.ts" -Recurse
$tablesInCode = @{}

foreach ($file in $apiFiles) {
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content, 'FROM\s+([a-z_]+)\s')
    foreach ($match in $matches) {
        $table = $match.Groups[1].Value
        if ($tablesInCode.ContainsKey($table)) {
            $tablesInCode[$table]++
        } else {
            $tablesInCode[$table] = 1
        }
    }
}

Write-Host "Tables used in code: $($tablesInCode.Keys.Count)" -ForegroundColor Green
$tablesInCode.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    $inSchema = if ($schemaTables -contains $_.Key) { "✅" } else { "❌" }
    Write-Host "  $inSchema $($_.Key) - $($_.Value) uses" -ForegroundColor $(if ($schemaTables -contains $_.Key) { "Green" } else { "Red" })
}

Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan

# Check for tables in code but not in schema
$missingInSchema = $tablesInCode.Keys | Where-Object { $schemaTables -notcontains $_ }
if ($missingInSchema) {
    Write-Host "❌ Tables in code but NOT in schema:" -ForegroundColor Red
    $missingInSchema | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
} else {
    Write-Host "✅ All code tables are in schema!" -ForegroundColor Green
}

# Check for tables in schema but not used in code
$unusedInCode = $schemaTables | Where-Object { -not $tablesInCode.ContainsKey($_) }
if ($unusedInCode) {
    Write-Host "`n⚠️  Tables in schema but NOT used in code:" -ForegroundColor Yellow
    $unusedInCode | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Schema tables: $($schemaTables.Count)" -ForegroundColor White
Write-Host "Code tables: $($tablesInCode.Keys.Count)" -ForegroundColor White
Write-Host "Missing in schema: $($missingInSchema.Count)" -ForegroundColor $(if ($missingInSchema.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Unused in code: $($unusedInCode.Count)" -ForegroundColor Yellow
