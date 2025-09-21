# Clinic Seeder Documentation

## Overview

The `ClinicSeeder` creates 12 professional, realistic Philippine dental clinics with complete data that will display properly on the Find Clinics page. These clinics bypass the normal registration process and appear as live, active clinics immediately after seeding.

## Features

### 🏥 **12 Professional Philippine Clinics**

-   **Metro Manila Dental Center** (Makati) - Premium Plan
-   **Quezon City Family Dental Clinic** (Quezon City) - Basic Plan
-   **Cebu City Dental Excellence** (Cebu) - Enterprise Plan
-   **Davao City Smile Center** (Davao) - Premium Plan
-   **Iloilo City Dental Care** (Iloilo) - Basic Plan
-   **Baguio City Mountain Dental** (Baguio) - Premium Plan
-   **Cagayan de Oro Dental Hub** (Cagayan de Oro) - Enterprise Plan
-   **Bacolod City Smile Studio** (Bacolod) - Basic Plan
-   **Zamboanga City Dental Care Center** (Zamboanga) - Premium Plan
-   **Tacloban City Family Dental** (Tacloban) - Basic Plan
-   **General Santos City Dental Excellence** (GenSan) - Enterprise Plan
-   **Cagayan Valley Dental Center** (Tuguegarao) - Premium Plan

### 📍 **Geographic Distribution**

-   **NCR**: 2 clinics (Makati, Quezon City)
-   **Luzon**: 2 clinics (Baguio, Tuguegarao)
-   **Visayas**: 4 clinics (Cebu, Iloilo, Bacolod, Tacloban)
-   **Mindanao**: 4 clinics (Davao, Cagayan de Oro, Zamboanga, General Santos)

### 🎯 **Subscription Plan Distribution**

-   **Basic Plan**: 4 clinics (33%)
-   **Premium Plan**: 5 clinics (42%)
-   **Enterprise Plan**: 3 clinics (25%)

## Data Structure

### Required Fields

Each clinic includes all required fields based on the `clinics` table structure:

```php
[
    'name' => 'Clinic Name',
    'slug' => 'auto-generated-unique-slug',
    'logo_url' => '/images/clinic-logo.png',
    'description' => 'Professional clinic description',
    'street_address' => 'Complete street address',
    'region_code' => 'PSGC region code',
    'province_code' => 'PSGC province code',
    'city_municipality_code' => 'PSGC city code',
    'barangay_code' => 'PSGC barangay code',
    'address_details' => 'Additional address info',
    'postal_code' => 'Postal code',
    'contact_number' => 'Philippine phone format',
    'email' => 'Professional email address',
    'license_number' => 'Unique dental license',
    'operating_hours' => 'JSON operating hours',
    'timezone' => 'Asia/Manila',
    'is_active' => true,
    'subscription_plan' => 'basic|premium|enterprise',
    'subscription_status' => 'active',
    'subscription_start_date' => 'Random past date',
    'subscription_end_date' => '30 days from start',
    'latitude' => 'GPS latitude',
    'longitude' => 'GPS longitude',
]
```

### User Accounts Created

For each clinic, the seeder creates:

1. **Clinic Admin** (clinic_admin role)

    - Email: admin@[clinicname].com
    - Password: password123
    - Auto-verified email

2. **Dentist** (dentist role)

    - Email: dentist@[clinicname].com
    - Password: password123
    - Auto-verified email

3. **Staff** (staff role) - Only for Premium/Enterprise plans
    - Email: staff@[clinicname].com
    - Password: password123
    - Auto-verified email

## Usage

### Run All Seeders (Including Clinics)

```bash
php artisan db:seed
```

### Run Only Clinic Seeder

```bash
php artisan db:seed --class=ClinicSeeder
```

### Fresh Migration with Seeding

```bash
php artisan migrate:fresh --seed
```

## Data Quality Features

### 🏆 **Professional Credibility**

-   **Realistic Names**: Professional clinic names with proper Philippine naming conventions
-   **Authentic Addresses**: Real Philippine locations with proper PSGC codes
-   **Valid Contact Info**: Philippine phone number format (+63X-XXXX-XXXX)
-   **Professional Emails**: Clinic-specific email addresses
-   **Unique Licenses**: Properly formatted dental license numbers

### 📞 **Operating Hours**

Each clinic has realistic operating hours:

-   **Monday-Friday**: 8:00 AM - 5:00 PM (variations)
-   **Saturday**: 8:00 AM - 2:00 PM (variations)
-   **Sunday**: Closed

### 🗺️ **Geographic Accuracy**

-   **Real Coordinates**: Actual GPS coordinates for each city
-   **PSGC Compliance**: Proper Philippine Standard Geographic Code usage
-   **Regional Distribution**: Balanced coverage across all major Philippine regions

### 💼 **Business Realism**

-   **Subscription History**: Random start dates (30-365 days ago)
-   **Payment Records**: Realistic payment timestamps
-   **Trial Periods**: Basic plans include 14-day trial periods
-   **Active Status**: All clinics are active and operational

## Technical Implementation

### Database Compatibility

-   ✅ **Follows Migration Schema**: All fields match the `create_clinics_table` migration
-   ✅ **Respects Constraints**: Unique constraints for email, license_number, slug
-   ✅ **Proper Data Types**: Correct casting for JSON, dates, booleans
-   ✅ **Relationship Integrity**: Proper clinic_id assignments for users

### Error Prevention

-   **Unique Slug Generation**: Automatic slug uniqueness checking
-   **Email Uniqueness**: Clinic-specific email domains prevent conflicts
-   **License Uniqueness**: Region-prefixed license numbers ensure uniqueness
-   **Date Logic**: Proper subscription date calculations

### Performance Considerations

-   **Batch Operations**: Efficient database insertions
-   **Minimal Queries**: Optimized database operations
-   **Memory Efficient**: No large data arrays in memory

## Verification

After running the seeder, you can verify the data:

```sql
-- Check all clinics
SELECT name, subscription_plan, subscription_status, is_active FROM clinics;

-- Check user accounts per clinic
SELECT c.name, u.name, u.role, u.email
FROM clinics c
JOIN users u ON c.id = u.clinic_id
ORDER BY c.name, u.role;

-- Check subscription distribution
SELECT subscription_plan, COUNT(*) as count
FROM clinics
GROUP BY subscription_plan;
```

## Notes

-   **Password**: All seeded users have password `password123`
-   **Email Verification**: All users are pre-verified
-   **Subscription Status**: All clinics are active with valid subscriptions
-   **Logo**: All clinics use the default logo `/images/clinic-logo.png`
-   **Timezone**: All clinics use `Asia/Manila` timezone

This seeder provides a robust foundation for testing and demonstration purposes while maintaining data integrity and professional appearance.
