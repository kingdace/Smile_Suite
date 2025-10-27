# 📱 SMS Testing Guide for Smile Suite

This guide explains how to test the SMS functionality without spending credits from your Semaphore subscription.

---

## 🎯 Overview

The SMS system is configured with **TEST MODE enabled by default**, which means:

-   ✅ SMS content is logged but NOT actually sent
-   ✅ No credits are used
-   ✅ You can safely test all functionality
-   ✅ Real SMS only sent when explicitly enabled

---

## ⚙️ Configuration

### Environment Variables

Add these to your `.env` file:

```env
SEMAPHORE_API_KEY=6dff29a20c4ad21b0ff30725e15c23d0
SEMAPHORE_SENDER_NAME=AutoRepair
SEMAPHORE_TEST_MODE=true
```

**Important:** Keep `SEMAPHORE_TEST_MODE=true` during testing!

---

## 🧪 Testing Appointment Approval SMS

### Step 1: Enable Test Mode

Make sure your `.env` has:

```env
SEMAPHORE_TEST_MODE=true
```

### Step 2: Create/Approve an Appointment

1. Log in as clinic staff
2. Go to Appointments
3. Find a pending online booking
4. Click "Approve"

### Step 3: Check the Logs

Open `storage/logs/laravel.log` and search for:

```
SMS (TEST MODE) - Would send to +639XXXXXXXXX
```

You should see the SMS content that would be sent, but **no actual SMS is sent**.

### Step 4: Verify Log Entry

Look for entries like:

```
[2025-XX-XX] local.INFO: SMS (TEST MODE) - Would send to +639XXXXXXXXX {"message":"Hi Juan! Your appointment at...","sender":"AutoRepair"}
```

---

## 🧪 Testing Daily Reminders

### Step 1: Create a Test Appointment for Today

Create an appointment scheduled for today (current date) with status "Pending" or "Confirmed".

### Step 2: Run the Reminder Command

```bash
php artisan appointments:send-daily-reminders
```

### Step 3: Check Output

You should see:

```
🕐 Starting daily appointment reminders...
📋 Found X appointments scheduled for today
📱 SMS sent to Patient Name
✅ Daily reminders completed successfully!
```

### Step 4: Verify in Logs

Check `storage/logs/laravel.log` for:

```
SMS (TEST MODE) - Would send to +639XXXXXXXXX
```

**No actual SMS is sent in test mode!**

---

## 🚀 Testing with Real SMS (Optional - Use Caution!)

### ⚠️ WARNING: This will use your Semaphore credits!

Only do this when you're ready to test with a real phone number.

### Step 1: Disable Test Mode

In `.env`, change:

```env
SEMAPHORE_TEST_MODE=false
```

### Step 2: Use a Real Test Number

Make sure your patient has a valid Philippine phone number:

-   Format: `09XXXXXXXXX` or `+639XXXXXXXXX`
-   Must be a working number you can test with

### Step 3: Send Test SMS

Approve an appointment or run the reminder command.

### Step 4: Check Your Phone

You should receive the SMS within a few seconds.

### Step 5: Re-enable Test Mode

Immediately set:

```env
SEMAPHORE_TEST_MODE=true
```

---

## 📊 Monitoring SMS Usage

### Check Log Files

All SMS attempts are logged to `storage/logs/laravel.log`:

```bash
tail -f storage/logs/laravel.log | grep SMS
```

### Success Log Entry (Test Mode)

```
[2025-XX-XX] local.INFO: SMS (TEST MODE) - Would send to +639XXXXXXXXX {"message":"Hi Juan!...","sender":"AutoRepair"}
```

### Success Log Entry (Production)

```
[2025-XX-XX] local.INFO: SMS sent successfully {"to":"+639XXXXXXXXX","message_id":123456}
```

### Error Log Entry

```
[2025-XX-XX] local.ERROR: SMS error {"phone":"09123456789","error":"Invalid phone number format"}
```

---

## 🔍 Debugging

### Test Mode Verification

Run this command to check your configuration:

```bash
php artisan tinker
>>> $service = app(App\Services\SemaphoreSmsService::class);
>>> $service->getConfig();
```

Expected output:

```php
[
    "api_key" => "6dff29a2...",
    "sender_name" => "AutoRepair",
    "test_mode" => true
]
```

### Phone Number Validation

Test if a phone number is valid:

```bash
php artisan tinker
>>> $service = app(App\Services\SemaphoreSmsService::class);
>>> $service->validatePhoneNumber('09123456789');
=> true
>>> $service->validatePhoneNumber('9111111111');
=> false
```

### Manual SMS Test

Send a test SMS from Tinker:

```bash
php artisan tinker
>>> $service = app(App\Services\SemaphoreSmsService::class);
>>> $service->send('09123456789', 'Test SMS from Smile Suite');
```

---

## 📱 SMS Message Examples

### Appointment Confirmation

```
Hi Juan! Your appointment at Manila Dental Clinic is confirmed for Jan 15, 2025 at 2:00 PM with Dr. Santos. See you there! - Smile Suite
```

### Daily Reminder

```
Hi Juan! Reminder: You have an appointment TODAY at 2:00 PM with Dr. Santos at Manila Dental Clinic. See you soon! - Smile Suite
```

---

## ✅ Checklist for Safe Testing

-   [ ] `SEMAPHORE_TEST_MODE=true` is set
-   [ ] Can see SMS logs without sending
-   [ ] No credits deducted
-   [ ] Approved appointments log SMS
-   [ ] Daily reminders command runs successfully
-   [ ] All phone numbers validated
-   [ ] Error handling works correctly

---

## 🚨 Common Issues

### Issue: SMS not appearing in logs

**Solution:** Check that `SEMAPHORE_TEST_MODE=true` is set in `.env`

### Issue: "Invalid phone number format"

**Solution:** Ensure phone number is valid Philippine format (09XXXXXXXXX or +639XXXXXXXXX)

### Issue: No logs appear

**Solution:** Check Laravel log file permissions and PHP error logs

### Issue: Command not found

**Solution:** Run `php artisan list | grep appointments` to verify the command is registered

---

## 📞 Production Deployment

When ready for production:

1. **Test thoroughly in test mode first**
2. **Enable production SMS:**
    ```env
    SEMAPHORE_TEST_MODE=false
    ```
3. **Monitor closely for first few days**
4. **Track credit usage**
5. **Watch logs for errors**
6. **Set up alerts for failures**

---

## 🔒 Credit Protection Features

-   ✅ Test mode by default
-   ✅ Detailed logging of all attempts
-   ✅ Graceful error handling
-   ✅ No SMS sent on invalid numbers
-   ✅ SMS failure doesn't block appointment approval

---

## 📝 SMS Statistics

After implementation, you can track:

-   Total SMS sent
-   SMS failed count
-   Test mode usage
-   Credit consumption
-   Success rate

All data is logged in `storage/logs/laravel.log`.

---

**Remember:** Always keep `SEMAPHORE_TEST_MODE=true` during testing to avoid wasting credits!
