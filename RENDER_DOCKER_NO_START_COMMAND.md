# 🐳 Render Docker Setup (No Start Command Field)

When you select **Docker** as the language in Render, sometimes the **Start Command** field doesn't appear. That's okay! Here's how to handle it:

## ✅ Solution: Dockerfile CMD

The Dockerfile's `CMD` instruction will automatically run when the container starts. I've updated the Dockerfile to run `render-start.sh` by default.

## 📋 What to Configure

### In Render Dashboard:

1. **Dockerfile Path**: `./Dockerfile` (or just `.` - both work)
2. **Docker Command**: **Leave empty** (Dockerfile CMD will handle it)
   - OR if you see this field, you can optionally set: `./render-start.sh`

### How It Works:

1. Render builds your Docker image
2. When container starts, it runs the `CMD` from Dockerfile
3. The Dockerfile's `CMD` runs `render-start.sh`
4. `render-start.sh` handles:
   - ✅ Database migrations
   - ✅ Seeding (if needed)
   - ✅ Storage setup
   - ✅ Starting the Laravel server

## 🔍 Alternative: Docker Command Field

If you see a **"Docker Command"** field in the Advanced section, you can set:

```bash
./render-start.sh
```

But it's **not required** - the Dockerfile CMD will work fine.

## ✅ Quick Checklist

- [x] Dockerfile Path: `./Dockerfile` or `.`
- [x] Docker Command: Leave empty (or set to `./render-start.sh` if field exists)
- [x] Build Command: Leave empty
- [x] Health Check Path: `/health`
- [ ] Environment Variables: Add all your variables
- [ ] Database: Link your database

## 🎯 That's It!

The Dockerfile will automatically handle starting your application. No need for a separate Start Command field!

