# 🔧 Subdirectory Deployment Fix for Smile Suite

## 🎯 **Your Current Structure**

```
public_html/
├── smile_suite/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── index.php (Laravel entry point)
│   ├── build/ (React assets)
│   ├── images/
│   ├── psgc/
│   ├── storage/
│   ├── vendor/
│   └── .env
└── (other files)
```

## 🚨 **The Problem**

Your domain `smilesuite.site` points to `public_html/`, but your Laravel app is in `public_html/smile_suite/`. You need to either:

1. **Option A**: Redirect from root to subdirectory
2. **Option B**: Move files to root level
3. **Option C**: Change domain to point to subdirectory

## ✅ **Solution 1: Redirect from Root to Subdirectory (Recommended)**

### **Step 1: Create Root .htaccess**

Create a `.htaccess` file in `public_html/` (root level) with this content:

```apache
# Redirect all traffic to smile_suite subdirectory
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/smile_suite/
RewriteRule ^(.*)$ /smile_suite/$1 [L,R=301]
```

### **Step 2: Update Subdirectory .htaccess**

Replace the `.htaccess` in `public_html/smile_suite/` with the content from `smilesuite-subdirectory.htaccess`.

### **Step 3: Update index.php**

Replace `public_html/smile_suite/index.php` with the content from `index-subdirectory.php`.

## ✅ **Solution 2: Move Files to Root (Alternative)**

### **Step 1: Move All Files**

Move everything from `public_html/smile_suite/` to `public_html/`:

```bash
# In cPanel File Manager:
# Move all files from smile_suite/ to public_html/
```

### **Step 2: Update .htaccess**

Use the content from `smilesuite-fixed.htaccess` in `public_html/.htaccess`.

### **Step 3: Update index.php**

Use the content from `index.php` in `public_html/index.php`.

## ✅ **Solution 3: Change Domain Document Root (Advanced)**

### **Step 1: Contact Hostinger Support**

Ask them to change your document root from `public_html/` to `public_html/smile_suite/`.

### **Step 2: Use Original .htaccess**

Use the original `.htaccess` from your `public/` folder.

## 🔧 **Quick Fix Steps (Recommended)**

### **Step 1: Create Root Redirect**

1. Go to cPanel File Manager
2. Navigate to `public_html/` (root level)
3. Create a new `.htaccess` file
4. Add this content:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/smile_suite/
RewriteRule ^(.*)$ /smile_suite/$1 [L,R=301]
```

### **Step 2: Fix Subdirectory .htaccess**

1. Go to `public_html/smile_suite/`
2. Replace `.htaccess` with content from `smilesuite-subdirectory.htaccess`

### **Step 3: Fix index.php**

1. Go to `public_html/smile_suite/`
2. Replace `index.php` with content from `index-subdirectory.php`

### **Step 4: Test**

Visit `https://smilesuite.site` - it should redirect to `https://smilesuite.site/smile_suite/` and work!

## 🎯 **Why This Happens**

The issue is that:

1. Your domain points to `public_html/` (root)
2. But your Laravel app is in `public_html/smile_suite/` (subdirectory)
3. The `.htaccess` in the subdirectory can't handle requests from the root
4. You need a redirect from root to subdirectory

## ✅ **After Fixing**

Your website will work at:

-   `https://smilesuite.site` (redirects to subdirectory)
-   `https://smilesuite.site/smile_suite/` (direct access)
-   `https://smilesuite.site/smile_suite/admin` (admin panel)
-   `https://smilesuite.site/smile_suite/patient/dashboard` (patient portal)

## 🚨 **If Still Getting 500 Error**

### **Check These:**

1. **File Permissions:**

    - `public_html/smile_suite/` folder: 755
    - `public_html/smile_suite/index.php`: 644
    - `public_html/smile_suite/.htaccess`: 644
    - `public_html/smile_suite/storage/`: 755

2. **Check Error Logs:**

    - Go to cPanel → Error Logs
    - Look for specific error messages

3. **Check .env File:**

    - Make sure `.env` exists in `public_html/smile_suite/`
    - Verify database credentials are correct

4. **Test Database Connection:**
    - Go to cPanel → Terminal
    - Run: `cd public_html/smile_suite && php artisan tinker`
    - Test: `DB::connection()->getPdo();`

## 📋 **Quick Checklist**

-   [ ] Created root `.htaccess` with redirect
-   [ ] Updated subdirectory `.htaccess`
-   [ ] Updated subdirectory `index.php`
-   [ ] Checked file permissions
-   [ ] Verified `.env` file exists
-   [ ] Tested database connection
-   [ ] Tested website at `https://smilesuite.site`

## 🎉 **Expected Result**

After fixing, when you visit `https://smilesuite.site`:

1. It will redirect to `https://smilesuite.site/smile_suite/`
2. Your Smile Suite application will load correctly
3. All features will work (admin panel, patient portal, etc.)

This should fix your 500 Internal Server Error! 🚀
