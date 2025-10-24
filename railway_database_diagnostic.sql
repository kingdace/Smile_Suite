-- =====================================================
-- RAILWAY DATABASE DIAGNOSTIC SCRIPT
-- =====================================================
-- Run this FIRST to understand what tables exist in your Railway database
-- This will help us understand what's missing and what needs to be created
-- =====================================================

-- 1. SHOW ALL TABLES
SELECT '=== ALL TABLES IN DATABASE ===' as info;
SHOW TABLES;

-- 2. CHECK FOR CORE TABLES
SELECT '=== CHECKING CORE TABLES ===' as info;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users')
        THEN '✅ users table EXISTS'
        ELSE '❌ users table MISSING'
    END as users_status;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clinics')
        THEN '✅ clinics table EXISTS'
        ELSE '❌ clinics table MISSING'
    END as clinics_status;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patients')
        THEN '✅ patients table EXISTS'
        ELSE '❌ patients table MISSING'
    END as patients_status;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments')
        THEN '✅ appointments table EXISTS'
        ELSE '❌ appointments table MISSING'
    END as appointments_status;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'treatments')
        THEN '✅ treatments table EXISTS'
        ELSE '❌ treatments table MISSING'
    END as treatments_status;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments')
        THEN '✅ payments table EXISTS'
        ELSE '❌ payments table MISSING'
    END as payments_status;

-- 3. CHECK FOR ACTIVITY LOGS TABLE
SELECT '=== CHECKING ACTIVITY LOGS ===' as info;

SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activity_logs')
        THEN '✅ activity_logs table EXISTS'
        ELSE '❌ activity_logs table MISSING'
    END as activity_logs_status;

-- 4. IF ACTIVITY_LOGS EXISTS, CHECK ITS STRUCTURE
SELECT '=== ACTIVITY_LOGS STRUCTURE (if exists) ===' as info;
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'activity_logs'
ORDER BY ORDINAL_POSITION;

-- 5. CHECK DATABASE SIZE AND INFO
SELECT '=== DATABASE INFO ===' as info;
SELECT
    DATABASE() as current_database,
    VERSION() as mysql_version,
    NOW() as current_time;

-- 6. COUNT RECORDS IN EXISTING TABLES
SELECT '=== RECORD COUNTS ===' as info;

-- Count users
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users')
        THEN CONCAT('users: ', (SELECT COUNT(*) FROM users), ' records')
        ELSE 'users: table does not exist'
    END as users_count;

-- Count clinics
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clinics')
        THEN CONCAT('clinics: ', (SELECT COUNT(*) FROM clinics), ' records')
        ELSE 'clinics: table does not exist'
    END as clinics_count;

-- Count patients
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patients')
        THEN CONCAT('patients: ', (SELECT COUNT(*) FROM patients), ' records')
        ELSE 'patients: table does not exist'
    END as patients_count;

-- Count activity_logs
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activity_logs')
        THEN CONCAT('activity_logs: ', (SELECT COUNT(*) FROM activity_logs), ' records')
        ELSE 'activity_logs: table does not exist'
    END as activity_logs_count;

-- =====================================================
-- NEXT STEPS BASED ON RESULTS
-- =====================================================
-- After running this diagnostic:
--
-- If core tables (users, clinics, patients) are MISSING:
--   → Your Railway database might be empty or corrupted
--   → You may need to restore from backup or run full migrations
--
-- If core tables EXIST but activity_logs is MISSING:
--   → Run the updated railway_activity_logs_deployment.sql
--   → The script will now handle missing dependencies gracefully
--
-- If activity_logs EXISTS:
--   → Check if it has the change_metadata column
--   → If missing, run only the metadata migration part
-- =====================================================
