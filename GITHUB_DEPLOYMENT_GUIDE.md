# 🚀 GitHub Deployment Guide for Smile Suite

## 📋 Prerequisites

### ✅ Required Accounts & Tools

-   [x] GitHub account
-   [x] Hostinger cPanel account
-   [x] Domain connected to Cloudflare
-   [x] Git installed on your computer

---

## 🎯 Method 1: GitHub + cPanel File Manager (Recommended)

### Step 1: Prepare Your Repository

1. **Create GitHub Repository**

    ```bash
    # In your project directory
    git init
    git add .
    git commit -m "Initial commit - Smile Suite ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/smile-suite.git
    git push -u origin main
    ```

2. **Create .env.example for production**
    ```bash
    cp .env.production .env.example
    ```

### Step 2: Download from GitHub to cPanel

1. **Access cPanel File Manager**

    - Login to your Hostinger cPanel
    - Go to **File Manager**
    - Navigate to `public_html` folder

2. **Download from GitHub**
    - Go to your GitHub repository
    - Click **Code** → **Download ZIP**
    - Upload the ZIP file to `public_html`
    - Extract the ZIP file
    - Move all files from the extracted folder to `public_html`

### Step 3: Configure Production Environment

1. **Create .env file in cPanel**

    - In File Manager, create a new file called `.env`
    - Copy the contents from `.env.production`
    - Update the following values:
        ```
        APP_URL=https://yourdomain.com
        DB_DATABASE=your_cpanel_database_name
        DB_USERNAME=your_cpanel_db_username
        DB_PASSWORD=your_cpanel_db_password
        MAIL_USERNAME=noreply@yourdomain.com
        MAIL_PASSWORD=your_email_password
        ```

2. **Set up Database**
    - In cPanel, go to **MySQL Databases**
    - Create database: `smile_suite_prod`
    - Create user and assign to database
    - Note down credentials

### Step 4: Run Deployment Commands

1. **Access Terminal in cPanel**

    - Go to **Terminal** in cPanel
    - Navigate to your project: `cd public_html`

2. **Run Deployment Script**

    ```bash
    # Install dependencies
    composer install --optimize-autoloader --no-dev --no-interaction

    # Install NPM dependencies
    npm install --production

    # Build assets
    npm run build

    # Generate app key
    php artisan key:generate --force

    # Run migrations
    php artisan migrate --force

    # Seed database
    php artisan db:seed --force

    # Clear and cache
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

---

## 🎯 Method 2: GitHub + Git Clone (Advanced)

### Step 1: Enable SSH in cPanel

1. **Generate SSH Key**

    - In cPanel, go to **SSH/Shell Access**
    - Generate a new SSH key
    - Add your GitHub SSH key to authorized_keys

2. **Clone Repository**
    ```bash
    cd ~/public_html
    git clone https://github.com/YOUR_USERNAME/smile-suite.git .
    ```

### Step 2: Set up Environment

```bash
# Copy environment file
cp .env.production .env

# Edit .env with your production values
nano .env

# Run deployment commands
composer install --optimize-autoloader --no-dev
npm install --production
npm run build
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔧 Post-Deployment Configuration

### 1. Set File Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

### 2. Configure .htaccess

-   Copy `public_html.htaccess` to `public_html/.htaccess`
-   Ensure mod_rewrite is enabled in cPanel

### 3. Test Your Application

-   Visit `https://yourdomain.com`
-   Test all major features
-   Check email functionality
-   Verify database connections

---

## 🔄 Updating Your Application

### Method 1: Manual Update

1. Download latest from GitHub
2. Upload to cPanel
3. Run: `php artisan migrate --force`
4. Run: `php artisan config:cache`

### Method 2: Git Pull (if SSH enabled)

```bash
cd ~/public_html
git pull origin main
php artisan migrate --force
php artisan config:cache
```

---

## 🛡️ Security Checklist

-   [ ] `.env` file is not accessible via web
-   [ ] `storage` and `bootstrap/cache` have correct permissions
-   [ ] Database credentials are secure
-   [ ] Email credentials are secure
-   [ ] SSL certificate is active
-   [ ] Cloudflare security settings are enabled

---

## 🆘 Troubleshooting

### Common Issues:

1. **500 Error**: Check file permissions and .htaccess
2. **Database Connection**: Verify credentials in .env
3. **Asset Loading**: Run `npm run build` again
4. **Email Issues**: Check SMTP settings

### Debug Commands:

```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Test database connection
php artisan tinker
DB::connection()->getPdo();

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## 📞 Support

If you encounter issues:

1. Check the Laravel logs in `storage/logs/`
2. Verify your .env configuration
3. Ensure all dependencies are installed
4. Check file permissions

Your Smile Suite is production-ready! 🎉
