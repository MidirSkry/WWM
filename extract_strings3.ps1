[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$bytes = [System.IO.File]::ReadAllBytes('d:/Repo/WWM/xlsx_extracted/xl/sharedStrings.xml')
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$ms = [regex]::Matches($content, '<si>(.*?)</si>', [System.Text.RegularExpressions.RegexOptions]::Singleline)

# All relevant string indices
# Row 4 headers: 15(A4),16(B4),17(F4),18(G4),19(M4) = skill columns
# Row 4: 16(EO4), 33(EZ4), 34(FK4), 35(FR4)
# Row 5 sub: 50(N5=次数), 51(O5), 54(S5),55(T5),56(U5), 57(AE5),58(AG5),59(AI5), 60(Y5),61(AA5),62(AC5)
$targetIndices = @(15,16,17,18,19,33,34,35,50,51,54,55,56,57,58,59,60,61,62)

Write-Host "=== More Shared Strings ==="
for ($i = 0; $i -lt $ms.Count; $i++) {
    if ($targetIndices -contains $i) {
        $text = $ms[$i].Groups[1].Value -replace '<[^>]+>', ''
        Write-Output ("[$i]: " + $text)
    }
}
