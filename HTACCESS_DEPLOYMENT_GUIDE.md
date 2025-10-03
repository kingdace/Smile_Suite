# 🔧 .htaccess Deployment Guide for Smile Suite

## 📋 **Files Created for You**

I've created two `.htaccess` files for your Smile Suite deployment:

1. **`smilesuite.htaccess`** - Complete production configuration with all optimizations
2. **`smilesuite-simple.htaccess`** - Simplified version for easy deployment

## 🎯 **Quick Deployment Steps**

### **Step 1: Choose Your .htaccess File**

**For Maximum Performance (Recommended):**

-   Use `smilesuite.htaccess` - includes caching, compression, and security headers

**For Simple Setup:**

-   Use `smilesuite-simple.htaccess` - basic configuration that works on most servers

### **Step 2: Deploy to cPanel**

1. **Access cPanel File Manager**

    - Login to your Hostinger cPanel
    - Go to **File Manager**
    - Navigate to `public_html` folder

2. **Create .htaccess File**

    - Right-click in `public_html` folder
    - Select **"New File"**
    - Name it `.htaccess` (with the dot at the beginning)

3. **Copy Content**
    - Open the `.htaccess` file you created
    - Copy the content from either:
        - `smilesuite.htaccess` (recommended)
        - `smilesuite-simple.htaccess` (simple)
    - Paste it into the file
    - Save the file

### **Step 3: Verify Deployment**

1. **Check File Permissions**

    - Right-click on `.htaccess`
    - Select **"Change Permissions"**
    - Set to `644`

2. **Test Your Website**
    - Visit `https://smilesuite.site`
    - Check if the site loads correctly
    - Test navigation between pages

## 🔍 **What Each .htaccess Does**

### **smilesuite.htaccess (Complete Version)**

✅ **HTTPS Enforcement** - Forces all traffic to use HTTPS
✅ **URL Rewriting** - Handles Laravel routing properly
✅ **Security Headers** - Protects against common attacks
✅ **File Protection** - Blocks access to sensitive files
✅ **Caching** - Optimizes loading speed for static assets
✅ **Compression** - Reduces file sizes for faster loading
✅ **Smile Suite Optimized** - Specifically configured for your app

### **smilesuite-simple.htaccess (Simple Version)**

✅ **HTTPS Enforcement** - Forces all traffic to use HTTPS
✅ **URL Rewriting** - Handles Laravel routing properly
✅ **Basic Security** - Essential security headers
✅ **File Protection** - Blocks access to sensitive files
✅ **Basic Caching** - Simple caching for static assets

## 🛡️ **Security Features**

Both `.htaccess` files include:

-   **Environment File Protection** - Blocks access to `.env`
-   **Artisan File Protection** - Blocks access to `artisan`
-   **Directory Protection** - Blocks access to sensitive directories
-   **Security Headers** - XSS protection, clickjacking prevention
-   **HTTPS Enforcement** - Forces secure connections

## ⚡ **Performance Optimizations**

The complete version includes:

-   **Static Asset Caching** - Images, CSS, JS cached for 1 month
-   **JSON File Caching** - PSGC data cached for 1 week
-   **Gzip Compression** - Reduces file sizes by 60-80%
-   **Browser Caching** - Reduces server load and improves speed

## 🚨 **Troubleshooting**

### **If Your Site Doesn't Load:**

1. **Check .htaccess Syntax**

    - Make sure there are no extra spaces or characters
    - Verify all brackets are properly closed

2. **Check File Permissions**

    - `.htaccess` should be `644`
    - `public` directory should be `755`

3. **Check mod_rewrite**

    - Contact Hostinger support to enable mod_rewrite
    - Most Hostinger accounts have this enabled by default

4. **Check Error Logs**
    - Go to cPanel → Error Logs
    - Look for any .htaccess related errors

### **Common Issues:**

**500 Internal Server Error:**

-   Usually means mod_rewrite is not enabled
-   Contact Hostinger support

**CSS/JS Not Loading:**

-   Check if the `public` directory is accessible
-   Verify file paths in your Laravel app

**Redirect Loops:**

-   Check if HTTPS is already enforced by Hostinger
-   Remove the HTTPS redirect lines if needed

## 📞 **Support Commands**

If you need to debug:

```bash
# Check if mod_rewrite is enabled
php -m | grep rewrite

# Check .htaccess syntax
apache2ctl configtest

# Check file permissions
ls -la .htaccess
```

## ✅ **Verification Checklist**

After deployment, verify:

-   [ ] Website loads at `https://smilesuite.site`
-   [ ] All pages navigate correctly
-   [ ] CSS and JavaScript load properly
-   [ ] Images display correctly
-   [ ] No 500 errors in browser console
-   [ ] HTTPS is enforced (green lock in browser)
-   [ ] Admin panel accessible at `/admin`
-   [ ] Patient portal accessible at `/patient/dashboard`

## 🎉 **You're Ready!**

Your Smile Suite is now properly configured for production with:

-   ✅ Secure HTTPS connections
-   ✅ Optimized performance
-   ✅ Protected sensitive files
-   ✅ Proper Laravel routing
-   ✅ Production-ready configuration

Your website should now work perfectly at `https://smilesuite.site`! 🚀
