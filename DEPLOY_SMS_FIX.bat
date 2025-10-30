@echo off
echo ========================================
echo  SMS Scheduler Fix - Deployment Script
echo ========================================
echo.

echo Step 1: Adding modified files...
git add start.sh

echo.
echo Step 2: Committing changes...
git commit -m "fix: Enable Laravel scheduler for SMS reminders on Railway - Start scheduler in background alongside web server - Enables SMS appointment reminders at 8:00 AM - Enables subscription and payment checks - No need for multiple Railway services"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  DEPLOYMENT INITIATED!
echo ========================================
echo.
echo Railway is now deploying your changes...
echo This will take 2-5 minutes.
echo.
echo Once deployed, verify with:
echo   railway logs ^| findstr "Scheduler started"
echo.
echo You should see:
echo   ✅ Scheduler started (PID: XXXXX)
echo.
pause

