[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$bytes = [System.IO.File]::ReadAllBytes('d:/Repo/WWM/xlsx_extracted/xl/sharedStrings.xml')
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$ms = [regex]::Matches($content, '<si>(.*?)</si>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$targetIndices = @(20, 22, 23, 24, 25, 26, 27, 30, 32, 42, 43, 44, 50, 53, 84, 85, 90)
for ($i = 0; $i -lt $ms.Count; $i++) {
    if ($targetIndices -contains $i) {
        $text = $ms[$i].Groups[1].Value -replace '<[^>]+>', ''
        Write-Output "[$i]: $text"
    }
}
