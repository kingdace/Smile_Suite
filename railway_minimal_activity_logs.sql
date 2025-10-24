-- =====================================================
-- MINIMAL ACTIVITY LOGS DEPLOYMENT (NO FOREIGN KEYS)
-- =====================================================
-- This is the SAFEST version - creates activity_logs table without foreign key constraints
-- Use this if the main deployment script fails due to missing referenced tables
-- =====================================================

-- CREATE ACTIVITY_LOGS TABLE (NO FOREIGN KEYS)
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

-- VERIFY CREATION
-- =====================================================
SELECT 'Activity Logs table created successfully!' as status;
SHOW CREATE TABLE `activity_logs`;

-- CHECK TABLE STRUCTURE
-- =====================================================
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'activity_logs'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- The activity_logs table has been created without foreign key constraints.
-- This means:
-- ✅ The table will work for logging activities
-- ✅ No dependency on other tables
-- ✅ Can be used immediately
--
-- Note: Foreign key constraints can be added later when all referenced tables exist.
-- For now, the Activity Logs feature will work perfectly without them.
-- =====================================================
