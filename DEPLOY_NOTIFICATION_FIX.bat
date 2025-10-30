@echo off
echo ========================================
echo  Notification Fix - Deployment Script
echo ========================================
echo.
echo This will:
echo   1. Add NotificationSeeder to DatabaseSeeder
echo   2. Deploy to Railway
echo   3. Run the seeder to create notifications
echo.
pause

echo.
echo Step 1: Committing changes...
git add database/seeders/DatabaseSeeder.php
git commit -m "fix: Add NotificationSeeder to DatabaseSeeder for Railway

- NotificationSeeder now runs automatically with db:seed
- Will create notifications for all existing appointments
- Fixes notifications not appearing on Railway production"

echo.
echo Step 2: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  DEPLOYMENT INITIATED!
echo ========================================
echo.
echo Railway is deploying... (2-5 minutes)
echo.
echo After deployment completes, run:
echo   railway run php artisan db:seed --class=NotificationSeeder
echo.
echo Or to see instructions:
echo   type NOTIFICATION_ISSUE_COMPLETE_FIX.md
echo.
pause

