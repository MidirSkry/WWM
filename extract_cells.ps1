$content = Get-Content 'd:/Repo/WWM/xlsx_extracted/xl/worksheets/sheet1.xml' -Raw

# Find all Q column cells
$pattern = '<c r="Q\d+"[^>]*>.*?</c>'
$ms = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "=== Q column cells ==="
foreach ($m in $ms) {
    Write-Host $m.Value.Substring(0, [Math]::Min(400, $m.Value.Length))
    Write-Host "---"
}

# Get all cells in row 6 to understand full structure
Write-Host ""
Write-Host "=== All Row 6 cells with formulas ==="
$row6pattern = '<row r="6"[^>]*>.*?</row>'
$row6 = [regex]::Match($content, $row6pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($row6.Success) {
    # Find all cells in this row that have formulas
    $cellPattern = '<c r="[A-Z]+6"[^>]*>.*?</c>'
    $cells = [regex]::Matches($row6.Value, $cellPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($c in $cells) {
        if ($c.Value -match '<f') {
            Write-Host $c.Value.Substring(0, [Math]::Min(500, $c.Value.Length))
            Write-Host "---"
        }
    }
}
