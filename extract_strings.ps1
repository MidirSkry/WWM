$content = Get-Content 'd:/Repo/WWM/xlsx_extracted/xl/sharedStrings.xml' -Raw -Encoding UTF8

# Extract shared strings by index (0-based)
# We need: 20(AK4?), 22(AK4), 23(AO4), 24(BL4), 25(BW4), 26(CB4), 27(CG4), 30(DF4), 32(ED4), 42(HA4), 43(HH4), 44(HM4)
# Also 50(N5 header), 53(Q5 header), 84(AW6 buff), 85(BA6 buff), 90(BT6 buff)

$ms = [regex]::Matches($content, '<si>(.*?)</si>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$targetIndices = @(20, 22, 23, 24, 25, 26, 27, 30, 32, 42, 43, 44, 50, 53, 84, 85, 90)

Write-Host "=== Shared Strings for column labels ==="
for ($i = 0; $i -lt $ms.Count; $i++) {
    if ($targetIndices -contains $i) {
        $text = $ms[$i].Groups[1].Value -replace '<[^>]+>', '' -replace '&#xA;', "`n"
        Write-Host "[$i]: $text"
    }
}
