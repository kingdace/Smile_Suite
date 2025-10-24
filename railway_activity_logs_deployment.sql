-- =====================================================
-- RAILWAY PRODUCTION DEPLOYMENT - ACTIVITY LOGS FEATURE
-- =====================================================
-- This script safely applies the Activity Logs feature to Railway production
-- Run these queries in HeidiSQL connected to your Railway database
--
-- IMPORTANT: Run these queries in the exact order shown below
-- =====================================================

-- 0. FIRST, CHECK WHAT TABLES EXIST
-- =====================================================
SELECT 'Checking existing tables...' as status;
SHOW TABLES;

-- 1. CREATE ACTIVITY_LOGS TABLE (WITHOUT FOREIGN KEYS FIRST)
-- =====================================================
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `action` varchar(100) NOT NULL,
  `model_type` varchar(100) NOT NULL,
  `model_id` bigint(20) unsigned DEFAULT NULL,
  `description` text NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `change_metadata` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_clinic_id_user_id_index` (`clinic_id`,`user_id`),
  KEY `activity_logs_action_model_type_index` (`action`,`model_type`),
  KEY `activity_logs_created_at_index` (`created_at`),
  KEY `activity_logs_severity_index` (`severity`),
  KEY `activity_logs_category_index` (`category`),
  KEY `activity_logs_clinic_id_created_at_index` (`clinic_id`,`created_at`),
  KEY `activity_logs_severity_created_at_index` (`severity`,`created_at`),
  KEY `activity_logs_category_action_index` (`category`,`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.1. ADD FOREIGN KEY CONSTRAINTS (ONLY IF REFERENCED TABLES EXIST)
-- =====================================================
-- Check if clinics table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinics') > 0,
    'ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_clinic_id_foreign` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE',
    'SELECT "clinics table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if users table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'users') > 0,
    'ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE',
    'SELECT "users table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. ADD MISSING STRIPE FIELDS TO CLINICS TABLE (if not already present)
-- =====================================================
-- Check if columns exist first, then add if missing
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinics'
     AND COLUMN_NAME = 'stripe_customer_id') = 0,
    'ALTER TABLE `clinics` ADD `stripe_customer_id` varchar(255) DEFAULT NULL AFTER `subscription_status`',
    'SELECT "stripe_customer_id column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinics'
     AND COLUMN_NAME = 'stripe_subscription_id') = 0,
    'ALTER TABLE `clinics` ADD `stripe_subscription_id` varchar(255) DEFAULT NULL AFTER `stripe_customer_id`',
    'SELECT "stripe_subscription_id column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. ADD MISSING STRIPE FIELDS TO CLINIC_REGISTRATION_REQUESTS TABLE (if not already present)
-- =====================================================
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinic_registration_requests'
     AND COLUMN_NAME = 'stripe_customer_id') = 0,
    'ALTER TABLE `clinic_registration_requests` ADD `stripe_customer_id` varchar(255) DEFAULT NULL AFTER `status`',
    'SELECT "stripe_customer_id column already exists in clinic_registration_requests" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinic_registration_requests'
     AND COLUMN_NAME = 'stripe_subscription_id') = 0,
    'ALTER TABLE `clinic_registration_requests` ADD `stripe_subscription_id` varchar(255) DEFAULT NULL AFTER `stripe_customer_id`',
    'SELECT "stripe_subscription_id column already exists in clinic_registration_requests" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. CREATE TREATMENT_INVENTORY_ITEMS TABLE (if not already present)
-- =====================================================
CREATE TABLE IF NOT EXISTS `treatment_inventory_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `treatment_id` bigint(20) unsigned NOT NULL,
  `inventory_id` bigint(20) unsigned NOT NULL,
  `quantity_used` decimal(8,2) NOT NULL DEFAULT 0.00,
  `unit_cost` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatment_inventory_items_treatment_id_foreign` (`treatment_id`),
  KEY `treatment_inventory_items_inventory_id_foreign` (`inventory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.1. ADD FOREIGN KEY CONSTRAINTS FOR TREATMENT_INVENTORY_ITEMS (ONLY IF REFERENCED TABLES EXIST)
-- =====================================================
-- Check if treatments table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'treatments') > 0,
    'ALTER TABLE `treatment_inventory_items` ADD CONSTRAINT `treatment_inventory_items_treatment_id_foreign` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`) ON DELETE CASCADE',
    'SELECT "treatments table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if inventory table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'inventory') > 0,
    'ALTER TABLE `treatment_inventory_items` ADD CONSTRAINT `treatment_inventory_items_inventory_id_foreign` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE',
    'SELECT "inventory table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. ADD INVENTORY INTEGRATION FIELDS TO TREATMENTS TABLE (if not already present)
-- =====================================================
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'treatments'
     AND COLUMN_NAME = 'inventory_tracking_enabled') = 0,
    'ALTER TABLE `treatments` ADD `inventory_tracking_enabled` tinyint(1) NOT NULL DEFAULT 0 AFTER `notes`',
    'SELECT "inventory_tracking_enabled column already exists in treatments" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'treatments'
     AND COLUMN_NAME = 'total_inventory_cost') = 0,
    'ALTER TABLE `treatments` ADD `total_inventory_cost` decimal(10,2) DEFAULT NULL AFTER `inventory_tracking_enabled`',
    'SELECT "total_inventory_cost column already exists in treatments" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. ENHANCE SERVICES TABLE (if not already present)
-- =====================================================
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'services'
     AND COLUMN_NAME = 'description') = 0,
    'ALTER TABLE `services` ADD `description` text DEFAULT NULL AFTER `name`',
    'SELECT "description column already exists in services" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'services'
     AND COLUMN_NAME = 'duration_minutes') = 0,
    'ALTER TABLE `services` ADD `duration_minutes` int(11) DEFAULT NULL AFTER `description`',
    'SELECT "duration_minutes column already exists in services" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'services'
     AND COLUMN_NAME = 'is_active') = 0,
    'ALTER TABLE `services` ADD `is_active` tinyint(1) NOT NULL DEFAULT 1 AFTER `duration_minutes`',
    'SELECT "is_active column already exists in services" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 7. CREATE SERVICE_DENTIST TABLE (if not already present)
-- =====================================================
CREATE TABLE IF NOT EXISTS `service_dentist` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `service_id` bigint(20) unsigned NOT NULL,
  `dentist_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_dentist_service_id_dentist_id_unique` (`service_id`,`dentist_id`),
  KEY `service_dentist_service_id_foreign` (`service_id`),
  KEY `service_dentist_dentist_id_foreign` (`dentist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.1. ADD FOREIGN KEY CONSTRAINTS FOR SERVICE_DENTIST (ONLY IF REFERENCED TABLES EXIST)
-- =====================================================
-- Check if services table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'services') > 0,
    'ALTER TABLE `service_dentist` ADD CONSTRAINT `service_dentist_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE',
    'SELECT "services table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if users table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'users') > 0,
    'ALTER TABLE `service_dentist` ADD CONSTRAINT `service_dentist_dentist_id_foreign` FOREIGN KEY (`dentist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE',
    'SELECT "users table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 8. ADD PERFORMANCE INDEXES (if not already present)
-- =====================================================
-- Add indexes to clinics table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'clinics'
     AND INDEX_NAME = 'clinics_subscription_status_index') = 0,
    'ALTER TABLE `clinics` ADD INDEX `clinics_subscription_status_index` (`subscription_status`)',
    'SELECT "clinics_subscription_status_index already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes to users table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'users'
     AND INDEX_NAME = 'users_clinic_id_role_index') = 0,
    'ALTER TABLE `users` ADD INDEX `users_clinic_id_role_index` (`clinic_id`,`role`)',
    'SELECT "users_clinic_id_role_index already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 9. ADD AVATAR AND PASSWORD FIELDS TO USERS TABLE (if not already present)
-- =====================================================
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'users'
     AND COLUMN_NAME = 'avatar_url') = 0,
    'ALTER TABLE `users` ADD `avatar_url` varchar(500) DEFAULT NULL AFTER `email_verified_at`',
    'SELECT "avatar_url column already exists in users" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'users'
     AND COLUMN_NAME = 'password_confirmed_at') = 0,
    'ALTER TABLE `users` ADD `password_confirmed_at` timestamp NULL DEFAULT NULL AFTER `avatar_url`',
    'SELECT "password_confirmed_at column already exists in users" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 10. CREATE PERMISSIONS TABLE (if not already present)
-- =====================================================
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. CREATE ROLE_PERMISSIONS TABLE (if not already present)
-- =====================================================
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_permission_id_unique` (`role`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.1. ADD FOREIGN KEY CONSTRAINT FOR ROLE_PERMISSIONS (ONLY IF PERMISSIONS TABLE EXISTS)
-- =====================================================
-- Check if permissions table exists and add foreign key
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'permissions') > 0,
    'ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE',
    'SELECT "permissions table does not exist - skipping foreign key constraint" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify everything was created successfully

-- Check if activity_logs table exists and has correct structure
SELECT 'Activity Logs Table Check' as verification;
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'activity_logs'
ORDER BY ORDINAL_POSITION;

-- Check if all required indexes exist
SELECT 'Activity Logs Indexes Check' as verification;
SELECT
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'activity_logs'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- Check foreign key constraints
SELECT 'Activity Logs Foreign Keys Check' as verification;
SELECT
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'activity_logs'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Final verification - show all tables
SELECT 'All Tables Verification' as verification;
SHOW TABLES;

-- =====================================================
-- DEPLOYMENT COMPLETE
-- =====================================================
-- If all queries executed without errors, your Activity Logs feature
-- has been successfully deployed to Railway production!
--
-- Next steps:
-- 1. Deploy your code changes to Railway
-- 2. Test the Activity Logs functionality
-- 3. Monitor for any issues
-- =====================================================
