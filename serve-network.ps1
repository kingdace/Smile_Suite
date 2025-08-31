Write-Host "🚀 Starting Smile Suite on Network for Mobile Access..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your app will be accessible at:" -ForegroundColor Cyan
Write-Host "   - Local: http://localhost:8000" -ForegroundColor Yellow
Write-Host "   - Network: http://10.116.255.70:8000" -ForegroundColor Yellow
Write-Host "   - Vite Dev: http://10.116.255.70:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Make sure your firewall allows connections on port 8000" -ForegroundColor Red
Write-Host ""
Write-Host "🔄 Starting Laravel server..." -ForegroundColor Green
Write-Host ""

# Start Laravel server on all network interfaces
php artisan serve --host=0.0.0.0 --port=8000

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
