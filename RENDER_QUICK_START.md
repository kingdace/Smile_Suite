# ⚡ Render Quick Start (5 Minutes)

## 🎯 Fastest Way to Deploy

### Method 1: Using Docker (Recommended for PHP)

1. **Push to GitHub** (if not already):

    ```bash
    git add .
    git commit -m "Add Render Docker deployment config"
    git push origin main
    ```

2. **Go to Render Dashboard**: https://dashboard.render.com

3. **Create Web Service**:

    - Click "New +" → "Web Service"
    - Connect your GitHub repo
    - **Language**: Select **"Docker"**
    - **Build Command**: Leave empty (Dockerfile handles it)
    - **Start Command**: `chmod +x render-start.sh && ./render-start.sh`

4. **Add Environment Variables**:

    - Go to Web Service → Environment
    - Add all variables from your Railway `.env` (see below)
    - Repeat for Worker Service

5. **Generate APP_KEY**:

    ```bash
    php artisan key:generate --show
    ```

    Copy output and add as `APP_KEY` in Render

6. **Link Database**:

    - In Web Service → Environment → Link Database
    - Select your database
    - Repeat for Worker Service

7. **Deploy!** ✅

---

### Method 2: Manual Setup (Dashboard)

Follow the detailed guide in `RENDER_DEPLOYMENT_GUIDE.md`

---

## 🔑 Required Environment Variables

Copy these from your Railway dashboard:

```env
APP_NAME=Smile Suite
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_TIMEZONE=Asia/Manila
APP_URL=https://your-service.onrender.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com

SEMAPHORE_API_KEY=your-key
SEMAPHORE_SENDER_NAME=your-name
SEMAPHORE_TEST_MODE=false

QUEUE_CONNECTION=database
CACHE_DRIVER=file
SESSION_DRIVER=database
LOG_CHANNEL=stderr
LOG_LEVEL=error
```

---

## 🗄️ Database Options

### Option A: Use Railway MySQL (Recommended)

-   Keep Railway MySQL service running (free tier)
-   Get connection details from Railway
-   Add to Render environment variables

### Option B: Use Render PostgreSQL (Free)

-   Create PostgreSQL in Render
-   Change `DB_CONNECTION=pgsql`
-   Update migrations if needed

See `RENDER_MYSQL_SETUP.md` for details.

---

## ✅ Verify Deployment

1. **Check Service Status**: Should be green ✅
2. **Visit App URL**: Should load your app
3. **Check Logs**: Render Dashboard → Logs tab
4. **Test Command**:
    ```bash
    render run php artisan appointments:send-daily-reminders
    ```

---

## 🆘 Common Issues

| Issue               | Solution                                 |
| ------------------- | ---------------------------------------- |
| Service won't start | Check logs, verify `APP_KEY` is set      |
| Database error      | Verify DB credentials, link database     |
| 404 errors          | Check `APP_URL` matches your Render URL  |
| Worker not running  | Create worker service, set same env vars |

---

## 📚 Full Documentation

-   **Complete Guide**: `RENDER_DEPLOYMENT_GUIDE.md`
-   **MySQL Setup**: `RENDER_MYSQL_SETUP.md`
-   **Platform Info**: `DEPLOYMENT_PLATFORMS.md`

---

## 🎉 You're Done!

Your app will be live at:

```
https://your-service-name.onrender.com
```

**Note**: Free tier services sleep after 15min inactivity. First request takes ~30s to wake up.
