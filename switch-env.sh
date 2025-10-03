#!/bin/bash

# Environment Switching Script for Smile Suite
# Usage: ./switch-env.sh [local|production]

ENV=${1:-local}

echo "🔄 Switching to $ENV environment..."

# Backup current .env
if [ -f ".env" ]; then
    cp .env .env.backup
    echo "✅ Current .env backed up to .env.backup"
fi

# Switch environment
case $ENV in
    "local")
        cp .env.local .env
        echo "✅ Switched to LOCAL development environment"
        echo "🌐 App URL: http://localhost"
        echo "🐛 Debug mode: ENABLED"
        ;;
    "production")
        cp .env.production .env
        echo "✅ Switched to PRODUCTION environment"
        echo "🌐 App URL: https://yourdomain.com"
        echo "🐛 Debug mode: DISABLED"
        echo "⚠️  Remember to update database and email settings!"
        ;;
    *)
        echo "❌ Invalid environment. Use 'local' or 'production'"
        echo "Usage: ./switch-env.sh [local|production]"
        exit 1
        ;;
esac

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "🎉 Environment switched successfully!"
echo "💡 Run 'php artisan serve' to start development server"
