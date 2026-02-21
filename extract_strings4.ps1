[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$bytes = [System.IO.File]::ReadAllBytes('d:/Repo/WWM/xlsx_extracted/xl/sharedStrings.xml')
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$ms = [regex]::Matches($content, '<si>(.*?)</si>', [System.Text.RegularExpressions.RegexOptions]::Singleline)

# CS4=29(内暴率), DS4=31(内暴伤), CL4=28
# Also check I38=159(是/否), I30=153, I31=159 etc
$targetIndices = @(28, 29, 31, 153, 159)

Write-Host "=== Column label strings ==="
for ($i = 0; $i -lt $ms.Count; $i++) {
    if ($targetIndices -contains $i) {
        $text = $ms[$i].Groups[1].Value -replace '<[^>]+>', ''
        Write-Output ("[$i]: " + $text)
    }
}
