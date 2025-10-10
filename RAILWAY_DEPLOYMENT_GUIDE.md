# 🚀 Railway Deployment Guide for Smile Suite

This guide will help you deploy your Smile Suite Laravel application on Railway using their free tier.

## 📋 Prerequisites

-   GitHub account
-   Railway account (free)
-   Your Smile Suite project pushed to GitHub

## 🎯 Railway Free Tier Limits

-   **$5 credit monthly** (usually enough for small-medium apps)
-   **512MB RAM** per service
-   **1GB storage** per service
-   **Automatic deployments** from GitHub
-   **Built-in PostgreSQL database**
-   **Custom domains** support

## 📁 Step 1: Prepare Your Project

### 1.1 Create Railway Configuration Files

The following files have been created for you:

-   `railway.json` - Railway deployment configuration
-   `nixpacks.toml` - Build configuration
-   `Procfile` - Process definition

### 1.2 Update Environment Variables

Create a production-ready `.env` file:

```env
APP_NAME="Smile Suite"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_TIMEZONE=Asia/Manila
APP_URL=https://your-app-name.railway.app

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

# Queue
QUEUE_CONNECTION=database

# Mail (use your Gmail or other SMTP)
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

# Pusher (optional)
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=

# Vite
VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## 🚀 Step 2: Deploy to Railway

### 2.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email address

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your Smile Suite repository
4. Railway will automatically detect it's a Laravel project

### 2.3 Add Database

1. In your Railway project dashboard
2. Click **"New"** → **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Note down the connection details

### 2.4 Configure Environment Variables

1. Go to your service settings
2. Click **"Variables"** tab
3. Add all the environment variables from your `.env` file
4. Railway will automatically provide database connection details

### 2.5 Deploy

1. Railway will automatically start building and deploying
2. Monitor the build logs
3. Wait for deployment to complete

## 🔧 Step 3: Post-Deployment Configuration

### 3.1 Run Database Migrations

1. Go to your service dashboard
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Go to **"Logs"** tab
5. Run these commands in the terminal:

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 3.2 Generate Application Key

```bash
php artisan key:generate --force
```

### 3.3 Clear Caches

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🌐 Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain

1. Go to your service settings
2. Click **"Domains"** tab
3. Add your custom domain
4. Update DNS records as instructed

### 4.2 Update Environment Variables

Update `APP_URL` to your custom domain:

```env
APP_URL=https://your-custom-domain.com
```

## 📊 Step 5: Monitor Your Application

### 5.1 Railway Dashboard

-   **Metrics**: CPU, Memory, Network usage
-   **Logs**: Real-time application logs
-   **Deployments**: Deployment history
-   **Variables**: Environment variables

### 5.2 Application Health

-   Check your application URL
-   Test all major features
-   Monitor error logs
-   Check database connectivity

## 🔧 Step 6: Troubleshooting

### Common Issues

1. **Build Failures**

    - Check build logs for errors
    - Ensure all dependencies are in `composer.json`
    - Verify Node.js and PHP versions

2. **Database Connection Issues**

    - Verify database credentials
    - Check if database is running
    - Ensure migrations are run

3. **Environment Variable Issues**

    - Check all required variables are set
    - Verify variable names and values
    - Restart the service after changes

4. **File Permission Issues**
    - Ensure storage directory is writable
    - Check file upload permissions

### Debug Commands

```bash
# Check Laravel configuration
php artisan config:show

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check routes
php artisan route:list

# Check environment
php artisan env
```

## 💰 Step 7: Cost Optimization

### Free Tier Tips

1. **Monitor Usage**: Check your monthly credit usage
2. **Optimize Images**: Compress images before upload
3. **Use CDN**: For static assets
4. **Database Optimization**: Regular cleanup
5. **Caching**: Enable Laravel caching

### Upgrade Options

-   **Pro Plan**: $20/month for more resources
-   **Team Plan**: $99/month for team collaboration
-   **Enterprise**: Custom pricing for large deployments

## 🚀 Step 8: Production Checklist

-   [ ] Environment variables configured
-   [ ] Database migrations run
-   [ ] Application key generated
-   [ ] Caches cleared
-   [ ] File permissions set
-   [ ] SSL certificate active
-   [ ] Error logging configured
-   [ ] Backup strategy in place
-   [ ] Monitoring set up
-   [ ] Performance optimized

## 📞 Support

-   **Railway Docs**: [docs.railway.app](https://docs.railway.app)
-   **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
-   **Laravel Docs**: [laravel.com/docs](https://laravel.com/docs)

## 🎉 Success!

Your Smile Suite application should now be live on Railway!

**Your app URL**: `https://your-app-name.railway.app`

Remember to:

-   Monitor your usage
-   Set up backups
-   Configure monitoring
-   Update dependencies regularly
-   Test all features thoroughly

Happy deploying! 🚀
