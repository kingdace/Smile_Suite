#!/bin/sh

# Worker startup script for Render deployment
# This script runs both the scheduler and queue worker for background tasks
echo "🚀 Starting Smile Suite Worker Service on Render..."

# Set timezone
export TZ=Asia/Manila

# Critical: Clear all caches first (fixes errors)
echo "🧹 Clearing all Laravel caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Check if APP_KEY is set
echo "🔑 Checking APP_KEY..."
if [ -z "$APP_KEY" ]; then
    echo "⚠️ APP_KEY not set! Generating new key..."
    php artisan key:generate --force || echo "❌ Failed to generate APP_KEY"
else
    echo "✅ APP_KEY is set"
fi

# Test database connection
echo "🔌 Testing database connection..."
php artisan db:show || echo "⚠️ Database connection test failed (will continue anyway)"

# Optimize Laravel for production
echo "⚡ Optimizing Laravel..."
php artisan config:cache || echo "⚠️ Config cache failed"
php artisan route:cache || echo "⚠️ Route cache failed"

# Function to cleanup background processes on script exit
cleanup() {
    echo "🛑 Stopping scheduler and queue worker..."
    kill $SCHEDULER_PID 2>/dev/null || true
    kill $QUEUE_PID 2>/dev/null || true
    echo "✅ Cleanup complete"
}

# Trap exit signals to ensure cleanup
trap cleanup EXIT INT TERM

# Start the Laravel scheduler in the background
echo "📅 Starting Laravel scheduler..."
php artisan schedule:work &
SCHEDULER_PID=$!
echo "✅ Scheduler started (PID: $SCHEDULER_PID)"

# Start the queue worker in the background
echo "🔄 Starting Laravel queue worker..."
php artisan queue:work --tries=3 --timeout=90 &
QUEUE_PID=$!
echo "✅ Queue worker started (PID: $QUEUE_PID)"

echo "🎉 Worker service is now running!"
echo "   - Scheduler: Running scheduled tasks (SMS reminders, etc.)"
echo "   - Queue Worker: Processing queued jobs (notifications, broadcasts)"

# Keep the script running and monitor both processes
while true; do
    # Check if scheduler is still running
    if ! kill -0 $SCHEDULER_PID 2>/dev/null; then
        echo "⚠️ Scheduler process died! Restarting..."
        php artisan schedule:work &
        SCHEDULER_PID=$!
        echo "✅ Scheduler restarted (PID: $SCHEDULER_PID)"
    fi

    # Check if queue worker is still running
    if ! kill -0 $QUEUE_PID 2>/dev/null; then
        echo "⚠️ Queue worker process died! Restarting..."
        php artisan queue:work --tries=3 --timeout=90 &
        QUEUE_PID=$!
        echo "✅ Queue worker restarted (PID: $QUEUE_PID)"
    fi

    # Sleep for 30 seconds before checking again
    sleep 30
done
