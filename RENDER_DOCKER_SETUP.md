# 🐳 Render Docker Setup Guide

Since Render doesn't have a native PHP runtime, we're using **Docker** to deploy your Laravel application.

## ✅ What's Included

1. **Dockerfile** - Multi-stage build for Laravel + PHP 8.2 + Node.js
2. **.dockerignore** - Excludes unnecessary files from Docker build
3. **Updated render.yaml** - Configured for Docker

## 📋 Configuration in Render Dashboard

### Web Service Settings:

1. **Language**: Select **"Docker"** (NOT PHP)
2. **Build Command**: Leave **empty** (Dockerfile handles everything)
3. **Start Command**: 
   ```bash
   chmod +x render-start.sh && ./render-start.sh
   ```

### Worker Service Settings:

1. **Language**: Select **"Docker"** (same as web)
2. **Build Command**: Leave **empty**
3. **Start Command**: 
   ```bash
   php artisan schedule:work
   ```

## 🔧 How It Works

The Dockerfile:
1. ✅ Uses PHP 8.2 Alpine (lightweight)
2. ✅ Installs all PHP extensions (MySQL, PostgreSQL, GD, etc.)
3. ✅ Installs Composer
4. ✅ Installs Node.js and npm
5. ✅ Builds your application (composer install + npm build)
6. ✅ Sets up storage directories
7. ✅ Exposes port 10000 (Render sets PORT automatically)

## 🚀 Deployment Steps

1. **Push Dockerfile to GitHub**:
   ```bash
   git add Dockerfile .dockerignore
   git commit -m "Add Dockerfile for Render deployment"
   git push origin main
   ```

2. **In Render Dashboard**:
   - Create Web Service
   - Language: **Docker**
   - Build Command: **Leave empty**
   - Start Command: `chmod +x render-start.sh && ./render-start.sh`

3. **Add Environment Variables** (same as before)

4. **Deploy!**

## ⚠️ Important Notes

- **First build takes longer** (~5-10 minutes) - Docker needs to build the image
- **Subsequent builds are faster** - Docker caches layers
- **All PHP extensions are included** - MySQL, PostgreSQL, GD, etc.
- **Port is auto-detected** - Render sets `PORT` env var automatically

## 🐛 Troubleshooting

### Build Fails

1. Check Dockerfile syntax
2. Check logs for specific error
3. Verify all dependencies in composer.json/npm are correct

### Service Won't Start

1. Check if `render-start.sh` is executable
2. Verify environment variables are set
3. Check logs for PHP errors

### Port Issues

- Render automatically sets `PORT` environment variable
- Dockerfile uses `${PORT:-10000}` as fallback
- No manual port configuration needed

## 📚 Additional Resources

- Dockerfile best practices: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- Render Docker docs: https://render.com/docs/docker

