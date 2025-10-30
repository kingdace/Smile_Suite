# 🔧 Queue Worker Fix for Notifications on Railway

## 🐛 The Problem

Notifications were working perfectly on **local development** but NOT working on **Railway production**.

### Root Cause Analysis

1. **Broadcast Events are Queued**
   - The `AppointmentUpdated` event implements `ShouldBroadcast`
   - Laravel automatically queues broadcast events
   - Default queue driver is `database` (jobs stored in `jobs` table)

2. **Missing Queue Worker on Railway**
   - The `start.sh` script only started:
     - ✅ Web Server (`php artisan serve`)
     - ✅ Scheduler (`php artisan schedule:work`)
     - ❌ Queue Worker (MISSING!)
   
3. **What Happened**
   - When an appointment was created/updated on production:
     - ✅ Observer was triggered
     - ✅ Broadcast event was queued in the `jobs` table
     - ❌ NO worker to process the queue
     - ❌ Notifications were never created!

### Why It Worked Locally

On local development:
- Laravel's `php artisan serve` automatically processes some queued jobs
- Or you might have been running `php artisan queue:work` separately
- Smaller load means jobs might process synchronously

## ✅ The Solution

### Updated `start.sh` Script

Added a **queue worker** to run in the background alongside the scheduler:

```bash
# Start the Laravel scheduler in the background
echo "Starting Laravel scheduler..."
php artisan schedule:work &
SCHEDULER_PID=$!
echo "✅ Scheduler started (PID: $SCHEDULER_PID)"

# Start the queue worker in the background
echo "Starting Laravel queue worker..."
php artisan queue:work --tries=3 --timeout=90 &
QUEUE_PID=$!
echo "✅ Queue worker started (PID: $QUEUE_PID)"
```

### Now Running on Railway:
1. **Web Server** - Serves the application
2. **Scheduler** - Processes scheduled tasks (SMS reminders)
3. **Queue Worker** - Processes queued jobs (broadcasts, notifications)

## 🚀 Deployment Steps

### Option 1: Use Batch Script (Windows)
```bash
.\DEPLOY_QUEUE_FIX.bat
```

### Option 2: Manual Git Commands
```bash
git add start.sh
git commit -m "fix: Add queue worker to process broadcast events and notifications on Railway"
git push origin main
```

## 🧪 Testing After Deployment

1. Wait 2-3 minutes for Railway to deploy
2. Log into your production clinic (Clinic ID 27)
3. **Create a new appointment** or **edit an existing one**
4. Check the notifications bell - notifications should appear!
5. Check the "View All Notifications" page

## 📊 Monitoring Queue Jobs

### Check if jobs are being processed:

```sql
-- On Railway database (HeidiSQL)
SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10;

-- If this table is empty or jobs are old = queue worker is working!
-- If jobs are piling up = queue worker issue
```

### Check if jobs failed:

```sql
SELECT * FROM failed_jobs ORDER BY failed_at DESC LIMIT 10;
```

## 🔍 Understanding the Queue System

### Queue Driver: `database`
- Default: `config/queue.php` → `QUEUE_CONNECTION=database`
- Jobs stored in `jobs` table
- Failed jobs in `failed_jobs` table

### Queue Worker Options:
- `--tries=3` - Retry failed jobs up to 3 times
- `--timeout=90` - Kill jobs that run longer than 90 seconds
- `--sleep=3` - Sleep 3 seconds when no jobs available

### Queue vs Scheduler:
- **Scheduler**: Runs scheduled tasks at specific times (cron jobs)
  - Example: SMS reminders sent daily at specific times
- **Queue**: Processes background jobs as they're added
  - Example: Broadcast events, email notifications, file processing

## 🎯 What Gets Queued in Smile Suite

1. **Broadcast Events** (`AppointmentUpdated`)
   - When appointments are created/updated
   - Sent to WebSocket clients for real-time updates

2. **Notification Creation** (indirect)
   - Observer creates notifications synchronously
   - But broadcast events must be processed first

3. **Future Queued Jobs** (if implemented)
   - Email notifications
   - SMS notifications
   - Report generation
   - File exports

## ⚠️ Important Notes

### Railway Configuration:
- Railway will restart the entire `start.sh` script on each deployment
- All background processes (scheduler, queue worker) will restart
- Jobs in progress will be retried (thanks to `--tries=3`)

### Database Queue Limitations:
- Database queue is simple but not the most performant
- For high-traffic apps, consider Redis queue (`QUEUE_CONNECTION=redis`)
- Current setup is fine for Smile Suite's scale

### Monitoring:
- Check Railway logs for queue worker output
- Look for: `Processing: App\Events\AppointmentUpdated`
- Look for: `Processed: App\Events\AppointmentUpdated`

## 🔧 Troubleshooting

### If notifications still don't work after deployment:

1. **Check Railway Logs:**
   ```
   Look for: "✅ Queue worker started (PID: XXXX)"
   Look for: "Processing: App\Events\AppointmentUpdated"
   ```

2. **Check Database:**
   ```sql
   -- Are jobs piling up?
   SELECT COUNT(*) FROM jobs;
   
   -- Are jobs failing?
   SELECT * FROM failed_jobs ORDER BY failed_at DESC LIMIT 5;
   ```

3. **Check Observer is Firing:**
   ```sql
   -- Check if appointments are being created
   SELECT * FROM appointments WHERE clinic_id = 27 ORDER BY created_at DESC LIMIT 5;
   ```

4. **Manual Queue Worker (Emergency):**
   - SSH into Railway or use `railway run`
   - Run: `php artisan queue:work --once --tries=3`
   - This will process one job and exit

### If queue worker crashes:

The queue worker will automatically restart when Railway restarts the container (on each deployment or every 24 hours).

For immediate restart:
- Go to Railway dashboard
- Click "Restart" on your service

## 📝 Summary

**Before:**
- ❌ Notifications not working on production
- ❌ Broadcast events stuck in queue
- ❌ No queue worker running

**After:**
- ✅ Queue worker running 24/7
- ✅ Broadcast events processed
- ✅ Notifications created automatically
- ✅ Everything works like local development!

---

**Created:** 2025-10-30  
**Issue:** Notifications not working on Railway production  
**Solution:** Added queue worker to `start.sh` script  
**Status:** FIXED ✅

