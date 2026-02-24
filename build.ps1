# Build script: đóng gói lại plugin.zip từ source files
$ErrorActionPreference = "Stop"

$pluginDir   = "$PSScriptRoot\sangtacviet"
$outputZip   = "$pluginDir\plugin.zip"
$tempDir     = "$PSScriptRoot\_build_temp"

# Dọn temp cũ
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path "$tempDir\src" | Out-Null

# Copy file vào temp
Copy-Item "$pluginDir\plugin.json" "$tempDir\plugin.json"
Copy-Item "$pluginDir\icon.png"    "$tempDir\icon.png"
Copy-Item "$pluginDir\src\*"       "$tempDir\src\" -Recurse

# Xoá zip cũ rồi tạo mới
if (Test-Path $outputZip) { Remove-Item $outputZip -Force }
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip

# Dọn temp
Remove-Item -Recurse -Force $tempDir

Write-Host "✅ Build xong: $outputZip" -ForegroundColor Green
