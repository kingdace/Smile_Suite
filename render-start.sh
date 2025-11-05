#!/bin/sh

# Startup script for Render deployment
# This is separate from start.sh (Railway) to handle platform differences
echo "🚀 Starting Smile Suite application on Render..."

# Set timezone
export TZ=Asia/Manila

# Critical: Clear all caches first (fixes 500 errors)
echo "🧹 Clearing all Laravel caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Check if APP_KEY is set
echo "🔑 Checking APP_KEY..."
if [ -z "$APP_KEY" ]; then
    echo "⚠️ APP_KEY not set! Generating new key..."
    php artisan key:generate --force || echo "❌ Failed to generate APP_KEY"
else
    echo "✅ APP_KEY is set"
fi

# Test database connection
echo "🔌 Testing database connection..."
php artisan db:show || echo "⚠️ Database connection test failed (will continue anyway)"

# Check if we need to run migrations
echo "📋 Running database migrations..."
php artisan migrate --force || echo "⚠️ Migration failed (will continue anyway)"

# Check if we need to run seeders (only if database is empty or missing seed data)
echo "🌱 Checking if seeders need to be run..."
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
    fi

    # Always check if Clinic 27 needs business data (regardless of permission status)
    echo "Checking if Clinic 27 needs business data..."
    APPOINTMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Appointment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")

    echo "Clinic 27 currently has $APPOINTMENT_COUNT appointments"

    # Check if Clinic 27 exists and has required data
    echo "Checking Clinic 27 requirements..."
    PATIENT_COUNT=$(php artisan tinker --execute="echo App\Models\Patient::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
    DENTIST_COUNT=$(php artisan tinker --execute="echo App\Models\User::where('clinic_id', 27)->where('role', 'dentist')->count();" 2>/dev/null || echo "0")
    SERVICE_COUNT=$(php artisan tinker --execute="echo App\Models\Service::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")

    echo "Clinic 27 has: $PATIENT_COUNT patients, $DENTIST_COUNT dentists, $SERVICE_COUNT services"

    if [ "$APPOINTMENT_COUNT" -lt "39" ]; then
        if [ "$PATIENT_COUNT" -eq "0" ] || [ "$DENTIST_COUNT" -eq "0" ] || [ "$SERVICE_COUNT" -eq "0" ]; then
            echo "⚠️  Clinic 27 missing required data (patients, dentists, or services). Cannot seed business data."
            echo "   Please ensure Clinic 27 has at least 1 patient, 1 dentist, and 1 service."
        else
            echo "Clinic 27 has $APPOINTMENT_COUNT appointments (target: 39). Seeding full dataset..."

            # Check if treatments and payments also need seeding
            TREATMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Treatment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
            PAYMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Payment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")

            echo "Clinic 27 has: $TREATMENT_COUNT treatments, $PAYMENT_COUNT payments"

            # Always try to seed if counts are below targets
            if [ "$APPOINTMENT_COUNT" -lt "39" ]; then
                echo "Running AppointmentSeeder to reach 39 appointments..."
                php artisan db:seed --class=AppointmentSeeder --force
            fi

            if [ "$TREATMENT_COUNT" -lt "39" ]; then
                echo "Running TreatmentSeeder to reach 39 treatments..."
                php artisan db:seed --class=TreatmentSeeder --force
            fi

            if [ "$PAYMENT_COUNT" -lt "50" ]; then
                echo "Running PaymentSeeder to reach 50+ payments..."
                php artisan db:seed --class=PaymentSeeder --force
            fi

            # Check and seed notifications for Clinic 27
            echo "Checking if Clinic 27 needs notifications..."
            NOTIFICATION_COUNT=$(php artisan tinker --execute="echo App\Models\Notification::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
            echo "Clinic 27 has: $NOTIFICATION_COUNT notifications"

            if [ "$NOTIFICATION_COUNT" -lt "39" ]; then
                echo "Running NotificationSeeder to create notifications for appointments..."
                php artisan db:seed --class=NotificationSeeder --force
                echo "✅ Notifications seeded for Clinic 27"
            else
                echo "✅ Clinic 27 already has sufficient notifications ($NOTIFICATION_COUNT found)"
            fi

            echo "✅ Business data seeded for Clinic 27"
        fi
    else
        echo "Clinic 27 already has sufficient data ($APPOINTMENT_COUNT appointments)"

        # Check and seed notifications even if appointments already exist
        echo "Checking if Clinic 27 needs notifications..."
        NOTIFICATION_COUNT=$(php artisan tinker --execute="echo App\Models\Notification::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
        echo "Clinic 27 has: $NOTIFICATION_COUNT notifications"

        if [ "$NOTIFICATION_COUNT" -lt "39" ]; then
            echo "Running NotificationSeeder to create notifications for existing appointments..."
            php artisan db:seed --class=NotificationSeeder --force
            echo "✅ Notifications seeded for Clinic 27"
        else
            echo "✅ Clinic 27 already has sufficient notifications ($NOTIFICATION_COUNT found)"
        fi
    fi
fi

# Ensure storage directories exist
echo "📁 Creating storage directories..."
mkdir -p storage/app/public/clinic-gallery
mkdir -p storage/app/public/clinic-logos
mkdir -p storage/app/public/clinics
mkdir -p storage/app/public/clinics/treatments
mkdir -p storage/app/public/user-avatars
chmod -R 755 storage bootstrap/cache

# Remove existing storage symlink or directory if it exists
if [ -L "public/storage" ] || [ -d "public/storage" ]; then
    echo "Removing existing storage symlink or directory..."
    rm -rf public/storage
fi

# Create storage symlink
echo "🔗 Creating storage symlink..."
if [ ! -L "public/storage" ]; then
    php artisan storage:link || ln -sf ../storage/app/public public/storage || true
fi

# Verify storage symlink was created
if [ -L "public/storage" ] || [ -d "public/storage" ]; then
    echo "✅ Storage symlink exists"
else
    echo "⚠️ Storage symlink not found (will continue anyway)"
fi

# Optimize Laravel for production
echo "⚡ Optimizing Laravel..."
php artisan config:cache || echo "⚠️ Config cache failed"
php artisan route:cache || echo "⚠️ Route cache failed"
php artisan view:cache || echo "⚠️ View cache failed"

# Final check: verify APP_KEY exists
echo "🔍 Final verification..."
if php artisan tinker --execute="echo config('app.key') ? 'APP_KEY OK' : 'APP_KEY MISSING';" 2>/dev/null | grep -q "OK"; then
    echo "✅ APP_KEY verified"
else
    echo "❌ APP_KEY verification failed - this may cause 500 errors!"
fi

# Start the Laravel scheduler in the background
# (SMS reminders, subscription checks, etc.)
echo "📅 Starting Laravel scheduler..."
php artisan schedule:work &
SCHEDULER_PID=$!
echo "✅ Scheduler started (PID: $SCHEDULER_PID)"

# Start the queue worker in the background
# (Notifications, broadcast events, etc.)
echo "🔄 Starting queue worker in background..."
php artisan queue:work --tries=3 --timeout=90 &
QUEUE_PID=$!
echo "✅ Queue worker started (PID: $QUEUE_PID)"

# Function to cleanup background processes on script exit
cleanup() {
    echo "🛑 Stopping scheduler and queue worker..."
    kill $SCHEDULER_PID 2>/dev/null || true
    kill $QUEUE_PID 2>/dev/null || true
    echo "✅ Cleanup complete"
}

# Trap exit signals to ensure cleanup
trap cleanup EXIT INT TERM

# Start the application (foreground process)
# Render sets PORT environment variable automatically
echo "🌐 Starting PHP server on port ${PORT:-10000}..."
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}

