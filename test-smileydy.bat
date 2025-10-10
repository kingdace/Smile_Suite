@echo off
echo.
echo 🤖 SmileyDy Chatbot Test Script
echo ================================
echo.

echo Starting Laravel development server...
start "Laravel Server" cmd /k "php artisan serve"

echo.
echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Starting Vite development server...
start "Vite Server" cmd /k "npm run dev"

echo.
echo ✅ Servers are starting up!
echo.
echo 🌐 Test SmileyDy at these URLs:
echo    • Landing Page: http://localhost:8000
echo    • Clinic Directory: http://localhost:8000/clinics
echo    • Payment Page: http://localhost:8000/payment
echo.
echo 🧪 Test these messages in SmileyDy:
echo    • "Hello"
echo    • "Book an appointment"
echo    • "Find clinics near me"
echo    • "What services do you offer?"
echo    • "How much does it cost?"
echo.
echo 📱 Test on mobile by visiting:
echo    • http://[your-ip]:8000
echo.
echo Press any key to open the landing page...
pause > nul

start http://localhost:8000

echo.
echo 🎉 SmileyDy is ready for testing!
echo Check the floating blue button with the smiley face 😊
echo.
pause
