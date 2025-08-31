@echo off
echo 🧪 Testing Mobile Access Configuration...
echo.

echo 📱 Your Network Information:
echo    IP Address: 10.116.255.70
echo    Network: 10.116.255.0/24
echo.

echo 🔍 Testing Network Connectivity...
ping -n 1 10.116.255.191 >nul
if %errorlevel% equ 0 (
    echo ✅ Network connectivity: OK
) else (
    echo ❌ Network connectivity: FAILED
)

echo.
echo 🌐 Testing Port Availability...
netstat -an | findstr "0.0.0.0:8000" >nul
if %errorlevel% equ 0 (
    echo ✅ Port 8000 available on all interfaces
) else (
    echo ❌ Port 8000 not available on all interfaces
    echo    Current status: Only localhost (127.0.0.1:8000)
)

echo.
echo 📋 Next Steps:
echo    1. Stop current Laravel server (Ctrl+C)
echo    2. Run: npm run serve:network
echo    3. Test on mobile: http://10.116.255.70:8000
echo.

pause
