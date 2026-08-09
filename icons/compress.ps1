Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\Noman\Documents\GitHub\School-management-system\icons\icon-512.png")
$bmp = New-Object System.Drawing.Bitmap($img, 128, 128)
$bmp.Save("C:\Users\Noman\Documents\GitHub\School-management-system\icons\icon-small.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$bmp.Dispose()
$size = (Get-Item "C:\Users\Noman\Documents\GitHub\School-management-system\icons\icon-small.png").Length
Write-Output "Done! icon-small.png size: $size bytes ($([math]::Round($size/1024, 1)) KB)"
