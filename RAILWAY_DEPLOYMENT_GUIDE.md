# 🚀 RAILWAY DEPLOYMENT GUIDE - IAM IMPLEMENTATION

## 📋 **DEPLOYMENT CHECKLIST**

### **New Files Created/Modified:**

#### **🗄️ Database Migrations (NEW)**
- `2025_10_17_101451_create_permissions_table.php`
- `2025_10_17_101515_create_role_permissions_table.php`

#### **🌱 Database Seeders (MODIFIED)**
- `DatabaseSeeder.php` - Added PermissionSeeder and RolePermissionSeeder
- `PermissionSeeder.php` - Added all IAM permissions
- `RolePermissionSeeder.php` - Added role-permission assignments

#### **🔒 Middleware (NEW)**
- `app/Http/Middleware/CheckRole.php` - Role-based access control
- `app/Http/Kernel.php` - Registered new middleware

#### **🛡️ Policies (NEW)**
- `app/Policies/DentistSchedulePolicy.php` - Dentist schedule authorization

#### **🎨 Frontend Components (MODIFIED)**
- `resources/js/Components/PermissionDeniedModal.jsx` - Enhanced UI/UX
- `resources/js/Components/ProtectedRoute.jsx` - Button protection
- `resources/js/Layouts/AuthenticatedLayout.jsx` - Upgrade/Renew restrictions
- `resources/js/Pages/Clinic/DentistSchedules/Index.jsx` - Frontend restrictions
- `resources/js/Pages/Clinic/Treatments/Index.jsx` - Staff restrictions

#### **🛣️ Routes (MODIFIED)**
- `routes/web.php` - Added permission middleware to routes

---

## 🚀 **STEP-BY-STEP RAILWAY DEPLOYMENT**

### **Step 1: Prepare Migration Files for Railway**

Since Railway doesn't have direct database access, we need to create SQL files for HeidiSQL:

#### **Create Migration SQL Files:**

```sql
-- File: 2025_10_17_101451_create_permissions_table.sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);
```

```sql
-- File: 2025_10_17_101515_create_role_permissions_table.sql
CREATE TABLE role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY role_permissions_role_permission_id_unique (role, permission_id),
    KEY role_permissions_permission_id_foreign (permission_id),
    CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);
```

### **Step 2: Prepare Seeder Data for Railway**

#### **Create Permission Data SQL:**

```sql
-- File: permissions_data.sql
INSERT INTO permissions (name, display_name, description, category, created_at, updated_at) VALUES
('view_patients', 'View Patients', 'Access patient records and information', 'patient_management', NOW(), NOW()),
('add_patients', 'Add Patients', 'Create new patient records', 'patient_management', NOW(), NOW()),
('edit_patients', 'Edit Patients', 'Modify patient information', 'patient_management', NOW(), NOW()),
('delete_patients', 'Delete Patients', 'Remove patient records', 'patient_management', NOW(), NOW()),
('view_appointments', 'View Appointments', 'Access appointment schedules and information', 'appointment_management', NOW(), NOW()),
('create_appointments', 'Create Appointments', 'Schedule new appointments', 'appointment_management', NOW(), NOW()),
('edit_appointments', 'Edit Appointments', 'Modify appointment details', 'appointment_management', NOW(), NOW()),
('delete_appointments', 'Delete Appointments', 'Cancel or remove appointments', 'appointment_management', NOW(), NOW()),
('assign_dentists', 'Assign Dentists', 'Assign dentists to appointments', 'appointment_management', NOW(), NOW()),
('view_treatments', 'View Treatments', 'Access treatment records and history', 'treatment_management', NOW(), NOW()),
('create_treatments', 'Create Treatments', 'Create new treatment plans', 'treatment_management', NOW(), NOW()),
('edit_treatments', 'Edit Treatments', 'Modify treatment records', 'treatment_management', NOW(), NOW()),
('delete_treatments', 'Delete Treatments', 'Remove treatment records', 'treatment_management', NOW(), NOW()),
('view_inventory', 'View Inventory', 'Access inventory and stock information', 'inventory_management', NOW(), NOW()),
('add_inventory', 'Add Inventory', 'Add new inventory items', 'inventory_management', NOW(), NOW()),
('edit_inventory', 'Edit Inventory', 'Modify inventory information', 'inventory_management', NOW(), NOW()),
('delete_inventory', 'Delete Inventory', 'Remove inventory items', 'inventory_management', NOW(), NOW()),
('manage_suppliers', 'Manage Suppliers', 'Create, edit, and delete supplier information', 'inventory_management', NOW(), NOW()),
('view_payments', 'View Payments', 'Access payment records and financial information', 'payment_management', NOW(), NOW()),
('process_payments', 'Process Payments', 'Process and manage payments', 'payment_management', NOW(), NOW()),
('refund_payments', 'Refund Payments', 'Process payment refunds', 'payment_management', NOW(), NOW()),
('view_services', 'View Services', 'Access service catalog', 'service_management', NOW(), NOW()),
('manage_services', 'Manage Services', 'Create, edit, and delete services', 'service_management', NOW(), NOW()),
('view_staff', 'View Staff', 'Access staff information', 'staff_management', NOW(), NOW()),
('add_staff', 'Add Staff', 'Create new staff members', 'staff_management', NOW(), NOW()),
('edit_staff', 'Edit Staff', 'Modify staff information', 'staff_management', NOW(), NOW()),
('delete_staff', 'Delete Staff', 'Remove staff members', 'staff_management', NOW(), NOW()),
('view_schedules', 'View Schedules', 'Access dentist schedules', 'schedule_management', NOW(), NOW()),
('manage_dentist_schedules', 'Manage Dentist Schedules', 'Create, edit, and delete dentist schedules', 'schedule_management', NOW(), NOW()),
('manage_clinic', 'Manage Clinic', 'Manage clinic settings and profile', 'clinic_management', NOW(), NOW());
```

#### **Create Role Permission Data SQL:**

```sql
-- File: role_permissions_data.sql
-- Clinic Admin - All permissions
INSERT INTO role_permissions (role, permission_id, created_at, updated_at) 
SELECT 'clinic_admin', id, NOW(), NOW() FROM permissions;

-- Dentist - Clinical permissions
INSERT INTO role_permissions (role, permission_id, created_at, updated_at) 
SELECT 'dentist', id, NOW(), NOW() FROM permissions 
WHERE name IN (
    'view_patients', 'add_patients', 'edit_patients',
    'view_appointments', 'create_appointments', 'edit_appointments', 'assign_dentists',
    'view_treatments', 'create_treatments', 'edit_treatments',
    'view_inventory',
    'view_payments',
    'view_services',
    'view_schedules', 'manage_dentist_schedules'
);

-- Staff - Operational permissions
INSERT INTO role_permissions (role, permission_id, created_at, updated_at) 
SELECT 'staff', id, NOW(), NOW() FROM permissions 
WHERE name IN (
    'view_patients', 'add_patients', 'edit_patients',
    'view_appointments', 'create_appointments', 'edit_appointments', 'assign_dentists',
    'view_treatments',
    'view_inventory', 'add_inventory', 'edit_inventory', 'manage_suppliers',
    'view_payments', 'process_payments',
    'view_services',
    'view_schedules'
);
```

### **Step 3: Deploy to Railway**

#### **3.1 Push Code to Railway**

```bash
# Make sure you're in the project directory
cd C:\Users\kiteb\smile_suite

# Add all changes
git add .

# Commit changes
git commit -m "feat: Implement comprehensive IAM system with role-based permissions"

# Push to Railway
git push railway main
```

#### **3.2 Apply Database Changes via HeidiSQL**

1. **Open HeidiSQL**
2. **Connect to your Railway MySQL database**
3. **Run the SQL files in this order:**
   - `2025_10_17_101451_create_permissions_table.sql`
   - `2025_10_17_101515_create_role_permissions_table.sql`
   - `permissions_data.sql`
   - `role_permissions_data.sql`

#### **3.3 Run Laravel Commands on Railway**

After deployment, run these commands in Railway console:

```bash
# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations (if any new ones)
php artisan migrate --force

# Run seeders (if needed)
php artisan db:seed --class=PermissionSeeder --force
php artisan db:seed --class=RolePermissionSeeder --force
```

### **Step 4: Verify Deployment**

#### **4.1 Test IAM Functionality**

1. **Login as different roles** (clinic_admin, dentist, staff)
2. **Test permission restrictions:**
   - Try accessing restricted buttons
   - Verify permission modals appear
   - Check dashboard navigation works
3. **Test specific features:**
   - Dentist Schedule restrictions
   - Treatment module restrictions
   - Upgrade/Renew button restrictions

#### **4.2 Check Database**

Verify in HeidiSQL that:
- `permissions` table exists with all permissions
- `role_permissions` table exists with all assignments
- Data is properly inserted

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

#### **Issue 1: Migration Fails**
**Solution:** Run migrations manually via HeidiSQL using the SQL files above

#### **Issue 2: Seeder Data Missing**
**Solution:** Run the permission and role_permission data SQL files

#### **Issue 3: Frontend Not Working**
**Solution:** Clear caches and rebuild assets:
```bash
php artisan config:clear
php artisan cache:clear
npm run build
```

#### **Issue 4: Permission Checks Failing**
**Solution:** Verify database data and check middleware registration

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Code pushed to Railway
- [ ] Database migrations applied via HeidiSQL
- [ ] Permission data inserted
- [ ] Role-permission data inserted
- [ ] Laravel caches cleared
- [ ] Frontend assets rebuilt
- [ ] IAM functionality tested
- [ ] All roles tested (clinic_admin, dentist, staff)
- [ ] Permission modals working
- [ ] Dashboard navigation working

---

## 🎯 **EXPECTED RESULTS AFTER DEPLOYMENT**

1. **Clinic Admin**: Full access to all features
2. **Dentist**: Restricted access with permission modals for unauthorized actions
3. **Staff**: View-only access to treatments, restricted upgrade/renew buttons
4. **Permission Modals**: Modern, compact UI with proper centering
5. **Button Restrictions**: Upgrade/Renew buttons visible but only clickable by clinic_admin

**Ready to deploy! 🚀**