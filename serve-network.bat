@echo off
echo 🚀 Starting Smile Suite on Network for Mobile Access...
echo.
echo 📱 Your app will be accessible at:
echo    - Local: http://localhost:8000
echo    - Network: http://10.116.255.70:8000
echo    - Vite Dev: http://10.116.255.70:5173
echo.
echo ⚠️  Make sure your firewall allows connections on port 8000
echo.
echo 🔄 Starting Laravel server...
php artisan serve --host=0.0.0.0 --port=8000
pause
