@echo off
echo 🔍 Detecting Current Network IP Address...
echo.

REM Get the current IP address from the WiFi adapter
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set "CURRENT_IP=%%a"
    goto :found_ip
)

:found_ip
REM Remove leading spaces
set "CURRENT_IP=%CURRENT_IP: =%"

echo 📱 Current IP Address: %CURRENT_IP%
echo.

if "%CURRENT_IP%"=="" (
    echo ❌ Could not detect IP address
    echo    Please check your network connection
    pause
    exit /b 1
)

echo 🔄 Updating configuration files...
echo.

REM Update CORS configuration
echo    Updating config/cors.php...
powershell -Command "(Get-Content 'config/cors.php') -replace '10\.116\.255\.70', '%CURRENT_IP%' | Set-Content 'config/cors.php'"

REM Update Vite configuration
echo    Updating vite.config.js...
powershell -Command "(Get-Content 'vite.config.js') -replace '10\.116\.255\.70', '%CURRENT_IP%' | Set-Content 'vite.config.js'"

REM Update documentation
echo    Updating MOBILE_ACCESS_SETUP.md...
powershell -Command "(Get-Content 'MOBILE_ACCESS_SETUP.md') -replace '10\.116\.255\.70', '%CURRENT_IP%' | Set-Content 'MOBILE_ACCESS_SETUP.md'"

echo.
echo ✅ Configuration updated successfully!
echo.
echo 📱 Your app will now be accessible at:
echo    - Local: http://localhost:8000
echo    - Network: http://%CURRENT_IP%:8000
echo    - Vite Dev: http://%CURRENT_IP%:5173
echo.
echo 🔄 Clear config cache: php artisan config:clear
echo.

pause
