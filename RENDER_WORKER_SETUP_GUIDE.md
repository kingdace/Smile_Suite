# 🚀 Render Worker Service Setup Guide

## 📋 Overview

This guide will help you set up a **Background Worker Service** on Render to handle:

- ✅ **Automated SMS Reminders** - Daily appointment reminders at 8:00 AM
- ✅ **Notification Processing** - Processes queued notification jobs
- ✅ **Broadcast Events** - Handles real-time event broadcasts
- ✅ **Queue Jobs** - Processes all background jobs

---

## 🎯 What You're Setting Up

### Current Architecture:

```
Render Services:
├── Web Service (smile-suite-web)
│   └── Runs: render-start.sh
│   └── Handles: HTTP requests, web app
│
└── Worker Service (smile-suite-worker) ⭐ NEW!
    └── Runs: render-worker-start.sh
    └── Handles: 
        - Scheduler (schedule:work)
        - Queue Worker (queue:work)
```

---

## 📝 Step-by-Step Setup

### Step 1: Verify Files Are Ready

The following files should already be in your repository:

- ✅ `render-worker-start.sh` - Worker startup script
- ✅ `render.yaml` - Render configuration (already updated)
- ✅ `Dockerfile` - Should make scripts executable

**Check that `render.yaml` includes the worker service:**

```yaml
services:
  # Web Service
  - type: web
    name: smile-suite-web
    # ... web config ...
  
  # Worker Service
  - type: worker
    name: smile-suite-worker
    startCommand: chmod +x render-worker-start.sh && ./render-worker-start.sh
    # ... worker config ...
```

---

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)

If you have `render.yaml` in your repo:

1. **Push changes to GitHub:**
   ```bash
   git add render-worker-start.sh render.yaml
   git commit -m "feat: Add worker service for background tasks on Render"
   git push origin main
   ```

2. **Render will auto-detect `render.yaml`:**
   - Go to Render Dashboard
   - Connect your GitHub repo (if not already connected)
   - Render will automatically create both services from `render.yaml`

3. **Verify services created:**
   - Go to Render Dashboard → Your Project
   - You should see TWO services:
     - `smile-suite-web` (web service)
     - `smile-suite-worker` (worker service)

#### Option B: Manual Service Creation

If `render.yaml` doesn't work, create the worker service manually:

1. **Go to Render Dashboard**
   - Navigate to your project
   - Click **"New"** → **"Background Worker"**

2. **Configure the Service:**
   - **Name:** `smile-suite-worker`
   - **Environment:** Docker
   - **Region:** Oregon (or your preferred region)
   - **Plan:** Free

3. **Connect Repository:**
   - Select your GitHub repository
   - Connect the same repo as your web service

4. **Set Build & Start Commands:**
   - **Build Command:** (leave empty, Dockerfile handles it)
   - **Start Command:** `chmod +x render-worker-start.sh && ./render-worker-start.sh`

5. **Add Environment Variables:**
   - Click **"Environment"** tab
   - Click **"Sync from"** → Select your web service
   - This copies all environment variables from web service
   - **OR** manually add all the same variables:
     ```
     APP_ENV=production
     APP_DEBUG=false
     APP_TIMEZONE=Asia/Manila
     DB_CONNECTION=...
     DB_HOST=...
     DB_PORT=...
     DB_DATABASE=...
     DB_USERNAME=...
     DB_PASSWORD=...
     SEMAPHORE_API_KEY=...
     SEMAPHORE_SENDER_NAME=...
     SEMAPHORE_TEST_MODE=false
     (and all other vars from web service)
     ```

6. **Deploy:**
   - Click **"Save Changes"**
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

### Step 3: Verify Worker Service is Running

#### Check Worker Logs:

1. Go to Render Dashboard
2. Click on `smile-suite-worker` service
3. Click **"Logs"** tab

**Expected output:**
```
🚀 Starting Smile Suite Worker Service on Render...
🧹 Clearing all Laravel caches...
✅ APP_KEY is set
🔌 Testing database connection...
✅ Scheduler started (PID: 12345)
✅ Queue worker started (PID: 12346)
🎉 Worker service is now running!
   - Scheduler: Running scheduled tasks (SMS reminders, etc.)
   - Queue Worker: Processing queued jobs (notifications, broadcasts)
```

#### Check Service Status:

- Status should show: **"Live"** (green)
- Health check should pass

---

## 🧪 Testing the Worker Service

### Test 1: Verify Scheduler is Running

**Check scheduled tasks:**
```bash
# You can't run commands directly, but check logs for:
# "Running scheduled tasks."
# "No scheduled commands are ready to run."
```

**View scheduled tasks list:**
- The scheduler runs `appointments:send-daily-reminders` daily at 8:00 AM
- Check logs at 8:00 AM Manila time to see it executing

### Test 2: Verify Queue Worker is Processing

1. **Create a new appointment** in your web app
2. **Check worker logs** - Should see:
   ```
   Processing: App\Events\AppointmentUpdated
   Processed: App\Events\AppointmentUpdated
   ```

3. **Check notifications** - Notification should appear in your app

### Test 3: Verify SMS Reminders

**Wait for 8:00 AM Manila time** or **manually trigger**:

You can't directly run commands in Render, but you can:
- Wait until 8:00 AM Manila time
- Check worker logs for SMS sending activity
- Verify patients received SMS

**Alternative:** Create a test appointment scheduled for today, and the reminder should be sent at 8:00 AM.

---

## 🔧 What the Worker Service Does

### 1. Laravel Scheduler (`schedule:work`)

**Runs:**
- ✅ Daily SMS reminders at 8:00 AM (`appointments:send-daily-reminders`)
- ✅ Subscription expiration checks
- ✅ Payment expiration checks
- ✅ Any other scheduled tasks in `routes/console.php` or `app/Console/Kernel.php`

**How it works:**
- Checks every minute for scheduled tasks
- Runs tasks when their scheduled time arrives
- Prevents overlapping executions

### 2. Queue Worker (`queue:work`)

**Processes:**
- ✅ Broadcast events (`AppointmentUpdated`, etc.)
- ✅ Notification creation jobs
- ✅ Email sending jobs (if queued)
- ✅ Any other queued jobs

**How it works:**
- Continuously polls the `jobs` table
- Processes jobs in FIFO order
- Retries failed jobs (up to 3 times)
- Logs all job processing

---

## ⚙️ Configuration

### Environment Variables Required

The worker service needs **ALL the same environment variables** as your web service:

**Critical Variables:**
```
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=Asia/Manila
APP_KEY=your-app-key
APP_URL=https://your-app.onrender.com

# Database
DB_CONNECTION=pgsql (or mysql)
DB_HOST=...
DB_PORT=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

# SMS Service (Semaphore)
SEMAPHORE_API_KEY=your-api-key
SEMAPHORE_SENDER_NAME=your-sender-name
SEMAPHORE_TEST_MODE=false

# All other vars from web service
```

**Easy Way:** Use Render's "Sync from" feature to copy all variables from web service!

---

## 🐛 Troubleshooting

### Issue: Worker Service Not Starting

**Symptoms:**
- Status shows "Failed" or "Stopped"
- Logs show errors

**Solutions:**
1. **Check Dockerfile:**
   - Ensure `render-worker-start.sh` is copied
   - Ensure it's made executable

2. **Check Logs:**
   - Look for specific error messages
   - Common issues:
     - Missing environment variables
     - Database connection errors
     - File permissions

3. **Verify Script:**
   - Ensure `render-worker-start.sh` exists
   - Ensure it has execute permissions (chmod +x)

### Issue: Scheduler Not Running

**Symptoms:**
- No logs about scheduled tasks
- SMS reminders not sent

**Solutions:**
1. **Check Logs:**
   ```
   Look for: "✅ Scheduler started (PID: ...)"
   ```

2. **Verify Timezone:**
   ```
   APP_TIMEZONE=Asia/Manila
   ```

3. **Check Scheduled Tasks:**
   - Verify `routes/console.php` has the reminder schedule
   - Verify command exists: `appointments:send-daily-reminders`

### Issue: Queue Worker Not Processing Jobs

**Symptoms:**
- Jobs piling up in `jobs` table
- Notifications not appearing

**Solutions:**
1. **Check Logs:**
   ```
   Look for: "✅ Queue worker started (PID: ...)"
   Look for: "Processing: ..."
   ```

2. **Check Database:**
   ```sql
   -- Should be empty or very few jobs (being processed)
   SELECT COUNT(*) FROM jobs;
   
   -- Check for failed jobs
   SELECT * FROM failed_jobs ORDER BY failed_at DESC LIMIT 5;
   ```

3. **Verify Queue Connection:**
   ```
   QUEUE_CONNECTION=database
   ```

### Issue: Both Processes Dying

**Symptoms:**
- Worker service keeps restarting
- Processes keep dying

**Solutions:**
1. **Check Memory:**
   - Free tier has limited memory
   - Both processes might be using too much
   - Consider optimizing or upgrading plan

2. **Check Logs for Errors:**
   - Look for out-of-memory errors
   - Look for fatal errors

3. **Monitor Process Health:**
   - The script automatically restarts dead processes
   - If they keep dying, there's an underlying issue

---

## 📊 Monitoring

### What to Monitor:

1. **Worker Service Status:**
   - Should always be "Live"
   - Should show healthy metrics

2. **Logs:**
   - Regular "Running scheduled tasks" messages
   - "Processing:" messages for queue jobs
   - No error messages

3. **Database:**
   - `jobs` table should stay relatively empty
   - `failed_jobs` table should be empty
   - `notifications` table should grow as appointments are created

4. **SMS Reminders:**
   - Check at 8:00 AM Manila time
   - Verify reminders are being sent
   - Check Semaphore dashboard for sent SMS

---

## ✅ Checklist

Before considering setup complete:

- [ ] `render-worker-start.sh` file exists and is executable
- [ ] `render.yaml` includes worker service configuration
- [ ] Worker service created in Render dashboard
- [ ] All environment variables copied to worker service
- [ ] Worker service status shows "Live"
- [ ] Worker logs show scheduler and queue worker started
- [ ] Created appointment generates notification
- [ ] Queue jobs are being processed (check logs)
- [ ] Scheduled tasks are running (check at 8:00 AM)

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Worker service shows "Live" status
2. ✅ Logs show both scheduler and queue worker running
3. ✅ Creating appointments creates notifications immediately
4. ✅ At 8:00 AM, SMS reminders are sent to patients
5. ✅ `jobs` table stays empty (jobs being processed)
6. ✅ No failed jobs in `failed_jobs` table

---

## 📚 Related Files

- `render-worker-start.sh` - Worker startup script
- `render-start.sh` - Web service startup script
- `render.yaml` - Render service configuration
- `app/Console/Commands/SendAppointmentRemindersDaily.php` - SMS reminder command
- `routes/console.php` - Scheduled tasks configuration

---

## 🆘 Need Help?

If you encounter issues:

1. Check Render logs first
2. Verify all environment variables are set
3. Ensure database is accessible from worker service
4. Check that scripts have execute permissions
5. Review this guide's troubleshooting section

---

**Status:** Ready to deploy! 🚀

Follow the steps above to set up your worker service on Render and enable all background tasks!
