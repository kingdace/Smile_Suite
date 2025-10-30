@echo off
echo ========================================
echo DEPLOYING QUEUE WORKER FIX TO RAILWAY
echo ========================================
echo.

echo This will:
echo 1. Commit the updated start.sh with queue worker
echo 2. Push to Railway (triggers auto-deployment)
echo 3. Queue worker will process broadcast events
echo 4. Notifications will work on production!
echo.

pause

echo.
echo Step 1: Committing start.sh changes...
git add start.sh
git commit -m "fix: Add queue worker to process broadcast events and notifications on Railway"

echo.
echo Step 2: Pushing to GitHub (will trigger Railway deployment)...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo The queue worker is now running on Railway!
echo.
echo What's happening now:
echo - Scheduler: Processes scheduled tasks (SMS reminders)
echo - Queue Worker: Processes queued jobs (broadcast events, notifications)
echo - Web Server: Serves the application
echo.
echo Please wait 2-3 minutes for Railway to deploy...
echo Then test creating/editing an appointment on production!
echo.
echo You can monitor the deployment at:
echo https://railway.app/project/[your-project-id]
echo.

pause

