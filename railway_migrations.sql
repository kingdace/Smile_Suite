-- =====================================================
-- Railway MySQL Migration Script for Smile Suite
-- Support Tickets & Notifications System
-- =====================================================
-- Run this script in HeidiSQL after connecting to Railway MySQL
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- 1. CREATE NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `target_roles` json NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` json DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_clinic_created` (`clinic_id`,`created_at`),
  KEY `idx_user_read` (`user_id`,`is_read`),
  KEY `idx_type_priority` (`type`,`priority`),
  KEY `idx_expires_at` (`expires_at`),
  KEY `notifications_clinic_id_foreign` (`clinic_id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_clinic_id_foreign` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CREATE SUPPORT TICKETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('technical','billing','feature_request','bug_report','general') NOT NULL DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `support_tickets_ticket_number_unique` (`ticket_number`),
  KEY `idx_support_tickets_clinic_status` (`clinic_id`,`status`),
  KEY `idx_support_tickets_user_created` (`user_id`,`created_at`),
  KEY `idx_support_tickets_assigned_status` (`assigned_to`,`status`),
  KEY `idx_support_tickets_priority_status` (`priority`,`status`),
  KEY `idx_support_tickets_created_at` (`created_at`),
  KEY `support_tickets_clinic_id_foreign` (`clinic_id`),
  KEY `support_tickets_user_id_foreign` (`user_id`),
  KEY `support_tickets_assigned_to_foreign` (`assigned_to`),
  CONSTRAINT `support_tickets_clinic_id_foreign` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `support_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `support_tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CREATE SUPPORT TICKET MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `support_ticket_messages` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_support_messages_ticket_created` (`ticket_id`,`created_at`),
  KEY `idx_support_messages_user` (`user_id`),
  KEY `idx_support_messages_admin` (`is_admin`),
  KEY `support_ticket_messages_ticket_id_foreign` (`ticket_id`),
  KEY `support_ticket_messages_user_id_foreign` (`user_id`),
  CONSTRAINT `support_ticket_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `support_ticket_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. CREATE SUPPORT TICKET ATTACHMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `support_ticket_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(20) UNSIGNED DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(10) UNSIGNED NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_support_attachments_ticket` (`ticket_id`),
  KEY `idx_support_attachments_message` (`message_id`),
  KEY `support_ticket_attachments_ticket_id_foreign` (`ticket_id`),
  KEY `support_ticket_attachments_message_id_foreign` (`message_id`),
  CONSTRAINT `support_ticket_attachments_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `support_ticket_attachments_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `support_ticket_messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFY TABLES CREATED
-- =====================================================
-- Run these queries to verify the tables were created:
--
-- SHOW TABLES LIKE 'notifications';
-- SHOW TABLES LIKE 'support_tickets';
-- SHOW TABLES LIKE 'support_ticket_messages';
-- SHOW TABLES LIKE 'support_ticket_attachments';
--
-- =====================================================

