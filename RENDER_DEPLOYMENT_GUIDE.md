# 🚀 Render Deployment Guide for Smile Suite

This guide will help you deploy your Smile Suite application to Render while keeping all Railway configurations intact.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) (Free tier available)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Database Access**: You'll need database credentials (Render provides MySQL or PostgreSQL)

---

## 🎯 Quick Start (Dashboard Method)

### Step 1: Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Name**: `smile-suite-web`
   
   **Language**: `Docker` ⚠️ (NOT PHP - Render doesn't have PHP option)
   
   **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   
   **Branch**: `main` or `master`
   
   **Root Directory**: Leave empty (or `.` if needed)
   
   **Build Command**: Leave empty (Dockerfile handles the build)
   
   **Start Command**:
   ```bash
   chmod +x render-start.sh && ./render-start.sh
   ```
   
   **Note**: The Dockerfile will automatically:
   - Install PHP 8.2 and extensions
   - Install Composer
   - Install Node.js and npm
   - Build your application
   - Set up storage directories

### Step 2: Create a Database

1. Click **"New +"** → **"PostgreSQL"** (or **"MySQL"** if available)
2. Configure:
   - **Name**: `smile-suite-db`
   - **Database**: `smile_suite`
   - **User**: `smile_suite_user`
   - **Plan**: `Free` (or upgrade if needed)
3. Copy the **Internal Database URL** (you'll need this)

### Step 3: Create a Worker Service

1. Click **"New +"** → **"Background Worker"**
2. Configure:

   **Name**: `smile-suite-worker`
   
   **Language**: `Docker` ⚠️ (Same as web service)
   
   **Branch**: `main` or `master`
   
   **Build Command**: Leave empty (Dockerfile handles it)
   
   **Start Command**:
   ```bash
   php artisan schedule:work
   ```

### Step 4: Configure Environment Variables

For **Web Service**, add these environment variables:

```env
# Application
APP_NAME=Smile Suite
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_TIMEZONE=Asia/Manila
APP_URL=https://your-service-name.onrender.com

# Database (use Internal Database URL from Step 2)
DB_CONNECTION=mysql
DB_HOST=your-db-host.render.com
DB_PORT=3306
DB_DATABASE=smile_suite
DB_USERNAME=smile_suite_user
DB_PASSWORD=your-db-password

# Mail (if using)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# SMS (Semaphore)
SEMAPHORE_API_KEY=your-semaphore-api-key
SEMAPHORE_SENDER_NAME=your-sender-name
SEMAPHORE_TEST_MODE=false

# Queue
QUEUE_CONNECTION=database

# Cache
CACHE_DRIVER=file
SESSION_DRIVER=database

# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=error

# Storage
FILESYSTEM_DISK=local
```

**Important**: Copy all environment variables to the **Worker Service** as well!

### Step 5: Link Database to Services

1. In your **Web Service** → **Environment** tab
2. Click **"Link Database"**
3. Select your `smile-suite-db` database
4. Repeat for **Worker Service**

---

## 🔧 Alternative: Using render.yaml

If you prefer using the `render.yaml` file (already created):

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create all services

**Note**: You'll still need to:
- Add environment variables manually (see Step 4 above)
- Link the database to services
- Generate `APP_KEY` using: `php artisan key:generate --show`

---

## 🔑 Generate APP_KEY

Run this locally and copy the output:

```bash
php artisan key:generate --show
```

Add it to both Web and Worker services as `APP_KEY`.

---

## 📊 Database Migration & Seeding

The `render-start.sh` script automatically:
- ✅ Runs migrations
- ✅ Seeds database if needed
- ✅ Creates storage directories
- ✅ Sets up storage symlink

**First deployment**: The script will automatically seed your database.

---

## 🚨 Important Notes

### Free Tier Limitations

- **Services sleep after 15 minutes of inactivity** (on free tier)
- **First request after sleep takes ~30 seconds** (cold start)
- **Upgrade to paid plan** for always-on services

### Database

- **PostgreSQL is default** on Render free tier
- If you need **MySQL**, you may need to:
  - Use external MySQL service (like PlanetScale, Railway MySQL, etc.)
  - Or upgrade Render plan
  - Or modify code to use PostgreSQL

### Port Configuration

- Render automatically sets `PORT` environment variable
- Our script uses `${PORT:-10000}` as fallback
- No manual port configuration needed

---

## ✅ Verification Checklist

After deployment:

- [ ] Web service is running (green status)
- [ ] Worker service is running (green status)
- [ ] Database is linked to both services
- [ ] All environment variables are set
- [ ] Visit your app URL (should load)
- [ ] Check logs for any errors
- [ ] Test appointment reminder command:
  ```bash
  render run php artisan appointments:send-daily-reminders
  ```

---

## 🔄 Switching Back to Railway

All Railway configurations are preserved:

- ✅ `Procfile` - Still works for Railway
- ✅ `start.sh` - Railway-specific startup script
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `railway.json` - Railway deployment config

To redeploy to Railway:
1. Just push to your repo
2. Railway will automatically detect and deploy
3. No changes needed!

---

## 🆘 Troubleshooting

### Service Fails to Start

1. Check **Logs** tab in Render dashboard
2. Look for error messages
3. Common issues:
   - Missing `APP_KEY` → Generate and add it
   - Database connection failed → Check DB credentials
   - Storage permissions → Script handles this automatically

### Database Connection Issues

1. Verify database is **linked** to service
2. Check `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
3. Use **Internal Database URL** for `DB_HOST`

### Worker Not Running

1. Verify worker service is **created and running**
2. Check environment variables match web service
3. Check logs for scheduler errors

### Scheduler Not Working

1. Worker service must be running 24/7
2. Free tier: Service sleeps → Scheduler won't run
3. **Solution**: Upgrade to paid plan or use external cron service

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Render Support: support@render.com
- Your project logs: Check Render dashboard → Logs tab

---

## 🎉 Success!

Once deployed, your app will be available at:
```
https://smile-suite-web.onrender.com
```

(Your actual URL will be shown in the Render dashboard)

