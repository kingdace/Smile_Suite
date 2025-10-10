#!/bin/bash

# Startup script for Railway deployment
echo "Starting Smile Suite application..."

# Ensure storage directories exist
echo "Creating storage directories..."
mkdir -p storage/app/public/clinic-gallery
mkdir -p storage/app/public/clinic-logos
mkdir -p storage/app/public/clinics
mkdir -p storage/app/public/clinics/treatments
mkdir -p storage/app/public/user-avatars

# Remove existing storage symlink or directory if it exists
if [ -L "public/storage" ] || [ -d "public/storage" ]; then
    echo "Removing existing storage symlink or directory..."
    rm -rf public/storage
fi

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link

# Verify storage symlink was created
if [ -L "public/storage" ]; then
    echo "✅ Storage symlink created successfully"
    ls -la public/ | grep storage
else
    echo "❌ Failed to create storage symlink"
    echo "Creating manual symlink..."
    ln -sf ../storage/app/public public/storage
    if [ -L "public/storage" ]; then
        echo "✅ Manual storage symlink created"
    else
        echo "❌ Manual symlink creation failed"
    fi
fi

# Start the application
echo "Starting PHP server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT
