# Extract all unique table names from API routes
$apiFiles = Get-ChildItem -Path "app\api" -Filter "*.ts" -Recurse
$tablesInCode = @{}

foreach ($file in $apiFiles) {
    $content = Get-Content $file.FullName | Out-String
    
    
    # Extract table names from SQL queries
    $patterns = @(
        'FROM\s+([a-z_]+)',
        'INTO\s+([a-z_]+)',
        'UPDATE\s+([a-z_]+)',
        'JOIN\s+([a-z_]+)'
    )
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            $table = $match.Groups[1].Value
            if ($table -and $table -ne 'information_schema' -and $table -ne 'pg_catalog') {
                if ($tablesInCode.ContainsKey($table)) {
                    $tablesInCode[$table]++
                } else {
                    $tablesInCode[$table] = 1
                }
            }
        }
    }
}

# Extract tables from schema.sql
$schemaContent = Get-Content "database\schema.sql" | Out-String
$schemaTables = [regex]::Matches($schemaContent, 'CREATE TABLE IF NOT EXISTS ([a-z_]+)') | 
    ForEach-Object { $_.Groups[1].Value } | 
    Sort-Object -Unique

Write-Host "=== SCHEMA TABLES ===" -ForegroundColor Cyan
Write-Host "Total: $($schemaTables.Count)" -ForegroundColor Green
$schemaTables | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== CODE TABLES ===" -ForegroundColor Cyan
Write-Host "Total: $($tablesInCode.Keys.Count)" -ForegroundColor Green
$tablesInCode.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    $inSchema = if ($schemaTables -contains $_.Key) { "[OK]" } else { "[MISS]" }
    Write-Host "  $inSchema $($_.Key) - $($_.Value) uses"
}

Write-Host "`n=== MISSING IN SCHEMA ===" -ForegroundColor Red
$missing = $tablesInCode.Keys | Where-Object { $schemaTables -notcontains $_ -and $_ -ne 'pg_tables' }
if ($missing) {
    $missing | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
} else {
    Write-Host "  None! ✓" -ForegroundColor Green
}

Write-Host "`n=== UNUSED IN CODE ===" -ForegroundColor Yellow
$unused = $schemaTables | Where-Object { -not $tablesInCode.ContainsKey($_) }
if ($unused) {
    $unused | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
} else {
    Write-Host "  None! ✓" -ForegroundColor Green
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Schema tables: $($schemaTables.Count)"
Write-Host "Code tables: $($tablesInCode.Keys.Count)"
Write-Host "Missing: $(($missing | Measure-Object).Count)"
Write-Host "Unused: $(($unused | Measure-Object).Count)"
