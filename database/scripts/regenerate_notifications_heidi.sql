-- ============================================================================
-- NOTIFICATION REGENERATION SQL SCRIPT FOR HEIDI SQL
-- ============================================================================
-- Purpose: Generate notifications for existing appointments that were
--          imported via HeidiSQL and bypassed Laravel's AppointmentObserver
--
-- INSTRUCTIONS:
-- 1. Open HeidiSQL and connect to your Railway MySQL database
-- 2. Select your database from the left panel
-- 3. Open the Query tab
-- 4. Copy and paste this entire script
-- 5. Execute the script (Press F9 or click "Execute")
--
-- WARNING:
-- - This script will SKIP notifications that already exist (checks by appointment_id in data JSON)
-- - To regenerate ALL notifications, uncomment the DELETE statement below
-- ============================================================================

-- OPTIONAL: Uncomment the line below to DELETE all existing notifications first
-- DELETE FROM notifications;

-- ===========================================================================
-- SAFETY CHECK: Verify all required tables exist
-- ===========================================================================
-- Run this first to check if your database is ready:
-- SELECT 
--     (SELECT COUNT(*) FROM clinics) as clinic_count,
--     (SELECT COUNT(*) FROM appointments) as appointment_count,
--     (SELECT COUNT(*) FROM patients) as patient_count;
-- ===========================================================================

-- Create notifications for Pending appointments
INSERT INTO notifications (clinic_id, user_id, target_roles, type, title, message, data, priority, is_read, read_at, expires_at, created_at, updated_at)
SELECT
    a.clinic_id,
    NULL as user_id,
    JSON_ARRAY('clinic_admin', 'staff') as target_roles,
    'appointment' as type,
    'New Appointment Request' as title,
    CONCAT('New appointment request from ', p.first_name, ' ', p.last_name, ' for ', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p')) as message,
    JSON_OBJECT(
        'appointment_id', a.id,
        'patient_id', a.patient_id,
        'patient_name', CONCAT(p.first_name, ' ', p.last_name),
        'dentist_id', a.assigned_to,
        'dentist_name', IFNULL(u.name, 'Unassigned'),
        'appointment_date', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'),
        'status', ast.name,
        'event_type', 'sql_generated',
        'action_url', CONCAT('/clinic/', a.clinic_id, '/appointments')
    ) as data,
    'medium' as priority,
    0 as is_read,
    NULL as read_at,
    NULL as expires_at,
    a.created_at,
    a.updated_at
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.id
INNER JOIN appointment_statuses ast ON a.appointment_status_id = ast.id
INNER JOIN clinics c ON a.clinic_id = c.id  -- Added: Ensure clinic exists
LEFT JOIN users u ON a.assigned_to = u.id
WHERE ast.name = 'Pending'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.clinic_id = a.clinic_id 
    AND JSON_EXTRACT(n.data, '$.appointment_id') = a.id
);

-- Create notifications for Confirmed appointments
INSERT INTO notifications (clinic_id, user_id, target_roles, type, title, message, data, priority, is_read, read_at, expires_at, created_at, updated_at)
SELECT
    a.clinic_id,
    NULL as user_id,
    JSON_ARRAY('clinic_admin', 'dentist', 'staff') as target_roles,
    'appointment' as type,
    'Appointment Confirmed' as title,
    CONCAT('Appointment for ', p.first_name, ' ', p.last_name, ' has been confirmed for ', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p')) as message,
    JSON_OBJECT(
        'appointment_id', a.id,
        'patient_id', a.patient_id,
        'patient_name', CONCAT(p.first_name, ' ', p.last_name),
        'dentist_id', a.assigned_to,
        'dentist_name', IFNULL(u.name, 'Unassigned'),
        'appointment_date', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'),
        'status', ast.name,
        'event_type', 'sql_generated',
        'action_url', CONCAT('/clinic/', a.clinic_id, '/appointments')
    ) as data,
    'high' as priority,
    0 as is_read,
    NULL as read_at,
    NULL as expires_at,
    a.created_at,
    a.updated_at
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.id
INNER JOIN appointment_statuses ast ON a.appointment_status_id = ast.id
INNER JOIN clinics c ON a.clinic_id = c.id  -- Added: Ensure clinic exists
LEFT JOIN users u ON a.assigned_to = u.id
WHERE ast.name = 'Confirmed'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.clinic_id = a.clinic_id 
    AND JSON_EXTRACT(n.data, '$.appointment_id') = a.id
);

-- Create notifications for Completed appointments
INSERT INTO notifications (clinic_id, user_id, target_roles, type, title, message, data, priority, is_read, read_at, expires_at, created_at, updated_at)
SELECT
    a.clinic_id,
    NULL as user_id,
    JSON_ARRAY('clinic_admin', 'dentist', 'staff') as target_roles,
    'appointment' as type,
    'Appointment Completed' as title,
    CONCAT('Appointment for ', p.first_name, ' ', p.last_name, ' has been completed') as message,
    JSON_OBJECT(
        'appointment_id', a.id,
        'patient_id', a.patient_id,
        'patient_name', CONCAT(p.first_name, ' ', p.last_name),
        'dentist_id', a.assigned_to,
        'dentist_name', IFNULL(u.name, 'Unassigned'),
        'appointment_date', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'),
        'status', ast.name,
        'event_type', 'sql_generated',
        'action_url', CONCAT('/clinic/', a.clinic_id, '/appointments')
    ) as data,
    'medium' as priority,
    0 as is_read,
    NULL as read_at,
    NULL as expires_at,
    a.created_at,
    a.updated_at
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.id
INNER JOIN appointment_statuses ast ON a.appointment_status_id = ast.id
INNER JOIN clinics c ON a.clinic_id = c.id  -- Added: Ensure clinic exists
LEFT JOIN users u ON a.assigned_to = u.id
WHERE ast.name = 'Completed'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.clinic_id = a.clinic_id 
    AND JSON_EXTRACT(n.data, '$.appointment_id') = a.id
);

-- Create notifications for Cancelled appointments
INSERT INTO notifications (clinic_id, user_id, target_roles, type, title, message, data, priority, is_read, read_at, expires_at, created_at, updated_at)
SELECT
    a.clinic_id,
    NULL as user_id,
    JSON_ARRAY('clinic_admin', 'dentist', 'staff') as target_roles,
    'appointment' as type,
    'Appointment Cancelled' as title,
    CONCAT('Appointment for ', p.first_name, ' ', p.last_name, ' on ', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'), ' has been cancelled') as message,
    JSON_OBJECT(
        'appointment_id', a.id,
        'patient_id', a.patient_id,
        'patient_name', CONCAT(p.first_name, ' ', p.last_name),
        'dentist_id', a.assigned_to,
        'dentist_name', IFNULL(u.name, 'Unassigned'),
        'appointment_date', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'),
        'status', ast.name,
        'event_type', 'sql_generated',
        'action_url', CONCAT('/clinic/', a.clinic_id, '/appointments')
    ) as data,
    'high' as priority,
    0 as is_read,
    NULL as read_at,
    NULL as expires_at,
    a.created_at,
    a.updated_at
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.id
INNER JOIN appointment_statuses ast ON a.appointment_status_id = ast.id
INNER JOIN clinics c ON a.clinic_id = c.id  -- Added: Ensure clinic exists
LEFT JOIN users u ON a.assigned_to = u.id
WHERE ast.name = 'Cancelled'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.clinic_id = a.clinic_id 
    AND JSON_EXTRACT(n.data, '$.appointment_id') = a.id
);

-- Create notifications for No Show appointments
INSERT INTO notifications (clinic_id, user_id, target_roles, type, title, message, data, priority, is_read, read_at, expires_at, created_at, updated_at)
SELECT
    a.clinic_id,
    NULL as user_id,
    JSON_ARRAY('clinic_admin', 'dentist', 'staff') as target_roles,
    'appointment' as type,
    'Patient No Show' as title,
    CONCAT('Patient ', p.first_name, ' ', p.last_name, ' did not show up for their appointment') as message,
    JSON_OBJECT(
        'appointment_id', a.id,
        'patient_id', a.patient_id,
        'patient_name', CONCAT(p.first_name, ' ', p.last_name),
        'dentist_id', a.assigned_to,
        'dentist_name', IFNULL(u.name, 'Unassigned'),
        'appointment_date', DATE_FORMAT(a.scheduled_at, '%b %e, %Y at %l:%i %p'),
        'status', ast.name,
        'event_type', 'sql_generated',
        'action_url', CONCAT('/clinic/', a.clinic_id, '/appointments')
    ) as data,
    'high' as priority,
    0 as is_read,
    NULL as read_at,
    NULL as expires_at,
    a.created_at,
    a.updated_at
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.id
INNER JOIN appointment_statuses ast ON a.appointment_status_id = ast.id
INNER JOIN clinics c ON a.clinic_id = c.id  -- Added: Ensure clinic exists
LEFT JOIN users u ON a.assigned_to = u.id
WHERE ast.name = 'No Show'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.clinic_id = a.clinic_id 
    AND JSON_EXTRACT(n.data, '$.appointment_id') = a.id
);

-- Display summary of created notifications
SELECT
    'NOTIFICATION REGENERATION COMPLETE' as Status,
    COUNT(*) as Total_Notifications_Created
FROM notifications
WHERE JSON_EXTRACT(data, '$.event_type') = 'sql_generated';

-- Show breakdown by status
SELECT
    JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) as Appointment_Status,
    COUNT(*) as Notification_Count
FROM notifications
WHERE JSON_EXTRACT(data, '$.event_type') = 'sql_generated'
GROUP BY JSON_UNQUOTE(JSON_EXTRACT(data, '$.status'));

-- ============================================================================
-- SCRIPT COMPLETE
-- ============================================================================

