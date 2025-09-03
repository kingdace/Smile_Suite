@echo off
echo Network IP Detection and Configuration Update
echo =============================================
echo.

echo Detecting your current network IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set "ip=%%a"
    goto :found
)

:found
if "%ip%"=="" (
    echo Could not detect IP address automatically.
    echo Please enter your IP address manually:
    set /p ip="Enter your IP address (e.g., 192.168.1.100): "
)

set "ip=%ip: =%"
echo.
echo Using IP Address: %ip%
echo.

echo Updating configuration files...

REM Update CORS configuration
echo   Updating CORS configuration...
powershell -Command "(Get-Content 'config/cors.php') -replace 'http://[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:5173', 'http://%ip%:5173' | Set-Content 'config/cors.php'"
powershell -Command "(Get-Content 'config/cors.php') -replace 'http://[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:8000', 'http://%ip%:8000' | Set-Content 'config/cors.php'"

REM Update Vite configuration
echo   Updating Vite configuration...
powershell -Command "(Get-Content 'vite.config.js') -replace 'host: \"[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\"', 'host: \"%ip%\"' | Set-Content 'vite.config.js'"

REM Update documentation
echo   Updating documentation...
powershell -Command "(Get-Content 'MOBILE_ACCESS_SETUP.md') -replace '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+', '%ip%' | Set-Content 'MOBILE_ACCESS_SETUP.md'"

echo.
echo Configuration update completed!
echo.
echo Your app will now be accessible at:
echo   Local: http://localhost:8000
echo   Network: http://%ip%:8000
echo   Vite Dev: http://%ip%:5173
echo.
echo Next steps:
echo   1. Run: php artisan config:clear
echo   2. Start servers: npm run serve:network ^&^& npm run dev:network
echo.

pause
