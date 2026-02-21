$content = Get-Content 'd:/Repo/WWM/xlsx_extracted/xl/worksheets/sheet1.xml' -Raw -Encoding UTF8

# Understand what EO6 represents: it's crit rate in permille (0-1000)?
# EO6 = EQ6 + ES6 + EU6 + EW6 + EY6 = 570 + 0 + 0 - 270 + 109.09 = 409.09
# EZ6 = FB6 + FD6 + FF6 + FH6 + FJ6 = 1800 + 0 + 0 - 270 + 218.18 = 1748.18
# Y6 formula references EO6 and EZ6 directly as numbers, not percentages
# So crit rate = 409/1000 = 40.9%? and crit dmg = 1748/1000 = 174.8%?
# Let's check the Y6 formula more carefully to understand EO6/EZ6 scale

# First check what FM6, FR6, FK6 are (for AA6)
Write-Host "=== AA6 input cells ==="
foreach ($cell in @('FM6','FR6','FK6','FT6','FV6','FO6','FQ6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Now look at N column (hit count)
Write-Host ""
Write-Host "=== N column cells ==="
$pattern = '<c r="N[0-9]+"[^>]*>.*?</c>'
$ms = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
foreach ($m in $ms) {
    if ($m.Value -match 'r="N(\d+)"') {
        $rowNum = [int]$Matches[1]
        if ($rowNum -ge 4 -and $rowNum -le 25) {
            Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length))
            Write-Host "---"
        }
    }
}

# Check HH6 components (outer multiplier 1)
Write-Host ""
Write-Host "=== HH6 components ==="
foreach ($cell in @('HJ6','HL6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check HM6 component (outer multiplier 2)
Write-Host ""
Write-Host "=== HM6 components ==="
foreach ($cell in @('HO6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check HC6, HE6, HG6 (HA6 components)
Write-Host ""
Write-Host "=== HA6 components ==="
foreach ($cell in @('HC6','HE6','HG6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check CN6, CP6, CR6 (components of CL6 = total crit rate before cap)
Write-Host ""
Write-Host "=== CL6 components (crit rate sources) ==="
foreach ($cell in @('CN6','CP6','CR6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# BN6, BP6, BR6, BT6, BV6 (components of BL6 = 外攻穿透)
Write-Host ""
Write-Host "=== BL6 components (outer pen 外攻穿透) ==="
foreach ($cell in @('BN6','BP6','BR6','BT6','BV6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# BY6, CA6 (components of BW6 = 外伤增加)
Write-Host ""
Write-Host "=== BW6 components (outer dmg boost 外伤增加) ==="
foreach ($cell in @('BY6','CA6')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}

# Check the AO4 label cell and neighbors
Write-Host ""
Write-Host "=== Row 4 column labels (from AO4 area) ==="
foreach ($cell in @('AO4','AK4','AL4','AM4','AN4','BL4','CB4','BW4','CG4','ED4','DF4','HA4','HH4','HM4')) {
    $pattern2 = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern2, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Write-Host "=== $cell ==="
    if ($m.Success) { Write-Host $m.Value.Substring(0, [Math]::Min(500, $m.Value.Length)) } else { Write-Host "NOT FOUND" }
}
