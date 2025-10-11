# Production Storage Guide

## 🚨 **The Problem**

When you redeploy on Railway, uploaded images get deleted because:

-   Railway rebuilds the entire container
-   The `storage/app/public` directory gets wiped clean
-   Only code gets deployed, not uploaded files

## 🎯 **Solutions (Choose One)**

### **Option 1: Use Cloud Storage (Recommended)**

#### **Step 1: Set up AWS S3 (or similar)**

1. Create an AWS S3 bucket
2. Get your AWS credentials
3. Add these to your Railway environment variables:
    ```
    FILESYSTEM_DISK=s3
    AWS_ACCESS_KEY_ID=your_key
    AWS_SECRET_ACCESS_KEY=your_secret
    AWS_DEFAULT_REGION=us-east-1
    AWS_BUCKET=your-bucket-name
    ```

#### **Step 2: Update your models to use cloud storage**

In your models (Clinic, etc.), change:

```php
// From:
'logo_url' => $request->file('logo')->store('clinic-logos', 'public'),

// To:
'logo_url' => $request->file('logo')->store('clinic-logos', 's3'),
```

### **Option 2: Use Railway's Persistent Storage**

#### **Step 1: Add a Volume in Railway Dashboard**

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Volumes"
4. Add a new volume:
    - **Name**: `storage-volume`
    - **Mount Path**: `/app/storage/app/public`

#### **Step 2: Update railway.json**

```json
{
    "volumes": [
        {
            "mountPath": "/app/storage/app/public",
            "name": "storage-volume"
        }
    ]
}
```

### **Option 3: Use External File Storage Service**

#### **Use Cloudinary (Easiest)**

1. Sign up at cloudinary.com
2. Install: `composer require cloudinary/cloudinary_php`
3. Add to `.env`:
    ```
    CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
    ```
4. Update your upload logic to use Cloudinary

## 🔧 **Quick Fix for Now**

If you want to keep using local storage temporarily:

1. **Before each deployment**, backup your images:

    ```bash
    # Download images from production
    scp -r user@your-server:/path/to/storage/app/public ./backup-storage/
    ```

2. **After deployment**, restore them:
    ```bash
    # Upload images back to production
    scp -r ./backup-storage/ user@your-server:/path/to/storage/app/public/
    ```

## 🎯 **Recommended Approach**

**Use AWS S3** - it's the most reliable and scalable solution:

1. **Images persist** across deployments ✅
2. **Better performance** (CDN) ✅
3. **Automatic backups** ✅
4. **Cost-effective** ✅

## 📝 **Next Steps**

1. Choose your preferred solution
2. Set up the cloud storage service
3. Update your environment variables
4. Test the upload functionality
5. Deploy and verify images persist

---

**Note**: This is a common issue with containerized deployments. Cloud storage is the industry standard solution.
