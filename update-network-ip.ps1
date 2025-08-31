Write-Host "🔍 Detecting Current Network IP Address..." -ForegroundColor Green
Write-Host ""

# Get the current IP address from the WiFi adapter
$ipConfig = ipconfig | Select-String "IPv4 Address"
$currentIP = ($ipConfig -split ":")[1].Trim()

if (-not $currentIP) {
    Write-Host "❌ Could not detect IP address" -ForegroundColor Red
    Write-Host "   Please check your network connection" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "📱 Current IP Address: $currentIP" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔄 Updating configuration files..." -ForegroundColor Yellow
Write-Host ""

# Update CORS configuration
Write-Host "   Updating config/cors.php..." -ForegroundColor Gray
$corsContent = Get-Content 'config/cors.php' -Raw
$corsContent = $corsContent -replace '10\.116\.255\.70', $currentIP
Set-Content 'config/cors.php' $corsContent

# Update Vite configuration
Write-Host "   Updating vite.config.js..." -ForegroundColor Gray
$viteContent = Get-Content 'vite.config.js' -Raw
$viteContent = $viteContent -replace '10\.116\.255\.70', $currentIP
Set-Content 'vite.config.js' $viteContent

# Update documentation
Write-Host "   Updating MOBILE_ACCESS_SETUP.md..." -ForegroundColor Gray
$docContent = Get-Content 'MOBILE_ACCESS_SETUP.md' -Raw
$docContent = $docContent -replace '10\.116\.255\.70', $currentIP
Set-Content 'MOBILE_ACCESS_SETUP.md' $docContent

Write-Host ""
Write-Host "✅ Configuration updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your app will now be accessible at:" -ForegroundColor Cyan
Write-Host "   - Local: http://localhost:8000" -ForegroundColor Yellow
Write-Host "   - Network: http://$currentIP:8000" -ForegroundColor Yellow
Write-Host "   - Vite Dev: http://$currentIP:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Clear config cache: php artisan config:clear" -ForegroundColor Blue
Write-Host ""

Read-Host "Press Enter to continue"
