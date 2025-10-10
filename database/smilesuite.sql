-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 10, 2025 at 04:13 AM
-- Server version: 8.3.0
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smile_suite`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `patient_id` bigint UNSIGNED NOT NULL,
  `appointment_type_id` bigint UNSIGNED NOT NULL,
  `appointment_status_id` bigint UNSIGNED NOT NULL,
  `service_id` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `assigned_to` bigint UNSIGNED DEFAULT NULL,
  `scheduled_at` datetime NOT NULL,
  `requested_scheduled_at` timestamp NULL DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '30',
  `payment_status` varchar(191) NOT NULL DEFAULT 'pending',
  `is_follow_up` tinyint(1) NOT NULL DEFAULT '0',
  `previous_visit_date` date DEFAULT NULL,
  `previous_visit_notes` text,
  `ended_at` datetime DEFAULT NULL,
  `requested_ended_at` timestamp NULL DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `custom_reason` varchar(191) DEFAULT NULL,
  `notes` text,
  `is_online_booking` tinyint(1) NOT NULL DEFAULT '0',
  `confirmation_code` varchar(191) DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancellation_reason` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointments_confirmation_code_unique` (`confirmation_code`),
  KEY `appointments_clinic_id_foreign` (`clinic_id`),
  KEY `appointments_patient_id_foreign` (`patient_id`),
  KEY `appointments_appointment_type_id_foreign` (`appointment_type_id`),
  KEY `appointments_appointment_status_id_foreign` (`appointment_status_id`),
  KEY `appointments_created_by_foreign` (`created_by`),
  KEY `appointments_assigned_to_foreign` (`assigned_to`),
  KEY `appointments_service_id_foreign` (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `clinic_id`, `patient_id`, `appointment_type_id`, `appointment_status_id`, `service_id`, `created_by`, `assigned_to`, `scheduled_at`, `requested_scheduled_at`, `duration`, `payment_status`, `is_follow_up`, `previous_visit_date`, `previous_visit_notes`, `ended_at`, `requested_ended_at`, `reason`, `custom_reason`, `notes`, `is_online_booking`, `confirmation_code`, `confirmed_at`, `cancelled_at`, `cancellation_reason`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 1, 3, 2, NULL, 9, 10, '2025-07-01 21:03:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-07-01 22:03:00', NULL, 'Teeth Whitening', NULL, 'qwe', 0, NULL, NULL, NULL, NULL, '2025-07-01 00:00:25', '2025-07-01 00:01:27', NULL),
(2, 2, 3, 3, 2, NULL, 7, 11, '2025-07-17 00:11:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-07-17 01:11:00', NULL, 'Teeth Cleaning', NULL, 'okayyy', 0, NULL, NULL, NULL, NULL, '2025-07-16 16:08:04', '2025-07-16 16:09:09', NULL),
(3, 2, 4, 3, 2, NULL, 7, NULL, '2025-08-05 11:17:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-08-05 12:17:00', NULL, 'Teeth Whitening', NULL, 'ewqs', 0, NULL, NULL, NULL, NULL, '2025-07-16 16:14:19', '2025-07-16 16:14:28', NULL),
(4, 7, 10, 1, 2, 7, 19, 19, '2025-08-25 09:00:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-08-25 09:30:00', NULL, 'Teeth Cleaning', NULL, 'none', 0, NULL, NULL, NULL, NULL, '2025-08-23 06:27:23', '2025-08-23 06:27:23', NULL),
(5, 7, 10, 1, 3, 7, 19, 19, '2025-08-25 09:45:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-08-25 10:15:00', NULL, 'Teeth Cleaning', NULL, 'seqw', 0, NULL, NULL, NULL, NULL, '2025-08-23 06:34:58', '2025-09-20 12:51:23', NULL),
(6, 7, 10, 1, 2, 7, 19, 19, '2025-08-25 10:30:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-08-25 11:00:00', NULL, 'Teeth Cleaning', NULL, 'qwe', 0, NULL, NULL, NULL, NULL, '2025-08-23 14:47:45', '2025-08-23 14:47:45', NULL),
(7, 7, 10, 1, 2, 7, 17, 19, '2025-09-06 14:15:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-06 14:45:00', NULL, 'Teeth Cleaning', NULL, '', 0, NULL, NULL, NULL, NULL, '2025-08-31 13:17:31', '2025-08-31 13:17:31', NULL),
(8, 2, 20, 3, 4, 4, 48, NULL, '2025-09-20 09:19:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-20 10:19:00', NULL, 'General Check-up', NULL, 'aight', 0, NULL, NULL, NULL, NULL, '2025-09-02 13:20:59', '2025-09-10 14:21:26', NULL),
(9, 2, 20, 3, 2, 2, 48, 11, '2025-09-03 09:00:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-03 10:00:00', NULL, 'General Check-up', NULL, 'None', 0, NULL, NULL, NULL, NULL, '2025-09-02 23:42:49', '2025-09-02 23:46:27', NULL),
(10, 7, 19, 3, 2, 7, 48, 19, '2025-09-20 01:00:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-20 01:30:00', NULL, 'General Check-up', NULL, 'aight\n\nRescheduled by patient on 2025-09-10 22:17:42. Reason: qwe\n\nReschedule requested by patient on 2025-09-10 22:57:20. Reason: BROAWS\nRequested new time: Sep 20, 2025 13:00 PM\n\nReschedule denied by clinic on 2025-09-10 23:08:01. Reason: No available slots at requested time\n\nReschedule requested by patient on 2025-09-10 23:09:48. Reason: yeyeye\nRequested new time: Sep 20, 2025 13:00 PM\n\nReschedule approved by clinic on 2025-09-10 23:18:06', 0, NULL, NULL, NULL, NULL, '2025-09-03 02:33:42', '2025-09-19 03:18:36', NULL),
(11, 2, 3, 1, 2, 1, 4, 11, '2025-09-06 09:30:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-06 10:00:00', NULL, 'Braces', NULL, '', 0, NULL, NULL, NULL, NULL, '2025-09-03 06:39:55', '2025-09-03 06:39:55', NULL),
(12, 7, 19, 3, 4, 7, 48, NULL, '2025-12-25 09:28:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-12-25 10:28:00', NULL, 'Other', NULL, 'yeye', 0, NULL, NULL, NULL, NULL, '2025-09-15 13:28:49', '2025-09-15 13:30:22', NULL),
(13, 7, 19, 3, 1, 7, 48, NULL, '2025-09-26 13:56:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-26 14:56:00', NULL, 'Tooth Extraction', NULL, 'sss', 0, NULL, NULL, NULL, NULL, '2025-09-15 16:56:45', '2025-09-15 16:56:45', NULL),
(14, 7, 22, 3, 3, 7, 47, 55, '2025-09-22 13:00:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-22 14:00:00', NULL, 'Root Canal', NULL, 'yes', 0, NULL, NULL, NULL, NULL, '2025-09-20 05:44:56', '2025-09-20 12:52:01', NULL),
(15, 7, 9, 1, 3, 7, 17, 57, '2025-09-30 09:00:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-09-30 09:30:00', NULL, 'Teeth Cleanings', NULL, '', 0, NULL, NULL, NULL, NULL, '2025-09-20 08:28:36', '2025-09-20 12:51:23', NULL),
(16, 7, 19, 3, 2, 7, 48, 55, '2025-10-06 14:09:00', NULL, 30, 'pending', 0, NULL, NULL, '2025-10-06 15:09:00', NULL, 'Cleaning', NULL, 'yes', 0, NULL, NULL, NULL, NULL, '2025-10-05 13:10:48', '2025-10-05 13:11:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `appointment_statuses`
--

DROP TABLE IF EXISTS `appointment_statuses`;
CREATE TABLE IF NOT EXISTS `appointment_statuses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL DEFAULT '#6B7280',
  `description` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointment_statuses`
--

INSERT INTO `appointment_statuses` (`id`, `name`, `color`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(2, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(3, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(4, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(5, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(6, 'Pending Reschedule', '#6B7280', 'Appointment reschedule request pending clinic approval', '2025-09-10 14:40:37', '2025-09-10 14:40:37'),
(7, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-09-17 13:02:33', '2025-09-17 13:02:33'),
(8, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-09-17 13:02:33', '2025-09-17 13:02:33'),
(9, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-09-17 13:02:33', '2025-09-17 13:02:33'),
(10, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-09-17 13:02:33', '2025-09-17 13:02:33'),
(11, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-09-17 13:02:33', '2025-09-17 13:02:33'),
(12, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(13, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(14, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(15, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(16, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(17, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(18, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(19, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(20, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(21, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(22, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-09-21 14:29:08', '2025-09-21 14:29:08'),
(23, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-09-21 14:29:08', '2025-09-21 14:29:08'),
(24, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-09-21 14:29:08', '2025-09-21 14:29:08'),
(25, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-09-21 14:29:08', '2025-09-21 14:29:08'),
(26, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-09-21 14:29:08', '2025-09-21 14:29:08'),
(27, 'Pending', '#F59E0B', 'Appointment is waiting for confirmation', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(28, 'Confirmed', '#10B981', 'Appointment has been confirmed', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(29, 'Completed', '#3B82F6', 'Appointment has been completed', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(30, 'Cancelled', '#EF4444', 'Appointment has been cancelled', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(31, 'No Show', '#6B7280', 'Patient did not show up for the appointment', '2025-09-21 14:37:01', '2025-09-21 14:37:01');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_types`
--

DROP TABLE IF EXISTS `appointment_types`;
CREATE TABLE IF NOT EXISTS `appointment_types` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointment_types`
--

INSERT INTO `appointment_types` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Walk-in', 'Patient walked in for an appointment', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(2, 'Phone Call', 'Appointment scheduled via phone call', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(3, 'Online Booking', 'Appointment booked through patient portal', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(4, 'Follow-up', 'Follow-up appointment from previous visit', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(5, 'Emergency', 'Emergency dental appointment', '2025-06-27 17:05:09', '2025-06-27 17:05:09'),
(6, 'Walk-in', 'Patient walked in for an appointment', '2025-09-17 13:02:44', '2025-09-17 13:02:44'),
(7, 'Phone Call', 'Appointment scheduled via phone call', '2025-09-17 13:02:44', '2025-09-17 13:02:44'),
(8, 'Online Booking', 'Appointment booked through patient portal', '2025-09-17 13:02:44', '2025-09-17 13:02:44'),
(9, 'Follow-up', 'Follow-up appointment from previous visit', '2025-09-17 13:02:44', '2025-09-17 13:02:44'),
(10, 'Emergency', 'Emergency dental appointment', '2025-09-17 13:02:44', '2025-09-17 13:02:44'),
(11, 'Walk-in', 'Patient walked in for an appointment', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(12, 'Phone Call', 'Appointment scheduled via phone call', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(13, 'Online Booking', 'Appointment booked through patient portal', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(14, 'Follow-up', 'Follow-up appointment from previous visit', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(15, 'Emergency', 'Emergency dental appointment', '2025-09-21 14:19:04', '2025-09-21 14:19:04'),
(16, 'Walk-in', 'Patient walked in for an appointment', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(17, 'Phone Call', 'Appointment scheduled via phone call', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(18, 'Online Booking', 'Appointment booked through patient portal', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(19, 'Follow-up', 'Follow-up appointment from previous visit', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(20, 'Emergency', 'Emergency dental appointment', '2025-09-21 14:19:34', '2025-09-21 14:19:34'),
(21, 'Walk-in', 'Patient walked in for an appointment', '2025-09-21 14:29:09', '2025-09-21 14:29:09'),
(22, 'Phone Call', 'Appointment scheduled via phone call', '2025-09-21 14:29:09', '2025-09-21 14:29:09'),
(23, 'Online Booking', 'Appointment booked through patient portal', '2025-09-21 14:29:09', '2025-09-21 14:29:09'),
(24, 'Follow-up', 'Follow-up appointment from previous visit', '2025-09-21 14:29:09', '2025-09-21 14:29:09'),
(25, 'Emergency', 'Emergency dental appointment', '2025-09-21 14:29:09', '2025-09-21 14:29:09'),
(26, 'Walk-in', 'Patient walked in for an appointment', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(27, 'Phone Call', 'Appointment scheduled via phone call', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(28, 'Online Booking', 'Appointment booked through patient portal', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(29, 'Follow-up', 'Follow-up appointment from previous visit', '2025-09-21 14:37:01', '2025-09-21 14:37:01'),
(30, 'Emergency', 'Emergency dental appointment', '2025-09-21 14:37:01', '2025-09-21 14:37:01');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('lovejisoo4@gmail.com|127.0.0.1:timer', 'i:1758427478;', 1758427478),
('lovejisoo4@gmail.com|127.0.0.1', 'i:2;', 1758427478),
('bccc5af893fcf20da1010cc6b6822ad1:timer', 'i:1759729607;', 1759729607),
('bccc5af893fcf20da1010cc6b6822ad1', 'i:1;', 1759729607);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) NOT NULL,
  `owner` varchar(191) NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

DROP TABLE IF EXISTS `clinics`;
CREATE TABLE IF NOT EXISTS `clinics` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `logo_url` varchar(191) DEFAULT NULL,
  `description` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `contact_number` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `license_number` varchar(191) NOT NULL,
  `operating_hours` json DEFAULT NULL,
  `timezone` varchar(191) NOT NULL DEFAULT 'Asia/Manila',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `region_code` varchar(191) DEFAULT NULL,
  `province_code` varchar(191) DEFAULT NULL,
  `city_municipality_code` varchar(191) DEFAULT NULL,
  `barangay_code` varchar(191) DEFAULT NULL,
  `street_address` varchar(191) DEFAULT NULL,
  `postal_code` varchar(191) DEFAULT NULL,
  `address_details` text,
  `subscription_plan` varchar(191) NOT NULL DEFAULT 'basic',
  `subscription_status` varchar(191) NOT NULL DEFAULT 'trial',
  `stripe_customer_id` varchar(191) DEFAULT NULL,
  `stripe_subscription_id` varchar(191) DEFAULT NULL,
  `stripe_payment_method_id` varchar(191) DEFAULT NULL,
  `subscription_start_date` date DEFAULT NULL,
  `subscription_end_date` date DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `last_payment_at` timestamp NULL DEFAULT NULL,
  `next_payment_at` timestamp NULL DEFAULT NULL,
  `testing_mode` tinyint(1) NOT NULL DEFAULT '0',
  `testing_expiry` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clinics_slug_unique` (`slug`),
  UNIQUE KEY `clinics_email_unique` (`email`),
  UNIQUE KEY `clinics_license_number_unique` (`license_number`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`id`, `name`, `slug`, `logo_url`, `description`, `latitude`, `longitude`, `contact_number`, `email`, `license_number`, `operating_hours`, `timezone`, `is_active`, `region_code`, `province_code`, `city_municipality_code`, `barangay_code`, `street_address`, `postal_code`, `address_details`, `subscription_plan`, `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_payment_method_id`, `subscription_start_date`, `subscription_end_date`, `trial_ends_at`, `last_payment_at`, `next_payment_at`, `testing_mode`, `testing_expiry`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Enhaynes Dental Clinic', 'enhaynes-dental-clinic', '/storage/clinic-logos/cnj80niyHAhZy0QzgatZIw57ZwwnXf9kESZhKZCh.png', NULL, NULL, NULL, '+639123456789', 'contact@enhaynesdental.com', 'DENT-2024-001', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"09:00\", \"12:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 0, 'CARAGA', 'SURIGAO_DEL_NORTE', 'SURIGAO_CITY', 'IPIL', '123 Main Street', NULL, 'Near City Hall', 'basic', 'suspended', NULL, NULL, NULL, '2025-06-28', '2025-08-29', '2025-08-25 02:08:33', '2025-08-28 13:34:30', '2025-08-29 13:34:30', 0, NULL, '2025-06-27 17:05:08', '2025-08-31 00:44:04', NULL),
(2, 'Enhaynes TEST', 'brgy-ipil-dental-clinic', '/storage/clinic-logos/UBlFw6GIn3pWc07uplbOVqnCSR3P2cRP6Quy0WF9.png', 'Brgy. Ipil\'s most outstanding Clinic!', 9.77739100, 125.42246700, '09457712351', 'blissqueen198@gmail.com', 'DENT-31256121', '{\"friday\": [\"08:00\", \"17:00\"], \"monday\": [\"08:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"17:00\"], \"saturday\": [\"08:00\", \"17:00\"], \"thursday\": [\"08:00\", \"17:00\"], \"wednesday\": [\"08:00\", \"17:00\"]}', 'Asia/Manila', 0, '160000000', '166700000', '166724000', '166724028', 'Purok 6', '8400', 'Near Embroiler', 'basic', 'suspended', NULL, NULL, NULL, '2025-06-27', '2025-09-30', NULL, '2025-09-03 06:11:10', '2025-10-01 06:11:10', 0, NULL, '2025-06-27 17:08:47', '2025-10-06 02:59:37', NULL),
(3, 'SNSU Clinic', 'snsu-clinic', '/storage/clinic-logos/IspSGqMRLaj8yFIyXgspnXvUg8fuVzjrw8beyx4C.png', 'This is the SNSU\'s Dental Clinic', 9.78774939, 125.49459167, '0931412311', 'dgales@ssct.edu.ph', 'DENT1235', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724022', 'Purok- Ilang-Ilang', '8400', 'Banguis Street, Near Ipil\'s Luneta Park..', 'basic', 'active', NULL, NULL, NULL, '2025-07-01', '2026-07-01', NULL, NULL, NULL, 0, NULL, '2025-06-30 19:04:12', '2025-08-16 16:39:17', NULL),
(4, 'GALES Dental Clinic', 'gales-dental-clinic', '/images/default-clinic-logo.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, NULL, '09457766069', 'dymark123@gmail.com', 'DENT-3125512', NULL, 'Asia/Manila', 0, '160000000', '166700000', '166724000', '166724022', 'Purok- Ilang-Ilang', '8400', 'Near Luneta Park @ Brgy. Ipil', 'basic', 'suspended', NULL, NULL, NULL, '2025-08-17', '2025-09-16', NULL, NULL, NULL, 0, NULL, '2025-08-16 23:19:12', '2025-10-10 03:09:36', NULL),
(5, 'Dela Cruz Dental', 'dela-cruz-dental', '/images/clinic-logo.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, NULL, '0931252132', 'ackermanlevii172@gmail.com', 'DENT-3215217', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724022', 'Purok Ilang-Ilang', '8400', 'Near Ipil to Mabua crossing', 'basic', 'active', NULL, NULL, NULL, '2025-08-17', '2026-08-17', NULL, NULL, NULL, 0, NULL, '2025-08-17 02:23:55', '2025-08-17 02:23:55', NULL),
(6, 'Surigao Dental', 'surigao-dental', '/images/clinic-logo.png', 'LOREM', NULL, NULL, '0931241231', 'dace.gales18@gmail.com', 'DENT12312412', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724068', 'Purok IDK', '8400', 'City Hall', 'basic', 'active', NULL, NULL, NULL, '2025-08-17', '2026-08-17', NULL, NULL, NULL, 0, NULL, '2025-08-17 07:19:56', '2025-08-17 07:19:56', NULL),
(7, 'The DY\'s CLINIC', 'dym-test-trial', '/storage/clinic-logos/hVChf6jtpZj6THE36AxQc6Z6Ppx84mpZAjQwi6nV.png', 'Lorem ipsum yeye brobro', 9.79359700, 125.44063300, '0997643211', 'loveejisoo4@gmail.com', 'DENT-097-765-421-656', '{\"friday\": [\"09:00\", \"16:00\"], \"monday\": [\"08:00\", \"16:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"16:00\"], \"saturday\": null, \"thursday\": [\"08:00\", \"16:00\"], \"wednesday\": [\"08:00\", \"16:00\"]}', 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724022', 'Purok Ilang-Ilang', '8400', 'Near Somewhere', 'premium', 'active', NULL, NULL, NULL, '2025-08-30', '2025-11-28', NULL, '2025-08-31 01:36:25', '2025-11-27 16:00:00', 0, NULL, '2025-08-19 00:07:39', '2025-09-15 04:58:44', NULL),
(8, 'Golden Clinic', 'golden-clinic', '/images/clinic-logo.png', 'FOR THE HONMOON!', NULL, NULL, '09412312311', 'loveejisoo5@gmail.com', 'DENT-3125-1234-1231', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724068', 'Near the Honmoon', '8400', 'Building 123', 'enterprise', 'active', NULL, NULL, NULL, '2025-08-27', '2026-08-27', NULL, NULL, NULL, 0, NULL, '2025-08-27 15:55:46', '2025-08-27 15:55:46', NULL),
(11, 'BRO BRO CLINIC', 'bro-bro-clinic', '/images/clinic-logo.png', 'Ow yeah brobro', NULL, NULL, '09412312412', 'imeerose68@gmail.com', 'DENT-3124-1231-4123', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724028', 'Purok Saja', '8400', 'Building Boys SAJA', 'basic', 'grace_period', NULL, NULL, NULL, '2025-08-28', '2025-09-18', '2025-09-11 05:39:11', NULL, NULL, 0, NULL, '2025-08-28 05:39:11', '2025-10-10 03:09:40', NULL),
(12, 'Premium Testing', 'premium-testing', '/images/clinic-logo.png', 'WQEJIQWEJASOEJQWOIE', NULL, NULL, '09458589871', 'premiumtesting540@gmail.com', 'DENT-3213-3213-1241', NULL, 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724068', 'Purok 412', '8400', 'Room 321', 'enterprise', 'active', NULL, NULL, NULL, '2025-08-31', '2025-10-30', NULL, '2025-08-31 02:12:46', '2025-10-29 16:00:00', 0, NULL, '2025-08-28 05:53:34', '2025-08-31 02:12:46', NULL),
(13, 'Enterprise Testing', 'enterprise-testing', '/images/clinic-logo.png', 'OKAY BRO BRO', NULL, NULL, '09858978098', 'enterprisetesting7@gmail.com', 'DENT-312-321-412', NULL, 'Asia/Manila', 0, '160000000', '166700000', '166724000', '166724022', 'Purok 091', '8400', 'Building 123', 'enterprise', 'suspended', NULL, NULL, NULL, '2025-08-28', '2025-09-27', NULL, NULL, NULL, 0, NULL, '2025-08-28 06:00:24', '2025-10-10 03:09:42', NULL),
(14, 'Metro Manila Dental Center', 'metro-manila-dental-center', '/images/clinic-logo.png', 'A premier dental clinic in the heart of Metro Manila, offering comprehensive dental care with state-of-the-art equipment and experienced professionals.', 14.55470000, 121.02440000, '+632-8888-1234', 'info@metromaniladental.com', 'DENT-NCR-2024-001', '{\"friday\": [\"08:00\", \"18:00\"], \"monday\": [\"08:00\", \"18:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"18:00\"], \"saturday\": [\"09:00\", \"15:00\"], \"thursday\": [\"08:00\", \"18:00\"], \"wednesday\": [\"08:00\", \"18:00\"]}', 'Asia/Manila', 0, 'NCR', 'NCR', 'MAKATI', 'AYALA', '123 Ayala Avenue, Makati City', '1226', 'Ground Floor, Ayala Tower One', 'premium', 'suspended', NULL, NULL, NULL, '2025-07-16', '2025-08-15', NULL, '2025-07-16 14:19:04', '2025-08-15 14:19:04', 0, NULL, '2025-07-16 14:19:04', '2025-10-10 03:09:43', NULL),
(15, 'Quezon City Family Dental Clinic', 'quezon-city-family-dental-clinic', '/images/clinic-logo.png', 'Family-oriented dental practice providing gentle care for patients of all ages, specializing in preventive dentistry and orthodontics.', 14.67600000, 121.04370000, '+632-8888-2345', 'contact@qcfamilydental.com', 'DENT-NCR-2024-002', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"08:00\", \"12:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 0, 'NCR', 'NCR', 'QUEZON_CITY', 'DILIMAN', '456 Tomas Morato Avenue, Quezon City', '1103', '2nd Floor, Tomas Morato Building', 'basic', 'suspended', NULL, NULL, NULL, '2025-06-29', '2025-07-15', '2025-06-29 14:19:25', '2025-06-29 14:19:25', '2025-07-15 14:19:25', 0, NULL, '2025-06-29 14:19:25', '2025-10-10 03:09:44', NULL),
(16, 'Cebu City Dental Excellence', 'cebu-city-dental-excellence', '/images/clinic-logo.png', 'Leading dental clinic in Cebu offering advanced cosmetic and restorative dentistry services with modern technology and skilled practitioners.', 10.31570000, 123.88540000, '+6332-8888-3456', 'info@cebudentalexcellence.com', 'DENT-CV-2024-003', '{\"friday\": [\"08:30\", \"17:30\"], \"monday\": [\"08:30\", \"17:30\"], \"sunday\": null, \"tuesday\": [\"08:30\", \"17:30\"], \"saturday\": [\"09:00\", \"14:00\"], \"thursday\": [\"08:30\", \"17:30\"], \"wednesday\": [\"08:30\", \"17:30\"]}', 'Asia/Manila', 0, 'CENTRAL_VISAYAS', 'CEBU', 'CEBU_CITY', 'FUENTE_OSMENA', '789 Fuente Osmeña Circle, Cebu City', '6000', '3rd Floor, Fuente Medical Center', 'enterprise', 'suspended', NULL, NULL, NULL, '2025-06-30', '2025-07-30', NULL, '2025-06-30 14:19:25', '2025-07-30 14:19:25', 0, NULL, '2025-06-30 14:19:25', '2025-10-10 03:09:46', NULL),
(17, 'Davao City Smile Center', 'davao-city-smile-center', '/images/clinic-logo.png', 'Comprehensive dental care facility in Davao City, known for excellent patient care and advanced dental treatments including implants and cosmetic procedures.', 7.19070000, 125.45530000, '+6382-8888-4567', 'hello@davaosmilecenter.com', 'DENT-DAV-2024-004', '{\"friday\": [\"08:00\", \"18:00\"], \"monday\": [\"08:00\", \"18:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"18:00\"], \"saturday\": [\"09:00\", \"15:00\"], \"thursday\": [\"08:00\", \"18:00\"], \"wednesday\": [\"08:00\", \"18:00\"]}', 'Asia/Manila', 0, 'DAVAO_REGION', 'DAVAO_DEL_SUR', 'DAVAO_CITY', 'CENTRO', '321 Davao City Boulevard, Davao City', '8000', 'Ground Floor, Davao Medical Plaza', 'premium', 'suspended', NULL, NULL, NULL, '2025-03-06', '2025-04-05', NULL, '2025-03-06 14:19:26', '2025-04-05 14:19:26', 0, NULL, '2025-03-06 14:19:26', '2025-10-10 03:09:47', NULL),
(18, 'Iloilo City Dental Care', 'iloilo-city-dental-care', '/images/clinic-logo.png', 'Trusted dental practice in Iloilo City providing quality dental services with a focus on patient comfort and satisfaction.', 10.72020000, 122.56210000, '+6333-8888-5678', 'contact@iloilodentalcare.com', 'DENT-WV-2024-005', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"08:00\", \"12:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 0, 'WESTERN_VISAYAS', 'ILOILO', 'ILOILO_CITY', 'JARO', '654 Jaro Plaza, Iloilo City', '5000', '2nd Floor, Jaro Commercial Center', 'basic', 'suspended', NULL, NULL, NULL, '2025-08-01', '2025-08-17', '2025-08-01 14:19:27', '2025-08-01 14:19:27', '2025-08-17 14:19:27', 0, NULL, '2025-08-01 14:19:27', '2025-10-10 03:09:49', NULL),
(19, 'Baguio City Mountain Dental', 'baguio-city-mountain-dental', '/images/clinic-logo.png', 'Premier dental clinic in the Summer Capital of the Philippines, offering specialized dental services with a focus on oral health and aesthetics.', 16.40230000, 120.59600000, '+6374-8888-6789', 'info@baguiomountaindental.com', 'DENT-CAR-2024-006', '{\"friday\": [\"08:30\", \"17:30\"], \"monday\": [\"08:30\", \"17:30\"], \"sunday\": null, \"tuesday\": [\"08:30\", \"17:30\"], \"saturday\": [\"09:00\", \"14:00\"], \"thursday\": [\"08:30\", \"17:30\"], \"wednesday\": [\"08:30\", \"17:30\"]}', 'Asia/Manila', 0, 'CAR', 'BENGUET', 'BAGUIO_CITY', 'SESSION_ROAD', '987 Session Road, Baguio City', '2600', '4th Floor, Session Medical Building', 'premium', 'suspended', NULL, NULL, NULL, '2024-09-23', '2024-10-23', NULL, '2024-09-23 14:19:27', '2024-10-23 14:19:27', 0, NULL, '2024-09-23 14:19:27', '2025-10-10 03:09:50', NULL),
(20, 'Cagayan de Oro Dental Hub', 'cagayan-de-oro-dental-hub', '/images/clinic-logo.png', 'Modern dental facility in Cagayan de Oro providing comprehensive dental care with cutting-edge technology and experienced dental professionals.', 8.45420000, 124.63190000, '+6388-8888-7890', 'info@cdodentalhub.com', 'DENT-NM-2024-007', '{\"friday\": [\"08:00\", \"18:00\"], \"monday\": [\"08:00\", \"18:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"18:00\"], \"saturday\": [\"09:00\", \"15:00\"], \"thursday\": [\"08:00\", \"18:00\"], \"wednesday\": [\"08:00\", \"18:00\"]}', 'Asia/Manila', 0, 'NORTHERN_MINDANAO', 'MISAMIS_ORIENTAL', 'CAGAYAN_DE_ORO', 'LIMKETKAI', '147 Limketkai Drive, Cagayan de Oro', '9000', 'Ground Floor, Limketkai Center', 'enterprise', 'suspended', NULL, NULL, NULL, '2025-05-18', '2025-06-17', NULL, '2025-05-18 14:19:28', '2025-06-17 14:19:28', 0, NULL, '2025-05-18 14:19:28', '2025-10-10 03:09:51', NULL),
(21, 'Bacolod City Smile Studio', 'bacolod-city-smile-studio', '/images/clinic-logo.png', 'Artistic dental practice in Bacolod City specializing in cosmetic dentistry and smile makeovers with a focus on natural-looking results.', 10.64070000, 122.96820000, '+6334-8888-8901', 'hello@bacolodsmilestudio.com', 'DENT-WV-2024-008', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"08:00\", \"12:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 0, 'WESTERN_VISAYAS', 'NEGROS_OCCIDENTAL', 'BACOLOD_CITY', 'LACSON', '258 Lacson Street, Bacolod City', '6100', '3rd Floor, Lacson Medical Center', 'basic', 'suspended', NULL, NULL, NULL, '2025-04-07', '2025-04-23', '2025-04-07 14:19:29', '2025-04-07 14:19:29', '2025-04-23 14:19:29', 0, NULL, '2025-04-07 14:19:29', '2025-10-10 03:09:53', NULL),
(22, 'Zamboanga City Dental Care Center', 'zamboanga-city-dental-care-center', '/images/clinic-logo.png', 'Comprehensive dental care facility in Zamboanga City offering a full range of dental services with emphasis on patient comfort and quality care.', 6.92140000, 122.07900000, '+6362-8888-9012', 'contact@zamboangadentalcare.com', 'DENT-ZP-2024-009', '{\"friday\": [\"08:30\", \"17:30\"], \"monday\": [\"08:30\", \"17:30\"], \"sunday\": null, \"tuesday\": [\"08:30\", \"17:30\"], \"saturday\": [\"09:00\", \"14:00\"], \"thursday\": [\"08:30\", \"17:30\"], \"wednesday\": [\"08:30\", \"17:30\"]}', 'Asia/Manila', 0, 'ZAMBOANGA_PENINSULA', 'ZAMBOANGA_CITY', 'ZAMBOANGA_CITY', 'PASEO_DEL_MAR', '369 Paseo del Mar, Zamboanga City', '7000', '2nd Floor, Paseo Medical Building', 'premium', 'suspended', NULL, NULL, NULL, '2024-09-27', '2024-10-27', NULL, '2024-09-27 14:19:29', '2024-10-27 14:19:29', 0, NULL, '2024-09-27 14:19:29', '2025-10-10 03:09:54', NULL),
(23, 'Tacloban City Family Dental', 'tacloban-city-family-dental', '/images/clinic-logo.png', 'Family-focused dental practice in Tacloban City providing gentle and comprehensive dental care for patients of all ages.', 11.25180000, 125.00600000, '+6353-8888-0123', 'info@taclobanfamilydental.com', 'DENT-EV-2024-010', '{\"friday\": [\"08:00\", \"18:00\"], \"monday\": [\"08:00\", \"18:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"18:00\"], \"saturday\": [\"09:00\", \"15:00\"], \"thursday\": [\"08:00\", \"18:00\"], \"wednesday\": [\"08:00\", \"18:00\"]}', 'Asia/Manila', 0, 'EASTERN_VISAYAS', 'LEYTE', 'TACLOBAN_CITY', 'REAL', '741 Real Street, Tacloban City', '6500', 'Ground Floor, Real Medical Plaza', 'basic', 'suspended', NULL, NULL, NULL, '2025-07-04', '2025-07-20', '2025-07-04 14:19:30', '2025-07-04 14:19:30', '2025-07-20 14:19:30', 0, NULL, '2025-07-04 14:19:30', '2025-10-10 03:09:56', NULL),
(24, 'General Santos City Dental Excellence', 'general-santos-city-dental-excellence', '/images/clinic-logo.png', 'Advanced dental clinic in General Santos City offering specialized treatments including orthodontics, implants, and cosmetic dentistry.', 6.11680000, 125.17160000, '+6383-8888-1234', 'info@gensandentalexcellence.com', 'DENT-SOC-2024-011', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"08:00\", \"12:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 0, 'SOCCSKSARGEN', 'SOUTH_COTABATO', 'GENERAL_SANTOS_CITY', 'PIONEER', '852 Pioneer Avenue, General Santos City', '9500', '4th Floor, Pioneer Medical Center', 'enterprise', 'suspended', NULL, NULL, NULL, '2025-05-18', '2025-06-17', NULL, '2025-05-18 14:19:30', '2025-06-17 14:19:30', 0, NULL, '2025-05-18 14:19:30', '2025-10-10 03:09:57', NULL),
(25, 'Cagayan Valley Dental Center', 'cagayan-valley-dental-center', '/images/clinic-logo.png', 'Modern dental facility in Tuguegarao City providing comprehensive dental care with state-of-the-art equipment and experienced professionals.', 17.61380000, 121.72690000, '+6378-8888-2345', 'contact@cagayanvalleydental.com', 'DENT-CV-2024-012', '{\"friday\": [\"08:30\", \"17:30\"], \"monday\": [\"08:30\", \"17:30\"], \"sunday\": null, \"tuesday\": [\"08:30\", \"17:30\"], \"saturday\": [\"09:00\", \"14:00\"], \"thursday\": [\"08:30\", \"17:30\"], \"wednesday\": [\"08:30\", \"17:30\"]}', 'Asia/Manila', 0, 'CAGAYAN_VALLEY', 'CAGAYAN', 'TUGUEGARAO_CITY', 'MAGSAYSAY', '963 Magsaysay Avenue, Tuguegarao City', '3500', '2nd Floor, Magsaysay Medical Building', 'premium', 'suspended', NULL, NULL, NULL, '2025-02-04', '2025-03-06', NULL, '2025-02-04 14:19:31', '2025-03-06 14:19:31', 0, NULL, '2025-02-04 14:19:31', '2025-10-10 03:09:58', NULL),
(26, 'Palawan Dental Wellness Center', 'palawan-dental-wellness-center', '/images/clinic-logo.png', 'Premier dental wellness center in Puerto Princesa offering holistic dental care with a focus on patient comfort and natural treatments.', 9.73920000, 118.73530000, '+6348-8888-3456', 'info@palawandentalwellness.com', 'DENT-MIM-2024-013', '{\"friday\": [\"08:00\", \"18:00\"], \"monday\": [\"08:00\", \"18:00\"], \"sunday\": null, \"tuesday\": [\"08:00\", \"18:00\"], \"saturday\": [\"09:00\", \"15:00\"], \"thursday\": [\"08:00\", \"18:00\"], \"wednesday\": [\"08:00\", \"18:00\"]}', 'Asia/Manila', 0, 'MIMAROPA', 'PALAWAN', 'PUERTO_PRINCESA_CITY', 'RIZAL', '741 Rizal Avenue, Puerto Princesa City', '5300', 'Ground Floor, Rizal Medical Plaza', 'basic', 'suspended', NULL, NULL, NULL, '2024-11-04', '2024-11-20', '2024-11-04 14:28:39', '2024-11-04 14:28:39', '2024-11-20 14:28:39', 0, NULL, '2024-11-04 14:28:39', '2025-10-10 03:10:00', NULL),
(27, 'Enhaynes Dental Clinic', 'enhaynes-dental-clinic-1', '/storage/clinic-logos/IuxDw9c7GzGGUcuVQn5jBh1IBLmR8B3vcDrinqBP.jpg', 'Enhaynes Dental Clinic – Where bright smiles begin! Experience quality, gentle, and affordable dental care with our friendly team. Visit us today and let your smile shine with confidence!', 9.78854521, 125.49418313, '09412312312', 'enhaynesdental@gmail.com', 'DENT-3124-4123-1234-1234', '{\"friday\": [\"09:00\", \"17:00\"], \"monday\": [\"09:00\", \"17:00\"], \"sunday\": null, \"tuesday\": [\"09:00\", \"17:00\"], \"saturday\": [\"09:00\", \"17:00\"], \"thursday\": [\"09:00\", \"17:00\"], \"wednesday\": [\"09:00\", \"17:00\"]}', 'Asia/Manila', 1, '160000000', '166700000', '166724000', '166724068', '011 Magallanes St. Surigao City (Across STI College)', '8400', 'Enhaynes Building', 'premium', 'active', NULL, NULL, NULL, '2025-10-06', '2025-11-05', NULL, NULL, NULL, 0, NULL, '2025-10-06 04:52:54', '2025-10-06 05:13:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clinic_gallery_images`
--

DROP TABLE IF EXISTS `clinic_gallery_images`;
CREATE TABLE IF NOT EXISTS `clinic_gallery_images` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `image_url` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clinic_gallery_images_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinic_gallery_images`
--

INSERT INTO `clinic_gallery_images` (`id`, `clinic_id`, `image_url`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, '/storage/clinic-gallery/Nl3P56Hyrwk7CbA0HvcAjINB93SvQDoq7nx5fefH.png', '2025-07-01 23:25:33', '2025-07-01 23:25:33', NULL),
(2, 2, '/storage/clinic-gallery/H2X25p3AEVfR1Zr1RFEQvMO1mH7HoB8GJ8yq5rH8.png', '2025-07-01 23:25:34', '2025-07-01 23:25:34', NULL),
(3, 2, '/storage/clinic-gallery/LPks2nqjTUKj1dSauiqyiV48umRMf6Qnultqfdst.jpg', '2025-07-01 23:25:34', '2025-07-01 23:25:34', NULL),
(4, 2, '/storage/clinic-gallery/ZyzcKkMtZiDCrYA26S78p1KHvNNxlz3fpnaZLviE.jpg', '2025-07-01 23:25:34', '2025-07-01 23:25:34', NULL),
(5, 2, '/storage/clinic-gallery/cX412Kp82Aoom3jn5mTw8UYmhbBwKGKcXTmkJxd1.jpg', '2025-07-01 23:26:15', '2025-07-01 23:26:15', NULL),
(6, 2, '/storage/clinic-gallery/lgOKDY0IaNc5lXKmxQTOQoDIAwyUYBEBPknq0Dpe.webp', '2025-07-01 23:26:15', '2025-07-01 23:26:15', NULL),
(7, 2, '/storage/clinic-gallery/DZyKxz57kXQHIARMQlMYvQ7EyVPIDYyFBAVrWHx5.jpg', '2025-07-01 23:26:51', '2025-07-02 07:11:34', '2025-07-02 07:11:34'),
(8, 2, '/storage/clinic-gallery/ly36fSV5h75lrogm74NH7Dh4DDRH0NHhQRbO7xF9.jpg', '2025-07-01 23:26:51', '2025-07-02 01:24:03', '2025-07-02 01:24:03'),
(9, 2, '/storage/clinic-gallery/GcmEbQvYdufKhDjDfB9FvUBEBIOZL5rkFAHNUDrv.jpg', '2025-07-02 07:33:44', '2025-07-02 07:40:39', '2025-07-02 07:40:39'),
(10, 2, '/storage/clinic-gallery/QevzXUbXhbrYlhBQhVFH2SDfjjJgprVbR5GBe9Cg.jpg', '2025-07-02 07:33:45', '2025-07-02 07:40:44', '2025-07-02 07:40:44'),
(11, 2, '/storage/clinic-gallery/yv73WyOppkpoSNijDtVa3luRtjyPEwBiNxW1otTA.jpg', '2025-07-02 07:40:55', '2025-07-02 07:49:16', '2025-07-02 07:49:16'),
(12, 2, '/storage/clinic-gallery/pYQ8ZJsm0ru7iUPGuEio1ghpaBfqpsYTPxm3zIF1.jpg', '2025-07-02 07:40:55', '2025-07-02 07:49:23', '2025-07-02 07:49:23'),
(13, 2, '/storage/clinic-gallery/EPmB6V5QE2GRnp6LFLAD6d4zqxYcAbEnOafrkJaG.jpg', '2025-07-02 07:49:39', '2025-07-02 07:53:04', '2025-07-02 07:53:04'),
(14, 2, '/storage/clinic-gallery/93Y8Bot5208pZz4SVlQ4keVwau52oB7AKkc0q3gD.jpg', '2025-07-02 07:49:40', '2025-07-02 07:53:10', '2025-07-02 07:53:10'),
(15, 2, '/storage/clinic-gallery/7MqyqaL9R1F2IWcWpifU9eSbMazThPyfFjKLxlaH.jpg', '2025-07-02 07:53:31', '2025-07-02 07:55:33', '2025-07-02 07:55:33'),
(16, 2, '/storage/clinic-gallery/ItuDHT1lGD71zSqtL0l7gKO47P3i0VqKEDQK0c9w.jpg', '2025-07-02 07:53:31', '2025-07-02 07:55:40', '2025-07-02 07:55:40'),
(17, 2, '/storage/clinic-gallery/jSt9XGEmIpdl7jMnMtXV8xmSTMkTUyYaPkjdzao8.jpg', '2025-07-02 07:55:49', '2025-07-02 08:04:22', '2025-07-02 08:04:22'),
(18, 2, '/storage/clinic-gallery/fgOGfsBmSzR8d6RwjlKw8c4SNbDLKVLGemQwkfBj.jpg', '2025-07-02 07:55:49', '2025-07-02 08:04:27', '2025-07-02 08:04:27'),
(19, 2, '/storage/clinic-gallery/rrt3rVwpRLnFuIUU4L8NUFG9xhY2ip99aLalomdW.jpg', '2025-07-02 08:04:41', '2025-07-02 08:06:19', '2025-07-02 08:06:19'),
(20, 2, '/storage/clinic-gallery/qQohdkvOD3a0lHhG3xGpcUgdTix7U6tDYYZfrUl6.jpg', '2025-07-02 08:04:41', '2025-07-02 08:04:41', NULL),
(21, 2, '/storage/clinic-gallery/9BSDmFwzMezV7Ju7OFTlDge4tfWfTq4wXma1xeRE.jpg', '2025-07-02 08:06:29', '2025-07-02 08:09:43', '2025-07-02 08:09:43'),
(22, 2, '/storage/clinic-gallery/Qstrf5pUJh9f9GeGxd5uzpg9tj1Yj6zCAOEdeYvq.jpg', '2025-07-02 08:43:38', '2025-07-02 08:49:41', '2025-07-02 08:49:41'),
(23, 2, '/storage/clinic-gallery/wYmzr2ZA4Afnkl4nJaXGzTz4tbYvZmwvg3jBrTYl.jpg', '2025-07-02 08:50:07', '2025-07-02 08:55:21', '2025-07-02 08:55:21'),
(24, 2, '/storage/clinic-gallery/8iQoTzTbrchZkzJPD4VLYQBTxKUDSZ3od5pIpFVB.png', '2025-07-02 08:55:47', '2025-07-02 08:55:54', '2025-07-02 08:55:54'),
(25, 2, '/storage/clinic-gallery/yLYQQo7RmDx2GwkSugdpWB1NWDuyP1OlEOslj84e.jpg', '2025-07-10 04:26:19', '2025-07-10 04:27:03', '2025-07-10 04:27:03'),
(26, 2, '/storage/clinic-gallery/0l8eHN9JGpyHHW8BU4N0GXR5gYfTN722avr0r9Mx.jpg', '2025-07-10 04:27:17', '2025-07-10 04:27:33', '2025-07-10 04:27:33'),
(27, 1, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop', '2025-08-31 09:48:38', '2025-08-31 09:48:38', NULL),
(28, 1, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop', '2025-08-31 09:48:38', '2025-08-31 09:48:38', NULL),
(29, 1, 'https://images.unsplash.com/photo-1588776814546-1ffcf6fs199?w=800&h=600&fit=crop', '2025-08-31 09:48:38', '2025-08-31 09:48:38', NULL),
(30, 7, '/storage/clinic-gallery/jEwojEfjdWlkDuEePI4V11SoHwIk9REcmJjVOQcZ.webp', '2025-09-13 06:31:50', '2025-09-13 07:09:42', '2025-09-13 07:09:42'),
(31, 7, '/storage/clinic-gallery/V2TmlU8iUacTCQCM7bENVS7522h3B2QPtBJfhwZs.png', '2025-09-13 06:31:51', '2025-09-13 07:26:23', '2025-09-13 07:26:23'),
(32, 7, '/storage/clinic-gallery/YEjQ0bzknlOV4QOyTRusxFGeABMf4547Fhube11p.png', '2025-09-13 06:31:52', '2025-09-13 06:31:52', NULL),
(33, 7, '/storage/clinic-gallery/m4hd7b37tf3YRLkJ4Gnc6Rfz9hUwdQKrP4sULx5w.png', '2025-09-13 07:22:47', '2025-09-13 07:26:37', '2025-09-13 07:26:37'),
(34, 7, '/storage/clinic-gallery/8ANuG1yHsmXcnBC9zRchRDAgLjP2CHIvJoaFFKJy.jpg', '2025-09-13 07:29:17', '2025-09-13 07:29:32', '2025-09-13 07:29:32'),
(35, 7, '/storage/clinic-gallery/Ka61LeMcJGhKuFrSmFzamPEPjydqJffIxCOyOPoo.jpg', '2025-09-13 07:29:18', '2025-09-13 07:31:27', '2025-09-13 07:31:27'),
(36, 7, '/storage/clinic-gallery/2yEHHnSKkj3NqDphlM74uK5FHDWY6nvk6NBCYRF3.jpg', '2025-09-13 07:36:13', '2025-09-13 16:02:38', '2025-09-13 16:02:38'),
(37, 7, '/storage/clinic-gallery/alinVsqtBK4eV9hiGsQ9IL1H7yAwYcO3XGa3igKy.jpg', '2025-09-13 16:03:14', '2025-09-13 16:03:29', '2025-09-13 16:03:29'),
(38, 7, '/storage/clinic-gallery/8WOOxC0gViyKtAMOIrFPxqOcOLETu8EqjgPjCTTa.jpg', '2025-09-15 04:59:03', '2025-09-15 04:59:22', '2025-09-15 04:59:22'),
(39, 27, '/storage/clinic-gallery/xYdCF5h9gUh1CADCdWwE1g4RrDWixTkHf9zgxjJU.jpg', '2025-10-06 05:19:15', '2025-10-06 05:19:15', NULL),
(40, 27, '/storage/clinic-gallery/rngOb3rI82OKOpgxNGxW6MfLxganWrt9ToVZqtZG.jpg', '2025-10-06 05:19:15', '2025-10-06 05:19:15', NULL),
(41, 27, '/storage/clinic-gallery/a3jDdbwIJgDXmy2VK1eFwYjMrBVIK064vfbh4fLa.jpg', '2025-10-06 05:19:16', '2025-10-06 05:19:16', NULL),
(42, 27, '/storage/clinic-gallery/jfmeZvuk5tCwtPlCaQNmIpfdDxv5TVOMVbE4VTEv.jpg', '2025-10-06 05:19:17', '2025-10-06 05:19:17', NULL),
(43, 27, '/storage/clinic-gallery/IABtUQJxbPJdCF2uW752R9zmgwhrkI116mVutRAE.jpg', '2025-10-06 05:19:17', '2025-10-06 05:19:17', NULL),
(44, 27, '/storage/clinic-gallery/YGn5MbMS9IwO8lBdipJILmne7zIPU4nVDbEZ9acD.jpg', '2025-10-06 05:19:18', '2025-10-06 05:19:18', NULL),
(45, 27, '/storage/clinic-gallery/W0F0xg2BGb38sMfAtawcPFau5RIACEFZrFgGJcI7.jpg', '2025-10-06 05:19:18', '2025-10-06 05:19:18', NULL),
(46, 27, '/storage/clinic-gallery/rIsC2gkGb7WXeSKSZ2F08pPgn3yHjssDBaeNyozV.jpg', '2025-10-06 05:19:19', '2025-10-06 05:19:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clinic_holidays`
--

DROP TABLE IF EXISTS `clinic_holidays`;
CREATE TABLE IF NOT EXISTS `clinic_holidays` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT '0',
  `description` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clinic_holidays_clinic_id_date_unique` (`clinic_id`,`date`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinic_holidays`
--

INSERT INTO `clinic_holidays` (`id`, `clinic_id`, `name`, `date`, `is_recurring`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 7, 'Christmas Day', '2025-12-23', 0, 'xmas brobro', 1, '2025-09-15 08:44:50', '2025-09-15 14:28:48');

-- --------------------------------------------------------

--
-- Table structure for table `clinic_registration_requests`
--

DROP TABLE IF EXISTS `clinic_registration_requests`;
CREATE TABLE IF NOT EXISTS `clinic_registration_requests` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_name` varchar(191) NOT NULL,
  `contact_person` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `address` text,
  `license_number` varchar(191) NOT NULL,
  `description` text,
  `message` text,
  `subscription_plan` enum('basic','premium','enterprise') NOT NULL,
  `subscription_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','pending_verification','paid','failed','payment_failed','trial') DEFAULT 'pending',
  `stripe_customer_id` varchar(191) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(191) DEFAULT NULL,
  `payment_details` json DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `admin_notes` text,
  `approval_token` varchar(191) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `payment_deadline` timestamp NULL DEFAULT NULL,
  `payment_duration_days` int NOT NULL DEFAULT '7',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `clinic_id` bigint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clinic_registration_requests_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinic_registration_requests`
--

INSERT INTO `clinic_registration_requests` (`id`, `clinic_name`, `contact_person`, `email`, `phone`, `address`, `license_number`, `description`, `message`, `subscription_plan`, `subscription_amount`, `payment_status`, `stripe_customer_id`, `stripe_payment_intent_id`, `payment_details`, `status`, `admin_notes`, `approval_token`, `approved_at`, `expires_at`, `payment_deadline`, `payment_duration_days`, `created_at`, `updated_at`, `deleted_at`, `clinic_id`) VALUES
(1, 'Brgy. Ipil Dental Clinic', 'Cap. Enan', 'blissqueen198@gmail.com', '09457712351', NULL, 'DENT-31256121', 'Brgy. Ipil\'s most outstanding Clinic!', 'None here', 'basic', 99.00, 'paid', NULL, NULL, NULL, 'completed', NULL, 'hqvRbdNWFM9nmmEupNZbjyWucYDm9YvUsnF6PLYdbRlzOtevTiUy9impqES7z63V', '2025-06-27 17:07:06', '2025-07-04 17:05:50', NULL, 7, '2025-06-27 17:05:50', '2025-06-27 17:08:47', NULL, NULL),
(3, 'SNSU Clinic', 'SNSU_Chair', 'dgales@ssct.edu.ph', '0931412311', NULL, 'DENT1235', 'This is the SNSU\'s Dental Clinic', 'Alright bro', 'basic', 99.00, 'paid', NULL, NULL, NULL, 'completed', NULL, 'PJ9Lhp5opHS9mZKNVz2pUqllalmCPwlp7fnLuGTIstoo0nDEoBAjGzCUCkGXCTFt', '2025-06-30 19:02:18', '2025-07-07 06:48:48', NULL, 7, '2025-06-30 06:48:48', '2025-06-30 19:04:12', NULL, NULL),
(4, 'Dela Cruz Dental', 'Dr. Dela Cruz', 'ackermanlevii172@gmail.com', '0931252132', NULL, 'DENT-3215217', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'basic', 99.00, 'paid', NULL, NULL, NULL, 'completed', NULL, 'DwmLVyZ7sJJIGiEZtGehRY2fCa5zyhrLw86POeiNAjxUQo2UKVmfJws8Z4YJckyL', '2025-08-17 02:05:15', '2025-08-24 00:49:23', NULL, 7, '2025-08-17 00:49:23', '2025-08-17 02:23:56', NULL, NULL),
(21, 'dym test trial', 'okay?', 'loveejisoo4@gmail.com', '0931231', NULL, '02193102319sjj', '312huqe', 'ehqwuehqwiu', 'basic', 0.00, 'trial', NULL, NULL, NULL, 'completed', NULL, 'uKMa4qwk0nOKshsOxdSXyP7UaNJx3vGN6xJiYOMRybd8pqYH9uIF1ptKhWzNqyKj', '2025-08-18 23:47:15', '2025-08-25 23:47:03', NULL, 7, '2025-08-18 23:47:03', '2025-08-19 01:00:15', NULL, NULL),
(22, 'Smile Dental', 'Smile Admin', 'imeerosedagahoya@gmail.com', '09457766078', NULL, 'DENT-231-412-123', 'Lorem Ipsum blah blah blah', 'None bro bro', 'premium', 1999.00, 'paid', 'CUST-20250827-0022', 'PAY-20250827-0022', NULL, 'approved', NULL, 'dlXU05BCjfDd4GCd4HaK8AjGvQ1TPA7f99cKbtHPUQNNzOAsebOGs1acu6DyNh3Y', '2025-08-27 13:31:59', '2025-09-03 13:30:53', '2025-09-03 13:31:59', 7, '2025-08-27 13:30:53', '2025-08-27 14:16:45', NULL, NULL),
(9, 'Surigao Dental', 'Hon. Yves', 'dace.gales18@gmail.com', '0931241231', NULL, 'DENT12312412', 'LOREM', 'IPSUM', 'basic', 99.00, 'paid', NULL, NULL, NULL, 'completed', NULL, 'NayIsOCn4tK3qIvs1zmb1iyU2EDBFaSRrDqrxDojyVz0O96GvnzXJfPz5Mcg8L0Y', '2025-08-17 07:17:03', '2025-08-24 07:16:10', NULL, 7, '2025-08-17 07:16:10', '2025-08-17 07:19:57', NULL, NULL),
(10, 'DAVID\'s Dental', 'David Dy B. Gales', 'tamboksidavid22@gmail.com', '0931241231', NULL, 'dent1231231', 'ejqiwejwoqias', 'ejwqioejqiowejioq', 'basic', 99.00, 'paid', 'CUST-20250818-0010', 'PAY-20250818-0010', NULL, 'approved', 'please proceed with payment', '7TVPg7ZcahpLrNAdU85uOWeRYaNAzaZswHJvRbOpFyjct3GWzhUzAdxgGk4EiLoi', '2025-08-18 07:31:36', '2025-08-25 07:30:40', NULL, 7, '2025-08-18 07:30:40', '2025-08-18 07:32:58', NULL, NULL),
(11, 'PERDIBOI\'s Dental', 'Perdivoi', 'dgales@ssct.edu.ph', '0932141231', NULL, 'dent-1231512', 'qwewqewq', 'qwewqe', 'basic', 99.00, 'paid', 'CUST-20250818-0011', 'PAY-20250818-0011', NULL, 'approved', 'hola', 'kmE2MBFVQ9fq59d4qIwKQVeMlY98KLNaaQogYwCTF9WquSpv74ssPIwqKa9yvgSP', '2025-08-18 07:43:52', '2025-08-25 07:43:06', NULL, 7, '2025-08-18 07:43:06', '2025-08-18 07:45:42', NULL, NULL),
(28, 'BRO BRO CLINIC', 'si_BROBRO', 'imeerose68@gmail.com', '09412312412', NULL, 'DENT-3124-1231-4123', 'Ow yeah brobro', 'brobro yeah yeah', 'basic', 0.00, 'trial', NULL, NULL, NULL, 'completed', NULL, 'QuKYWaLfeiJ6kxKIwSpP0Xf9UCTIVxShtNbCUCsPgxxXzxJcO9KPpMC2b6TeZZpC', '2025-08-28 05:37:49', '2025-09-04 05:37:37', NULL, 7, '2025-08-28 05:37:37', '2025-08-28 05:39:12', NULL, 11),
(24, 'Golden Clinic', 'Huntrix', 'loveejisoo5@gmail.com', '09412312311', NULL, 'DENT-3125-1234-1231', 'FOR THE HONMOON!', 'LET\'S SEAL IT FOR GOOD BRO! LETS GOOOAW', 'enterprise', 2999.00, 'paid', 'CUST-20250827-0024', 'PAY-20250827-0024', '{\"sender_name\": \"JANE ROSE\", \"sender_phone\": \"0941231213\", \"payment_amount\": \"2999.00\", \"transaction_reference\": \"09312ASDA31273\"}', 'completed', NULL, 'AqaniMTkelhKO9vHPRy8SWBPxKOGUWSQfPRcT972ehqqBJFtRCUPlNazyjy48xah', '2025-08-27 15:35:43', '2025-09-03 15:35:24', '2025-09-03 15:35:43', 7, '2025-08-27 15:35:24', '2025-08-27 15:55:47', NULL, NULL),
(29, 'Premium Testing', 'Premium Test', 'premiumtesting540@gmail.com', '09458589871', NULL, 'DENT-3213-3213-1241', 'WQEJIQWEJASOEJQWOIE', 'EJWQIOEJQWOIDJASOEWQ', 'premium', 1999.00, 'paid', 'CUST-20250828-0029', 'PAY-20250828-0029', '{\"sender_name\": \"DY MARK\", \"sender_phone\": \"09457766068\", \"payment_amount\": \"1999.00\", \"transaction_reference\": \"REF01234123\"}', 'completed', NULL, 'dZLKvkICpChzM4qxwDuZFdMQISwenoQoLCf0VqNJyvbDjyDATJqZ7RpurPwuB6yq', '2025-08-28 05:49:21', '2025-09-04 05:48:16', '2025-09-04 05:49:21', 7, '2025-08-28 05:48:16', '2025-08-28 05:53:35', NULL, 12),
(30, 'Enterprise Testing', 'Enterprise Test', 'enterprisetesting7@gmail.com', '09858978098', NULL, 'DENT-312-321-412', 'OKAY BRO BRO', 'YEHYEH BROBRO', 'enterprise', 2999.00, 'paid', 'CUST-20250828-0030', 'PAY-20250828-0030', '{\"sender_name\": \"jANE ROSE\", \"sender_phone\": \"0931241231\", \"payment_amount\": \"2999.00\", \"transaction_reference\": \"REF093124123\"}', 'completed', NULL, '6nUcwMak4Jjq5iWs5XKVXQIAzfD5mIlA3sgZRSnO2B1ZLr8myEbZZSgGih9G071F', '2025-08-28 05:58:00', '2025-09-04 05:57:25', '2025-09-04 05:58:00', 7, '2025-08-28 05:57:25', '2025-08-28 06:00:24', NULL, 13),
(31, 'BRAWBRAW CLINIC', 'BRAWBRAWR', 'imeerose68@gmail.com', '09312412312', NULL, 'DENT-312-312-312', 'WKWKWK', 'WKWKWKW', 'basic', 0.00, 'trial', NULL, NULL, NULL, 'approved', NULL, '4F8s6gEACAeXRPXDkVvTqg5uV2E3wB49hVtfBZfE7hF20IEChLpfcy3MOoYvxCeR', '2025-09-05 14:13:20', '2025-09-12 14:11:20', NULL, 7, '2025-09-05 14:11:20', '2025-09-05 14:13:20', NULL, NULL),
(32, 'Ilang-Ilang Dental', 'Zimple Mail Test', 'zimplemail02@gmail.com', '09412312431', NULL, 'DENT-312-3124-1241-123', 'YEYEYEYE', 'QWEQW', 'basic', 0.00, 'trial', NULL, NULL, NULL, 'approved', NULL, 'fUOrMUUEPBZ5vjtY479yPQI1BYL21yLC3JOGdxBS8mgoyPW1YY6eGnGLvSjd5RxT', '2025-10-03 15:35:51', '2025-10-10 15:34:10', NULL, 7, '2025-10-03 15:34:10', '2025-10-03 15:35:51', NULL, NULL),
(33, 'Enhaynes Dental Clinic', 'Roshien E. Dumale', 'enhaynesdental@gmail.com', '09412312312', NULL, 'DENT-3124-4123-1234-1234', 'Enhaynes Dental Clinic – Where bright smiles begin! Experience quality, gentle, and affordable dental care with our friendly team. Visit us today and let your smile shine with confidence!', 'None', 'premium', 1999.00, 'paid', 'CUST-20251006-0033', 'PAY-20251006-0033', '{\"sender_name\": \"DY MARK GALES\", \"sender_phone\": \"09457766068\", \"payment_amount\": \"1999.00\", \"transaction_reference\": \"REF123412512512\"}', 'completed', NULL, 'nnEgkLbaLSpiLGb2iBXBHmuLfxkVVRGYy5eRjXvyyoijKMIQ5ysX2LBNdy8fD0tk', '2025-10-06 04:48:15', '2025-10-13 04:46:47', '2025-10-13 04:48:15', 7, '2025-10-06 04:46:47', '2025-10-06 04:52:54', NULL, 27);

-- --------------------------------------------------------

--
-- Table structure for table `dentist_schedules`
--

DROP TABLE IF EXISTS `dentist_schedules`;
CREATE TABLE IF NOT EXISTS `dentist_schedules` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `day_of_week` varchar(191) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `buffer_time` int NOT NULL DEFAULT '15',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `date` date DEFAULT NULL,
  `exception_type` varchar(191) DEFAULT NULL,
  `schedule_type` varchar(191) NOT NULL DEFAULT 'weekly',
  `recurring_pattern` json DEFAULT NULL,
  `is_template` tinyint(1) NOT NULL DEFAULT '0',
  `template_name` varchar(191) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `notes` text,
  `slot_duration` int NOT NULL DEFAULT '30',
  `allow_overlap` tinyint(1) NOT NULL DEFAULT '0',
  `max_appointments_per_day` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dentist_schedules_clinic_id_foreign` (`clinic_id`),
  KEY `dentist_schedules_user_id_foreign` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dentist_schedules`
--

INSERT INTO `dentist_schedules` (`id`, `clinic_id`, `user_id`, `day_of_week`, `start_time`, `end_time`, `buffer_time`, `is_available`, `date`, `exception_type`, `schedule_type`, `recurring_pattern`, `is_template`, `template_name`, `valid_from`, `valid_until`, `notes`, `slot_duration`, `allow_overlap`, `max_appointments_per_day`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, 19, '5', '10:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-09-19 02:27:50', NULL),
(2, 7, 19, '1', '09:00:00', '16:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-08-22 21:25:41', NULL),
(3, 7, 19, '2', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-08-22 21:25:41', NULL),
(4, 7, 19, '6', '09:00:00', '15:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-08-22 21:25:41', NULL),
(5, 7, 19, '4', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-08-22 21:25:41', NULL),
(6, 7, 19, '3', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-08-22 21:25:41', '2025-08-22 21:25:41', NULL),
(7, 2, 11, '5', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:40', '2025-09-03 06:43:40', NULL),
(8, 2, 11, '1', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:40', '2025-09-03 06:43:40', NULL),
(9, 2, 11, '2', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:40', '2025-09-03 06:43:40', NULL),
(10, 2, 11, '6', '09:00:00', '15:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:41', '2025-09-03 06:43:41', NULL),
(11, 2, 11, '4', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:41', '2025-09-03 06:43:41', NULL),
(12, 2, 11, '3', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, 'Synced from profile working hours', 30, 0, NULL, '2025-09-03 06:43:41', '2025-09-03 06:43:41', NULL),
(13, 7, 55, '1', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 13:58:42', '2025-09-18 13:58:42', NULL),
(14, 7, 55, '2', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 13:58:42', '2025-09-18 13:58:42', NULL),
(15, 7, 55, '3', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 13:58:42', '2025-09-18 13:58:42', NULL),
(16, 7, 55, '4', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 13:58:42', '2025-09-18 13:58:42', NULL),
(17, 7, 55, '5', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 13:58:42', '2025-09-18 13:58:42', NULL),
(18, 7, 57, '1', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:01:08', '2025-09-18 15:01:08', NULL),
(19, 7, 57, '2', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:01:08', '2025-09-18 15:01:08', NULL),
(20, 7, 57, '3', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:01:08', '2025-09-18 15:01:08', NULL),
(21, 7, 57, '4', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:01:08', '2025-09-18 15:01:08', NULL),
(22, 7, 57, '5', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:01:08', '2025-09-18 15:01:08', NULL),
(23, 7, 56, '1', '08:00:00', '15:01:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:06:49', '2025-09-19 01:52:00', '2025-09-19 01:52:00'),
(24, 7, 56, '2', '11:12:00', '23:12:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:12:35', '2025-09-19 01:58:55', '2025-09-19 01:58:55'),
(25, 7, 56, '3', '11:12:00', '12:12:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:12:36', '2025-09-19 02:05:04', '2025-09-19 02:05:04'),
(26, 7, 56, '4', '11:12:00', '12:12:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:12:36', '2025-09-19 02:27:15', '2025-09-19 02:27:15'),
(27, 7, 56, '5', '11:12:00', '23:12:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:12:37', '2025-09-19 02:27:17', '2025-09-19 02:27:17'),
(28, 7, 56, '6', '11:12:00', '23:12:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-18 15:12:37', '2025-09-19 02:27:20', '2025-09-19 02:27:20'),
(29, 7, 56, '1', '09:52:00', '21:52:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 01:52:27', '2025-09-19 02:27:22', '2025-09-19 02:27:22'),
(30, 7, 56, '3', '01:05:00', '22:05:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:05:24', '2025-09-19 02:26:50', '2025-09-19 02:26:50'),
(31, 7, 56, '2', '10:26:00', '22:26:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:26:28', '2025-09-19 02:27:23', '2025-09-19 02:27:23'),
(32, 7, 56, '0', '10:26:00', '22:26:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:26:28', '2025-09-19 02:26:47', '2025-09-19 02:26:47'),
(33, 7, 56, '3', '10:27:00', '22:27:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:07', '2025-09-19 02:27:25', '2025-09-19 02:27:25'),
(34, 7, 56, '1', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:31', '2025-09-19 02:27:31', NULL),
(35, 7, 56, '2', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:31', '2025-09-19 02:27:31', NULL),
(36, 7, 56, '3', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:31', '2025-09-19 02:27:31', NULL),
(37, 7, 56, '4', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:31', '2025-09-19 02:27:31', NULL),
(38, 7, 56, '5', '09:00:00', '17:00:00', 15, 1, NULL, NULL, 'weekly', NULL, 0, NULL, NULL, NULL, NULL, 30, 0, NULL, '2025-09-19 02:27:31', '2025-09-19 02:27:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `supplier_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `quantity` int NOT NULL,
  `minimum_quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `category` varchar(191) NOT NULL,
  `notes` text,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_supplier_id_foreign` (`supplier_id`),
  KEY `idx_clinic_category` (`clinic_id`,`category`),
  KEY `idx_clinic_active` (`clinic_id`,`is_active`),
  KEY `idx_clinic_stock_levels` (`clinic_id`,`quantity`,`minimum_quantity`),
  KEY `idx_expiry_date` (`expiry_date`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `clinic_id`, `supplier_id`, `name`, `description`, `quantity`, `minimum_quantity`, `unit_price`, `is_active`, `category`, `notes`, `expiry_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'Dental Floss', 'Waxed dental floss, 50m per roll', 100, 20, 50.00, 1, 'dental_supplies', NULL, NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', NULL),
(2, 1, 1, 'Toothpaste', 'Fluoride toothpaste, 100g tube', 50, 10, 75.00, 1, 'dental_supplies', NULL, NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', NULL),
(3, 1, 2, 'Dental Anesthetic', 'Local anesthetic, 50ml bottle', 30, 5, 500.00, 1, 'medications', NULL, NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', NULL),
(4, 2, 3, 'Amoxicillin', 'wkwkwk', 15, 20, 9.00, 1, 'medications', 'wkwkwk', NULL, '2025-09-03 07:57:25', '2025-09-03 07:57:25', NULL),
(5, 7, NULL, 'Amoxicilin', 'qwes', 50, 100, 9.00, 1, 'medications', 'ewqsa', '2028-12-21', '2025-09-15 14:03:25', '2025-09-20 15:41:08', NULL),
(6, 7, NULL, 'paracetamol 500G', 'QWE', 5, 20, 9.00, 1, 'medications', 'QWE', NULL, '2025-09-20 03:04:53', '2025-09-20 08:30:21', NULL),
(7, 1, NULL, 'Dental Composite Resin', 'Test inventory item for treatment integration', 50, 10, 125.00, 1, 'materials', NULL, NULL, '2025-09-20 05:53:37', '2025-09-20 05:53:37', NULL),
(8, 1, NULL, 'Local Anesthetic (Lidocaine)', 'Test inventory item for treatment integration', 25, 5, 85.50, 1, 'medication', NULL, NULL, '2025-09-20 05:53:37', '2025-09-20 05:53:37', NULL),
(9, 1, NULL, 'Dental Floss', 'Test inventory item for treatment integration', 100, 20, 15.75, 1, 'supplies', NULL, NULL, '2025-09-20 05:53:37', '2025-09-20 05:53:37', NULL),
(10, 1, NULL, 'Dental X-Ray Film', 'Test inventory item for treatment integration', 30, 10, 45.00, 1, 'supplies', NULL, NULL, '2025-09-20 05:53:37', '2025-09-20 05:53:37', NULL),
(11, 1, NULL, 'Dental Cement', 'Test inventory item for treatment integration', 15, 5, 95.25, 1, 'materials', NULL, NULL, '2025-09-20 05:53:37', '2025-09-20 05:53:37', NULL),
(12, 7, NULL, 'Dental Floss', 'okay', 50, 25, 30.00, 1, 'supplies', 'okay', NULL, '2025-09-20 15:15:55', '2025-09-20 15:15:55', NULL),
(13, 7, NULL, 'Something', 'sss', 10, 10, 30.00, 1, 'equipment', 'sseqw', '2029-11-20', '2025-09-20 15:42:15', '2025-09-20 15:42:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
CREATE TABLE IF NOT EXISTS `inventory_transactions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `inventory_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` enum('in','out','adjustment','transfer','damaged','expired') NOT NULL,
  `quantity` int NOT NULL,
  `quantity_before` int NOT NULL,
  `quantity_after` int NOT NULL,
  `unit_cost` decimal(10,2) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `reference_number` varchar(191) DEFAULT NULL,
  `reference_type` varchar(191) DEFAULT NULL,
  `notes` text,
  `metadata` json DEFAULT NULL,
  `transaction_date` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_transactions_inventory_id_foreign` (`inventory_id`),
  KEY `inventory_transactions_user_id_foreign` (`user_id`),
  KEY `inventory_transactions_clinic_id_inventory_id_index` (`clinic_id`,`inventory_id`),
  KEY `inventory_transactions_clinic_id_type_index` (`clinic_id`,`type`),
  KEY `inventory_transactions_clinic_id_transaction_date_index` (`clinic_id`,`transaction_date`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`id`, `clinic_id`, `inventory_id`, `user_id`, `type`, `quantity`, `quantity_before`, `quantity_after`, `unit_cost`, `total_cost`, `reference_number`, `reference_type`, `notes`, `metadata`, `transaction_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, 6, 55, 'out', 12, 20, 8, 9.00, 108.00, '6', 'treatment', 'Used in treatment: eqw (Patient: PERDI GURL )', NULL, '2025-09-20 06:15:42', '2025-09-20 06:15:42', '2025-09-20 06:15:42', NULL),
(2, 7, 6, 55, 'out', 1, 10, 9, 9.00, 9.00, '6', 'treatment', 'Treatment update: out 1 units', NULL, '2025-09-20 08:18:45', '2025-09-20 08:18:45', '2025-09-20 08:18:45', NULL),
(3, 7, 6, 55, 'out', 1, 9, 8, 9.00, 9.00, '6', 'treatment', 'Treatment update: out 1 units', NULL, '2025-09-20 08:21:32', '2025-09-20 08:21:32', '2025-09-20 08:21:32', NULL),
(4, 7, 6, 55, 'out', 1, 8, 7, 9.00, 9.00, '6', 'treatment', 'Treatment update: out 1 units', NULL, '2025-09-20 08:24:11', '2025-09-20 08:24:11', '2025-09-20 08:24:11', NULL),
(5, 7, 6, 55, 'in', 1, 7, 8, 9.00, 9.00, '6', 'treatment', 'Treatment update: in 1 units', NULL, '2025-09-20 08:24:26', '2025-09-20 08:24:26', '2025-09-20 08:24:26', NULL),
(6, 7, 6, 57, 'out', 3, 8, 5, 9.00, 27.00, '7', 'treatment', 'Used in treatment: BROBRO (Patient: Marc Salamanca)', NULL, '2025-09-20 08:30:21', '2025-09-20 08:30:21', '2025-09-20 08:30:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"c97030ea-4042-4598-86ca-9dc19ea49f9b\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:10;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758193186, 1758193186),
(2, 'default', '{\"uuid\":\"a085acdf-7569-4582-92c9-9cce1b492484\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:10;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758251870, 1758251870),
(3, 'default', '{\"uuid\":\"f7c70d54-71e7-4881-afcf-9ae0bef4dbdf\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:14;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758347096, 1758347096),
(4, 'default', '{\"uuid\":\"1fa4c7e0-6567-461f-93b3-10a240c147f8\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:14;s:9:\\\"relations\\\";a:2:{i:0;s:4:\\\"type\\\";i:1;s:6:\\\"status\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758347129, 1758347129),
(5, 'default', '{\"uuid\":\"67bd5adf-b888-425e-aa65-246019e7b055\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:15;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758356916, 1758356916),
(6, 'default', '{\"uuid\":\"2b4b2a57-e3c9-44c8-9d86-94982127d9c7\",\"displayName\":\"App\\\\Events\\\\PaymentCompleted\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:27:\\\"App\\\\Events\\\\PaymentCompleted\\\":3:{s:7:\\\"payment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Payment\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758372198, 1758372198),
(7, 'default', '{\"uuid\":\"5de4e1fc-12e1-488c-875b-fd89235ff8a3\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758372683, 1758372683),
(8, 'default', '{\"uuid\":\"f913fa75-0173-4377-9188-235fe54a60c9\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:15;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758372683, 1758372683),
(9, 'default', '{\"uuid\":\"ae69d5e8-3499-4577-8884-07c2496f74bc\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:14;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758372721, 1758372721),
(10, 'default', '{\"uuid\":\"06325e11-a91c-46bd-bfb2-1fcff7a5dcdc\",\"displayName\":\"App\\\\Events\\\\PaymentCompleted\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:27:\\\"App\\\\Events\\\\PaymentCompleted\\\":3:{s:7:\\\"payment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Payment\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1758372929, 1758372929),
(11, 'default', '{\"uuid\":\"ff884cb9-6b82-41fb-b839-445c9dc8ea07\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:16;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759669848, 1759669848),
(12, 'default', '{\"uuid\":\"bfc8371e-0639-43c6-b3a5-2f07e3f85fa9\",\"displayName\":\"App\\\\Events\\\\AppointmentUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:29:\\\"App\\\\Events\\\\AppointmentUpdated\\\":3:{s:11:\\\"appointment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Appointment\\\";s:2:\\\"id\\\";i:16;s:9:\\\"relations\\\";a:2:{i:0;s:4:\\\"type\\\";i:1;s:6:\\\"status\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"updated\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759669898, 1759669898),
(13, 'default', '{\"uuid\":\"4ea4af7b-1fef-4fd9-83c8-363bb62aabe5\",\"displayName\":\"App\\\\Events\\\\ReviewCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:24:\\\"App\\\\Events\\\\ReviewCreated\\\":3:{s:6:\\\"review\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Review\\\";s:2:\\\"id\\\";i:10;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759679318, 1759679318),
(14, 'default', '{\"uuid\":\"de6e4580-7a61-4084-90e7-e73f1ab174b7\",\"displayName\":\"App\\\\Events\\\\ReviewCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:24:\\\"App\\\\Events\\\\ReviewCreated\\\":3:{s:6:\\\"review\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Review\\\";s:2:\\\"id\\\";i:11;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759680844, 1759680844),
(15, 'default', '{\"uuid\":\"3379671d-23b3-4fec-b7df-c67b508780de\",\"displayName\":\"App\\\\Events\\\\ReviewCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:24:\\\"App\\\\Events\\\\ReviewCreated\\\":3:{s:6:\\\"review\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Review\\\";s:2:\\\"id\\\";i:12;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759713778, 1759713778),
(16, 'default', '{\"uuid\":\"e81c3fb8-cd26-43ef-88c7-298f9d63c874\",\"displayName\":\"App\\\\Events\\\\ReviewCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:24:\\\"App\\\\Events\\\\ReviewCreated\\\":3:{s:6:\\\"review\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Review\\\";s:2:\\\"id\\\";i:13;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759714538, 1759714538),
(17, 'default', '{\"uuid\":\"dd42ab3b-7392-4bfd-8feb-5b47c8359035\",\"displayName\":\"App\\\\Events\\\\ReviewCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:24:\\\"App\\\\Events\\\\ReviewCreated\\\":3:{s:6:\\\"review\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Review\\\";s:2:\\\"id\\\";i:14;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:8:\\\"clinicId\\\";i:7;s:9:\\\"eventType\\\";s:7:\\\"created\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1759715015, 1759715015);

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_03_21_000002_create_appointment_statuses_table', 1),
(5, '2024_03_21_000003_create_appointment_types_table', 1),
(6, '2024_03_21_000004_create_appointments_table', 1),
(7, '2024_03_22_000001_add_new_fields_to_appointments_table', 1),
(8, '2024_03_22_000002_create_dentist_schedules_table', 1),
(9, '2025_05_28_152004_create_clinics_table', 1),
(10, '2025_05_28_152011_create_patients_table', 1),
(11, '2025_05_28_152026_create_treatments_table', 1),
(12, '2025_05_28_152034_create_suppliers_table', 1),
(13, '2025_05_28_152035_create_inventory_table', 1),
(14, '2025_05_28_152037_create_payments_table', 1),
(15, '2025_05_28_152623_add_clinic_id_and_role_to_users_table', 1),
(16, '2025_05_29_014456_add_deleted_at_to_users_table', 1),
(17, '2025_06_14_132233_add_start_and_end_date_to_treatments_table', 1),
(18, '2025_06_15_114722_add_comprehensive_fields_to_treatments_table', 1),
(19, '2025_06_16_035707_add_appointment_id_nullable_to_treatments_table', 1),
(20, '2025_06_18_090758_add_public_fields_to_clinics_table', 1),
(21, '2025_06_18_101136_create_clinic_registration_requests_table', 1),
(22, '2025_06_18_132424_alter_status_column_in_clinic_registration_requests_table', 1),
(23, '2025_06_20_003405_add_user_id_to_patients_table', 1),
(24, '2025_06_20_004445_add_phone_number_to_users_table', 1),
(25, '2025_07_02_024620_add_latitude_longitude_to_clinics_table', 2),
(26, '2025_07_02_034000_create_clinic_gallery_images_table', 3),
(27, '2025_07_02_120000_create_services_table', 4),
(28, '2025_01_15_000000_create_reviews_table', 5),
(29, '2025_07_14_003022_add_deleted_at_to_reviews_table', 6),
(30, '2025_08_17_152906_add_address_to_clinic_registration_requests_table', 7),
(31, '2025_08_17_152912_add_address_to_clinic_registration_requests_table', 7),
(32, '2025_01_20_000000_add_stripe_fields_to_clinics_table', 8),
(33, '2025_01_20_000001_add_stripe_fields_to_clinic_registration_requests_table', 8),
(34, '2025_08_19_041323_add_payment_failed_status_to_clinic_registration_requests', 9),
(35, '2025_08_19_050000_add_payment_deadline_to_clinic_registration_requests', 10),
(36, '2025_08_19_053501_add_soft_deletes_to_clinic_registration_requests_table', 11),
(37, '2025_08_19_081812_add_trial_status_to_clinic_registration_requests', 12),
(38, '2025_08_19_085356_update_existing_basic_plan_requests_to_trial_status', 13),
(39, '2025_08_19_085952_fix_remaining_basic_plan_requests_to_trial_status', 14),
(40, '2025_08_20_130104_add_category_and_tags_to_patients_table', 15),
(41, '2025_08_20_155916_change_last_dental_visit_to_string_in_patients_table', 16),
(42, '2025_08_21_052336_add_user_type_to_users_table', 17),
(43, '2025_08_21_052448_add_verification_fields_to_patients_table', 17),
(44, '2025_08_21_083210_add_registration_verification_to_users_table', 18),
(45, '2025_08_22_012311_add_dentist_fields_to_users_table', 19),
(46, '2025_08_23_011949_unify_schedule_systems', 20),
(47, '2025_01_25_000001_enhance_services_table', 21),
(48, '2025_01_25_000002_create_service_dentist_table', 21),
(49, '2025_08_23_073708_add_service_id_to_appointments_table', 22),
(50, '2025_08_23_074125_add_deleted_at_to_services_table', 23),
(51, '2025_08_24_090701_create_waitlist_table', 24),
(52, '2025_08_24_214709_add_service_id_to_treatments_table', 25),
(53, '2025_08_25_195204_create_inventory_transactions_table', 26),
(54, '2025_08_25_195209_create_purchase_orders_table', 26),
(55, '2025_08_25_195214_enhance_inventory_table_with_advanced_fields', 26),
(56, '2025_08_25_195329_create_purchase_order_items_table', 26),
(57, '2025_08_27_215916_add_pending_verification_to_clinic_registration_requests', 27),
(58, '2025_08_27_222434_add_payment_details_to_clinic_registration_requests', 28),
(59, '2025_08_28_131512_add_clinic_id_to_clinic_registration_requests_table', 29),
(60, '2025_08_28_212005_add_testing_fields_to_clinics_table', 30),
(61, '2025_08_29_092238_create_subscription_requests_table', 31),
(62, '2025_08_29_103649_add_payment_fields_to_subscription_requests_table', 32),
(63, '2025_08_30_115427_add_missing_payment_fields_to_subscription_requests_table', 33),
(64, '2025_09_03_154542_make_supplier_id_nullable_in_inventory_table', 34),
(65, '2025_09_10_224024_add_pending_reschedule_status_to_appointment_statuses', 35),
(66, '2025_09_10_224058_add_reschedule_fields_to_appointments_table', 36),
(67, '2025_09_12_211718_create_clinic_holidays_table', 37),
(69, '2025_01_16_000000_add_dashboard_layout_to_users_table', 38),
(70, '2025_09_19_142516_simplify_inventory_table', 38),
(71, '2025_01_27_000001_create_treatment_inventory_items_table', 39),
(72, '2025_01_27_000002_add_inventory_integration_fields_to_treatments_table', 39),
(73, '2025_09_21_223830_add_dr_prefix_to_existing_dentists', 40),
(74, '2025_09_20_232258_add_expiry_date_to_inventory_table', 41),
(75, '2025_10_05_225252_add_doctor_review_fields_to_reviews_table', 42);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `first_name` varchar(191) NOT NULL,
  `last_name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `email_verification_token` varchar(191) DEFAULT NULL,
  `email_verification_token_expires_at` timestamp NULL DEFAULT NULL,
  `phone_number` varchar(191) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `address` text,
  `street_address` varchar(191) DEFAULT NULL,
  `region_code` varchar(191) DEFAULT NULL,
  `province_code` varchar(191) DEFAULT NULL,
  `city_municipality_code` varchar(191) DEFAULT NULL,
  `barangay_code` varchar(191) DEFAULT NULL,
  `postal_code` varchar(191) DEFAULT NULL,
  `address_details` text,
  `medical_history` json DEFAULT NULL,
  `allergies` json DEFAULT NULL,
  `emergency_contact_name` varchar(191) DEFAULT NULL,
  `emergency_contact_number` varchar(191) DEFAULT NULL,
  `emergency_contact_relationship` varchar(191) DEFAULT NULL,
  `insurance_provider` varchar(191) DEFAULT NULL,
  `insurance_policy_number` varchar(191) DEFAULT NULL,
  `blood_type` varchar(191) DEFAULT NULL,
  `occupation` varchar(191) DEFAULT NULL,
  `marital_status` enum('single','married','divorced','widowed') DEFAULT NULL,
  `last_dental_visit` varchar(50) DEFAULT NULL,
  `notes` text,
  `category` varchar(191) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patients_clinic_id_foreign` (`clinic_id`),
  KEY `patients_user_id_foreign` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `clinic_id`, `user_id`, `first_name`, `last_name`, `email`, `email_verified`, `email_verified_at`, `email_verification_token`, `email_verification_token_expires_at`, `phone_number`, `date_of_birth`, `gender`, `address`, `street_address`, `region_code`, `province_code`, `city_municipality_code`, `barangay_code`, `postal_code`, `address_details`, `medical_history`, `allergies`, `emergency_contact_name`, `emergency_contact_number`, `emergency_contact_relationship`, `insurance_provider`, `insurance_policy_number`, `blood_type`, `occupation`, `marital_status`, `last_dental_visit`, `notes`, `category`, `tags`, `balance`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, NULL, 'Jane Rose Tagubar', '', 'delacruzjane641@gmail.com', 0, NULL, NULL, NULL, '09512312111', '2007-07-01', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-01 00:00:25', '2025-08-20 20:31:36', NULL),
(2, 1, 12, 'John', 'Doe', 'patient@example.com', 0, NULL, NULL, NULL, '09123456789', '1990-01-01', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-13 16:30:58', '2025-08-20 20:31:36', NULL),
(3, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:08:04', '2025-08-21 04:27:41', NULL),
(4, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:14:19', '2025-09-03 06:12:24', '2025-09-03 06:12:24'),
(5, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:22:02', '2025-09-03 06:12:17', '2025-09-03 06:12:17'),
(6, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:29:17', '2025-09-03 06:12:11', '2025-09-03 06:12:11'),
(7, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:31:34', '2025-09-03 06:12:05', '2025-09-03 06:12:05'),
(8, 2, NULL, 'Dy Mark Gales', '', 'kite.gales10@gmail.com', 0, NULL, NULL, NULL, '+639457766068', '2007-07-17', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'No previous visit', NULL, NULL, NULL, 0.00, '2025-07-16 16:31:44', '2025-09-03 06:11:57', '2025-09-03 06:11:57'),
(9, 7, NULL, 'Marc', 'Salamanca', 'marcy@ssct.edu.ph', 0, NULL, NULL, NULL, '0931241211', '1993-07-17', 'male', NULL, 'Washington Street', '160000000', '166700000', '166724000', '166724068', '8400', 'In front of STI College Building', '\"N/A\"', '\"N/A\"', 'Marcy', '0932151212', 'Spouse', 'N/A', 'N/A', 'B+', 'Information Officer', 'married', 'Within 6 months', 'N/A', 'new', NULL, 0.00, '2025-08-20 05:26:20', '2025-08-20 08:18:53', NULL),
(10, 7, NULL, 'Dy Mark', 'Gales', 'dygales@ssct.edu.ph', 0, NULL, NULL, NULL, '09457766068', '2000-08-25', 'male', NULL, 'Purok Ilang-Ilang', '160000000', '166700000', '166724000', '166724022', '8400', 'Near Luneta Park', '\"None\"', '\"None\"', 'janerose', '090898724', 'Girlfriend', 'N/A', 'N/A', 'B+', 'Student', 'single', 'Within 3 months', 'None', 'vip', NULL, 0.00, '2025-08-20 08:24:39', '2025-08-20 08:24:39', NULL),
(11, 7, NULL, 'Dummy', 'ACcount', 'dummy_account@gmail.com', 0, NULL, NULL, NULL, '029312321', '2025-08-21', 'female', NULL, 'mabua', '160000000', '166700000', '166724000', '166724007', '8400', 'dsqweewqewq', '\"eqw\"', '\"eqw\"', 'janerose', '90898724', 'eqweas', 'eqwewq', 'ewqewq', 'B+', 'Student', 'single', 'No previous visit', 'eqw', 'emergency', NULL, 0.00, '2025-08-20 08:51:02', '2025-08-20 12:01:48', '2025-08-20 12:01:48'),
(12, 7, NULL, 'Dummy', 'ACcount', 'dummy_account@gmail.com', 0, NULL, NULL, NULL, '029312321', '2025-08-21', 'female', NULL, 'mabua', '160000000', '166700000', '166724000', '166724007', '8400', 'dsqweewqewq', '\"eqw\"', '\"eqw\"', 'janerose', '90898724', 'eqweas', 'eqwewq', 'ewqewq', 'B+', 'Student', 'single', 'No previous visit', 'eqw', 'emergency', NULL, 0.00, '2025-08-20 08:51:03', '2025-08-20 12:01:48', '2025-08-20 12:01:48'),
(13, 7, NULL, 'Dummy', 'ACcount', 'dummy_account@gmail.com', 0, NULL, NULL, NULL, '029312321', '2025-08-21', 'female', NULL, 'mabua', '160000000', '166700000', '166724000', '166724007', '8400', 'dsqweewqewq', '\"eqw\"', '\"eqw\"', 'janerose', '90898724', 'eqweas', 'eqwewq', 'ewqewq', 'B+', 'Student', 'single', 'No previous visit', 'eqw', 'emergency', NULL, 0.00, '2025-08-20 08:51:16', '2025-08-20 12:01:48', '2025-08-20 12:01:48'),
(14, 7, NULL, 'Dummy', 'ACcount', 'dummy_account@gmail.com', 0, NULL, NULL, NULL, '029312321', '2025-08-21', 'female', NULL, 'mabua', '160000000', '166700000', '166724000', '166724007', '8400', 'dsqweewqewq', '\"eqw\"', '\"eqw\"', 'janerose', '90898724', 'eqweas', 'eqwewq', 'ewqewq', 'B+', 'Student', 'single', 'No previous visit', 'eqw', 'emergency', NULL, 0.00, '2025-08-20 08:51:17', '2025-08-20 12:01:48', '2025-08-20 12:01:48'),
(15, 7, NULL, 'Dummy', 'ACcount', 'dummy_account@gmail.com', 0, NULL, NULL, NULL, '029312321', '2025-08-21', 'female', NULL, 'mabua', '160000000', '166700000', '166724000', '166724007', '8400', 'dsqweewqewq', '\"eqw\"', '\"eqw\"', 'janerose', '90898724', 'eqweas', 'eqwewq', 'ewqewq', 'AB-', 'Student', 'single', 'No previous visit', 'eqw', 'emergency', NULL, 0.00, '2025-08-20 08:51:55', '2025-08-20 11:58:39', '2025-08-20 11:58:39'),
(16, 7, NULL, 'ewqe', 'ewqeqw', 'ewqeqwe@gmail.com', 0, NULL, NULL, NULL, '021391231', '2025-08-21', 'female', NULL, 'eqwsae', '030000000', '037100000', '037107000', '037107012', '8400', 'eqwewqewq', '\"wqeqw\"', '\"qweqw\"', 'eqwewq', 'ewqewq', '321321qw', 'wqeqwewq', 'eqwewq', 'O+', 'qwewqewq', 'single', 'No previous visit', 'qweqwe', 'emergency', NULL, 0.00, '2025-08-20 08:54:27', '2025-08-20 11:57:28', '2025-08-20 11:57:28'),
(17, 7, NULL, 'Jane Rose', 'Dela Cruz', 'delacruzjane949@gmail.com', 0, NULL, NULL, NULL, '09089872489', '2003-06-26', 'female', NULL, 'Purok 6', '160000000', '166700000', '166724000', '166724028', '8400', 'Purok 6, Near Embroiler In-front of a Billiaran', '\"None\"', '\"None\"', 'Dy Mark Gales', '09457766068', 'Boyfriend', 'N/A', 'N/A', 'A+', 'Student', 'single', 'No previous visit', 'None', 'returning', NULL, 0.00, '2025-08-20 09:03:50', '2025-08-20 22:51:47', NULL),
(18, 7, NULL, 'Vince Dy', 'Gales', 'vince_dy@gmail.com', 0, NULL, NULL, NULL, '094457766067', '2015-04-15', 'male', NULL, 'Purok- Ilang-Ilang', '160000000', '166700000', '166724000', '166724022', '8400', 'Near luneta park of brgy. ipil', '\"None\"', '\"None\"', 'Aniceta B. Gales', '09457766068', 'Mother', 'None', 'None', 'A+', 'Student', 'single', 'More than 1 year', 'None', 'new', NULL, 0.00, '2025-08-20 20:04:25', '2025-08-20 20:32:40', NULL),
(19, 7, 48, 'PerdiBOI', 'Tough', 'perdiboitough@gmail.com', 1, '2025-08-21 06:42:42', NULL, NULL, '09858978067', '2000-08-22', 'male', NULL, 'Purok Ilang-Ilang', '160000000', '166700000', '166724000', '166724022', '8400', 'Near Brgy. Hall', '\"None\"', '\"None\"', 'PerdiGirl', '09747978067', 'GF', 'None', 'None', 'B+', 'Student', 'single', 'Within 3 months', 'None', 'pediatric', NULL, 0.00, '2025-08-20 23:03:53', '2025-09-18 11:02:50', NULL),
(20, 2, 48, 'PERDI BOI', '', 'perdiboitough@gmail.com', 0, NULL, NULL, NULL, '0932141231', '2007-09-02', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, '2025-09-02 13:20:59', '2025-09-02 13:20:59', NULL),
(21, 2, NULL, 'Marc', 'Salamanca', 'msalamanca@ssct.edu.ph', 0, NULL, NULL, NULL, '09832131231', '1996-06-10', 'male', NULL, 'Magallanes Street', '160000000', '166700000', '166724000', '166724068', '8400', 'In front of STI', '\"N/A\"', '\"N/A\"', 'Bridgette', '09312421312', 'Wife', 'N/A', 'N/A', 'AB+', 'Student', 'married', 'Within 3 months', 'N/A', 'new', NULL, 0.00, '2025-09-03 06:16:58', '2025-09-03 06:16:58', NULL),
(22, 7, 47, 'PERDI GURL', '', 'perdigirltough@gmail.com', 0, NULL, NULL, NULL, '0931242131', '2007-09-20', 'other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, '2025-09-20 05:44:43', '2025-09-20 05:44:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `patient_id` bigint UNSIGNED NOT NULL,
  `treatment_id` bigint UNSIGNED DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(191) DEFAULT NULL,
  `notes` text,
  `reference_number` varchar(191) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `received_by` bigint UNSIGNED DEFAULT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'PHP',
  `gcash_reference` varchar(191) DEFAULT NULL,
  `category` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_clinic_id_foreign` (`clinic_id`),
  KEY `payments_patient_id_foreign` (`patient_id`),
  KEY `payments_treatment_id_foreign` (`treatment_id`),
  KEY `payments_received_by_foreign` (`received_by`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `clinic_id`, `patient_id`, `treatment_id`, `amount`, `payment_method`, `status`, `transaction_id`, `notes`, `reference_number`, `payment_date`, `received_by`, `currency`, `gcash_reference`, `category`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 20, NULL, 123.00, 'cash', 'completed', NULL, 'qwe', 'PAY-20250903-645', '2025-09-03', 11, 'PHP', NULL, 'treatment', '2025-09-03 08:01:21', '2025-09-03 08:01:21', NULL),
(2, 7, 10, 3, 2332.99, 'cash', 'completed', NULL, 'qwe', 'PAY-20250915-263', '2025-09-14', 17, 'PHP', NULL, 'other', '2025-09-15 13:46:15', '2025-09-15 13:48:24', NULL),
(3, 7, 9, 7, 1026.00, 'cash', 'completed', NULL, NULL, 'PAY-20250920-931', '2025-09-20', 17, 'PHP', NULL, 'treatment', '2025-09-20 12:43:18', '2025-09-20 12:43:18', NULL),
(4, 7, 22, 6, 1125.00, 'cash', 'completed', NULL, NULL, 'PAY-20250920-941', '2025-09-20', 17, 'PHP', NULL, NULL, '2025-09-20 12:55:29', '2025-09-20 12:55:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `po_number` varchar(191) NOT NULL,
  `status` enum('draft','pending','approved','ordered','received','cancelled') NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `shipping_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL,
  `notes` text,
  `delivery_notes` text,
  `payment_terms` json DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `ordered_at` timestamp NULL DEFAULT NULL,
  `received_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_orders_po_number_unique` (`po_number`),
  KEY `purchase_orders_supplier_id_foreign` (`supplier_id`),
  KEY `purchase_orders_created_by_foreign` (`created_by`),
  KEY `purchase_orders_approved_by_foreign` (`approved_by`),
  KEY `purchase_orders_clinic_id_status_index` (`clinic_id`,`status`),
  KEY `purchase_orders_clinic_id_supplier_id_index` (`clinic_id`,`supplier_id`),
  KEY `purchase_orders_clinic_id_order_date_index` (`clinic_id`,`order_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

DROP TABLE IF EXISTS `purchase_order_items`;
CREATE TABLE IF NOT EXISTS `purchase_order_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `purchase_order_id` bigint UNSIGNED NOT NULL,
  `inventory_id` bigint UNSIGNED DEFAULT NULL,
  `item_name` varchar(191) NOT NULL,
  `item_description` text,
  `sku` varchar(191) DEFAULT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `quantity_ordered` int NOT NULL,
  `quantity_received` int NOT NULL DEFAULT '0',
  `unit_cost` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `unit_of_measure` varchar(191) NOT NULL DEFAULT 'pieces',
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `status` enum('pending','ordered','partially_received','received','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text,
  `specifications` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_order_items_purchase_order_id_status_index` (`purchase_order_id`,`status`),
  KEY `purchase_order_items_inventory_id_index` (`inventory_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recurring_appointments`
--

DROP TABLE IF EXISTS `recurring_appointments`;
CREATE TABLE IF NOT EXISTS `recurring_appointments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `appointment_id` bigint UNSIGNED NOT NULL,
  `frequency` varchar(191) NOT NULL,
  `interval` int NOT NULL DEFAULT '1',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `days_of_week` json DEFAULT NULL,
  `day_of_month` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recurring_appointments_appointment_id_foreign` (`appointment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `patient_id` bigint UNSIGNED DEFAULT NULL,
  `appointment_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(191) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` int NOT NULL COMMENT '1-5 stars',
  `source` enum('internal','external','google','manual') NOT NULL DEFAULT 'internal',
  `external_review_id` varchar(191) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `helpful_count` int NOT NULL DEFAULT '0',
  `reported_count` int NOT NULL DEFAULT '0',
  `review_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `staff_id` bigint UNSIGNED DEFAULT NULL,
  `professionalism_rating` tinyint DEFAULT NULL COMMENT '1-5 rating for professionalism',
  `communication_rating` tinyint DEFAULT NULL COMMENT '1-5 rating for communication',
  `treatment_quality_rating` tinyint DEFAULT NULL COMMENT '1-5 rating for treatment quality',
  `bedside_manner_rating` tinyint DEFAULT NULL COMMENT '1-5 rating for bedside manner',
  `comment` text COMMENT 'Optional additional comments',
  PRIMARY KEY (`id`),
  KEY `reviews_appointment_id_foreign` (`appointment_id`),
  KEY `reviews_clinic_id_status_index` (`clinic_id`,`status`),
  KEY `reviews_clinic_id_rating_index` (`clinic_id`,`rating`),
  KEY `reviews_patient_id_clinic_id_index` (`patient_id`,`clinic_id`),
  KEY `reviews_staff_id_status_index` (`staff_id`,`status`),
  KEY `reviews_clinic_id_staff_id_index` (`clinic_id`,`staff_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `clinic_id`, `patient_id`, `appointment_id`, `title`, `content`, `rating`, `source`, `external_review_id`, `status`, `is_verified`, `helpful_count`, `reported_count`, `review_date`, `created_at`, `updated_at`, `deleted_at`, `staff_id`, `professionalism_rating`, `communication_rating`, `treatment_quality_rating`, `bedside_manner_rating`, `comment`) VALUES
(1, 1, 2, NULL, 'Excellent Dental Care', 'I had a wonderful experience at this clinic. The staff was very professional and the dentist was gentle and thorough. Highly recommend!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-11 16:30:58', '2025-07-13 16:30:59', '2025-07-13 16:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 2, NULL, 'Great Service', 'The clinic is clean and modern. The dentist explained everything clearly and made me feel comfortable throughout the procedure.', 4, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-08 16:30:58', '2025-07-13 16:30:59', '2025-07-13 16:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 2, NULL, 'Professional and Caring', 'I was nervous about my dental procedure, but the team here made me feel at ease. The results were excellent and I would definitely return.', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-03 16:30:58', '2025-07-13 16:30:59', '2025-07-13 16:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 1, 2, NULL, 'Good Experience', 'The clinic is well-organized and the staff is friendly. The waiting time was reasonable and the treatment was effective.', 4, 'internal', NULL, 'approved', 0, 0, 0, '2025-06-28 16:30:58', '2025-07-13 16:30:59', '2025-07-13 16:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 1, 2, NULL, 'Highly Recommended', 'I found this clinic through a friend\'s recommendation and I\'m glad I did. The quality of care is outstanding and the prices are reasonable.', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-06-23 16:30:58', '2025-07-13 16:30:59', '2025-07-13 16:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 2, 5, NULL, NULL, 'yes!qsewqeaseqwewq', 4, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-16 16:22:02', '2025-07-16 16:22:02', '2025-07-16 16:22:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 2, 6, NULL, 'yeas', 'right here!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-16 16:29:17', '2025-07-16 16:29:17', '2025-07-16 16:29:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 2, 7, NULL, NULL, 'eqwsaeeeeeeeeeeqw', 2, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-16 16:31:34', '2025-07-16 16:31:34', '2025-07-16 16:31:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 2, 8, NULL, NULL, 'ssssssssssssssss', 2, 'internal', NULL, 'approved', 0, 0, 0, '2025-07-16 16:31:44', '2025-07-16 16:31:44', '2025-07-16 16:31:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 7, 19, NULL, NULL, 'A very outstanding and commendable doctor!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-10-05 15:48:38', '2025-10-05 15:48:38', '2025-10-05 15:48:38', NULL, 19, 5, 5, 5, 5, NULL),
(11, 7, 22, NULL, 'Amazing Clinic', 'What an amazing clinic! It was the best experience ever!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-10-05 16:14:04', '2025-10-05 16:14:04', '2025-10-05 16:14:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 7, 19, NULL, 'So good of a doctor!', 'You\'re so amazing po!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-10-06 01:22:58', '2025-10-06 01:22:58', '2025-10-06 01:22:58', NULL, 57, 5, 5, 5, 5, 'So skilled!'),
(13, 7, 19, NULL, 'Excellent Doc', 'Not bad of a doctor!', 4, 'internal', NULL, 'approved', 0, 0, 0, '2025-10-06 01:35:38', '2025-10-06 01:35:38', '2025-10-06 01:35:38', NULL, 55, 4, 4, 4, 4, 'Was accommodating.'),
(14, 7, 19, NULL, 'Nc ka Doc!', 'let\'s go doc!', 5, 'internal', NULL, 'approved', 0, 0, 0, '2025-10-06 01:43:35', '2025-10-06 01:43:35', '2025-10-06 01:43:35', NULL, 56, 5, 5, 2, 3, 'hehehehehe');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_exceptions`
--

DROP TABLE IF EXISTS `schedule_exceptions`;
CREATE TABLE IF NOT EXISTS `schedule_exceptions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `dentist_schedule_id` bigint UNSIGNED NOT NULL,
  `exception_date` date NOT NULL,
  `exception_type` varchar(191) NOT NULL,
  `modified_start_time` time DEFAULT NULL,
  `modified_end_time` time DEFAULT NULL,
  `reason` text,
  `is_recurring_yearly` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_exceptions_dentist_schedule_id_foreign` (`dentist_schedule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_templates`
--

DROP TABLE IF EXISTS `schedule_templates`;
CREATE TABLE IF NOT EXISTS `schedule_templates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text,
  `schedule_data` json NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_templates_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text,
  `category` varchar(191) NOT NULL DEFAULT 'general',
  `subcategory` varchar(191) DEFAULT NULL,
  `code` varchar(191) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `insurance_price` decimal(10,2) DEFAULT NULL,
  `is_insurance_eligible` tinyint(1) NOT NULL DEFAULT '0',
  `requires_consultation` tinyint(1) NOT NULL DEFAULT '0',
  `is_emergency_service` tinyint(1) NOT NULL DEFAULT '0',
  `advance_booking_days` int NOT NULL DEFAULT '0',
  `max_daily_bookings` int DEFAULT NULL,
  `insurance_codes` json DEFAULT NULL,
  `duration_minutes` int NOT NULL DEFAULT '30',
  `procedure_details` text,
  `preparation_instructions` text,
  `post_procedure_care` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `services_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `clinic_id`, `name`, `description`, `category`, `subcategory`, `code`, `price`, `cost_price`, `insurance_price`, `is_insurance_eligible`, `requires_consultation`, `is_emergency_service`, `advance_booking_days`, `max_daily_bookings`, `insurance_codes`, `duration_minutes`, `procedure_details`, `preparation_instructions`, `post_procedure_care`, `is_active`, `sort_order`, `tags`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 'Braces', 'Lorem ipsum services', 'general', NULL, NULL, 1299.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:19:25', '2025-07-13 15:19:25', NULL),
(2, 2, 'Deep Cleaning', 'Lorem ipsum services', 'general', NULL, NULL, 1599.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:20:14', '2025-07-13 15:20:14', NULL),
(3, 2, 'Whitening', 'Lorem ipsum brobro', 'general', NULL, NULL, 3211.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:21:15', '2025-07-13 15:21:15', NULL),
(4, 2, 'Teeth Checkup', 'Lorem ipsum brawbraw', 'general', NULL, NULL, 999.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:21:43', '2025-07-13 15:21:57', NULL),
(5, 2, 'Dentures', 'Lorem ipsum yeahyeah', 'general', NULL, NULL, 2999.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:23:06', '2025-07-13 15:23:06', NULL),
(6, 2, 'Oral Hygiene', 'Lorem ipsum janejane', 'general', NULL, NULL, 8333.00, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 30, NULL, NULL, NULL, 1, 0, NULL, NULL, '2025-07-13 15:23:32', '2025-07-13 15:23:32', NULL),
(7, 7, 'Teeth Cleanings', 'Lorem Ipsum', 'general', 'Deep Cleaning', 'TC001', 999.00, 499.00, NULL, 0, 1, 1, 30, 20, '[]', 30, 'Lorem ipsum', 'Lorem Ipsum', 'Lorem Lorem Ipsum Ipsum', 1, 0, '[]', 'None so far', '2025-08-23 00:40:32', '2025-09-19 04:05:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_dentist`
--

DROP TABLE IF EXISTS `service_dentist`;
CREATE TABLE IF NOT EXISTS `service_dentist` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `is_primary_specialist` tinyint(1) NOT NULL DEFAULT '0',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `experience_years` int DEFAULT NULL,
  `specialization_notes` text,
  `custom_price` decimal(10,2) DEFAULT NULL,
  `custom_duration_minutes` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_dentist_service_id_user_id_clinic_id_unique` (`service_id`,`user_id`,`clinic_id`),
  KEY `service_dentist_user_id_foreign` (`user_id`),
  KEY `service_dentist_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `service_dentist`
--

INSERT INTO `service_dentist` (`id`, `service_id`, `user_id`, `clinic_id`, `is_primary_specialist`, `is_available`, `experience_years`, `specialization_notes`, `custom_price`, `custom_duration_minutes`, `created_at`, `updated_at`) VALUES
(1, 7, 19, 7, 0, 1, NULL, NULL, NULL, NULL, '2025-08-23 00:40:32', '2025-09-20 13:33:53'),
(2, 7, 55, 7, 0, 1, NULL, NULL, NULL, NULL, '2025-09-20 13:33:53', '2025-09-20 13:33:53'),
(3, 7, 56, 7, 0, 1, NULL, NULL, NULL, NULL, '2025-09-20 13:33:53', '2025-09-20 13:33:53'),
(4, 7, 57, 7, 0, 1, NULL, NULL, NULL, NULL, '2025-09-20 13:33:53', '2025-09-20 13:33:53');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `payload` longtext NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fvi6BYACGd60MJgIqHDNlqEcO5smxVSHqSuSQB46', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-PH) WindowsPowerShell/5.1.26100.6584', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWkZnYjRQVHpkcTlGQmJDZXdLbnB1YWM5czlIbnJXRzJtNFBoMEZ4ciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1760063520),
('5GtjcGqSKcGRxpflSoVmUBECm7QAsYHhCPY1cJzW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-PH) WindowsPowerShell/5.1.26100.6584', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDJJcklEQWdzV0NITkIwZmd6T3R1SkZ6czlPcTNxYXpLNWVDaFlxUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC90ZXN0LWNoYXRib3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1760063539),
('mi5mnz1GLHEL4tFePEQ0SE2mqHH9SwgcvxPIo8co', NULL, '127.0.0.1', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicloyZ0E3azRna2dGSVhkdmRhdDZ6bWRPRmwwQTBZYlBGelBib3hEVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC90ZXN0LWNoYXRib3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1760063542),
('eA9YWV1gX4E0CJQCAOVN59NLIR9D7ERKgrFyzZ6g', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-PH) WindowsPowerShell/5.1.26100.6584', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOXdQVUo0R0dGZ1JGUjQ0eWdtWVFPT2lyN09XcXcyWXg5RlNDWjVvRyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1760063544),
('qASDZB1RDK3HmWsCl39Tu6aYaaNd3K4GGMljsh29', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidlJ6VWVXaXhmNkZDMGZRVDlUbzNvRnluOFRUOWNVeUN3VEY1ZDN4TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1760065802),
('lfJ7K8LDZlBCnByTJz1zhuhoEpMt8fqfqRYf9idX', 91, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo4OntzOjY6Il90b2tlbiI7czo0MDoiVVRvWGwzVlFrcTJ1MGluTWphbm1WeGxjVkdlUWp1dmpIMUVqaW9CdSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0MToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FkbWluL3N1YnNjcmlwdGlvbnMiO31zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo1NDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2NsaW5pY3MvZW5oYXluZXMtZGVudGFsLWNsaW5pYy0xIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6OTE7czoxOToic3Vic2NyaXB0aW9uX3N0YXR1cyI7czo2OiJhY3RpdmUiO3M6MjE6InN1YnNjcmlwdGlvbl9lbmRfZGF0ZSI7TzoyNToiSWxsdW1pbmF0ZVxTdXBwb3J0XENhcmJvbiI6Mzp7czo0OiJkYXRlIjtzOjI2OiIyMDI1LTExLTA1IDAwOjAwOjAwLjAwMDAwMCI7czoxMzoidGltZXpvbmVfdHlwZSI7aTozO3M6ODoidGltZXpvbmUiO3M6MTE6IkFzaWEvTWFuaWxhIjt9czoxMzoidHJpYWxfZW5kc19hdCI7Tjt9', 1760069613);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_requests`
--

DROP TABLE IF EXISTS `subscription_requests`;
CREATE TABLE IF NOT EXISTS `subscription_requests` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `request_type` enum('upgrade','renewal') NOT NULL,
  `current_plan` varchar(191) NOT NULL,
  `requested_plan` varchar(191) DEFAULT NULL,
  `duration_months` int NOT NULL,
  `message` text,
  `status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
  `admin_notes` text,
  `calculated_amount` decimal(10,2) DEFAULT NULL,
  `payment_token` varchar(64) DEFAULT NULL,
  `payment_deadline` timestamp NULL DEFAULT NULL,
  `payment_method` varchar(191) DEFAULT NULL,
  `payment_details` text,
  `reference_number` varchar(191) DEFAULT NULL,
  `sender_name` varchar(191) DEFAULT NULL,
  `sender_number` varchar(191) DEFAULT NULL,
  `amount_sent` decimal(10,2) DEFAULT NULL,
  `payment_received_at` timestamp NULL DEFAULT NULL,
  `payment_status` varchar(191) NOT NULL DEFAULT 'pending',
  `payment_verification_notes` text,
  `processed_at` timestamp NULL DEFAULT NULL,
  `processed_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subscription_requests_clinic_id_foreign` (`clinic_id`),
  KEY `subscription_requests_processed_by_foreign` (`processed_by`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subscription_requests`
--

INSERT INTO `subscription_requests` (`id`, `clinic_id`, `request_type`, `current_plan`, `requested_plan`, `duration_months`, `message`, `status`, `admin_notes`, `calculated_amount`, `payment_token`, `payment_deadline`, `payment_method`, `payment_details`, `reference_number`, `sender_name`, `sender_number`, `amount_sent`, `payment_received_at`, `payment_status`, `payment_verification_notes`, `processed_at`, `processed_by`, `created_at`, `updated_at`) VALUES
(1, 7, 'upgrade', 'basic', 'premium', 1, 'Requested via main header Upgrade button', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-08-29 02:18:56', '2025-08-29 02:18:56'),
(2, 7, 'upgrade', 'basic', 'premium', 1, 'Requested via main header Upgrade button', 'approved', NULL, 1999.00, 'hmz7mpxGitL4ZjiuNuTU31bh36fNt4J0E4InFJqAuCuBPTDi7infRsLMb5QSfhOE', '2025-09-05 03:26:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-08-29 03:26:52', 16, '2025-08-29 02:19:04', '2025-08-29 03:26:52'),
(3, 7, 'upgrade', 'basic', 'premium', 1, 'Requested via main header Upgrade button', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-08-30 01:37:34', '2025-08-30 01:37:34'),
(4, 7, 'renewal', 'basic', NULL, 1, 'Requested via main header Renew button', 'completed', NULL, 0.00, 'cCY8kiar8vetURlovlnrT4dQw6o1BRvMwuhT8TpJ932e8n8kLKXcfgCes56YkwEz', '2025-09-06 01:39:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-08-30 01:40:47', 16, '2025-08-30 01:37:49', '2025-08-30 01:40:47'),
(5, 7, 'upgrade', 'basic', 'premium', 1, 'Requested via main header Upgrade button', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-08-30 01:44:03', '2025-08-30 01:44:03'),
(6, 7, 'upgrade', 'basic', 'premium', 1, 'Requested upgrade from basic to premium via main header Upgrade button', 'approved', NULL, 1999.00, 'FZvLmZKMk0Y3WTP95urNAMsWtQ18eSVRc1tk8BBVN009gdSZiO08XWz0DtPdixcq', '2025-09-06 02:56:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-08-30 02:56:30', 16, '2025-08-30 02:55:35', '2025-08-30 02:56:30'),
(7, 7, 'upgrade', 'basic', 'premium', 1, 'Requested upgrade from basic to premium via main header Upgrade button', 'approved', NULL, 1999.00, '6ilAvPF0knn0DzdMeJO5N5QkTHq0FHGvIeeaC5hruDpylNjObwkYUzZ3qMrJabcQ', '2025-09-06 04:02:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-08-30 04:02:37', 16, '2025-08-30 04:02:01', '2025-08-30 04:02:37'),
(8, 7, 'upgrade', 'basic', 'premium', 1, 'Requested upgrade from basic to premium via main header Upgrade button', 'completed', NULL, 1999.00, '8aLeyY6cXzxEZvNj6O3MKZwtyqfllxHEEikpaJp2cKUtibxf7eZaElgOUQCaUEWq', '2025-09-06 05:21:53', 'gcash', '{\"sender_name\":\"dymark\",\"sender_phone\":\"0941251231\",\"transaction_reference\":\"GCA-20250830-0008-C9FBE6\",\"payment_amount\":\"1999\",\"payment_method\":\"gcash\"}', 'GCA-20250830-0008-C9FBE6', 'dymark', '0941251231', 1999.00, '2025-08-30 05:22:30', 'verified', NULL, '2025-08-30 05:24:11', 16, '2025-08-30 05:21:17', '2025-08-30 05:24:11'),
(9, 7, 'renewal', 'premium', 'premium', 1, 'Requested via main header Renew button', 'completed', NULL, 1999.00, '3ZSbtRxXpQlcaTKAkLxHJBpTeVW5FI5DkYn5jQLhp9yQ8EXfKff1NXLMCpxmS3PS', '2025-09-06 05:25:44', 'gcash', '{\"sender_name\":\"wkwk\",\"sender_phone\":\"094151231\",\"transaction_reference\":\"GCA-20250830-0009-C92D01\",\"payment_amount\":\"1999\",\"payment_method\":\"gcash\"}', 'GCA-20250830-0009-C92D01', 'wkwk', '094151231', 1999.00, '2025-08-30 05:26:16', 'verified', NULL, '2025-08-30 05:26:58', 16, '2025-08-30 05:25:16', '2025-08-30 05:26:58'),
(10, 7, 'renewal', 'premium', 'premium', 1, 'Requested via main header Renew button', 'completed', NULL, 1999.00, 'iltQiRj8JbTLFipkh103E6MKF2KkspfyKoOS1NITzSMFPiP3faS70JlGj9LYTkP3', '2025-09-06 05:41:42', 'gcash', '{\"sender_name\":\"jane\",\"sender_phone\":\"09858978067\",\"transaction_reference\":\"GCA-20250830-0010-751868\",\"payment_amount\":\"1999\",\"payment_method\":\"gcash\"}', 'GCA-20250830-0010-751868', 'jane', '09858978067', 1999.00, '2025-08-30 05:42:09', 'verified', NULL, '2025-08-30 05:42:40', 16, '2025-08-30 05:41:03', '2025-08-30 05:42:40'),
(11, 7, 'renewal', 'premium', 'premium', 1, 'Requested via main header Renew button', 'completed', NULL, 1999.00, '4Y8IYNexC6RZoHjnRgQ0el3gNNxg52lpo3iFFqu7pqwOar0Vs6W43FzNxuH6ljYE', '2025-09-07 00:48:39', 'paymaya', '{\"sender_name\":\"DYM GALS\",\"sender_phone\":\"09457766068\",\"transaction_reference\":\"PAY-20250831-0011-C5684B\",\"payment_amount\":\"1999\",\"payment_method\":\"paymaya\"}', 'PAY-20250831-0011-C5684B', 'DYM GALS', '09457766068', 1999.00, '2025-08-31 00:49:21', 'verified', NULL, '2025-08-31 01:36:25', 16, '2025-08-31 00:47:58', '2025-08-31 01:36:25'),
(12, 12, 'upgrade', 'premium', 'enterprise', 1, 'Requested upgrade from premium to enterprise via main header Upgrade button', 'pending', NULL, 2999.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-08-31 01:48:40', '2025-08-31 01:48:40'),
(13, 12, 'renewal', 'premium', 'premium', 1, 'Requested via main header Renew button', 'pending', NULL, 1999.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-08-31 01:49:24', '2025-08-31 01:49:24'),
(14, 12, 'upgrade', 'premium', 'enterprise', 1, 'Requested upgrade from premium to enterprise via main header Upgrade button', 'completed', NULL, 2999.00, 'UIaHlXqzIglXS6C0nRZdyf7neptR9DUsPLgDr4amnPvbeAJiMD3n6tySK6SOhCgk', '2025-09-07 01:53:36', 'gcash', '{\"sender_name\":\"dym galse\",\"sender_phone\":\"094123121\",\"transaction_reference\":\"GCA-20250831-0014-9C8FEF\",\"payment_amount\":\"2999\",\"payment_method\":\"gcash\",\"user_reference_number\":\"ref12345\"}', 'GCA-20250831-0014-9C8FEF', 'dym galse', '094123121', 2999.00, '2025-08-31 01:54:10', 'verified', NULL, '2025-08-31 02:03:17', 16, '2025-08-31 01:53:10', '2025-08-31 02:03:17'),
(15, 12, 'renewal', 'enterprise', 'enterprise', 1, 'Requested via main header Renew button', 'completed', NULL, 2999.00, 'AJxx3bm2iYd72bwiTR6N1fsN5i4WHjXOvVoSe3DcM4PQz7gEEMnnvmMzEOJWEJvE', '2025-09-07 02:03:59', 'gcash', '\"{\\\"sender_name\\\":\\\"yebrobro\\\",\\\"sender_phone\\\":\\\"0931241231\\\",\\\"transaction_reference\\\":\\\"GCA-20250831-0015-A11548\\\",\\\"payment_amount\\\":\\\"2999\\\",\\\"payment_method\\\":\\\"gcash\\\",\\\"user_reference_number\\\":\\\"REFBROBRO123\\\"}\"', 'GCA-20250831-0015-A11548', 'yebrobro', '0931241231', 2999.00, '2025-08-31 02:04:45', 'verified', NULL, '2025-08-31 02:12:46', 16, '2025-08-31 02:03:41', '2025-08-31 02:12:46'),
(16, 7, 'upgrade', 'premium', 'enterprise', 1, 'Upgrade request from premium to enterprise for 1 month(s)', 'pending', NULL, 2999.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2025-10-05 09:06:22', '2025-10-05 09:06:22');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `contact_person` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` text,
  `tax_id` varchar(191) DEFAULT NULL,
  `payment_terms` varchar(191) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suppliers_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `clinic_id`, `name`, `contact_person`, `email`, `phone`, `address`, `tax_id`, `payment_terms`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Dental Supplies Co.', 'John Smith', 'contact@dentalsupplies.com', '+639123456789', '456 Supply Street, Manila', 'TAX-001', 'Net 30', NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', NULL),
(2, 1, 'Medical Supplies Inc.', 'Jane Doe', 'contact@medsupplies.com', '+639987654321', '789 Medical Ave, Manila', 'TAX-002', 'Net 15', NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', NULL),
(3, 2, 'SNSU Store', 'SNSU_Inventory', 'supplier@example.com', '0931231241', 'none', '31231421', '31213', 'none', '2025-09-03 07:56:32', '2025-09-03 07:56:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE IF NOT EXISTS `treatments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `patient_id` bigint UNSIGNED NOT NULL,
  `appointment_id` bigint UNSIGNED DEFAULT NULL,
  `service_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text,
  `next_appointment` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `diagnosis` text,
  `procedures_details` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `recommendations` text,
  `tooth_numbers` json DEFAULT NULL,
  `prescriptions` json DEFAULT NULL,
  `follow_up_notes` text,
  `materials_used` json DEFAULT NULL,
  `insurance_info` json DEFAULT NULL,
  `payment_status` enum('pending','partial','completed') NOT NULL DEFAULT 'pending',
  `vital_signs` json DEFAULT NULL,
  `allergies` text,
  `medical_history` text,
  `consent_forms` json DEFAULT NULL,
  `treatment_phase` varchar(50) DEFAULT NULL,
  `outcome` varchar(50) DEFAULT NULL,
  `inventory_deducted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether inventory has been deducted for this treatment',
  `inventory_deducted_at` timestamp NULL DEFAULT NULL COMMENT 'When inventory was deducted for this treatment',
  `next_appointment_date` date DEFAULT NULL,
  `estimated_duration_minutes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatments_clinic_id_foreign` (`clinic_id`),
  KEY `treatments_patient_id_foreign` (`patient_id`),
  KEY `treatments_appointment_id_foreign` (`appointment_id`),
  KEY `treatments_user_id_foreign` (`user_id`),
  KEY `treatments_service_id_foreign` (`service_id`),
  KEY `idx_treatment_inventory_status` (`inventory_deducted`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `treatments`
--

INSERT INTO `treatments` (`id`, `clinic_id`, `patient_id`, `appointment_id`, `service_id`, `user_id`, `name`, `description`, `cost`, `status`, `start_date`, `end_date`, `notes`, `next_appointment`, `created_at`, `updated_at`, `deleted_at`, `diagnosis`, `procedures_details`, `images`, `recommendations`, `tooth_numbers`, `prescriptions`, `follow_up_notes`, `materials_used`, `insurance_info`, `payment_status`, `vital_signs`, `allergies`, `medical_history`, `consent_forms`, `treatment_phase`, `outcome`, `inventory_deducted`, `inventory_deducted_at`, `next_appointment_date`, `estimated_duration_minutes`) VALUES
(1, 7, 10, 6, 7, 19, 'qwe', 'aseqw', 999.00, 'scheduled', '2025-08-24', '2025-08-24', 'eqw', NULL, '2025-08-24 14:26:15', '2025-08-24 14:26:15', NULL, 'eqwewq', '[{\"step\": \"yes\", \"notes\": \"qwe\"}]', '[\"qwe\"]', 'qwe', '[]', '[]', NULL, '[]', '[]', 'pending', '[]', NULL, NULL, '[]', NULL, NULL, 0, NULL, NULL, 30),
(2, 7, 10, 5, 7, 19, 'Okay', 'aseqw', 999.00, 'completed', '2025-08-25', '2025-08-30', 'none', NULL, '2025-08-25 02:07:36', '2025-08-25 02:07:36', NULL, 'eqwewq', '[{\"step\": \"qwe\", \"notes\": \"qwe\"}]', NULL, 'none', '[\"9\", \"13\", \"17\", \"20\", \"21\", \"22\"]', '[\"none\"]', 'qwe', '[\"martilyo\"]', NULL, 'partial', NULL, 'none', 'none', NULL, 'treatment', 'successful', 0, NULL, '2025-09-04', 30),
(3, 7, 19, 5, 7, 19, 'I dont know', 'Okay bro', 999.00, 'completed', '2025-08-25', '2025-08-26', 'aswq', NULL, '2025-08-25 02:18:49', '2025-08-25 02:18:49', NULL, 'qweq', '[\"[object Object]\"]', '[\"/storage/clinics/7/treatments/3/1756088329_OIP.jpg\"]', 'qwe', '[\"1\", \"2\"]', '[\"qwe\"]', 'eqwsa', '[\"eqw\"]', NULL, 'completed', NULL, 'qwes', 'eqw', NULL, 'treatment', 'successful', 0, NULL, '2025-08-27', 30),
(4, 2, 3, 11, 4, 11, 'Tooth Extraction', 'qweqwe', 999.00, 'in_progress', '2025-09-03', '2025-09-27', 'ewquheqwi', NULL, '2025-09-03 08:10:32', '2025-09-03 08:10:33', NULL, 'eqweqw', '[\"[object Object]\"]', '[\"/storage/clinics/2/treatments/4/1756887033_dental-image.png\"]', 'qweqwe', '[\"3\", \"20\"]', '[\"qewjiqoewq\"]', 'qewqwe', NULL, NULL, 'partial', NULL, 'ngiyug', 'heioqwheiowq', NULL, 'initial', 'partial', 0, NULL, '2025-09-30', 30),
(5, 7, 22, 14, 7, 55, 'qwe', 'qwe', 999.00, 'completed', '2025-09-22', '2025-09-22', 'eqw', NULL, '2025-09-20 06:03:28', '2025-09-20 06:03:28', NULL, 'qew', '[\"[object Object]\"]', '[\"/storage/clinics/7/treatments/5/1758348208_Dy Mark Gales-5184.jpg\"]', 'ewq', '[\"12\", \"1\"]', '[\"eqw\"]', 'qew', '[\"qwe\"]', NULL, 'pending', NULL, 'eqwewq', 'ewqe', NULL, 'treatment', 'successful', 0, NULL, NULL, 30),
(6, 7, 22, 14, 7, 55, 'PROPER TEST', '312321', 999.00, 'completed', '2025-09-15', '2025-09-15', 'saewq', NULL, '2025-09-20 06:15:42', '2025-09-20 08:26:27', NULL, 'qweas', '[\"[object Object]\"]', '[\"/storage/clinics/7/treatments/6/1758348942_Dy Mark Gales-5226.jpg\"]', 'eqws', '[\"12\", \"4\"]', '[\"eqw\"]', 'eqw', '[\"eqw\"]', '[]', 'completed', '[]', 'eqwewqe', 'eqwewq', '[]', 'treatment', 'successful', 1, '2025-09-20 06:15:42', NULL, 30),
(7, 7, 9, 15, 7, 57, 'treatment bro', '123123SAEQWE', 999.00, 'completed', '2025-09-27', '2025-09-27', 'SSEWQ', NULL, '2025-09-20 08:30:21', '2025-09-20 13:15:33', NULL, 'EWQEWQ321', '[{\"step\": \"qwesaewq\", \"notes\": \"eqwease\"}]', '[\"/storage/clinics/7/treatments/7/1758357021_Dy Mark Gales-5172.jpg\"]', 'SSEWQ', '[\"11\"]', '[\"QWESSEWQ\"]', 'SSSS', '[\"SEWQEWQAS\"]', '[]', 'completed', '[]', 'SSEQW', 'EQWEWQAS', '[]', 'treatment', 'successful', 1, '2025-09-20 08:30:21', NULL, 30);

-- --------------------------------------------------------

--
-- Table structure for table `treatment_inventory_items`
--

DROP TABLE IF EXISTS `treatment_inventory_items`;
CREATE TABLE IF NOT EXISTS `treatment_inventory_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `treatment_id` bigint UNSIGNED NOT NULL,
  `inventory_id` bigint UNSIGNED NOT NULL,
  `quantity_used` int NOT NULL COMMENT 'Quantity of inventory item used in treatment',
  `unit_cost` decimal(10,2) NOT NULL COMMENT 'Unit cost at time of usage',
  `total_cost` decimal(10,2) NOT NULL COMMENT 'Total cost (quantity_used * unit_cost)',
  `notes` text COMMENT 'Additional notes about usage',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_treatment_inventory` (`treatment_id`,`inventory_id`),
  KEY `idx_inventory_usage_date` (`inventory_id`,`created_at`),
  KEY `idx_usage_date` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `treatment_inventory_items`
--

INSERT INTO `treatment_inventory_items` (`id`, `treatment_id`, `inventory_id`, `quantity_used`, `unit_cost`, `total_cost`, `notes`, `created_at`, `updated_at`) VALUES
(1, 6, 6, 14, 9.00, 126.00, NULL, '2025-09-20 06:15:42', '2025-09-20 08:24:26'),
(2, 7, 6, 3, 9.00, 27.00, NULL, '2025-09-20 08:30:21', '2025-09-20 08:30:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone_number` varchar(191) DEFAULT NULL,
  `license_number` varchar(191) DEFAULT NULL,
  `specialties` text,
  `qualifications` text,
  `years_experience` int DEFAULT NULL,
  `bio` text,
  `profile_photo` varchar(191) DEFAULT NULL,
  `working_hours` json DEFAULT NULL,
  `unavailable_dates` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_active_at` timestamp NULL DEFAULT NULL,
  `emergency_contact` varchar(191) DEFAULT NULL,
  `emergency_phone` varchar(191) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `registration_verification_code` varchar(191) DEFAULT NULL,
  `registration_verification_expires_at` timestamp NULL DEFAULT NULL,
  `registration_verified` tinyint(1) NOT NULL DEFAULT '0',
  `password` varchar(191) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `dashboard_layout` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `clinic_id` bigint UNSIGNED DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'staff',
  `user_type` enum('clinic_staff','patient','system_admin') NOT NULL DEFAULT 'clinic_staff',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_clinic_id_foreign` (`clinic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone_number`, `license_number`, `specialties`, `qualifications`, `years_experience`, `bio`, `profile_photo`, `working_hours`, `unavailable_dates`, `is_active`, `last_active_at`, `emergency_contact`, `emergency_phone`, `email_verified_at`, `registration_verification_code`, `registration_verification_expires_at`, `registration_verified`, `password`, `remember_token`, `dashboard_layout`, `created_at`, `updated_at`, `clinic_id`, `role`, `user_type`, `deleted_at`) VALUES
(1, 'Admin Dy', 'admin@admin.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$Hm0dl43cZXD3SCvI4Y6zrO5HJzg1/JMrmtdeb78tuqSDyWW2skOLu', NULL, NULL, '2025-06-27 17:05:08', '2025-08-20 22:20:48', NULL, 'admin', 'system_admin', NULL),
(2, 'Demo Staff', 'staff@staff.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$AHGixPcG8pvYG6WUR5GWmutd86oQVLLJo0u446eCVmPjBnBVfV8yy', NULL, NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', 1, 'staff', 'clinic_staff', NULL),
(3, 'Dr. John Doe', 'dentist@dentist.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$h4dJceYZQiNnpiQ203kVpuuEthe8mlYgpNHdN4TyhmHrWGrKizYRq', NULL, NULL, '2025-06-27 17:05:09', '2025-06-27 17:05:09', 1, 'dentist', 'clinic_staff', NULL),
(4, 'Enhaynes Admin', 'blissqueen198@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$yFvWjs5zavD6fRBwI1Y9N.y2EG1K55WX1CfjjioPdSTnDxy0Y.Dgi', NULL, NULL, '2025-06-27 17:08:47', '2025-09-05 14:41:24', 2, 'clinic_admin', 'clinic_staff', NULL),
(5, 'Enhaynes Admin', 'enhaynes_admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$oP3DpBc321ECxpfd4aTLH.esh4vWY1tTF4PN/otT2n7EarFISYOTe', NULL, NULL, '2025-06-28 06:48:45', '2025-06-28 06:48:45', 1, 'clinic_admin', 'clinic_staff', NULL),
(6, 'Staff Ipil', 'staff_ipil@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$DKn/o1NkYpKL54g8FCAt/eVC007J.9/5aVAblxcRrVew6pXembXF2', NULL, NULL, '2025-06-30 16:38:37', '2025-08-16 21:50:28', 2, 'staff', 'clinic_staff', NULL),
(8, 'Dy Mark Gales', 'dgales@ssct.edu.ph', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$ewp18OOpoFBDLXN7/.dMuOTOnZdO9P5oDvV6XxDpX0PD4P2mWNBMi', NULL, NULL, '2025-06-30 19:04:12', '2025-08-17 00:47:12', 3, 'clinic_admin', 'clinic_staff', NULL),
(10, 'Dr. dentist_admin', 'dentist_admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$HqLSG3uLETOPGNkgu2C6gee00PX3zU19LSkYQQ7VXKF.jEAveFHby', NULL, NULL, '2025-07-01 00:01:19', '2025-07-01 00:01:19', 3, 'dentist', 'clinic_staff', NULL),
(11, 'Dr. RoseJane', 'janerose1@gmail.com', '09412312411', 'DENT-3211-1231-3121', '[\"Orthodonics\"]', '[\"DDs\"]', 10, 'WKWKWK', NULL, '{\"friday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"monday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"sunday\": null, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"saturday\": {\"end\": \"15:00\", \"start\": \"09:00\"}, \"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}', NULL, 1, NULL, 'DOC JANE', '039213141', NULL, NULL, NULL, 0, '$2y$12$fMZ7zms3t7yqleKF3PiXP.tLRjNlafn5d5Flq0QqqCtUcmov8AFWq', NULL, NULL, '2025-07-13 15:43:22', '2025-09-03 06:42:44', 2, 'dentist', 'clinic_staff', NULL),
(12, 'John Doe', 'patient@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$NTjdTXq4/I6RMGW1TuhBUOZ2gnl33cW7l5vQFRxKGH2PODCaxtBku', NULL, NULL, '2025-07-13 16:30:58', '2025-08-20 22:20:48', 1, 'patient', 'patient', NULL),
(14, 'Dr. Jane Rose', 'jane_rose1@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$0Fs2OWyPRkpRdzw68AciuuAxbAbmBBZhsSx8ZAkVsazg0xyM3PfVO', NULL, NULL, '2025-08-17 02:23:56', '2025-08-17 02:23:56', 5, 'clinic_admin', 'clinic_staff', NULL),
(15, 'Yves Dumlao', 'dace.gales18@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$X0OBt1UGDJydBUbASR33/uhePpXoSn8JGgsj2Yyi.mMQXlXbKfKVa', NULL, NULL, '2025-08-17 07:19:57', '2025-08-17 07:19:57', 6, 'clinic_admin', 'clinic_staff', NULL),
(16, 'DY MARK', 'dy_admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$H1Cgjok9G41FUbf99MleseifPNVHzLv.Vy4KMqcl0wVms7cy0L1cm', NULL, NULL, '2025-08-17 08:09:18', '2025-08-20 22:20:48', NULL, 'admin', 'system_admin', NULL),
(17, 'DY Admin', 'loveejisoo4@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$aO3nUd5F4Dyat6IB9WLXoe2WFHRKfM2C3GbcmW0XK8ltZ7pOEfIVu', NULL, NULL, '2025-08-19 00:07:40', '2025-09-15 04:57:44', 7, 'clinic_admin', 'clinic_staff', NULL),
(19, 'Dr. David Dy B. Gales', 'david1234@gmail.com', '09312421312', 'License-031241', '[\"orthodontics\"]', '[\"DDs\",\"DMD\",\"Board Certification\"]', 50, 'Lorem ipsum blah blah', NULL, '{\"friday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"monday\": {\"end\": \"16:00\", \"start\": \"09:00\"}, \"sunday\": null, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"saturday\": {\"end\": \"15:00\", \"start\": \"09:00\"}, \"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}', NULL, 1, NULL, 'Aniceta Gales', '0931241231', NULL, NULL, NULL, 0, '$2y$12$zvJkI36ZSAzzEkNHxMHueOqV.RdEwU34QzgH4/jE5rQkYU5NYo8KW', NULL, NULL, '2025-08-20 22:33:08', '2025-08-22 05:41:02', 7, 'dentist', 'clinic_staff', NULL),
(20, 'Dy Anne B. Gales', 'dyanne123@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$Qmoa1NK35zAClhYkUnOfm.gCa6AUwaI9w3OlH/9Vut6IdFx9a7T2.', NULL, NULL, '2025-08-20 22:39:05', '2025-08-22 05:33:00', 7, 'staff', 'clinic_staff', NULL),
(22, 'dym_gals', 'dym_gals@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$SyIzVDejX6rOVw.uddgyyOz/eFuSmNK/l8fDFsabKP3cnoNWdYm0.', NULL, NULL, '2025-08-20 22:43:44', '2025-08-20 22:43:44', NULL, 'admin', 'system_admin', NULL),
(47, 'PERDI GURL', 'perdigirltough@gmail.com', '0931242131', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-21 06:40:35', NULL, NULL, 1, '$2y$12$HPBPcHM9HnPwlegJSxR9Z.E3iiTrzoCG4zkWmLVOnV5ZtCyY./w4K', NULL, NULL, '2025-08-21 06:40:12', '2025-08-21 06:40:35', NULL, 'patient', 'patient', NULL),
(48, 'PERDI BRO', 'perdiboitough@gmail.com', '0932141231', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-21 06:42:42', NULL, NULL, 1, '$2y$12$7lhjbRnL5vgi6Dhk5UOWceZWvt4GYPVKx9uCo7gf.EiVTOR42.eJG', NULL, NULL, '2025-08-21 06:42:42', '2025-10-05 06:08:03', NULL, 'patient', 'patient', NULL),
(49, 'Huntrix Golden', 'loveejisoo5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-27 15:55:47', NULL, NULL, 0, '$2y$12$Lf3m6kgx2H8YDVW4Seb9pu0bp0xCAg50JOzQ6Dikk5jTPZNYDt8wK', NULL, NULL, '2025-08-27 15:55:47', '2025-08-27 15:55:47', 8, 'clinic_admin', 'clinic_staff', NULL),
(53, 'Premium Testing', 'premiumtesting540@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-28 05:53:35', NULL, NULL, 0, '$2y$12$FqGccAWpFruu9EunGzy08eYhCIFZ07INgr/Lxapz7J3C3kpaKJcwm', NULL, NULL, '2025-08-28 05:53:35', '2025-08-28 05:53:35', 12, 'clinic_admin', 'clinic_staff', NULL),
(54, 'Enterprise Testing', 'enterprisetesting7@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-28 06:00:24', NULL, NULL, 0, '$2y$12$Ls/FoNsnTT8IPbU8rcsqI.YDmeb1BGm499wgmxVI9mNg5wU.N5Jca', NULL, NULL, '2025-08-28 06:00:24', '2025-08-28 06:00:24', 13, 'clinic_admin', 'clinic_staff', NULL),
(55, 'Dr. BroBro', 'dentist_brobro@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"friday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"monday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"sunday\": null, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"saturday\": {\"end\": \"15:00\", \"start\": \"09:00\"}, \"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$sURrHOx5Hvmkl1XGVO0iO.1p/68qVZpP/QDNm.LfzwDugYN/Hjxkq', NULL, NULL, '2025-09-18 12:52:39', '2025-09-18 12:52:39', 7, 'dentist', 'clinic_staff', NULL),
(56, 'Dr. Dentist YEYE', 'dentist_dentist@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"friday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"monday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"sunday\": null, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"saturday\": {\"end\": \"15:00\", \"start\": \"09:00\"}, \"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$GYv3Dnfu9Y2QEigsvBfBUuDSjlbywA3x2jtAobP/K9PYcFc8AkBDW', NULL, NULL, '2025-09-18 14:01:31', '2025-09-18 14:01:31', 7, 'dentist', 'clinic_staff', NULL),
(57, 'Dr. DYMDYM', 'dym_dym@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"friday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"monday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"sunday\": null, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"saturday\": {\"end\": \"15:00\", \"start\": \"09:00\"}, \"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, '$2y$12$zMoVc.SxpTb5bctWOFgnsubOxMAXLTHTogNkvrjSRZGYLAExY1yqS', NULL, NULL, '2025-09-18 15:00:29', '2025-09-18 15:00:29', 7, 'dentist', 'clinic_staff', NULL),
(58, 'Dr. Ana Sanchez', 'admin@quezoncityfamilydentalclinic.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-06-29 14:19:25', NULL, NULL, 0, '$2y$12$eb6Ff.yO5gyzXM/LH9g6FuTF1UGS9fGvULw4lgKp6z.MK8U9YOQvK', NULL, NULL, '2025-06-29 14:19:25', '2025-09-21 14:19:25', 15, 'clinic_admin', 'clinic_staff', NULL),
(59, 'Dr. Francisco Garcia', 'dentist@quezoncityfamilydentalclinic.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-06-29 14:19:25', NULL, NULL, 0, '$2y$12$9ZufvoBWnKORJS5IEw8KDOF55tYmVACpsfaPzP9Wt9LywGc4nFpMu', NULL, NULL, '2025-06-29 14:19:25', '2025-09-21 14:19:25', 15, 'dentist', 'clinic_staff', NULL),
(60, 'Dr. Rafael Lopez', 'admin@cebucitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-06-30 14:19:25', NULL, NULL, 0, '$2y$12$WLQETM6s1EnRKhzgChgp3OHtWwnGE1N9krF8iSaEU0xXGH7KXR2tG', NULL, NULL, '2025-06-30 14:19:25', '2025-09-21 14:19:26', 16, 'clinic_admin', 'clinic_staff', NULL),
(61, 'Dr. Elena Gutierrez', 'dentist@cebucitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-06-30 14:19:25', NULL, NULL, 0, '$2y$12$cYWzduQg4Je4sCZ9RwzfX.eEtnakJ7Cmc6Pr50YrDtsn0hc/uqO3y', NULL, NULL, '2025-06-30 14:19:25', '2025-09-21 14:19:26', 16, 'dentist', 'clinic_staff', NULL),
(62, 'Jose Rodriguez', 'staff@cebucitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-06-30 14:19:25', NULL, NULL, 0, '$2y$12$ND9D75YB8a91s75.nA4HV.HMAn56P/QWwv13WVeHDK3tR.GtSKXMG', NULL, NULL, '2025-06-30 14:19:25', '2025-09-21 14:19:26', 16, 'staff', 'clinic_staff', NULL),
(63, 'Dr. Carmen Gomez', 'admin@davaocitysmilecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-03-06 14:19:26', NULL, NULL, 0, '$2y$12$OjBrUo2EdAEaI48qh.ghFucqhM5Uy4qzvHVj5yf3obZfpZrvl50t6', NULL, NULL, '2025-03-06 14:19:26', '2025-09-21 14:19:26', 17, 'clinic_admin', 'clinic_staff', NULL),
(64, 'Dr. Daniel Vargas', 'dentist@davaocitysmilecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-03-06 14:19:26', NULL, NULL, 0, '$2y$12$4bdHPYEqQ7g7BAYhaszFvukyBofReMCKu5Tv63WCpKPDGse2Vw1DK', NULL, NULL, '2025-03-06 14:19:26', '2025-09-21 14:19:26', 17, 'dentist', 'clinic_staff', NULL),
(65, 'Francisco Flores', 'staff@davaocitysmilecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-03-06 14:19:26', NULL, NULL, 0, '$2y$12$tCXUhhbRlERU73ZF4By4suk4HBAv8sewdGFie7Hbsy7kzY4Xn0Ama', NULL, NULL, '2025-03-06 14:19:26', '2025-09-21 14:19:27', 17, 'staff', 'clinic_staff', NULL),
(66, 'Dr. Teresa Gomez', 'admin@iloilocitydentalcare.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-01 14:19:27', NULL, NULL, 0, '$2y$12$keleIXZIeh0X5D4kBhwmleQ7jp9roWunoBa.kcUxVQ87MExfNDsx6', NULL, NULL, '2025-08-01 14:19:27', '2025-09-21 14:19:27', 18, 'clinic_admin', 'clinic_staff', NULL),
(67, 'Dr. Pedro Flores', 'dentist@iloilocitydentalcare.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-01 14:19:27', NULL, NULL, 0, '$2y$12$Oxz75Iq1Wc33CAhZBqidwOaK0Neu1/DrzRJUfIB.Fm5zv8Txlhiia', NULL, NULL, '2025-08-01 14:19:27', '2025-09-21 14:19:27', 18, 'dentist', 'clinic_staff', NULL),
(68, 'Dr. Eduardo Gutierrez', 'admin@baguiocitymountaindental.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-23 14:19:27', NULL, NULL, 0, '$2y$12$zbG0i2NZ5fp5tZHwx2UQ8.Ngw9vVI9nKH.C/O/GB7iZxFZJKQoKJa', NULL, NULL, '2024-09-23 14:19:27', '2025-09-21 14:19:27', 19, 'clinic_admin', 'clinic_staff', NULL),
(69, 'Dr. Eduardo Vargas', 'dentist@baguiocitymountaindental.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-23 14:19:27', NULL, NULL, 0, '$2y$12$2Gbr4asoL08al.OHsRr20eDejbVa4yNgOwB6.uQ0LtfxsGzZHALs6', NULL, NULL, '2024-09-23 14:19:27', '2025-09-21 14:19:28', 19, 'dentist', 'clinic_staff', NULL),
(70, 'Jose Hernandez', 'staff@baguiocitymountaindental.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-23 14:19:27', NULL, NULL, 0, '$2y$12$H37xFqKf75f.cseV9Fz7l.ftB50ocwELmYJlSoWFm3FO/Vl1A3tYO', NULL, NULL, '2024-09-23 14:19:27', '2025-09-21 14:19:28', 19, 'staff', 'clinic_staff', NULL),
(71, 'Dr. Carlos Ramirez', 'admin@cagayandeorodentalhub.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:28', NULL, NULL, 0, '$2y$12$lG6Eo4Pmiki.VYWEZOo2jegMK82xyAqYQs0WHbAUoithrFk/wr3oO', NULL, NULL, '2025-05-18 14:19:28', '2025-09-21 14:19:28', 20, 'clinic_admin', 'clinic_staff', NULL),
(72, 'Dr. Pedro Bautista', 'dentist@cagayandeorodentalhub.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:28', NULL, NULL, 0, '$2y$12$TJYjBNG4R.B5AdK89ww3JOf5WsmXGyzU9qio9urVRiBdgDS1crhd.', NULL, NULL, '2025-05-18 14:19:28', '2025-09-21 14:19:28', 20, 'dentist', 'clinic_staff', NULL),
(73, 'Carlos Hernandez', 'staff@cagayandeorodentalhub.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:28', NULL, NULL, 0, '$2y$12$thVYcdUyML9Behh2J4w9DOK617uRSKThZ5k9TUqD99RQC3qEeZgvS', NULL, NULL, '2025-05-18 14:19:28', '2025-09-21 14:19:29', 20, 'staff', 'clinic_staff', NULL),
(74, 'Dr. Miguel Gomez', 'admin@bacolodcitysmilestudio.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-04-07 14:19:29', NULL, NULL, 0, '$2y$12$Gq6pDVN8iVlHFfhBnWaMJ.Ce6I9QMr66a.ULCeZIQzI.Q7UlbydUC', NULL, NULL, '2025-04-07 14:19:29', '2025-09-21 14:19:29', 21, 'clinic_admin', 'clinic_staff', NULL),
(75, 'Dr. Francisco Medina', 'dentist@bacolodcitysmilestudio.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-04-07 14:19:29', NULL, NULL, 0, '$2y$12$5.A9DPEGAUSijCDSpeaj/edrA2wwi8povJqUYwmzfFkbmej7aTEju', NULL, NULL, '2025-04-07 14:19:29', '2025-09-21 14:19:29', 21, 'dentist', 'clinic_staff', NULL),
(76, 'Dr. Maria Castillo', 'admin@zamboangacitydentalcarecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-27 14:19:29', NULL, NULL, 0, '$2y$12$J1C9nI3P1/enI71jzoPAPetE4mPHkjK9Qb.dh/rnYRhG4gIe4Vhou', NULL, NULL, '2024-09-27 14:19:29', '2025-09-21 14:19:29', 22, 'clinic_admin', 'clinic_staff', NULL),
(77, 'Dr. Patricia Castillo', 'dentist@zamboangacitydentalcarecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-27 14:19:29', NULL, NULL, 0, '$2y$12$4zlnY9AfpM16s2.pX1KKHOjWESm5RBYvOZn2DBxsOLQ1lCq0xuT5y', NULL, NULL, '2024-09-27 14:19:29', '2025-09-21 14:19:30', 22, 'dentist', 'clinic_staff', NULL),
(78, 'Andres Moreno', 'staff@zamboangacitydentalcarecenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-09-27 14:19:29', NULL, NULL, 0, '$2y$12$OBFsyrLJijIX.w8KnFCzCuygX6MkmMojgR6RVnJHVn1xHMSRk6dbO', NULL, NULL, '2024-09-27 14:19:29', '2025-09-21 14:19:30', 22, 'staff', 'clinic_staff', NULL),
(79, 'Dr. Isabel Ocampo', 'admin@taclobancityfamilydental.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-04 14:19:30', NULL, NULL, 0, '$2y$12$l.oJuQMgHCIAT5KvAZ0b/uDYRpZys/bs9Ob2OSKpL28oPjLbzbmJm', NULL, NULL, '2025-07-04 14:19:30', '2025-09-21 14:19:30', 23, 'clinic_admin', 'clinic_staff', NULL),
(80, 'Dr. Antonio Diaz', 'dentist@taclobancityfamilydental.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-04 14:19:30', NULL, NULL, 0, '$2y$12$dI39qmNf7VXpuURkBykRo./avghkxdaiC5Forh5e.bsNUqBkLsLkq', NULL, NULL, '2025-07-04 14:19:30', '2025-09-21 14:19:30', 23, 'dentist', 'clinic_staff', NULL),
(81, 'Dr. Eduardo Torres', 'admin@generalsantoscitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:30', NULL, NULL, 0, '$2y$12$n8YCKH46N7oIrieh5cIpDu937bU2GiLR.oXZw8ekMvy23y9cJ5ed2', NULL, NULL, '2025-05-18 14:19:30', '2025-09-21 14:19:30', 24, 'clinic_admin', 'clinic_staff', NULL),
(82, 'Dr. Fernando Reyes', 'dentist@generalsantoscitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:30', NULL, NULL, 0, '$2y$12$In1/yiTJJqF0AaIK1tvuHuiSDN/AWy9.q2xtnZgjPlkrgjmGOlEtS', NULL, NULL, '2025-05-18 14:19:30', '2025-09-21 14:19:31', 24, 'dentist', 'clinic_staff', NULL),
(83, 'Rosa Vargas', 'staff@generalsantoscitydentalexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-05-18 14:19:30', NULL, NULL, 0, '$2y$12$l/tRYvEe5qqF7Dq821YIJukpHuIhFus0OfeD/TjbjEwdoOD0etkbO', NULL, NULL, '2025-05-18 14:19:30', '2025-09-21 14:19:31', 24, 'staff', 'clinic_staff', NULL),
(84, 'Dr. Rafael Mendoza', 'admin@cagayanvalleydentalcenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-02-04 14:19:31', NULL, NULL, 0, '$2y$12$eOkfoUvldDLIH.yH54FjRO2.3GK0v03HNtX23yQm9gsfLhyB2iyMu', NULL, NULL, '2025-02-04 14:19:31', '2025-09-21 14:19:31', 25, 'clinic_admin', 'clinic_staff', NULL),
(85, 'Dr. Sofia Garcia', 'dentist@cagayanvalleydentalcenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-02-04 14:19:31', NULL, NULL, 0, '$2y$12$j0AyuzGJQFHitczunZqNW.OxRddx4iXb9yiz/5iyOr/3PJVjJNrm6', NULL, NULL, '2025-02-04 14:19:31', '2025-09-21 14:19:31', 25, 'dentist', 'clinic_staff', NULL),
(86, 'Andres Martinez', 'staff@cagayanvalleydentalcenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-02-04 14:19:31', NULL, NULL, 0, '$2y$12$hiZ7gGKaOm8MNgLKdiAIMO9h/x7b0ZC83/Ewl3oQvD6jNxYjcmzn2', NULL, NULL, '2025-02-04 14:19:31', '2025-09-21 14:19:32', 25, 'staff', 'clinic_staff', NULL),
(87, 'Dr. Jorge Medina', 'admin@palawandentalwellnesscenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-11-04 14:28:39', NULL, NULL, 0, '$2y$12$GQiBU1.yW/dy4XtBU1ngouY2coRj/awgF4paA22/XCSDlObIoZ/H6', NULL, NULL, '2024-11-04 14:28:39', '2025-09-21 14:28:39', 26, 'clinic_admin', 'clinic_staff', NULL),
(88, 'Dr. Francisco Torres', 'dentist@palawandentalwellnesscenter.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-11-04 14:28:39', NULL, NULL, 0, '$2y$12$Zh.35zmvamW4gceUMjHIRu/ONpQ7K6CXHWoutL3.AwpQlbQttofVy', NULL, NULL, '2024-11-04 14:28:39', '2025-09-21 14:28:39', 26, 'dentist', 'clinic_staff', NULL),
(89, 'Test Brobro', 'mailexample1001@gmail.com', '09312412312', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '668977', '2025-10-06 02:43:54', 0, '$2y$12$y8G/.HhL92eXMnwRadPID.urgBNhjmI3BV/arTTsP1q2d.7MmaraC', NULL, NULL, '2025-10-06 02:28:54', '2025-10-06 02:28:54', NULL, 'patient', 'patient', NULL),
(90, 'DYM TEST', 'mailexample1003@gmail.com', '0931241212', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-10-06 02:49:08', NULL, NULL, 1, '$2y$12$m7MN1O20JHeehnU2lAl/8.Q608Bh1e761CScK0aSG1pcAf9MAw65e', NULL, NULL, '2025-10-06 02:48:54', '2025-10-06 02:49:08', NULL, 'patient', 'patient', NULL),
(91, 'Enhaynes Admin', 'enhaynesdental@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-10-06 04:52:54', NULL, NULL, 0, '$2y$12$gdQzwmO6ie.kC7KXEu2VNO7a6hqK61lQXri8rgEY1AaGX6VKv/d/6', NULL, NULL, '2025-10-06 04:52:54', '2025-10-06 05:09:56', 27, 'clinic_admin', 'clinic_staff', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `waitlist`
--

DROP TABLE IF EXISTS `waitlist`;
CREATE TABLE IF NOT EXISTS `waitlist` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `clinic_id` bigint UNSIGNED NOT NULL,
  `patient_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `preferred_dentist_id` bigint UNSIGNED DEFAULT NULL,
  `service_id` bigint UNSIGNED DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `notes` text,
  `priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  `status` enum('active','contacted','scheduled','cancelled','expired') NOT NULL DEFAULT 'active',
  `preferred_start_date` date DEFAULT NULL,
  `preferred_end_date` date DEFAULT NULL,
  `preferred_days` json DEFAULT NULL,
  `preferred_start_time` time DEFAULT NULL,
  `preferred_end_time` time DEFAULT NULL,
  `contact_method` enum('phone','email','sms','any') NOT NULL DEFAULT 'any',
  `contact_notes` varchar(191) DEFAULT NULL,
  `estimated_duration` int NOT NULL DEFAULT '30',
  `appointment_type_id` bigint UNSIGNED DEFAULT NULL,
  `contacted_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `contact_attempts` int NOT NULL DEFAULT '0',
  `last_contact_attempt` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `waitlist_patient_id_foreign` (`patient_id`),
  KEY `waitlist_created_by_foreign` (`created_by`),
  KEY `waitlist_preferred_dentist_id_foreign` (`preferred_dentist_id`),
  KEY `waitlist_service_id_foreign` (`service_id`),
  KEY `waitlist_appointment_type_id_foreign` (`appointment_type_id`),
  KEY `waitlist_clinic_id_status_index` (`clinic_id`,`status`),
  KEY `waitlist_clinic_id_priority_index` (`clinic_id`,`priority`),
  KEY `waitlist_clinic_id_preferred_dentist_id_index` (`clinic_id`,`preferred_dentist_id`),
  KEY `waitlist_expires_at_index` (`expires_at`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `waitlist`
--

INSERT INTO `waitlist` (`id`, `clinic_id`, `patient_id`, `created_by`, `preferred_dentist_id`, `service_id`, `reason`, `notes`, `priority`, `status`, `preferred_start_date`, `preferred_end_date`, `preferred_days`, `preferred_start_time`, `preferred_end_time`, `contact_method`, `contact_notes`, `estimated_duration`, `appointment_type_id`, `contacted_at`, `scheduled_at`, `expires_at`, `contact_attempts`, `last_contact_attempt`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, 9, 17, NULL, 7, 'Teeth Cleaning', 'ewqas', 'normal', 'active', NULL, NULL, '[]', NULL, NULL, 'any', NULL, 30, NULL, '2025-08-24 07:37:54', '2025-08-24 07:37:59', NULL, 1, '2025-08-24 07:37:54', '2025-08-24 05:00:13', '2025-08-24 07:38:22', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
