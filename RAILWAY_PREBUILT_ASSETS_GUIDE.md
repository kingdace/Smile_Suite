# 🚀 Railway Deployment with Pre-built Assets

This guide shows you how to deploy your Smile Suite project on Railway using your already built assets instead of running `npm run build` on Railway.

## ✅ **What We've Set Up:**

1. **Modified `nixpacks.toml`** - Skips npm build process
2. **Updated `.gitignore`** - Includes build folder in repository
3. **Simplified build process** - Only installs PHP dependencies

## 📁 **Step 1: Ensure Your Build Folder is Ready**

### 1.1 Check Your Build Folder

Make sure you have a `public/build` folder with:

-   `assets/` directory with your compiled JS/CSS
-   `manifest.json` file

### 1.2 Build Your Assets Locally (if needed)

If you need to rebuild your assets:

```bash
npm run build
```

## 🔄 **Step 2: Commit and Push to GitHub**

```bash
# Add all files including the build folder
git add .

# Commit the changes
git commit -m "Add pre-built assets for Railway deployment"

# Push to GitHub
git push origin main
```

## 🚀 **Step 3: Deploy on Railway**

### 3.1 Create/Update Railway Project

1. Go to [railway.app](https://railway.app)
2. Create a new project or update existing one
3. Connect your GitHub repository
4. Railway will automatically detect it's a PHP project

### 3.2 Railway Will Now:

-   ✅ Install PHP 8.2
-   ✅ Install Composer
-   ✅ Run `composer install --no-dev --optimize-autoloader`
-   ✅ Skip npm build (uses your pre-built assets)
-   ✅ Run Laravel optimization commands
-   ✅ Start the server

## 🎯 **Step 4: Configure Environment Variables**

Add these in Railway dashboard:

```env
APP_NAME="Smile Suite"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app
APP_KEY=base64:YOUR_GENERATED_KEY

# Database (Railway will provide these)
DB_CONNECTION=pgsql
DB_HOST=your-railway-db-host
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=your-railway-db-password

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true

# Cache
CACHE_STORE=database

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Smile Suite"

# File Storage
FILESYSTEM_DISK=local

# Vite
VITE_APP_NAME="${APP_NAME}"
```

## 🗄️ **Step 5: Add Database**

1. In Railway dashboard, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will create a PostgreSQL database
3. Copy the connection details to your environment variables

## ⚙️ **Step 6: Post-Deployment Setup**

After deployment, run these commands in Railway terminal:

```bash
# Generate application key
php artisan key:generate --force

# Run database migrations
php artisan migrate --force

# Seed the database (optional)
php artisan db:seed --force

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔄 **Step 7: Updating Your App**

When you make changes to your frontend:

1. **Build locally:**

    ```bash
    npm run build
    ```

2. **Commit and push:**

    ```bash
    git add .
    git commit -m "Update frontend assets"
    git push origin main
    ```

3. **Railway will automatically redeploy** with your new assets

## 🎯 **Benefits of This Approach:**

-   ✅ **Faster Deployments** - No npm build on Railway
-   ✅ **No Build Errors** - Uses your working local build
-   ✅ **Consistent Assets** - Same assets that work locally
-   ✅ **Lower Resource Usage** - No Node.js needed on Railway
-   ✅ **More Reliable** - Fewer moving parts

## 🚨 **Troubleshooting:**

### If Assets Don't Load:

1. Check if `public/build` folder exists in your repository
2. Verify `manifest.json` is present
3. Check file permissions in Railway logs

### If Build Folder is Missing:

1. Run `npm run build` locally
2. Commit the build folder: `git add public/build && git commit -m "Add build assets"`
3. Push to GitHub: `git push origin main`

### If Vite Assets Don't Work:

1. Make sure your `vite.config.js` is configured correctly
2. Check that `APP_URL` environment variable is set correctly
3. Verify the build folder structure matches your Vite configuration

## 📊 **File Structure After Setup:**

```
smile_suite/
├── public/
│   ├── build/              # ← Your pre-built assets
│   │   ├── assets/
│   │   └── manifest.json
│   ├── icons/
│   └── images/
├── resources/
├── app/
├── nixpacks.toml          # ← Railway config (no npm build)
├── railway.json
└── .gitignore             # ← Updated to include build folder
```

## 🎉 **Success!**

Your app should now be live at: `https://your-app-name.railway.app`

The deployment will be much faster and more reliable since it uses your pre-built assets instead of trying to build them on Railway's servers!

## 🔄 **Alternative: Manual Asset Upload**

If you prefer to upload assets manually:

1. **Zip your build folder:**

    ```bash
    cd public
    zip -r build.zip build/
    ```

2. **Upload to Railway:**

    - Go to Railway dashboard
    - Navigate to your service
    - Go to "Files" tab
    - Upload `build.zip`
    - Extract it to `public/build/`

3. **Update your deployment** to use the uploaded assets

This approach gives you complete control over your assets but requires manual updates each time you change your frontend.
