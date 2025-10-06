#!/bin/bash

# Smile Suite Production Deployment Script
# This script helps deploy the application to production with proper email configuration

echo "🚀 Starting Smile Suite Production Deployment..."

# Step 1: Backup current production files (if any)
echo "📦 Creating backup of current production files..."
if [ -d "production_backup" ]; then
    rm -rf production_backup
fi
mkdir production_backup

# Step 2: Copy production environment file
echo "⚙️ Setting up production environment..."
cp .env.production .env

# Step 3: Install/Update dependencies
echo "📦 Installing production dependencies..."
composer install --optimize-autoloader --no-dev

# Step 4: Generate application key (if needed)
echo "🔑 Generating application key..."
php artisan key:generate --force

# Step 5: Clear and cache configurations
echo "🧹 Clearing and caching configurations..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Step 6: Cache configurations for production
echo "⚡ Caching configurations for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 7: Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Step 8: Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Step 9: Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Step 10: Test email configuration
echo "📧 Testing email configuration..."
php artisan email:test kite.gales10@gmail.com

echo "✅ Production deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files to your production server"
echo "2. Run this script on your production server"
echo "3. Test the email functionality"
echo "4. Monitor the application logs"
echo ""
echo "🔧 Production Email Configuration:"
echo "- Uses Gmail SMTP with SSL fixes for Hostinger"
echo "- Automatic SSL certificate verification bypass"
echo "- 60-second timeout for reliable delivery"
echo "- Database queue for better email handling"
