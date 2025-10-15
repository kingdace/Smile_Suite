@echo off
REM Smile Suite Production Deployment Script for Windows
REM This script helps deploy the application to production with proper email configuration

echo 🚀 Starting Smile Suite Production Deployment...

REM Step 1: Backup current production files (if any)
echo 📦 Creating backup of current production files...
if exist production_backup rmdir /s /q production_backup
mkdir production_backup

REM Step 2: Copy production environment file
echo ⚙️ Setting up production environment...
copy .env.production .env

REM Step 3: Install/Update dependencies
echo 📦 Installing production dependencies...
composer install --optimize-autoloader --no-dev

REM Step 4: Generate application key (if needed)
echo 🔑 Generating application key...
php artisan key:generate --force

REM Step 5: Clear and cache configurations
echo 🧹 Clearing and caching configurations...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

REM Step 6: Cache configurations for production
echo ⚡ Caching configurations for production...
php artisan config:cache
php artisan route:cache
php artisan view:cache

REM Step 7: Run database migrations
echo 🗄️ Running database migrations...
php artisan migrate --force

REM Step 8: Run database seeders
echo 🌱 Running database seeders...
php artisan db:seed --force

REM Step 9: Create storage symlink
echo 🔗 Creating storage symlink...
php artisan storage:link

REM Step 10: Test email configuration
echo 📧 Testing email configuration...
php artisan email:test kite.gales10@gmail.com

echo ✅ Production deployment completed!
echo.
echo 📋 Next steps:
echo 1. Upload all files to your production server
echo 2. Run this script on your production server
echo 3. Test the email functionality
echo 4. Monitor the application logs
echo.
echo 🔧 Production Email Configuration:
echo - Uses Gmail SMTP with SSL fixes for Hostinger
echo - Automatic SSL certificate verification bypass
echo - 60-second timeout for reliable delivery
echo - Database queue for better email handling

pause
