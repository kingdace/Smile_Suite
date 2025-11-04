# 🔧 Render Environment Variables Fix

## ❌ Issues Found

### 1. **Database Connection (CRITICAL)**
- `DB_HOST=mysql.railway.internal` - This is Railway's internal hostname
- **Won't work on Render!** You need to use Railway's **public database URL**

### 2. **APP_URL Mismatch**
- `APP_URL=https://smilesuite.site` - But your Render service is at `smile-suite.onrender.com`
- Should match your actual Render URL (or custom domain if you set one up)

### 3. **VITE_APP_URL Mismatch**
- `VITE_APP_URL=https://smilesuite.site` - Same issue

### 4. **Quotes in Values**
- Some values have extra quotes that might cause issues
- `APP_NAME='"Smile Suite"'` - Remove outer quotes
- `APP_KEY="base64:..."` - Remove quotes

---

## ✅ Corrected Environment Variables

### **Critical Fixes:**

```env
# Application
APP_DEBUG=false
APP_ENV=production
APP_KEY=base64:NTLggPoQnL9ZW41SV7ghDDNahFDuLrasq0Zh6G+/kYM=
APP_NAME=Smile Suite
APP_TIMEZONE=Asia/Manila
APP_URL=https://smile-suite.onrender.com

# Database (FIXED - Use Railway's public MySQL URL)
DB_CONNECTION=mysql
DB_DATABASE=railway
DB_HOST=containers-us-west-XXX.railway.app
DB_PASSWORD=MNNIzHuJrffCRqwlKeJYVAKQMakGVGPi
DB_PORT=3306
DB_USERNAME=root

# Vite (FIXED)
VITE_APP_URL=https://smile-suite.onrender.com
```

---

## 🔧 How to Fix Database Connection

### Option 1: Use Railway MySQL (Public URL)

1. **Go to Railway Dashboard** → Your MySQL Service
2. **Click "Connect"** or **"Variables"** tab
3. Look for **"Public Networking"** or **"External Connection"**
4. Copy the **public hostname** (usually looks like `containers-us-west-XXX.railway.app`)
5. **Update in Render**:
   - `DB_HOST=containers-us-west-XXX.railway.app` (use the actual hostname)
   - Keep other DB settings the same

### Option 2: Get Railway MySQL Connection String

In Railway MySQL service, look for:
- **"Public URL"** or
- **"Connection String"**

It might look like:
```
mysql://root:password@containers-us-west-XXX.railway.app:3306/railway
```

Extract the hostname from this URL.

---

## 📋 Complete Fixed Environment Variables

Copy this into Render (with your actual Railway MySQL public hostname):

```env
APP_DEBUG=false
APP_ENV=production
APP_KEY=base64:NTLggPoQnL9ZW41SV7ghDDNahFDuLrasq0Zh6G+/kYM=
APP_NAME=Smile Suite
APP_TIMEZONE=Asia/Manila
APP_URL=https://smile-suite.onrender.com

AWS_ACCESS_KEY_ID=AKIAUGYIFBHZMAHWQ6IK
AWS_BUCKET=smile-suite-images-dymark-gales
AWS_DEFAULT_REGION=us-east-1
AWS_SECRET_ACCESS_KEY=BFgzN3+RSBPjcJ7zf0si4+IbLmcUKoZJjjdktbBB

BCRYPT_ROUNDS=12
BROADCAST_DRIVER=pusher
CACHE_STORE=database

DB_CONNECTION=mysql
DB_DATABASE=railway
DB_HOST=YOUR_RAILWAY_PUBLIC_HOSTNAME_HERE
DB_PASSWORD=MNNIzHuJrffCRqwlKeJYVAKQMakGVGPi
DB_PORT=3306
DB_USERNAME=root

FILESYSTEM_DISK=s3
FORCE_HTTPS=true

LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_STACK=single

MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@smilesuite.site
MAIL_FROM_NAME=Smile Suite
MAIL_HOST=smtp.gmail.com
MAIL_MAILER=resend
MAIL_PASSWORD=wknwpeazsyquszum
MAIL_PORT=587
MAIL_USERNAME=kite.gales10@gmail.com

PUSHER_APP_CLUSTER=ap1
PUSHER_APP_ID=2052048
PUSHER_APP_KEY=be56f2af1134563bb033
PUSHER_APP_SECRET=b5729e93c9396ee89b2f

QUEUE_CONNECTION=database

RESEND_API_KEY=re_hyBQdHzi_96GvDyo6mK9Z6HNM4EJf33v5

SEMAPHORE_API_KEY=6dff29a20c4ad21b0ff30725e15c23d0
SEMAPHORE_SENDER_NAME=AutoRepair
SEMAPHORE_TEST_MODE=false

SESSION_DRIVER=database
SESSION_ENCRYPT=false
SESSION_LIFETIME=120

VITE_APP_URL=https://smile-suite.onrender.com
VITE_PUSHER_APP_CLUSTER=ap1
VITE_PUSHER_APP_KEY=be56f2af1134563bb033
```

---

## 🔍 Changes Made

1. ✅ **Removed quotes** from `APP_KEY`, `APP_NAME`, `MAIL_FROM_NAME`
2. ✅ **Updated APP_URL** to match Render service URL
3. ✅ **Updated VITE_APP_URL** to match Render service URL
4. ✅ **Changed LOG_LEVEL** from `debug` to `error` (production best practice)
5. ✅ **DB_HOST** - **YOU MUST UPDATE THIS** with Railway's public hostname

---

## 🚨 IMPORTANT: Railway MySQL Public Access

### Check if Railway MySQL has Public Networking Enabled

1. **In Railway Dashboard** → Your MySQL Service
2. **Settings** → Look for **"Public Networking"** or **"External Access"**
3. **Enable it** if it's disabled
4. **Copy the public hostname** (not `mysql.railway.internal`)

### If Railway MySQL Doesn't Support Public Access

You have two options:

**Option A: Enable Public Networking on Railway MySQL**
- Railway free tier MySQL might support public networking
- Check Railway MySQL service settings

**Option B: Use Render PostgreSQL (Free)**
- Create PostgreSQL database in Render
- Change `DB_CONNECTION=pgsql`
- Update other DB settings accordingly
- Run migrations again

---

## ✅ Verification Steps

After updating:

1. **Check Render Logs** - Should show successful database connection
2. **Test Database**: In Render Shell, run:
   ```bash
   php artisan tinker
   >>> DB::connection()->getPdo();
   ```
3. **Visit your site** - Should load without 500 errors

---

## 📝 Quick Fix Checklist

- [ ] Remove quotes from `APP_KEY`, `APP_NAME`, `MAIL_FROM_NAME`
- [ ] Update `APP_URL` to `https://smile-suite.onrender.com`
- [ ] Update `VITE_APP_URL` to `https://smile-suite.onrender.com`
- [ ] Get Railway MySQL **public hostname** (not internal)
- [ ] Update `DB_HOST` with Railway's public hostname
- [ ] Change `LOG_LEVEL` to `error` (production)
- [ ] Redeploy service

---

**Note**: If you set up a custom domain later, update `APP_URL` and `VITE_APP_URL` to match your custom domain.

