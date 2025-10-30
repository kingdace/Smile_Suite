@echo off
echo ========================================
echo  Local Test: Scheduler + Web Server
echo ========================================
echo.
echo This will test if both processes run together locally.
echo.
echo Press CTRL+C to stop when you see both running.
echo.
pause

echo.
echo Starting scheduler in background...
start /B php artisan schedule:work

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting web server in foreground...
echo.
echo ========================================
echo  BOTH PROCESSES NOW RUNNING!
echo ========================================
echo.
echo Open another terminal and run:
echo   - curl http://localhost:8000 (test web)
echo   - railway run php artisan schedule:list (see scheduled tasks)
echo.
echo Press CTRL+C to stop both processes.
echo.

php artisan serve --host=0.0.0.0 --port=8000

