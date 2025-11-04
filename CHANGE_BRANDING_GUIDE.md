# 🎨 Change Branding: Title & Favicon

## ✅ What I Changed

### 1. **Page Title** - Changed from "Laravel" to "Smile Suite"

**Files Updated:**
- ✅ `resources/views/app.blade.php` - Updated fallback title
- ✅ `resources/js/app.jsx` - Updated Inertia app name

Now the browser tab will show:
- **Before**: `Page Name - Laravel`
- **After**: `Page Name - Smile Suite`

### 2. **Favicon/Logo** - Already Configured ✅

Your favicon is already set to use `/images/smile-suite-logo.png`. I've also added:
- ✅ Apple touch icon support (for mobile devices)
- ✅ Multiple sizes for better browser compatibility

---

## 🔧 How It Works

### Title Configuration

The title uses this hierarchy:

1. **Page-specific title** (from Inertia pages) → `Page Name - Smile Suite`
2. **Fallback** → `Smile Suite` (if no page title)

**Example:**
- Dashboard page: `Dashboard - Smile Suite`
- Login page: `Login - Smile Suite`
- No title: `Smile Suite`

### Favicon Configuration

The favicon is loaded from:
```
/public/images/smile-suite-logo.png
```

**Supported:**
- ✅ Standard favicon (all sizes)
- ✅ Apple touch icon (iOS devices)
- ✅ Shortcut icon (older browsers)

---

## 🎯 Customizing Further

### Change Default Title

If you want to change the default title format, edit `resources/js/app.jsx`:

```javascript
// Current
title: (title) => `${title} - ${appName}`,

// Options:
title: (title) => title ? `${title} | ${appName}` : appName,
title: (title) => `${appName} - ${title}`,
title: (title) => title || appName,
```

### Change Favicon/Logo

1. **Replace the logo file**:
   - Go to `public/images/smile-suite-logo.png`
   - Replace with your new logo
   - Keep the same filename OR update the paths in `app.blade.php`

2. **Update favicon paths** (if using different file):
   - Edit `resources/views/app.blade.php`
   - Change all `/images/smile-suite-logo.png` to your new logo path

3. **Create proper favicon.ico** (optional):
   - Convert your logo to `.ico` format
   - Replace `public/favicon.ico`
   - Add this line to `app.blade.php`:
     ```html
     <link rel="icon" type="image/x-icon" href="/favicon.ico">
     ```

---

## 📝 Environment Variable (Optional)

You can also set the app name via environment variable:

**In Render Environment Variables:**
```env
APP_NAME=Smile Suite
VITE_APP_NAME=Smile Suite
```

This allows you to change it without code changes.

---

## ✅ Verification

After deploying:

1. **Check browser tab** - Should show "Smile Suite" instead of "Laravel"
2. **Check favicon** - Should show your logo
3. **Hard refresh** - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) to clear cache
4. **Check different pages** - Title should update per page

---

## 🚀 Next Steps

1. **Commit changes**:
   ```bash
   git add resources/views/app.blade.php resources/js/app.jsx
   git commit -m "Update branding: Change title to Smile Suite"
   git push origin main
   ```

2. **Redeploy** - Render will auto-deploy

3. **Test** - Visit your site and check the browser tab

---

## 🎨 Logo Recommendations

For best results, your logo should be:
- **Square format** (1:1 ratio)
- **PNG with transparency** (for better display)
- **Multiple sizes available**:
  - 16x16px (favicon)
  - 32x32px (tab icon)
  - 96x96px (high-res)
  - 180x180px (Apple touch icon)

---

**Your branding is now updated! 🎉**

