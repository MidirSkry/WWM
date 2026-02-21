[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = [System.IO.File]::ReadAllText('d:/Repo/WWM/xlsx_extracted/xl/worksheets/sheet1.xml', [System.Text.Encoding]::UTF8)

# Look at all the key row 4 headers to understand what columns mean
Write-Host "=== Key row 4 column headers ==="
$row4cells = @('A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','N4','O4','P4','S4','T4','U4','V4','W4','X4','Y4','AA4','AC4','AE4','AG4','AI4','AK4','AO4','BL4','BW4','CB4','CG4','ED4','DF4','HA4','HH4','HM4','EO4','EZ4','FK4','FR4')
foreach ($cell in $row4cells) {
    $pattern = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($m.Success) {
        $val = $m.Value.Substring(0, [Math]::Min(300, $m.Value.Length))
        Write-Host ($cell + ": " + $val)
    }
}

# Now get Y5 (sub-header for Y column)
Write-Host ""
Write-Host "=== Row 5 sub-headers ==="
$row5cells = @('N5','O5','S5','T5','U5','Y5','AA5','AC5','AE5','AG5','AI5')
foreach ($cell in $row5cells) {
    $pattern = "<c r=""$cell""[^>]*>.*?</c>"
    $m = [regex]::Match($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($m.Success) {
        Write-Host ($cell + ": " + $m.Value.Substring(0, [Math]::Min(300, $m.Value.Length)))
    }
}

# Get the O49 formula - it has different structure (no HH, HM multipliers)
Write-Host ""
Write-Host "=== O49:O52 formula (different from O6:O25) ==="
$m = [regex]::Match($content, '<c r="O49"[^>]*>.*?</c>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host $m.Value

# Get Y49 formula
$m = [regex]::Match($content, '<c r="Y49"[^>]*>.*?</c>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "=== Y49 ==="
Write-Host $m.Value

# Get AA49 formula
$m = [regex]::Match($content, '<c r="AA49"[^>]*>.*?</c>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "=== AA49 ==="
Write-Host $m.Value

# Get AC49 formula
$m = [regex]::Match($content, '<c r="AC49"[^>]*>.*?</c>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "=== AC49 ==="
Write-Host $m.Value

# Check N3 (used in DPS formula N4 = INT(O53/N3))
Write-Host ""
Write-Host "=== N3 (duration/time base) ==="
$m = [regex]::Match($content, '<c r="N3"[^>]*>.*?</c>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host $m.Value

# Look at the shared formula index 5 in full (Y6 formula)
Write-Host ""
Write-Host "=== All shared formula definitions ==="
$sfms = [regex]::Matches($content, '<f t="shared" ref="[^"]*" si="\d+">[^<]*</f>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
foreach ($sf in $sfms) {
    Write-Host $sf.Value.Substring(0, [Math]::Min(600, $sf.Value.Length))
    Write-Host "---"
}
