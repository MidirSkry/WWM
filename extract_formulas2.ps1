$content = Get-Content 'd:/Repo/WWM/xlsx_extracted/xl/worksheets/sheet1.xml' -Raw -Encoding UTF8

# Get all O column cells (O6:O52)
Write-Host "=== O column cells O6:O52 ==="
$pattern = '<c r="O[0-9]+"[^>]*>.*?</c>'
$ms = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
foreach ($m in $ms) {
    if ($m.Value -match 'r="O(\d+)"') {
        $rowNum = [int]$Matches[1]
        if ($rowNum -ge 6 -and $rowNum -le 55) {
            Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length))
            Write-Host "---"
        }
    }
}

# Check specific inputs: CL6, CS6, DS6, D8, D11
Write-Host ""
Write-Host "=== AK6 inputs (CL6, CS6, DS6, D8, D11) ==="
foreach ($cell in @('CL6','CS6','DS6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Get D8 and D11 (these are absolute refs $D$8, $D$11)
foreach ($cell in @('D8','D11')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check the AO6 component cells: AQ6, AS6, AU6, AW6, AY6, BA6, BC6, BE6, BG6, BI6, BK6, R6
Write-Host ""
Write-Host "=== AO6 component cells ==="
foreach ($cell in @('AQ6','AS6','AU6','AW6','AY6','BA6','BC6','BE6','BG6','BI6','BK6','R6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check EQ6, ES6, EU6, EW6, EY6 (components of EO6 = base crit rate)
Write-Host ""
Write-Host "=== EO6 components (base crit rate) ==="
foreach ($cell in @('EQ6','ES6','EU6','EW6','EY6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check FB6, FD6, FF6, FH6, FJ6 (components of EZ6 = crit dmg)
Write-Host ""
Write-Host "=== EZ6 components (crit dmg) ==="
foreach ($cell in @('FB6','FD6','FF6','FH6','FJ6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}
