# 🚂 Railway Scheduler Fix - The Complete Solution

## 🐛 **The Real Problem**

Railway doesn't automatically create multiple services from a `Procfile`. It only runs the `startCommand` from `railway.json`, which is `start.sh`, and that script only starts the web server.

**What's happening:**

-   ✅ `Procfile` has `worker: php artisan schedule:work`
-   ❌ Railway ignores the Procfile
-   ✅ Railway runs `start.sh` which starts web server
-   ❌ Railway does NOT start the worker process
-   ❌ Scheduler never runs → No automatic reminders

---

## ✅ **Solution Options**

You have 2 options to fix this:

### **Option 1: Create Separate Worker Service (RECOMMENDED)**

Manually create a worker service in Railway Dashboard.

**Steps:**

1. Go to Railway Dashboard → Your Project
2. Click **"New"** → **"Empty Service"** or **"Deploy from GitHub repo"**
3. Connect the **same GitHub repository**
4. Configure the service:
    - **Service Name:** `scheduler-worker`
    - **Deploy Command:** (leave empty, use defaults)
    - **Start Command:** `php artisan schedule:work`
5. Add the **same environment variables** as your main service:
    - `SEMAPHORE_API_KEY`
    - `SEMAPHORE_SENDER_NAME`
    - `SEMAPHORE_TEST_MODE=false`
6. Deploy!

**This creates:**

-   🖥️ **Main Service**: Runs your web app
-   ⚙️ **Worker Service**: Runs the scheduler

---

### **Option 2: Use Railway Cron (Alternative)**

Use Railway's cron feature to run commands at scheduled times.

**Steps:**

1. In Railway Dashboard → Your Project → Settings
2. Find **"Cron Jobs"** or **"Background Tasks"**
3. Add a new cron job:
    - **Schedule:** `0 8 * * *` (8:00 AM daily)
    - **Command:** `php artisan appointments:send-daily-reminders`
4. Save

**Note:** Railway might not have cron built-in, so Option 1 is more reliable.

---

## 🎯 **Recommended: Option 1 (Separate Worker Service)**

This is the **standard Laravel approach** and works perfectly on Railway.

### Step-by-Step Instructions:

#### 1. Update `railway.json` (Optional)

You can leave `railway.json` as is, OR add a note about the worker:

```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    },
    "deploy": {
        "startCommand": "chmod +x start.sh && ./start.sh",
        "healthcheckPath": "/",
        "healthcheckTimeout": 100,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
}
```

#### 2. In Railway Dashboard:

1. **Create New Service:**

    - Click **"+ New"** in your project
    - Select **"Empty Service"**
    - Name it: `sms-scheduler-worker`

2. **Link to Same Repo:**

    - Click the service
    - Click **"GitHub Repo"** tab
    - Connect your GitHub repository

3. **Configure Start Command:**

    - Go to **Settings** tab
    - Scroll to **"Deploy"** section
    - **Start Command:** `php artisan schedule:work`

4. **Add Environment Variables:**

    - Go to **Variables** tab
    - Add these (same as main service):

        ```
        SEMAPHORE_API_KEY=6dff29a20c4ad21b0ff30725e15c23d0
        SEMAPHORE_SENDER_NAME=AutoRepair
        SEMAPHORE_TEST_MODE=false

        # Also copy ALL your other env vars
        APP_ENV=production
        APP_DEBUG=false
        DB_CONNECTION=pgsql
        # ... etc
        ```

    - Railway will auto-detect variables or you can copy from main service

5. **Deploy:**
    - Click **"Deploy"** or wait for auto-deploy
    - Check logs to confirm it's running

#### 3. Verify It's Working:

**Check Worker Logs:**

```
Railway → sms-scheduler-worker service → Logs
```

You should see:

```
Running scheduled tasks.
No scheduled commands are ready to run.
```

**Check Scheduler List:**

```bash
# In Railway terminal (main service)
php artisan schedule:list
```

Should show:

```
  0 8 * * *  php artisan appointments:send-daily-reminders  ... Next Due: 22 hours from now
```

**Test Manually:**

```bash
# In Railway terminal (main service)
php artisan appointments:send-daily-reminders
```

---

## 🧪 **Testing on Railway**

### Test the Scheduler Before 8:00 AM:

You can manually trigger the reminder command to test RIGHT NOW:

```bash
# In Railway terminal
php artisan appointments:send-daily-reminders
```

This will send reminders to patients with appointments scheduled for TODAY.

### Verify Sent Reminders:

```bash
# In Railway terminal
php artisan tinker
```

```php
>>> $apt = App\Models\Appointment::where('scheduled_at', '>=', \Carbon\Carbon::today())->first();
>>> $apt->notes
// Should contain: "[sms_reminder_2025-10-28]"
```

---

## 📊 **Architecture Overview**

### Before Fix (Broken):

```
Railway
  └── Main Service
       └── start.sh → php artisan serve (web only)
       └── No scheduler running ❌
```

### After Fix (Working):

```
Railway
  ├── Main Service
  │    └── start.sh → php artisan serve (web app)
  │
  └── Worker Service (NEW)
       └── php artisan schedule:work (scheduler)
            └── Runs at 8:00 AM every day
            └── Sends SMS reminders
```

---

## ⚠️ **Important Notes**

### Environment Variables:

**CRITICAL:** Both services need the same environment variables:

-   SEMAPHORE_API_KEY
-   SEMAPHORE_SENDER_NAME
-   SEMAPHORE_TEST_MODE=false
-   Database credentials
-   Mail credentials
-   etc.

### Cost:

-   ✅ Railway usually allows multiple services in one project
-   ⚠️ Check if additional services cost extra in your plan
-   💡 Worker service is lightweight (just running a single command)

### Redundancy:

-   ✅ Main service handles web requests
-   ✅ Worker service handles scheduled tasks
-   ✅ If one fails, the other keeps working
-   ✅ Worker doesn't need to be scaled (single instance is fine)

---

## 🐛 **Troubleshooting**

### Worker Not Running?

1. **Check Service Status:**

    - Railway → sms-scheduler-worker → Metrics
    - Should show "Running" status

2. **Check Logs:**

    - Railway → sms-scheduler-worker → Logs
    - Look for: "Running scheduled tasks"

3. **Verify Environment Variables:**
    - Railway → Variables → sms-scheduler-worker
    - Make sure SEMAPHORE vars are set

### Scheduler Not Triggering?

1. **Check Timezone:**

    ```bash
    php artisan schedule:list
    ```

    Should show: "Asia/Manila"

2. **Manual Test:**

    ```bash
    php artisan appointments:send-daily-reminders
    ```

3. **Check Appointments:**
    ```bash
    php artisan tinker
    ```
    ```php
    >>> $count = App\Models\Appointment::where('scheduled_at', '>=', \Carbon\Carbon::today())->count();
    >>> echo $count;
    ```

---

## ✅ **Checklist**

Before deploying to Railway:

-   [ ] Create new worker service in Railway dashboard
-   [ ] Set start command to: `php artisan schedule:work`
-   [ ] Add all environment variables (SEMAPHORE, DB, etc.)
-   [ ] Deploy the worker service
-   [ ] Verify worker is running in logs
-   [ ] Test manual command: `php artisan appointments:send-daily-reminders`
-   [ ] Check schedule list: `php artisan schedule:list`

---

## 📝 **Summary**

### The Problem:

❌ Railway doesn't auto-create worker services from Procfile  
❌ Only web server running, scheduler never starts  
❌ Daily reminders never get sent automatically

### The Solution:

✅ Create separate "sms-scheduler-worker" service in Railway  
✅ Worker runs: `php artisan schedule:work`  
✅ Worker checks every minute for scheduled tasks  
✅ At 8:00 AM, sends daily reminders

### What You Need to Do:

1. Create new service in Railway dashboard
2. Set command to `php artisan schedule:work`
3. Add environment variables
4. Deploy
5. Done! Reminders will work automatically

---

**Status: Ready to implement! 🚀**

Follow the steps above to create the worker service and your automatic daily reminders will work on Railway!
