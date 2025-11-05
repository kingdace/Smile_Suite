# 🔍 Notification Debug Guide for Render (PostgreSQL)

## 🎯 **Problem: Notifications Not Showing on Render**

**Root Cause:** Render uses **PostgreSQL** (not MySQL), and JSON queries work differently!

---

## 🔧 **Quick Fix Applied**

Updated `app/Models/Notification.php` to be PostgreSQL-compatible:
- MySQL/MariaDB: Uses `whereJsonContains()` (Laravel handles this)
- PostgreSQL: Uses `LIKE` query for JSON text matching

---

## ✅ **Step 1: Verify Database Connection**

Check if you're using PostgreSQL:

```bash
# In Render logs or via SSH, run:
php artisan tinker
>>> DB::connection()->getDriverName()
=> "pgsql"  // Should return "pgsql" for Render
```

---

## ✅ **Step 2: Verify Notifications Exist**

Check if notifications are in the database:

```bash
php artisan tinker
```

Then run:
```php
// Check total notifications
\App\Models\Notification::count()

// Check notifications for Clinic 27
\App\Models\Notification::where('clinic_id', 27)->count()

// Check a sample notification
\App\Models\Notification::where('clinic_id', 27)->first()
```

**Expected:** Should return > 0 for Clinic 27

**If 0:** Seeder didn't run → Continue to Step 3

---

## ✅ **Step 3: Run NotificationSeeder Manually**

If notifications don't exist:

```bash
# In Render Shell/Dashboard, run:
php artisan db:seed --class=NotificationSeeder --force
```

**Expected Output:**
```
🔔 Starting Notification Seeder...
Processing Clinic: Enhaynes Dental Clinic (ID: 27)
  ✅ Created 39 notifications for this clinic
✅ Total Notifications Created: 39
```

---

## ✅ **Step 4: Verify User's Role and Clinic**

Check if your user has the correct role:

```php
// In tinker:
$user = \App\Models\User::where('email', 'your@email.com')->first();
echo "User ID: {$user->id}\n";
echo "Clinic ID: {$user->clinic_id}\n";
echo "Role: {$user->role}\n";
```

**Required:**
- `clinic_id` must match notification's `clinic_id` (e.g., 27)
- `role` must be in notification's `target_roles` array (e.g., `clinic_admin`, `staff`, `dentist`)

---

## ✅ **Step 5: Test Query Directly**

Test if the query returns notifications:

```php
// In tinker:
$user = \App\Models\User::where('email', 'your@email.com')->first();

// Test forClinic scope
$step1 = \App\Models\Notification::forClinic($user->clinic_id)->count();
echo "Step 1 (forClinic): {$step1}\n";

// Test forUser scope
$step2 = \App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->count();
echo "Step 2 (forClinic + forUser): {$step2}\n";

// Test with notExpired
$step3 = \App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->notExpired()
    ->count();
echo "Step 3 (complete query): {$step3}\n";
```

**Expected:** Step 3 should return > 0

---

## ✅ **Step 6: Check API Response**

Test the actual API endpoint:

1. **Login to your Render app**
2. **Open browser console** (F12)
3. **Run this JavaScript:**
   ```javascript
   fetch('/api/clinic/27/notifications', {
       headers: {
           'X-Requested-With': 'XMLHttpRequest'
       },
       credentials: 'same-origin'
   })
   .then(r => r.json())
   .then(data => {
       console.log('Notifications:', data.notifications);
       console.log('Unread Count:', data.unread_count);
   });
   ```

**Expected:**
```json
{
  "notifications": [...],
  "unread_count": 5
}
```

---

## 🐛 **Common Issues**

### Issue 1: "No notifications found"

**Possible Causes:**
- ✅ Seeder didn't run → Run `php artisan db:seed --class=NotificationSeeder`
- ✅ User's `clinic_id` doesn't match notification's `clinic_id`
- ✅ User's `role` not in `target_roles` array
- ✅ All notifications are expired (`expires_at < now()`)
- ✅ All notifications are marked as read (`is_read = true`)

**Fix:**
```php
// Check what notifications exist
\App\Models\Notification::where('clinic_id', 27)->get()->each(function($n) {
    echo "ID: {$n->id}, Roles: " . json_encode($n->target_roles) . ", Expires: {$n->expires_at}\n";
});
```

---

### Issue 2: "PostgreSQL JSON query not working"

**Symptom:** Query returns 0 even though notifications exist

**Fix:** Already applied! Updated `scopeForUser()` to handle PostgreSQL.

If still broken, try this manual query:
```php
// PostgreSQL-specific query
\App\Models\Notification::where('clinic_id', 27)
    ->whereRaw("target_roles::text LIKE ?", ['%clinic_admin%'])
    ->count();
```

---

### Issue 3: "Seeder runs but creates 0 notifications"

**Possible Causes:**
- ✅ No appointments exist for Clinic 27
- ✅ Appointments missing required relationships (patient, status)

**Fix:**
```php
// Check if appointments exist
\App\Models\Appointment::where('clinic_id', 27)->count();

// Check if they have required relationships
\App\Models\Appointment::where('clinic_id', 27)
    ->whereHas('patient')
    ->whereHas('status')
    ->count();
```

---

## 📋 **Complete Diagnostic Script**

Run this in `php artisan tinker`:

```php
echo "=== NOTIFICATION DIAGNOSTIC ===\n\n";

// 1. Database driver
echo "1. Database Driver: " . DB::connection()->getDriverName() . "\n\n";

// 2. User check
$user = \App\Models\User::where('clinic_id', 27)->first();
if (!$user) {
    echo "❌ No users found for Clinic 27\n";
    exit;
}
echo "2. User Found:\n";
echo "   Email: {$user->email}\n";
echo "   Role: {$user->role}\n";
echo "   Clinic ID: {$user->clinic_id}\n\n";

// 3. Notification count
$total = \App\Models\Notification::count();
echo "3. Total Notifications: {$total}\n";
$forClinic = \App\Models\Notification::where('clinic_id', 27)->count();
echo "   For Clinic 27: {$forClinic}\n\n";

// 4. Sample notification
$sample = \App\Models\Notification::where('clinic_id', 27)->first();
if ($sample) {
    echo "4. Sample Notification:\n";
    echo "   ID: {$sample->id}\n";
    echo "   Title: {$sample->title}\n";
    echo "   Target Roles: " . json_encode($sample->target_roles) . "\n";
    echo "   Expires: " . ($sample->expires_at ?? 'Never') . "\n\n";
} else {
    echo "4. ❌ No notifications found for Clinic 27\n\n";
}

// 5. Test scopes
echo "5. Testing Scopes:\n";
$step1 = \App\Models\Notification::forClinic($user->clinic_id)->count();
echo "   forClinic(): {$step1}\n";
$step2 = \App\Models\Notification::forClinic($user->clinic_id)->forUser($user)->count();
echo "   forClinic() + forUser(): {$step2}\n";
$step3 = \App\Models\Notification::forClinic($user->clinic_id)->forUser($user)->notExpired()->count();
echo "   Complete query: {$step3}\n\n";

// 6. Service test
$service = new \App\Services\NotificationService();
$notifications = $service->getNotificationsForUser($user, 10);
echo "6. NotificationService Results: {$notifications->count()} notifications\n";

if ($notifications->count() > 0) {
    echo "   ✅ Notifications are working!\n";
    echo "   First notification: {$notifications->first()->title}\n";
} else {
    echo "   ❌ No notifications returned\n";
}
```

---

## ✅ **Summary**

1. ✅ **Fixed:** PostgreSQL JSON query compatibility
2. ✅ **Check:** Notifications exist in database
3. ✅ **Verify:** User's role and clinic_id match
4. ✅ **Test:** API endpoint returns notifications
5. ✅ **Debug:** Use diagnostic script above

**After applying fixes, redeploy and test!** 🚀
