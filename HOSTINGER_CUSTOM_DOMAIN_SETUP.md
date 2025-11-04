# 🌐 Hostinger Custom Domain Setup for Render

## 🎯 Goal

Connect your custom domain `smilesuite.site` from Hostinger to your Render deployment at `smile-suite.onrender.com`.

---

## 📋 Step-by-Step Guide

### Step 1: Add Domain in Render Dashboard

1. Go to **Render Dashboard** → Your Service (`smile-suite-web`)
2. Click **Settings** tab
3. Scroll down to **"Custom Domains"** section
4. Click **"Add Custom Domain"**
5. Enter: `smilesuite.site`
6. Click **"Save"**

Render will show you DNS records to add. You'll need:
- **A Record** for root domain (`smilesuite.site`)
- **CNAME Record** for www subdomain (`www.smilesuite.site`)

---

### Step 2: Configure DNS in Hostinger

#### Option A: Root Domain Only (smilesuite.site)

1. **Login to Hostinger** → Go to **hPanel**
2. Navigate to **Domains** → Click on **smilesuite.site**
3. Go to **"DNS / Name Servers"** section
4. Click **"Manage DNS Records"** or **"DNS Zone Editor"**

5. **Add A Record**:
   - **Type**: `A`
   - **Name/Host**: `@` (or leave blank)
   - **Points to/Value**: `[Render's IP address]` (Render will show this - usually looks like `216.24.57.1` or similar)
   - **TTL**: `3600` (or default)
   - Click **"Add Record"** or **"Save"**

6. **Add CNAME Record for www**:
   - **Type**: `CNAME`
   - **Name/Host**: `www`
   - **Points to/Value**: `smile-suite.onrender.com` (your Render service URL)
   - **TTL**: `3600` (or default)
   - Click **"Add Record"** or **"Save"**

#### Option B: Using CNAME for Root Domain (Alternative)

Some hosts allow CNAME for root domain. If Hostinger supports it:

1. **Add CNAME Record**:
   - **Type**: `CNAME`
   - **Name/Host**: `@` (or leave blank)
   - **Points to/Value**: `smile-suite.onrender.com`
   - **TTL**: `3600`
   - Click **"Add Record"**

2. **Add CNAME for www** (same as above)

---

### Step 3: Get Render's DNS Records

After adding the domain in Render, you'll see:

**Example DNS Records (Render will show actual values):**

```
Type: A
Name: @
Value: 216.24.57.1

Type: CNAME
Name: www
Value: smile-suite.onrender.com
```

**Copy these exact values** from Render Dashboard.

---

### Step 4: Update Environment Variables in Render

After DNS is configured, update your Render environment variables:

1. Go to **Render Dashboard** → Your Service → **Environment**
2. Update these variables:

```env
APP_URL=https://smilesuite.site
VITE_APP_URL=https://smilesuite.site
```

3. **Save** and **Redeploy** (or wait for auto-deploy)

---

### Step 5: Verify Domain in Render

1. Go back to **Settings** → **Custom Domains**
2. Click **"Verify"** next to your domain
3. Render will check DNS propagation
4. Wait 5-30 minutes for verification

---

### Step 6: Wait for SSL Certificate

1. After DNS verification, Render automatically provisions SSL certificate
2. This takes **5-15 minutes**
3. Check status in Render Dashboard - should show **"Valid"** when ready

---

## 🔍 Detailed Hostinger DNS Setup

### Finding DNS Settings in Hostinger

1. **Login to Hostinger hPanel**
2. Click **"Domains"** in sidebar
3. Find **smilesuite.site** → Click **"Manage"**
4. Look for **"DNS Zone Editor"** or **"DNS Records"**
5. Click **"Manage DNS Records"**

### Hostinger DNS Record Format

When adding records in Hostinger, you'll see fields like:

- **Type**: Dropdown (A, CNAME, etc.)
- **Name**: The subdomain (use `@` for root, `www` for www)
- **Points to/Value**: The target value
- **TTL**: Time to live (3600 is fine)

### Example Records in Hostinger

**Record 1 (A Record):**
```
Type: A
Name: @
Points to: 216.24.57.1
TTL: 3600
```

**Record 2 (CNAME for www):**
```
Type: CNAME
Name: www
Points to: smile-suite.onrender.com
TTL: 3600
```

---

## ✅ Verification Checklist

After setup:

- [ ] Domain added in Render Dashboard
- [ ] A Record added in Hostinger (points to Render's IP)
- [ ] CNAME Record added for www (points to Render service)
- [ ] DNS records saved in Hostinger
- [ ] `APP_URL` updated in Render to `https://smilesuite.site`
- [ ] `VITE_APP_URL` updated in Render to `https://smilesuite.site`
- [ ] Domain verified in Render (green checkmark)
- [ ] SSL certificate provisioned (shows "Valid")
- [ ] Service redeployed with new APP_URL

---

## 🧪 Test Your Setup

### 1. Check DNS Propagation

Wait 5-30 minutes, then test:

```bash
# Windows PowerShell
nslookup smilesuite.site

# Or use online tool
# https://www.whatsmydns.net/#A/smilesuite.site
```

Should show Render's IP address.

### 2. Test HTTPS

Visit in browser:
- `https://smilesuite.site` - Should load with SSL
- `https://www.smilesuite.site` - Should redirect or load

### 3. Check SSL Certificate

- Browser should show **padlock icon** 🔒
- Certificate should be valid (not expired)

---

## 🆘 Troubleshooting

### Domain Not Resolving

**Problem**: Website doesn't load, DNS not found

**Solutions**:
1. **Wait longer** - DNS can take up to 48 hours (usually 5-30 min)
2. **Check DNS records** - Make sure they're exactly as Render shows
3. **Clear DNS cache**:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   ```

### SSL Certificate Not Provisioning

**Problem**: Shows "Pending" or "Invalid" in Render

**Solutions**:
1. **Wait 10-15 minutes** after DNS verification
2. **Verify DNS propagation** - Must be fully propagated first
3. **Check DNS records** - Make sure they're correct
4. **Click "Verify" again** in Render Dashboard

### 500 Error After Adding Domain

**Problem**: Domain loads but shows 500 error

**Solutions**:
1. **Update APP_URL** in Render environment variables
2. **Redeploy** service
3. **Check logs** for APP_URL mismatch errors

### www Not Working

**Problem**: Root domain works but www doesn't

**Solutions**:
1. **Check CNAME record** for www in Hostinger
2. **Verify it points to** `smile-suite.onrender.com`
3. **Wait for DNS propagation**

---

## 📝 Hostinger-Specific Notes

### Hostinger DNS Management

- **Location**: hPanel → Domains → Manage → DNS Zone Editor
- **TTL**: Usually defaults to 3600 (1 hour) - this is fine
- **Record Types**: Hostinger supports A, CNAME, MX, TXT, etc.

### Hostinger Support

If you need help:
- **Live Chat**: Available in hPanel
- **Support Ticket**: Submit through hPanel
- **Documentation**: https://www.hostinger.com/tutorials/dns

---

## 🔄 After Setup Complete

Once everything works:

1. **Test all features** on your custom domain
2. **Monitor SSL certificate** - Render auto-renews it
3. **Update any hardcoded URLs** in your codebase
4. **Test notifications** - Make sure they work with new domain

---

## ✅ Quick Reference

**Hostinger DNS Location:**
```
hPanel → Domains → smilesuite.site → Manage → DNS Zone Editor
```

**Render Settings:**
```
Dashboard → smile-suite-web → Settings → Custom Domains
```

**Environment Variables to Update:**
```env
APP_URL=https://smilesuite.site
VITE_APP_URL=https://smilesuite.site
```

---

## 🎉 Expected Timeline

- **DNS Setup**: 5 minutes
- **DNS Propagation**: 5-30 minutes
- **SSL Provisioning**: 5-15 minutes after DNS verified
- **Total**: Usually **15-45 minutes** from start to finish

---

**Need help?** Check Render logs or Hostinger support if you encounter issues!

