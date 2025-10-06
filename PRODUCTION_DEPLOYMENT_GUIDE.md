# 🚀 Smile Suite Production Deployment Guide

## 📋 Overview

This guide will help you deploy Smile Suite to production with working email functionality.

## 🔧 Production Environment Configuration

### Updated `.env.production` Features:

-   ✅ **Gmail SMTP Configuration**: Optimized for Hostinger cPanel
-   ✅ **SSL Certificate Fixes**: Automatic bypass for production servers
-   ✅ **Database Queue**: Better email handling and reliability
-   ✅ **Production Security**: Secure cookies and session settings
-   ✅ **Cache Optimization**: File-based caching for better performance

## 📁 Files to Upload to Production

### Core Application Files:

```
app/
config/
database/
resources/
routes/
storage/
vendor/
public/
.env.production
artisan
composer.json
composer.lock
```

### New/Updated Files for Email Fix:

```
app/Providers/SmtpSslFixServiceProvider.php
config/mail.php
config/app.php
deploy_production.sh (Linux/Mac)
deploy_production.bat (Windows)
```

## 🚀 Deployment Steps

### Step 1: Upload Files

1. Upload all files to your production server
2. Rename `.env.production` to `.env` on the server
3. Update database credentials in `.env` if needed

### Step 2: Run Deployment Script

**For Linux/Mac:**

```bash
chmod +x deploy_production.sh
./deploy_production.sh
```

**For Windows:**

```cmd
deploy_production.bat
```

**Manual Commands (if scripts don't work):**

```bash
# Set production environment
cp .env.production .env

# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate key
php artisan key:generate --force

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Test email
php artisan email:test your-email@example.com
```

## 📧 Email Configuration Details

### Production Email Settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=kite.gales10@gmail.com
MAIL_PASSWORD=wknwpeazsyquszum
MAIL_FROM_ADDRESS=kite.gales10@gmail.com
MAIL_FROM_NAME="Smile Suite"
MAIL_EHLO_DOMAIN=smilesuite.site
MAIL_TIMEOUT=60
```

### SSL Certificate Fix:

-   **Automatic**: Applied only in production environment
-   **Purpose**: Bypasses SSL certificate verification issues on Hostinger
-   **Safety**: Only affects email sending, not other SSL operations

## 🔍 Testing Email Functionality

### Test Commands:

```bash
# Test basic email
php artisan email:test your-email@example.com

# Test specific email types
php artisan tinker
>>> Mail::to('test@example.com')->send(new App\Mail\AppointmentReceivedMail(...));
```

### Email Types to Test:

1. **Appointment Emails**:

    - Appointment received
    - Appointment approved
    - Appointment denied
    - Appointment rescheduled

2. **Subscription Emails**:

    - Trial expiration
    - Subscription expiration
    - Grace period
    - Suspension

3. **Payment Emails**:
    - Payment confirmation
    - Payment failed
    - Subscription payment received

## 🛠️ Troubleshooting

### Common Issues:

**1. Email Not Sending:**

```bash
# Check configuration
php artisan config:show mail

# Test connection
php artisan email:test

# Check logs
tail -f storage/logs/laravel.log
```

**2. SSL Certificate Errors:**

-   The `SmtpSslFixServiceProvider` should handle this automatically
-   If issues persist, check that `APP_ENV=production` in `.env`

**3. Database Queue Issues:**

```bash
# Run queue worker
php artisan queue:work

# Check failed jobs
php artisan queue:failed
```

## 📊 Monitoring

### Log Files to Monitor:

-   `storage/logs/laravel.log` - General application logs
-   `storage/logs/mail.log` - Email-specific logs (if configured)

### Key Metrics:

-   Email delivery success rate
-   Queue job processing
-   SSL certificate bypass effectiveness

## 🔒 Security Notes

### Production Security Features:

-   ✅ **Secure Cookies**: `SESSION_SECURE_COOKIE=true`
-   ✅ **HTTP Only Sessions**: `SESSION_HTTP_ONLY=true`
-   ✅ **SameSite Protection**: `SESSION_SAME_SITE=lax`
-   ✅ **Debug Mode Disabled**: `APP_DEBUG=false`
-   ✅ **Error Logging**: `LOG_LEVEL=error`

## 📞 Support

If you encounter issues:

1. Check the logs in `storage/logs/laravel.log`
2. Verify your Gmail App Password is correct
3. Ensure your production server can connect to Gmail SMTP
4. Test with the provided email test command

## ✅ Success Checklist

-   [ ] All files uploaded to production server
-   [ ] `.env.production` renamed to `.env`
-   [ ] Database credentials updated
-   [ ] Dependencies installed (`composer install --no-dev`)
-   [ ] Configuration cached (`php artisan config:cache`)
-   [ ] Database migrated (`php artisan migrate --force`)
-   [ ] Storage linked (`php artisan storage:link`)
-   [ ] Email test successful (`php artisan email:test`)
-   [ ] Application accessible via web browser
-   [ ] All email types working (appointments, subscriptions, payments)

---

**🎉 Congratulations!** Your Smile Suite application should now be fully functional in production with working email capabilities!
