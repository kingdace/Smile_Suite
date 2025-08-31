@echo off
echo 🧪 Complete Mobile Access Test
echo ================================
echo.

echo 📱 Network Information:
echo    Your IP: 10.116.255.70
echo    Laravel Port: 8000
echo    Vite Port: 5173
echo.

echo 🔍 Testing Server Status...
echo.

echo 1. Laravel Server (Port 8000):
netstat -an | findstr "0.0.0.0:8000" >nul
if %errorlevel% equ 0 (
    echo    ✅ Laravel running on all interfaces
) else (
    echo    ❌ Laravel NOT running on all interfaces
    echo       Current status:
    netstat -an | findstr ":8000"
)

echo.
echo 2. Vite Dev Server (Port 5173):
netstat -an | findstr "0.0.0.0:5173" >nul
if %errorlevel% equ 0 (
    echo    ✅ Vite running on all interfaces
) else (
    echo    ❌ Vite NOT running on all interfaces
    echo       Current status:
    netstat -an | findstr ":5173"
)

echo.
echo 3. Network Connectivity:
ping -n 1 10.116.255.191 >nul
if %errorlevel% equ 0 (
    echo    ✅ Network connectivity: OK
) else (
    echo    ❌ Network connectivity: FAILED
)

echo.
echo 📋 Test URLs for Mobile:
echo    Laravel App: http://10.116.255.70:8000
echo    Vite Dev:   http://10.116.255.70:5173
echo.

echo 🚨 Common Issues & Solutions:
echo.
echo ❌ White Page = Vite assets not loading
echo    Solution: Ensure Vite is running on network
echo.
echo ❌ CORS Errors = Cross-origin issues
echo    Solution: Check CORS configuration
echo.
echo ❌ Connection Refused = Firewall blocking
echo    Solution: Allow ports 8000 & 5173 in Windows Firewall
echo.

echo 🔧 Next Steps:
echo    1. Stop current servers (Ctrl+C)
echo    2. Run: npm run serve:network
echo    3. New terminal: npm run dev:network
echo    4. Test on mobile: http://10.116.255.70:8000
echo.

pause
