# 🔧 Render 500 Error Fix Guide

If you're seeing a **500 Server Error** on https://smile-suite.onrender.com/, follow these steps:

## 🚨 Common Causes

1. **Missing APP_KEY** - Most common cause
2. **Database connection failure**
3. **Missing environment variables**
4. **Cache issues**
5. **Storage permission problems**

## ✅ Quick Fix Steps

### Step 1: Check Render Logs

1. Go to Render Dashboard → Your Service → **Logs** tab
2. Look for error messages (they'll tell you exactly what's wrong)
3. Common errors:
   - `No application encryption key has been specified`
   - `SQLSTATE[HY000] [2002] Connection refused`
   - `Class 'X' not found`

### Step 2: Verify Environment Variables

Make sure these are set in Render Dashboard → Environment:

**Critical:**
- ✅ `APP_KEY` - MUST be set! Generate with: `php artisan key:generate --show`
- ✅ `APP_ENV=production`
- ✅ `APP_DEBUG=false`
- ✅ `APP_URL=https://smile-suite.onrender.com`

**Database:**
- ✅ `DB_CONNECTION=mysql` (or `pgsql` if using PostgreSQL)
- ✅ `DB_HOST=your-db-host`
- ✅ `DB_PORT=3306` (or `5432` for PostgreSQL)
- ✅ `DB_DATABASE=your-database`
- ✅ `DB_USERNAME=your-username`
- ✅ `DB_PASSWORD=your-password`

### Step 3: Generate APP_KEY

If `APP_KEY` is missing:

1. **Locally**, run:
   ```bash
   php artisan key:generate --show
   ```

2. **Copy the output** (starts with `base64:`)

3. **In Render Dashboard**:
   - Go to your service → Environment
   - Add/Update: `APP_KEY=base64:YOUR_KEY_HERE`
   - Save and redeploy

### Step 4: Check Database Connection

1. **In Render Dashboard** → Your Database:
   - Make sure database is **running** (green status)
   - Copy the **Internal Database URL**

2. **In your Web Service** → Environment:
   - Verify database credentials match
   - If using Render PostgreSQL, use Internal Database URL

3. **Test connection** via Render Shell:
   ```bash
   render run php artisan tinker
   >>> DB::connection()->getPdo();
   ```

### Step 5: Clear Caches (Manual)

If logs show cache issues, manually clear:

1. In Render Dashboard → Your Service → **Shell**
2. Run:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   ```

### Step 6: Check Storage Permissions

The startup script handles this, but verify:

1. Check logs for storage errors
2. If needed, in Render Shell:
   ```bash
   chmod -R 755 storage bootstrap/cache
   php artisan storage:link
   ```

## 🔍 Debug Mode (Temporary)

To see detailed errors, temporarily:

1. In Render → Environment Variables:
   - Set `APP_DEBUG=true`
   - Set `LOG_LEVEL=debug`

2. Redeploy and check logs

3. **⚠️ IMPORTANT**: Set back to `false` after debugging!

## 📊 Check Logs for Specific Errors

### Error: "No application encryption key"
**Fix**: Set `APP_KEY` environment variable

### Error: "SQLSTATE[HY000] [2002]"
**Fix**: Check database connection settings

### Error: "Class not found"
**Fix**: Run `composer install` (should be in Dockerfile)

### Error: "Storage link failed"
**Fix**: Check storage permissions, run `php artisan storage:link`

## ✅ Verification Checklist

After fixing, verify:

- [ ] APP_KEY is set and valid
- [ ] Database connection works
- [ ] All environment variables are set
- [ ] Logs show no errors
- [ ] Storage symlink exists
- [ ] APP_DEBUG=false (production mode)

## 🆘 Still Not Working?

1. **Check Render Logs** - They'll show the exact error
2. **Enable debug mode temporarily** - See detailed error messages
3. **Check Render Status Page** - https://status.render.com
4. **Verify service is running** - Green status in dashboard

## 📝 Updated Startup Script

The `render-start.sh` script has been updated to:
- ✅ Clear all caches on startup
- ✅ Check APP_KEY exists
- ✅ Test database connection
- ✅ Handle errors gracefully
- ✅ Optimize Laravel for production

This should prevent most 500 errors!

