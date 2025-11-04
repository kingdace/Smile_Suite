# 🌐 Deployment Platforms Configuration

This document tracks deployment configurations for different platforms.

## 📁 Platform-Specific Files

### Railway (Preserved - Ready for Redeployment)

- ✅ `Procfile` - Defines web and worker processes
- ✅ `start.sh` - Railway startup script (handles seeding, scheduler, queue)
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `railway.json` - Railway deployment settings

**To redeploy on Railway:**
1. Push code to GitHub
2. Railway auto-detects and deploys
3. No changes needed!

---

### Render (New - Active Deployment)

- ✅ `render.yaml` - Render Blueprint configuration (auto-creates services)
- ✅ `render-start.sh` - Render-specific startup script
- ✅ `RENDER_DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- ✅ `RENDER_MYSQL_SETUP.md` - MySQL database options for Render

**To deploy on Render:**
1. Follow `RENDER_DEPLOYMENT_GUIDE.md`
2. Or use `render.yaml` Blueprint method
3. Set environment variables in Render dashboard

---

## 🔄 Platform Comparison

| Feature | Railway | Render |
|---------|---------|--------|
| **Free Tier** | ✅ Yes (expired) | ✅ Yes (15min sleep) |
| **MySQL** | ✅ Native | ❌ External or PostgreSQL |
| **PostgreSQL** | ✅ Native | ✅ Native (default) |
| **Worker Services** | ✅ Yes | ✅ Yes |
| **Auto-Deploy** | ✅ Yes | ✅ Yes (GitHub) |
| **Config Files** | `railway.json`, `nixpacks.toml` | `render.yaml` |

---

## 🚀 Quick Switch Between Platforms

### Switch to Railway:
```bash
git push origin main
# Railway auto-deploys
```

### Switch to Render:
```bash
git push origin main
# Then follow RENDER_DEPLOYMENT_GUIDE.md
```

---

## 📝 Environment Variables

Most environment variables are the same for both platforms. Key differences:

| Variable | Railway | Render |
|----------|---------|--------|
| `PORT` | Auto-set | Auto-set |
| `DB_HOST` | Railway internal | Render internal or external |
| `APP_URL` | Your Railway URL | Your Render URL |

---

## 🎯 Current Status

- **Primary Platform**: Render (free tier)
- **Railway Config**: Preserved and ready
- **Database**: External MySQL (Railway) or Render PostgreSQL

---

## 📞 Platform Support

- **Railway**: https://railway.app/docs
- **Render**: https://render.com/docs

