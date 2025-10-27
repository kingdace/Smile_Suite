# Railway Seeding Guide

## Overview

This guide ensures safe deployment of seeders to your Railway production environment without affecting existing data.

## ✅ Safety Features Implemented

### 1. **Duplicate Prevention**

-   **AppointmentSeeder**: Checks for existing appointments before creating new ones
-   **TreatmentSeeder**: Verifies treatments don't already exist for appointments
-   **PaymentSeeder**: Skips treatments that already have payments

### 2. **Scoped to Clinic 27**

All seeders target **Clinic ID 27** (Enhaynes Dental Clinic) specifically:

-   Appointments in months: Jan, May, Jul, Aug, Sep 2025
-   Treatments based on those appointments
-   Payments for those treatments

### 3. **Graceful Error Handling**

-   Returns early if required data doesn't exist
-   Shows informative messages instead of crashing
-   Won't overwrite existing data

## 📦 Seeders Included

### Core Seeders (Already in DatabaseSeeder.php)

1. **InitialDataSeeder** - Admin user, demo clinic, suppliers, inventory
2. **AppointmentStatusSeeder** - Global appointment statuses
3. **AppointmentTypeSeeder** - Global appointment types
4. **PermissionSeeder** - All permissions
5. **RoleSeeder** - Empty (for future use)
6. **RolePermissionSeeder** - Role-permission mappings
7. **UserSeeder** - Empty (for future use)
8. **ClinicSeeder** - 12 original Philippines clinics
9. **ClinicSeeder2025** - 20 Surigao clinics
10. **ClinicGallerySeeder** - Sample gallery images
11. **ReviewSeeder** - Sample reviews

### New Business Data Seeders

12. **AppointmentSeeder** - 39 appointments for Clinic 27
13. **TreatmentSeeder** - Treatments from those appointments
14. **PaymentSeeder** - Payments for those treatments

## 🚀 Railway Deployment Commands

### Option 1: Run All Seeders (Recommended)

```bash
php artisan db:seed
```

This will:

-   Run ALL seeders in the correct order
-   Skip duplicates automatically
-   Safe for existing production data

### Option 2: Run Only Missing Data (Appointments, Treatments, Payments)

If you only want to add the business data to Clinic 27:

```bash
# Run only the business data seeders
php artisan db:seed --class=AppointmentSeeder
php artisan db:seed --class=TreatmentSeeder
php artisan db:seed --class=PaymentSeeder
```

### Option 3: Use RailwayCompleteSeeder

```bash
php artisan db:seed --class=RailwayCompleteSeeder
```

## 🔍 Verification After Deployment

### Check Created Records

```bash
# SSH into Railway
railway shell

# Check counts
php artisan tinker
```

```php
// Check appointments
App\Models\Appointment::where('clinic_id', 27)->count();

// Check treatments
App\Models\Treatment::where('clinic_id', 27)->count();

// Check payments
App\Models\Payment::where('clinic_id', 27)->count();
```

### Verify Data Quality

```php
// Check appointment months
App\Models\Appointment::where('clinic_id', 27)
    ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
    ->groupBy('month')
    ->get();

// Check treatments with payments
App\Models\Treatment::where('clinic_id', 27)
    ->whereHas('payments')
    ->count();

// Check completed treatments
App\Models\Treatment::where('clinic_id', 27)
    ->where('status', 'completed')
    ->count();
```

## ⚠️ Important Notes

1. **Idempotent**: Running these seeders multiple times is safe - they won't create duplicates
2. **Non-Destructive**: Won't delete or modify existing data
3. **Scoped**: Only affects Clinic ID 27, won't touch other clinics
4. **Skip Logic**: Smart checks prevent duplicate creation

## 📊 Expected Results

After running seeders, you should have:

-   **Appointments**: 39 appointments (6+9+6+12+6 for Jan, May, Jul, Aug, Sep)
-   **Treatments**: ~35-40 treatments (one per appointment that has patient/dentist)
-   **Payments**: 1-3 payments per completed treatment

## 🔄 Re-running Seeders

If you need to re-run:

1. First time: Safe to run as-is
2. Second time: Will skip duplicates automatically
3. To force re-seed: Delete data for Clinic 27 first, then re-run

## 🛡️ Production Safety

These seeders are **PRODUCTION SAFE** because:

-   ✅ No DROP/CLEAR operations
-   ✅ No hard-coded IDs that conflict
-   ✅ Graceful error handling
-   ✅ Transaction-safe (uses insert, not create)
-   ✅ Scoped to specific clinic only
