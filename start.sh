#!/bin/bash

# Startup script for Railway deployment
echo "Starting Smile Suite application..."

# Check if we need to run seeders (only if database is empty or missing seed data)
echo "Checking if seeders need to be run..."
CLINIC_COUNT=$(php artisan tinker --execute="echo App\Models\Clinic::count();" 2>/dev/null || echo "0")

if [ "$CLINIC_COUNT" -lt "30" ]; then
    echo "Running database seeders (found $CLINIC_COUNT clinics, need at least 30)..."
    php artisan db:seed --force
    echo "✅ Database seeders completed"
else
    echo "✅ Database already seeded ($CLINIC_COUNT clinics found)"

    # Check if permissions are missing
    echo "Checking if permissions are missing..."
    PERMISSION_COUNT=$(php artisan tinker --execute="echo App\Models\Permission::count();" 2>/dev/null || echo "0")

    if [ "$PERMISSION_COUNT" -lt "40" ]; then
        echo "Permissions missing ($PERMISSION_COUNT found). Running permission seeders..."
        php artisan db:seed --class=PermissionSeeder --force
        php artisan db:seed --class=RolePermissionSeeder --force
        echo "✅ Permissions seeded"
    else
        echo "✅ Permissions exist ($PERMISSION_COUNT found)"

        # Check if we need to add business data for Clinic 27
        echo "Checking if Clinic 27 needs business data..."
        APPOINTMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Appointment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")

        if [ "$APPOINTMENT_COUNT" -lt "10" ]; then
            echo "Clinic 27 has insufficient data. Running business data seeders..."
            php artisan db:seed --class=AppointmentSeeder --force
            php artisan db:seed --class=TreatmentSeeder --force
            php artisan db:seed --class=PaymentSeeder --force
            echo "✅ Business data seeded for Clinic 27"
        else
            echo "Clinic 27 already has sufficient data ($APPOINTMENT_COUNT appointments)"
        fi
    fi
fi

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
    echo "❌ Failed to create storage symlink with artisan command"
    echo "Creating manual symlink..."
    ln -sf ../storage/app/public public/storage
    if [ -L "public/storage" ]; then
        echo "✅ Manual storage symlink created"
        ls -la public/ | grep storage
    else
        echo "❌ Manual symlink creation failed"
        echo "Storage symlink status:"
        ls -la public/ | grep storage || echo "No storage found in public/"
    fi
fi

# Start the application
echo "Starting PHP server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT
