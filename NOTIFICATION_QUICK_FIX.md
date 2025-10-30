# ⚡ Quick Fix - Railway Notifications Not Working

## 🎯 Choose ONE Method Below:

### Method 1: Via Railway CLI (Easiest)
```bash
railway run php artisan notifications:regenerate
```

### Method 2: Via HeidiSQL (Your Workflow)
1. Open HeidiSQL → Connect to Railway
2. Open Query tab
3. Run this file: `database/scripts/regenerate_notifications_heidi.sql`
4. Press F9 to execute

### Method 3: Via Seeder
```bash
railway run php artisan db:seed --class=NotificationSeeder
```

## ✅ Verify It Worked
```sql
SELECT COUNT(*) FROM notifications;
```
Should return a number > 0

## 📖 Full Documentation
See `RAILWAY_NOTIFICATION_FIX.md` for complete details.

## 🆘 Still Not Working?
1. Check user's clinic_id matches notification clinic_id
2. Verify user's role is in notification target_roles
3. Clear browser cache and refresh
4. Check Railway logs for errors

---
**Created:** 2025-10-30  
**Files:** 
- `database/seeders/NotificationSeeder.php`
- `app/Console/Commands/RegenerateNotifications.php`
- `database/scripts/regenerate_notifications_heidi.sql`

