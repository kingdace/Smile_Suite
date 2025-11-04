# 🌐 Render Custom Domain Setup Guide (Free Tier)

Yes! You **CAN** use a custom domain on Render's free tier! 🎉

## ✅ What's Included (Free Tier)

- ✅ **Custom domains** - Up to **2 domains** per workspace
- ✅ **Automatic SSL certificates** - HTTPS by default
- ✅ **Free SSL** - Let's Encrypt certificates automatically provisioned
- ✅ **DNS management** - Easy DNS configuration

## ⚠️ Limitations (Free Tier)

- **Max 2 custom domains** across all services in your workspace
- **Service spin-down** - Free services sleep after 15min inactivity (custom domain still works, just takes ~30s to wake up)

## 🚀 Step-by-Step Setup

### Step 1: Add Domain in Render Dashboard

1. Go to **Render Dashboard** → Your Service (`smile-suite-web`)
2. Click **Settings** → Scroll to **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `smilesuite.com` or `www.smilesuite.com`)
5. Click **Save**

### Step 2: Configure DNS Records

Render will show you DNS records to add. You need to add them at your **domain registrar** (where you bought the domain).

#### Option A: Root Domain (smilesuite.com)

Add these DNS records:

**Type**: `A`  
**Name**: `@` (or leave blank)  
**Value**: Render's IP address (shown in dashboard)

**Type**: `CNAME`  
**Name**: `www`  
**Value**: `smile-suite.onrender.com` (your Render service URL)

#### Option B: Subdomain (app.smilesuite.com)

**Type**: `CNAME`  
**Name**: `app` (or your subdomain)  
**Value**: `smile-suite.onrender.com`

### Step 3: Update Environment Variables

In Render Dashboard → Your Service → Environment:

Update `APP_URL` to match your custom domain:
```env
APP_URL=https://smilesuite.com
```
(Or `https://www.smilesuite.com` if using www)

### Step 4: Verify Domain

1. After adding DNS records, wait **5-30 minutes** for DNS propagation
2. In Render Dashboard, click **"Verify"** next to your domain
3. Render will automatically provision SSL certificate (takes a few minutes)

### Step 5: Update Laravel Configuration

In your codebase, make sure:

1. **`config/app.php`** uses `APP_URL` from environment:
   ```php
   'url' => env('APP_URL', 'http://localhost'),
   ```

2. **Update Render Environment Variable**:
   - Set `APP_URL=https://your-custom-domain.com`

3. **Redeploy** (or Render will auto-deploy when you change env vars)

## 📋 DNS Configuration Examples

### For Namecheap/Domain.com:

1. Go to **Domain List** → **Manage**
2. Go to **Advanced DNS** tab
3. Add records:

```
Type: A Record
Host: @
Value: [Render's IP]
TTL: Automatic

Type: CNAME Record
Host: www
Value: smile-suite.onrender.com
TTL: Automatic
```

### For Cloudflare:

1. Go to **DNS** → **Records**
2. Add records (same as above)
3. **Important**: Set SSL/TLS to **"Full"** mode

### For GoDaddy:

1. Go to **DNS Management**
2. Add records (same as above)

## 🔍 Verification Checklist

- [ ] Domain added in Render Dashboard
- [ ] DNS records added at domain registrar
- [ ] DNS propagation complete (check with `nslookup` or `dig`)
- [ ] Domain verified in Render Dashboard
- [ ] SSL certificate provisioned (shows "Valid" in Render)
- [ ] `APP_URL` updated in environment variables
- [ ] Service redeployed with new `APP_URL`

## 🧪 Test Your Setup

1. **Check DNS propagation**:
   ```bash
   nslookup your-domain.com
   # or
   dig your-domain.com
   ```

2. **Test HTTPS**:
   - Visit `https://your-domain.com`
   - Check for SSL lock icon in browser

3. **Test Laravel**:
   - Visit your domain
   - Check that `APP_URL` is correct in Laravel logs

## 🆘 Troubleshooting

### Domain Not Resolving

- **Wait longer** - DNS can take up to 48 hours (usually 5-30 minutes)
- **Check DNS records** - Make sure they're correct
- **Clear DNS cache**: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### SSL Certificate Not Provisioning

- **Wait 10-15 minutes** after DNS verification
- **Check DNS propagation** - Must be fully propagated first
- **Verify domain** - Click "Verify" again in Render Dashboard

### 500 Error After Adding Domain

- **Update APP_URL** environment variable to match your custom domain
- **Redeploy** service
- **Check logs** for APP_URL mismatch errors

### Domain Shows "Pending Verification"

- **Check DNS records** are correct
- **Wait for DNS propagation**
- **Click "Verify" again** in Render Dashboard

## 💡 Pro Tips

1. **Use www subdomain**: Always use `www.yourdomain.com` for better compatibility
2. **Set up redirect**: Redirect root domain to www (handled by Render automatically)
3. **Monitor SSL**: Render automatically renews SSL certificates
4. **Test both HTTP and HTTPS**: Both should work (HTTPS is preferred)

## 📚 Additional Resources

- Render Custom Domains Docs: https://render.com/docs/custom-domains
- Render SSL Certificates: https://render.com/docs/ssl-certificates

## ✅ Quick Start Command

```bash
# In Render Dashboard:
1. Settings → Custom Domains → Add Domain
2. Copy DNS records shown
3. Add to your domain registrar
4. Update APP_URL environment variable
5. Wait 10-30 minutes
6. Done! ✅
```

---

**Note**: While custom domains are free on Render, you still need to **purchase the domain** from a registrar (like Namecheap, GoDaddy, Cloudflare, etc.) - that cost is separate.

