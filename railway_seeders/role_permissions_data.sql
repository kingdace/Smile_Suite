-- Seeder: Insert role_permissions data
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
