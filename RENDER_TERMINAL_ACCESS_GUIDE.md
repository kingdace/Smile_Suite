# 🖥️ Render Terminal Access Guide - Run Commands Manually

## 🎯 **Purpose**

This guide shows you how to access Render's terminal/CLI to run Laravel Artisan commands manually, including `php artisan appointments:send-daily-reminders` for demonstrations.

---

## ✅ **YES, You Can Access Terminal on Render!**

Render provides **Shell Access** (SSH terminal) to your deployed services. You can:
- ✅ Run any Laravel Artisan commands
- ✅ Access your database via `php artisan tinker`
- ✅ Check logs
- ✅ Debug issues
- ✅ Run commands for demonstrations

---

## 📋 **Step-by-Step: Access Render Terminal**

### **Method 1: Via Render Dashboard (Recommended)**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login with your account

2. **Select Your Service**
   - Find your web service (e.g., `smile-suite-web`)
   - Click on it

3. **Open Shell**
   - Look for **"Shell"** or **"Open Shell"** button in the top menu
   - Click it → A terminal window opens!

4. **You're In!** 🎉
   - You're now in your Render service's shell
   - Working directory: `/var/www/html` (or similar)
   - You can run any command

---

### **Method 2: Via Render CLI (Alternative)**

If you prefer command-line:

```bash
# Install Render CLI (one-time setup)
npm install -g render-cli

# Login to Render
render login

# List your services
render services list

# SSH into your service
render shell [service-name]
```

**Note:** CLI method requires Render CLI installed. Method 1 is easier!

---

## 🚀 **Run the Appointment Reminder Command**

Once you're in the Render shell, run:

```bash
php artisan appointments:send-daily-reminders
```

### **What You'll See:**

```
🕐 Starting daily appointment reminders...
📋 Found X appointments scheduled for today
📱 SMS sent to Patient Name
✅ Daily reminders completed!
```

---

## ✅ **Does the Command Work on Render?**

**YES! 100% YES!** ✅

The command works **exactly the same** on Render as it does locally because:

1. ✅ **Same Laravel Framework** - Render runs your Laravel app
2. ✅ **Same PHP Version** - PHP 8.2+ (as configured)
3. ✅ **Same Artisan Commands** - All Laravel commands available
4. ✅ **Same Environment** - Uses your production database

**The ONLY difference:**
- Local: Uses your local `.env` and database
- Render: Uses Render environment variables and Render database

---

## 🎬 **Perfect for Demonstrations!**

### **During Your Defense Presentation:**

1. **Open Render Shell** (Method 1 above)
2. **Run the command:**
   ```bash
   php artisan appointments:send-daily-reminders
   ```
3. **Show the output** to demonstrate:
   - ✅ Automated SMS reminder system
   - ✅ Finding appointments scheduled for today
   - ✅ Sending SMS to patients
   - ✅ Real-time command execution

### **What It Does:**

- Finds all appointments scheduled for **TODAY**
- Filters by status: `Pending` or `Confirmed`
- Sends SMS reminders to patients with valid phone numbers
- Marks appointments as reminded (prevents duplicates)
- Logs all activity

---

## 📊 **Command Output Examples**

### **Scenario 1: Appointments Found**

```bash
$ php artisan appointments:send-daily-reminders

🕐 Starting daily appointment reminders...
📋 Found 3 appointments scheduled for today

[========================================] 100%

📱 SMS sent to Carmen Nambona
📱 SMS sent to John Doe
📱 SMS sent to Jane Smith

✅ Daily reminders completed successfully!
   Total: 3
   SMS Sent: 3
   Failed: 0
```

### **Scenario 2: No Appointments**

```bash
$ php artisan appointments:send-daily-reminders

🕐 Starting daily appointment reminders...
📋 Found 0 appointments scheduled for today
✅ No appointments scheduled for today. Skipping reminders.
```

### **Scenario 3: Some Failures**

```bash
$ php artisan appointments:send-daily-reminders

🕐 Starting daily appointment reminders...
📋 Found 5 appointments scheduled for today

[========================================] 100%

📱 SMS sent to Carmen Nambona
⚠️ SMS failed for John Doe: Invalid phone number
📱 SMS sent to Jane Smith
⚠️ SMS failed for Bob Wilson: Insufficient Semaphore credits
📱 SMS sent to Alice Brown

✅ Daily reminders completed!
   Total: 5
   SMS Sent: 3
   Failed: 2
```

---

## 🔍 **Verify Command is Scheduled**

To check if the command is scheduled to run automatically:

```bash
php artisan schedule:list
```

**Expected Output:**

```
  0 8 * * *  appointments:send-daily-reminders
  Description: Send SMS and Email reminders to patients
  Timezone: Asia/Manila
  Without Overlapping: Enabled ✓
  Runs In Background: Yes
```

This confirms:
- ✅ Scheduled to run at 8:00 AM daily
- ✅ Timezone: Asia/Manila
- ✅ Duplicate prevention enabled
- ✅ Runs in background

---

## 🧪 **Testing the Command**

### **Step 1: Create a Test Appointment**

1. Login to your Render app
2. Create an appointment scheduled for **TODAY**
3. Set status to `Pending` or `Confirmed`
4. Add a patient with a valid phone number

### **Step 2: Run the Command Manually**

```bash
# In Render Shell
php artisan appointments:send-daily-reminders
```

### **Step 3: Verify SMS Sent**

```bash
# Check appointment notes
php artisan tinker
```

```php
>>> $apt = App\Models\Appointment::whereDate('scheduled_at', today())->first();
>>> $apt->notes
// Should contain: "[sms_reminder_2025-01-XX]"
```

---

## 📝 **Other Useful Commands**

### **Check Database**

```bash
php artisan tinker
```

```php
// Check appointments for today
>>> App\Models\Appointment::whereDate('scheduled_at', today())->count()

// Check scheduled tasks
>>> \Illuminate\Support\Facades\Schedule::events()
```

### **Check Logs**

```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# Filter for SMS-related logs
tail -f storage/logs/laravel.log | grep -i sms
```

### **Check Environment Variables**

```bash
php artisan tinker
```

```php
>>> config('services.semaphore.test_mode')
>>> config('services.semaphore.sender_name')
>>> config('app.timezone')
```

### **Clear Cache**

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

---

## ⚠️ **Important Notes**

### **1. Scheduler vs Manual Run**

- **Scheduler:** Runs automatically at 8:00 AM daily (if `render-start.sh` has scheduler running)
- **Manual:** Run anytime via terminal for demonstrations

Both do the **exact same thing** - no difference!

### **2. Duplicate Prevention**

The command has built-in duplicate prevention:
- Checks if appointment was already reminded today
- Uses marker: `sms_reminder_YYYY-MM-DD` in notes field
- Safe to run multiple times (won't send duplicates)

### **3. Test Mode**

Check if SMS is in test mode:

```bash
php artisan tinker
>>> config('services.semaphore.test_mode')
```

- `true` = Test mode (logs but doesn't send real SMS)
- `false` = Production mode (sends real SMS, uses credits)

### **4. Timezone**

The command uses `Asia/Manila` timezone:
- Make sure `APP_TIMEZONE=Asia/Manila` in Render environment variables
- Scheduled time (8:00 AM) is in Manila time, not UTC

---

## 🎯 **Quick Reference**

### **Access Terminal:**
1. Render Dashboard → Your Service → **"Shell"** button

### **Run Command:**
```bash
php artisan appointments:send-daily-reminders
```

### **Check Schedule:**
```bash
php artisan schedule:list
```

### **Check Logs:**
```bash
tail -f storage/logs/laravel.log | grep SMS
```

---

## ✅ **Summary**

- ✅ **Yes, you CAN access Render terminal** via Dashboard → Shell
- ✅ **Yes, the command WORKS on Render** (same as local)
- ✅ **Perfect for demonstrations** - run manually during presentation
- ✅ **Scheduler also works** - runs automatically at 8:00 AM daily
- ✅ **Safe to run multiple times** - duplicate prevention built-in

**Ready to demonstrate!** 🚀

---

## 📞 **Troubleshooting**

### **"Command not found"**

Make sure you're in the correct directory:
```bash
cd /var/www/html  # Or wherever your app is deployed
```

### **"Permission denied"**

All commands should work in Render shell. If issues, contact Render support.

### **"Database connection failed"**

Check Render environment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

---

**Everything is ready for your demonstration!** 🎉

