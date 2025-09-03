# 📱 Mobile Access Setup Guide for Smile Suite

## 🎯 **Goal: Access Your App from Mobile Devices on the Same Network**

This guide will help you configure your Smile Suite project to be accessible from mobile devices, tablets, and other computers on your local network.

## 🔍 **Current Network Configuration**

-   **Your Computer IP**: `10.220.70.70`
-   **Network**: `10.116.255.0/24`
-   **Default Gateway**: `10.116.255.191`

## 🚀 **Quick Start (Choose One Method)**

### **Method 1: Using Package.json Scripts (Recommended)**

```bash
# Terminal 1: Start Laravel server on network
npm run serve:network

# Terminal 2: Start Vite dev server on network
npm run dev:network
```

### **🔄 Automatic IP Update (When IP Changes)**

If your network IP changes, automatically update all configurations:

```bash
# Automatically detect and update IP in all files
npm run update:ip

# Then clear config cache
php artisan config:clear
```

### **Method 2: Using Batch/PowerShell Scripts**

```bash
# Windows Batch File
serve-network.bat

# PowerShell Script
.\serve-network.ps1
```

### **Method 3: Manual Commands**

```bash
# Terminal 1: Laravel server
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: Vite dev server
npm run dev
```

## 🌐 **Access URLs**

Once running, your app will be accessible at:

-   **Local (Your Computer)**:

    -   Laravel: `http://localhost:8000`
    -   Vite Dev: `http://localhost:5173`

-   **Network (Mobile/Other Devices)**:
    -   Laravel: `http://10.220.70.70:8000`
    -   Vite Dev: `http://10.220.70.70:5173`

## ⚠️ **Important Security Notes**

### **Development Only**

-   This configuration is for **development purposes only**
-   **Never use this in production**
-   Your app will be accessible to anyone on your local network

### **Firewall Considerations**

-   Windows Firewall may block incoming connections
-   You may need to allow connections on port 8000
-   Consider using a more restrictive network if needed

## 🔧 **Configuration Changes Made**

### **1. CORS Configuration (`config/cors.php`)**

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://10.220.70.70:5173',    // ✅ Added
    'http://10.220.70.70:8000'     // ✅ Added
],
```

### **2. Vite Configuration (`vite.config.js`)**

```javascript
server: {
    host: "0.0.0.0",           // ✅ Already configured
    port: 5173,
    hmr: {
        host: "10.220.70.70", // ✅ Updated for network
    },
},
```

### **3. Package.json Scripts**

```json
"scripts": {
    "serve:network": "php artisan serve --host=0.0.0.0 --port=8000",
    "dev:network": "vite --host 0.0.0.0"
}
```

## 📱 **Testing Mobile Access**

### **Step 1: Start Your Servers**

```bash
# Terminal 1
npm run serve:network

# Terminal 2
npm run dev:network
```

### **Step 2: Test on Your Computer**

-   Open `http://localhost:8000` in your browser
-   Verify the app loads correctly

### **Step 3: Test on Mobile Device**

-   Connect your mobile device to the same WiFi network
-   Open browser and navigate to: `http://10.220.70.70:8000`
-   The app should load and be fully functional

### **Step 4: Test Vite Dev Server**

-   On mobile: `http://10.220.70.70:5173`
-   Hot Module Replacement (HMR) should work for development

## 🚨 **Troubleshooting**

### **Network IP Changed**

If your network IP address changes (common when reconnecting to WiFi):

1. **Automatic Fix (Recommended)**

    ```bash
    npm run update:ip
    php artisan config:clear
    ```

2. **Manual Fix**
    - Update `config/cors.php` with new IP
    - Update `vite.config.js` with new IP
    - Update `MOBILE_ACCESS_SETUP.md` with new IP
    - Run `php artisan config:clear`

### **App Not Loading on Mobile**

1. **Check Server Status**

    ```bash
    # Verify Laravel is running on 0.0.0.0
    netstat -an | findstr :8000
    ```

2. **Check Firewall**

    - Windows Defender Firewall may be blocking port 8000
    - Add exception for PHP/Artisan

3. **Check Network Connection**

    ```bash
    # Verify your IP address
    ipconfig

    # Test connectivity from mobile
    ping 10.220.70.70
    ```

### **CORS Errors on Mobile**

1. **Clear Browser Cache** on mobile device
2. **Verify CORS Configuration** is correct
3. **Check Network Tab** in browser dev tools for errors

### **Vite HMR Not Working on Mobile**

1. **Verify Vite Host Configuration**
2. **Check Network Tab** for WebSocket connection errors
3. **Restart Vite Dev Server**

## 🔒 **Security Best Practices**

### **For Development**

-   Use this only on trusted networks
-   Consider using a VPN for additional security
-   Regularly update your development environment

### **For Production**

-   Never expose development servers to the internet
-   Use proper hosting services (Heroku, DigitalOcean, AWS)
-   Implement proper authentication and authorization
-   Use HTTPS with valid SSL certificates

## 📋 **Quick Commands Reference**

```bash
# Start Laravel on network
npm run serve:network

# Start Vite on network
npm run dev:network

# Update IP automatically (when IP changes)
npm run update:ip

# Check network status
netstat -an | findstr :8000

# Check your IP
ipconfig

# Test mobile access
curl http://10.220.70.70:8000
```

## 🎉 **Success Indicators**

✅ **Laravel server shows**: `Server running on [http://0.0.0.0:8000]`  
✅ **Vite shows**: `Local: http://localhost:5173/` and `Network: http://10.220.70.70:5173/`  
✅ **Mobile device can access**: `http://10.220.70.70:8000`  
✅ **No CORS errors** in mobile browser console  
✅ **App loads and functions** normally on mobile

## 🆘 **Need Help?**

If you encounter issues:

1. **Check the console output** for error messages
2. **Verify network connectivity** between devices
3. **Check firewall settings** on Windows
4. **Ensure both servers** (Laravel + Vite) are running
5. **Try accessing from different devices** on the same network

---

**Happy Mobile Development! 🚀📱**




