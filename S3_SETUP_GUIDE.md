# AWS S3 Setup Guide for Smile Suite

## 🎯 **Quick Setup (15 minutes)**

### **Step 1: Create AWS Account**

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Fill in your details
4. **Add credit card** (required but won't be charged for free tier)
5. Verify your phone number

### **Step 2: Create S3 Bucket**

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com)
2. Click "Create bucket"
3. **Bucket name**: `smile-suite-images-[your-name]` (must be globally unique)
4. **Region**: `us-east-1` (cheapest)
5. **Uncheck**: "Block all public access"
6. **Check**: "I acknowledge that the current settings might result in this bucket and objects being public"
7. Click "Create bucket"

### **Step 3: Create Access Keys**

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam)
2. Click "Users" → "Create user"
3. **Username**: `smile-suite-s3-user`
4. **Attach policies**: Search "S3" → Select "AmazonS3FullAccess"
5. Click "Create user"
6. Click on the user → "Security credentials" tab
7. Click "Create access key"
8. **Choose**: "Application running outside AWS"
9. **Copy both keys** (you'll need these!)

### **Step 4: Add to Railway Environment Variables**

In your Railway dashboard:

1. Go to your project
2. Click on your service
3. Go to "Variables" tab
4. Add these variables:

```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=smile-suite-images-[your-name]
```

### **Step 5: Install AWS SDK**

Run this command in your terminal:

```bash
composer require league/flysystem-aws-s3-v3
```

### **Step 6: Test Upload**

1. Deploy to Railway
2. Try uploading an image in your clinic management
3. Check if it appears in your S3 bucket

## 🔒 **Security Notes**

-   Your access keys are stored securely in Railway
-   Images are public (needed for website display)
-   You can revoke access keys anytime
-   AWS has enterprise-level security

## 💰 **Costs**

-   **Free for 12 months**: 5GB storage, 20,000 requests/month
-   **After free tier**: ~$0.023/GB/month (very cheap)
-   **Your usage**: Probably $0-2/month max

## 🚨 **Important**

-   **Never commit** your AWS keys to Git
-   **Only add them** to Railway environment variables
-   **Keep your keys safe** - don't share them

## ✅ **Benefits**

-   Images never get deleted on deployment
-   Faster loading (CDN)
-   Automatic backups
-   Scalable storage
-   Professional solution

---

**Need help?** Just follow these steps and let me know if you get stuck!
