# 🔌 Railway MySQL Public Access for Render

## 📋 What You Have

Railway provides **two** connection options:
- **Private**: `RAILWAY_PRIVATE_DOMAIN` (internal only - won't work from Render)
- **Public**: `RAILWAY_TCP_PROXY_DOMAIN` (public access - USE THIS!)

## ✅ How to Get the Public MySQL Hostname

### Option 1: Check Railway Dashboard (Easiest)

1. Go to **Railway Dashboard** → Your MySQL Service
2. Click **"Connect"** or **"Variables"** tab
3. Look for **"Public Networking"** or **"TCP Proxy"** section
4. You should see something like:
   - **Hostname**: `containers-us-west-XXX.up.railway.app`
   - **Port**: `XXXXX` (a 5-digit number)

### Option 2: Check Railway Service Variables

In Railway MySQL service, look for these variables:
- `RAILWAY_TCP_PROXY_DOMAIN` - This is the public hostname
- `RAILWAY_TCP_PROXY_PORT` - This is the public port

**Copy these actual values** (not the template variables like `${{RAILWAY_TCP_PROXY_DOMAIN}}`)

---

## 🔧 Update Render Environment Variables

Once you have the public values, update Render:

### **Database Connection:**

```env
DB_CONNECTION=mysql
DB_DATABASE=railway
DB_HOST=YOUR_RAILWAY_TCP_PROXY_DOMAIN_HERE
DB_PORT=YOUR_RAILWAY_TCP_PROXY_PORT_HERE
DB_USERNAME=root
DB_PASSWORD=oshZOdRkwaTRvLikGpEexhANZjwWxamB
```

**Example** (your actual values will be different):
```env
DB_HOST=containers-us-west-12345.up.railway.app
DB_PORT=65432
```

---

## 🔍 Finding the Values in Railway

### Step 1: Go to MySQL Service Variables

1. Railway Dashboard → MySQL Service
2. Click **"Variables"** tab
3. Look for variables starting with `RAILWAY_TCP_PROXY`

### Step 2: Check Service Settings

1. Railway Dashboard → MySQL Service
2. Click **"Settings"** tab
3. Look for **"Public Networking"** or **"TCP Proxy"**
4. Should show the public domain and port

### Step 3: Check Service Logs

Sometimes Railway shows connection info in the service startup logs.

---

## 🚨 If You Can't Find Public Access

### Enable Public Networking:

1. Railway Dashboard → MySQL Service
2. **Settings** → **Networking**
3. Enable **"Public Networking"** or **"TCP Proxy"**
4. Railway will generate a public domain and port

### Alternative: Use Connection String

If Railway provides a full connection string like:
```
mysql://root:password@containers-us-west-XXX.up.railway.app:65432/railway
```

You can extract:
- **Host**: `containers-us-west-XXX.up.railway.app`
- **Port**: `65432`
- **Database**: `railway`
- **Username**: `root`
- **Password**: `password`

---

## ✅ Complete Render Environment Variables

After getting the public values:

```env
# Database (FIXED - Using Railway Public MySQL)
DB_CONNECTION=mysql
DB_DATABASE=railway
DB_HOST=YOUR_RAILWAY_TCP_PROXY_DOMAIN
DB_PORT=YOUR_RAILWAY_TCP_PROXY_PORT
DB_USERNAME=root
DB_PASSWORD=oshZOdRkwaTRvLikGpEexhANZjwWxamB
```

---

## 🧪 Test Connection

After updating, test in Render Shell:

```bash
php artisan tinker
>>> DB::connection()->getPdo();
```

Should return a PDO object without errors.

---

## 📝 Quick Checklist

- [ ] Found `RAILWAY_TCP_PROXY_DOMAIN` in Railway MySQL service
- [ ] Found `RAILWAY_TCP_PROXY_PORT` in Railway MySQL service
- [ ] Updated `DB_HOST` in Render with public domain
- [ ] Updated `DB_PORT` in Render with public port
- [ ] Kept `DB_DATABASE=railway`
- [ ] Kept `DB_USERNAME=root`
- [ ] Kept `DB_PASSWORD=oshZOdRkwaTRvLikGpEexhANZjwWxamB`
- [ ] Tested connection in Render Shell

---

**Note**: The `${{...}}` syntax you're seeing is Railway's template variable syntax. You need to find the **actual resolved values** in Railway's dashboard, not use the template syntax.

