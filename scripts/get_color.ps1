Add-Type -AssemblyName System.Drawing;
$bmp = New-Object System.Drawing.Bitmap 'c:\projects\pl2\public\logo.png';
$colors = @{};
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y);
        if ($pixel.A -eq 0) { continue; }
        if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) { continue; }
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B;
        if (-not $colors.ContainsKey($hex)) {
            $colors[$hex] = 0;
        }
        $colors[$hex]++;
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name): $($_.Value)"
}
