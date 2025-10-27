#!/bin/bash

# Railway Seeder Deployment Script
# This script safely deploys seeders to Railway without duplicating data

echo "🚀 Starting Smile Suite Seeder Deployment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check database connection
echo "📊 Step 1: Checking database connection..."
php artisan migrate:status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Database connected${NC}"

# Step 2: Check existing clinic count
echo ""
echo "📊 Step 2: Checking existing clinic count..."
CLINIC_COUNT=$(php artisan tinker --execute="echo App\Models\Clinic::count();" 2>/dev/null || echo "0")
echo "Found $CLINIC_COUNT clinics"

if [ "$CLINIC_COUNT" -lt "30" ]; then
    echo -e "${YELLOW}Running full database seeders...${NC}"
    php artisan db:seed --force
    echo -e "${GREEN}✅ Full seeders completed${NC}"
else
    echo -e "${GREEN}✅ Sufficient clinics found ($CLINIC_COUNT)${NC}"

    # Step 3: Check if we need business data for Clinic 27
    echo ""
    echo "📊 Step 3: Checking Clinic 27 business data..."
    APPOINTMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Appointment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
    TREATMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Treatment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")
    PAYMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Payment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")

    echo "Clinic 27 currently has:"
    echo "  - Appointments: $APPOINTMENT_COUNT"
    echo "  - Treatments: $TREATMENT_COUNT"
    echo "  - Payments: $PAYMENT_COUNT"

    if [ "$APPOINTMENT_COUNT" -lt "10" ] || [ "$TREATMENT_COUNT" -lt "10" ] || [ "$PAYMENT_COUNT" -lt "10" ]; then
        echo ""
        echo -e "${YELLOW}Clinic 27 needs business data. Running business seeders...${NC}"

        # Run seeders individually
        echo "  📅 Seeding appointments..."
        php artisan db:seed --class=AppointmentSeeder --force

        echo "  🦷 Seeding treatments..."
        php artisan db:seed --class=TreatmentSeeder --force

        echo "  💳 Seeding payments..."
        php artisan db:seed --class=PaymentSeeder --force

        echo ""
        echo -e "${GREEN}✅ Business data seeded successfully${NC}"
    else
        echo -e "${GREEN}✅ Clinic 27 already has sufficient business data${NC}"
    fi
fi

# Step 4: Show final summary
echo ""
echo "📊 Final Summary:"
echo "  Total Clinics: $(php artisan tinker --execute="echo App\Models\Clinic::count();" 2>/dev/null || echo "0")"
echo "  Clinic 27 Appointments: $(php artisan tinker --execute="echo App\Models\Appointment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")"
echo "  Clinic 27 Treatments: $(php artisan tinker --execute="echo App\Models\Treatment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")"
echo "  Clinic 27 Payments: $(php artisan tinker --execute="echo App\Models\Payment::where('clinic_id', 27)->count();" 2>/dev/null || echo "0")"

echo ""
echo -e "${GREEN}✅ Seeder deployment completed successfully!${NC}"

