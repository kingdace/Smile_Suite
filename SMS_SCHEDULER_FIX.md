# 📱 SMS Appointment Reminders - Railway Scheduler Fix

## 📋 **PROBLEM IDENTIFIED**

Your SMS appointment reminders weren't working on Railway production because:

### **Root Cause:**

```bash
# Railway was only running THIS:
php artisan serve --host=0.0.0.0 --port=$PORT

# But NOT running the scheduler, which is needed for:
php artisan schedule:work  # ← This was MISSING!
```

**Laravel's scheduled tasks** (like SMS reminders at 8:00 AM) require the scheduler process to be running continuously. Without it:
- ❌ Daily SMS reminders never fire
- ❌ Subscription checks don't run
- ❌ Payment expiration checks don't work
- ❌ Any scheduled artisan commands are ignored

---

## ✅ **SOLUTION IMPLEMENTED**

### **Single-Service Solution** (No Multiple Railway Services Needed!)

I've modified your `start.sh` script to run BOTH processes in a single Railway service:

```bash
# 1. Start scheduler in BACKGROUND
php artisan schedule:work &

# 2. Start web server in FOREGROUND  
php artisan serve --host=0.0.0.0 --port=$PORT
```

This way:
- ✅ Web server handles HTTP requests
- ✅ Scheduler runs scheduled tasks (SMS reminders, etc.)
- ✅ Both run in the SAME Railway service
- ✅ No need for multiple services
- ✅ No extra cost

---

## 🔧 **WHAT WAS CHANGED**

### **File Modified:** `start.sh`

**Added:**
```bash
# Start the Laravel scheduler in the background
echo "Starting Laravel scheduler..."
php artisan schedule:work &
SCHEDULER_PID=$!
echo "✅ Scheduler started (PID: $SCHEDULER_PID)"

# Function to cleanup background processes on script exit
cleanup() {
    echo "Stopping scheduler..."
    kill $SCHEDULER_PID 2>/dev/null || true
    echo "✅ Cleanup complete"
}

# Trap exit signals to ensure cleanup
trap cleanup EXIT INT TERM

# Start the application (foreground process)
echo "Starting PHP server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT
```

**Benefits:**
- ✅ Scheduler runs continuously in background
- ✅ Web server runs in foreground (keeps Railway service alive)
- ✅ Proper cleanup on shutdown
- ✅ Process IDs tracked for monitoring

---

## 📅 **SCHEDULED TASKS THAT WILL NOW WORK**

### **1. SMS Appointment Reminders** 📱
**When:** Daily at 8:00 AM (Asia/Manila timezone)  
**What:** Sends SMS to patients with appointments TODAY  
**Command:** `php artisan appointments:send-daily-reminders`  
**Location:** `routes/console.php` line 12-16

### **2. Subscription Status Checks** 💳
**When:** Daily at 2:00 AM  
**What:** Checks and updates subscription statuses  
**Command:** `php artisan subscriptions:check-status`  
**Location:** `app/Console/Kernel.php` line 16-19

### **3. Subscription Expiration Notifications** ⏰
**When:** Weekly on Sundays at 9:00 AM  
**What:** Sends expiration warnings to clinics  
**Command:** `php artisan subscriptions:check-expirations`  
**Location:** `app/Console/Kernel.php` line 22-27

### **4. Payment Expiration Checks** 💰
**When:** Daily at 3:00 AM  
**What:** Checks for expired payments  
**Command:** `php artisan payments:check-expirations`  
**Location:** `app/Console/Kernel.php` line 30-33

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Commit and Push the Changes**

```bash
# Check what changed
git status

# Add the modified start.sh
git add start.sh

# Commit
git commit -m "fix: Add Laravel scheduler to start.sh for SMS reminders on Railway

- Start scheduler in background alongside web server
- Enables SMS appointment reminders at 8:00 AM
- Enables subscription and payment checks
- No need for multiple Railway services
- Added proper cleanup on shutdown"

# Push to GitHub
git push origin main
```

### **Step 2: Wait for Railway Auto-Deployment**

- Railway will automatically detect the push
- New deployment will start (2-5 minutes)
- Check Railway dashboard for deployment status

### **Step 3: Verify Scheduler is Running**

Once deployed, check Railway logs:

```bash
railway logs
```

You should see:
```
Starting Laravel scheduler...
✅ Scheduler started (PID: 12345)
Starting PHP server on port 8000...
```

---

## 🧪 **TESTING**

### **Test 1: Check Scheduler Status (Via Railway)**

```bash
# View live logs
railway logs --tail

# You should see scheduler starting up
```

### **Test 2: Manually Trigger SMS Reminders**

```bash
# Run the command manually to test
railway run php artisan appointments:send-daily-reminders

# Check output for:
# - Number of appointments found
# - SMS sending status
# - Any errors
```

### **Test 3: Create Test Appointment for Tomorrow**

1. **Login to Railway production**
2. **Create an appointment scheduled for TOMORROW at 8:00 AM**
3. **Wait until tomorrow at 8:00 AM (Manila time)**
4. **Patient should receive SMS reminder**

### **Test 4: Check Railway Logs Tomorrow Morning**

```bash
# At 8:00 AM Manila time, check logs
railway logs --tail

# Look for:
# "Starting daily appointment reminders..."
# "Found X appointments scheduled for today"
# "SMS sent to: +639XXXXXXXXX"
```

---

## 📊 **HOW IT WORKS**

### **Before (Broken):**

```
Railway Service
├─ php artisan serve  ✅ Running (web requests work)
└─ scheduler          ❌ NOT RUNNING (scheduled tasks never fire)
```

**Result:** SMS reminders never sent because scheduler wasn't running.

### **After (Fixed):**

```
Railway Service (Single Process)
├─ php artisan schedule:work  ✅ Running in background
└─ php artisan serve          ✅ Running in foreground
```

**Result:** Both web requests AND scheduled tasks work!

---

## 🔍 **UNDERSTANDING LARAVEL SCHEDULER**

### **What is `php artisan schedule:work`?**

This command:
1. **Continuously checks** for scheduled tasks every minute
2. **Runs tasks** when their scheduled time arrives
3. **Stays running** forever (until stopped)
4. **Replaces the need** for system cron jobs

### **Alternative: `schedule:run` vs `schedule:work`**

| Command | Behavior | Use Case |
|---------|----------|----------|
| `schedule:run` | Runs ONCE then exits | Traditional cron: `* * * * * php artisan schedule:run` |
| `schedule:work` | Runs FOREVER (checks every minute) | Long-running processes (Railway, Docker) |

**We use `schedule:work`** because:
- ✅ No need for system cron
- ✅ Perfect for Railway
- ✅ Easier to manage
- ✅ Logs are centralized

---

## 📝 **CONFIGURATION FILES**

### **Scheduled Tasks Location:**

1. **`app/Console/Kernel.php`** - System-wide schedules
   - Subscription checks
   - Payment checks

2. **`routes/console.php`** - Route-based schedules
   - SMS appointment reminders

### **SMS Reminder Configuration:**

```php
// routes/console.php
Schedule::command('appointments:send-daily-reminders')
    ->dailyAt('08:00')                    // 8:00 AM
    ->timezone('Asia/Manila')             // Manila time
    ->withoutOverlapping()                // Prevent duplicates
    ->runInBackground();                  // Don't block
```

---

## 🛡️ **SAFETY FEATURES**

### **1. SMS Test Mode**

By default, SMS is in TEST MODE (no credits used):

```env
SEMAPHORE_TEST_MODE=true
```

To enable real SMS:
```env
SEMAPHORE_TEST_MODE=false
```

### **2. Duplicate Prevention**

The reminder command checks if SMS was already sent:
```php
// Only reminds if not already reminded today
$todayMarker = 'sms_reminder_' . $todayStart->format('Y-m-d');
$query->where('notes', 'NOT LIKE', "%{$todayMarker}%");
```

### **3. Proper Cleanup**

When Railway restarts:
```bash
# Cleanup function kills scheduler gracefully
trap cleanup EXIT INT TERM
```

---

## 🆘 **TROUBLESHOOTING**

### **Issue: Scheduler not showing in logs**

**Solution:**
```bash
# Check if start.sh has execute permissions
railway run ls -la start.sh

# Should show: -rwxr-xr-x (executable)
```

### **Issue: SMS reminders not sending**

**Check 1: Is scheduler running?**
```bash
railway logs | grep "Scheduler started"
# Should see: ✅ Scheduler started (PID: XXXXX)
```

**Check 2: Is command scheduled correctly?**
```bash
railway run php artisan schedule:list
# Should show: appointments:send-daily-reminders  Daily at 08:00
```

**Check 3: Are there appointments today?**
```bash
railway run php artisan appointments:send-daily-reminders
# Check output for appointments found
```

**Check 4: Is SMS test mode enabled?**
```bash
railway run php artisan tinker
>>> config('services.semaphore.test_mode')
=> true  # If true, no real SMS sent (check logs instead)
```

### **Issue: "Command not found" error**

```bash
# Clear config cache
railway run php artisan config:clear

# Regenerate autoload
railway run composer dump-autoload
```

---

## 📊 **MONITORING**

### **Check Scheduler Health:**

```bash
# View recent logs
railway logs --tail

# Filter for scheduler activity
railway logs | grep "scheduler"

# Filter for SMS reminders
railway logs | grep "reminder"

# Filter for specific time (8:00 AM)
railway logs | grep "08:00"
```

### **Monitor SMS Sending:**

```bash
# Check SMS service logs
railway logs | grep "SMS"

# Check Semaphore API calls
railway logs | grep "Semaphore"
```

---

## ✅ **VERIFICATION CHECKLIST**

After deployment, verify:

- [ ] Git changes committed and pushed
- [ ] Railway deployment successful
- [ ] Scheduler appears in Railway logs
- [ ] Web server still working (visit your site)
- [ ] No error messages in logs
- [ ] `railway logs` shows "Scheduler started"
- [ ] Create test appointment for tomorrow
- [ ] Wait for 8:00 AM tomorrow
- [ ] Check logs for "Starting daily appointment reminders"
- [ ] Verify SMS sent (or logged in test mode)

---

## 🎯 **SUMMARY**

### **Problem:**
SMS appointment reminders didn't work because Laravel scheduler wasn't running on Railway.

### **Solution:**
Modified `start.sh` to run BOTH web server AND scheduler in a single Railway service.

### **How It Works:**
```bash
start.sh
├─ Runs seeders (if needed)
├─ Sets up storage
├─ Starts scheduler (background)  ← NEW!
└─ Starts web server (foreground)
```

### **Result:**
- ✅ SMS reminders will now send at 8:00 AM daily
- ✅ All scheduled tasks work
- ✅ No need for multiple Railway services
- ✅ No extra configuration needed

---

## 📞 **NEXT STEPS**

1. **Commit and push** the changes (see Deployment Steps above)
2. **Wait for Railway** to auto-deploy (2-5 minutes)
3. **Check logs** to verify scheduler started
4. **Create a test appointment** for tomorrow
5. **Check tomorrow at 8:00 AM** if SMS was sent

---

## 🎉 **YOU'RE ALL SET!**

Your SMS appointment reminders will now work automatically on Railway production!

**Files Modified:**
- ✅ `start.sh` - Added scheduler startup

**What Works Now:**
- ✅ Daily SMS reminders at 8:00 AM
- ✅ Subscription status checks
- ✅ Payment expiration checks
- ✅ All Laravel scheduled tasks

**No Additional Services Needed:**
- ✅ Everything runs in a single Railway service
- ✅ No extra cost
- ✅ Easy to manage

---

**Last Updated:** October 30, 2025  
**Status:** ✅ Ready for Deployment  
**Impact:** SMS reminders and all scheduled tasks will work on Railway

