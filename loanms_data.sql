-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2026 at 03:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loanms_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `all_cust_master`
--

CREATE TABLE `all_cust_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cust_name` varchar(200) DEFAULT NULL,
  `emp_code` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `organization_id` int(11) NOT NULL DEFAULT 0,
  `company_id` int(11) NOT NULL DEFAULT 0,
  `gross_pay` double NOT NULL DEFAULT 0,
  `net_pay` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `all_cust_master`
--

INSERT INTO `all_cust_master` (`id`, `cust_name`, `emp_code`, `phone`, `email`, `organization_id`, `company_id`, `gross_pay`, `net_pay`, `created_at`, `updated_at`) VALUES
(1, 'Alice Fernandez', 'EMP0003', '+675-7000-9012', 'alice.fernandez@email.com', 1, 1, 5500, 4400, '2025-11-04 02:08:10', '2025-11-04 02:08:10'),
(2, 'Michael Osei', 'EMP0004', '+675-7000-3456', 'michael.osei@email.com', 1, 1, 6200, 5000, '2025-11-04 02:08:10', '2025-11-04 02:08:10'),
(3, 'Priya Nair', 'EMP0005', '+675-7000-7890', 'priya.nair@email.com', 1, 1, 5800, 4600, '2025-11-04 02:08:10', '2025-11-04 02:08:10'),
(4, 'Liam Chen', 'EMP0006', '+675-7000-6543', 'liam.chen@email.com', 1, 1, 6100, 4900, '2025-11-04 02:08:10', '2025-11-04 02:08:10'),
(5, 'Fatima Yusuf', 'EMP0007', '+675-7000-4321', 'fatima.yusuf@email.com', 1, 1, 5300, 4200, '2025-11-04 02:08:10', '2025-11-04 02:08:10'),
(6, 'New DeptCust555', 'EMP159787', '7597316980', 'newdeptcust.11@gmail.com', 0, 0, 5000, 0, '2025-11-05 06:46:39', '2025-11-05 23:18:58'),
(7, 'New Customer11', 'EMP0159', '8597432103', 'customer115@email.com', 0, 0, 5500, 0, '2025-11-05 22:54:12', '2025-11-05 22:54:12'),
(8, '11New Custoom', 'Emp45678', '9112852567', 'user234@gmail.com', 4, 0, 5001, 0, '2025-11-12 00:30:48', '2025-12-01 22:44:05'),
(9, 'New Cust Name33', 'EMP75395123', '7910397564', 'newuniq33@email.com', 0, 0, 1100, 0, '2025-11-24 01:40:16', '2025-11-24 01:40:16'),
(10, 'Philip, Ruth', '00585688', NULL, NULL, 0, 1, 5247.49, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(11, 'Rema, Jorem', '10210703', NULL, NULL, 0, 1, 1889.48, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(12, 'TSIHAKOU, ABIGAIL', '10689461', NULL, NULL, 0, 1, 1507.42, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(13, 'Wakit, Welmah', '10862201', NULL, NULL, 0, 1, 2666.76, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(14, 'Jimberi, Jacklyn', '12481532', NULL, NULL, 0, 1, 1384.48, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(15, 'Fonn, Tolopato Mary', '00488518', NULL, NULL, 0, 1, 1510.62, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(16, 'Gelo, Gisola', '00548871', NULL, NULL, 0, 1, 1613.94, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(17, 'Sogowa, Lucy', '01575828', NULL, NULL, 0, 1, 1584.46, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(18, 'Edward, Miriam', '10069730', NULL, NULL, 0, 1, 1200.78, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(19, 'Nega, Salagowato', '10321646', NULL, NULL, 0, 1, 1507.42, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(20, 'Auma, Lotter', '10322535', NULL, NULL, 0, 1, 1468.83, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(21, 'Damela, Uwa', '10416678', NULL, NULL, 0, 1, 1413.24, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(22, 'Paine, Wendy', '11142773', NULL, NULL, 0, 1, 1413.24, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(23, 'Ananga, Jerusha', '11250661', NULL, NULL, 0, 1, 1413.24, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(24, 'Salangau, Rollen', '13195508', NULL, NULL, 0, 1, 1229.02, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(25, 'Bibi, Julie', '13275983', NULL, NULL, 0, 1, 1229.02, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(26, 'Thomas, Buka Junior', '13394683', NULL, NULL, 0, 1, 1266.52, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(27, 'GOGUSO, Gipson', '13477913', NULL, NULL, 0, 1, 1266.52, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(28, 'Dauri, Wendy', '13512563', NULL, NULL, 0, 1, 1266.52, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(29, 'Mewa, Cathy', '13514735', NULL, NULL, 0, 1, 1229.02, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(30, 'Olewale, Tuwe', '10208185', NULL, NULL, 0, 1, 1468.83, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(31, 'Tabua, Hilry', '11274466', NULL, NULL, 0, 1, 1413.24, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(32, 'Tubai, Tupolam', '0060066A', NULL, NULL, 0, 1, 1468.83, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(33, 'Gorgom, Pamela', '12717681', NULL, NULL, 0, 1, 1413.24, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(34, 'Maim, Molly', '12961454', NULL, NULL, 0, 1, 1266.52, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(35, 'Lalamo, Michael Gim', '13005455', NULL, NULL, 0, 1, 1302.94, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(36, 'Lowa, Karam Willie', '13829950', NULL, NULL, 0, 1, 1192.64, 0, '2025-11-28 05:13:41', '2025-11-28 05:13:41'),
(37, 'Aditya', 'Badmash420', '7539512368', 'aditya@email.com', 4, 0, 5500, 3000, '2025-12-18 06:43:12', '2025-12-18 06:45:45'),
(38, 'demo surname', 'demo1001', '85201365', 'demo1001@gmail.com', 2, 0, 6000, 5000, '2026-01-09 01:10:14', '2026-01-09 01:11:59'),
(39, 'Alice Fernandez1', 'emp9001', '75395456', 'demo9001@email.com', 4, 0, 5500, 5000, '2026-01-09 02:34:53', '2026-01-09 02:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `assigned_loans_under_org`
--

CREATE TABLE `assigned_loans_under_org` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `org_id` int(11) NOT NULL DEFAULT 0,
  `loan_id` int(11) NOT NULL DEFAULT 0,
  `active` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assigned_loans_under_org`
--

INSERT INTO `assigned_loans_under_org` (`id`, `org_id`, `loan_id`, `active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, NULL),
(2, 1, 2, 1, NULL, NULL),
(7, 3, 1, 1, '2025-11-19 00:01:40', '2025-11-19 00:01:40'),
(8, 3, 6, 1, '2025-11-19 00:01:40', '2025-11-19 00:01:40'),
(10, 4, 6, 1, '2025-11-24 02:55:47', '2025-11-24 02:55:47'),
(11, 4, 2, 1, '2025-11-24 02:55:47', '2025-11-24 02:55:47'),
(21, 2, 1, 1, '2025-12-18 07:34:53', '2025-12-18 07:34:53'),
(22, 2, 2, 1, '2025-12-18 07:34:53', '2025-12-18 07:34:53');

-- --------------------------------------------------------

--
-- Table structure for table `assigned_purpose_under_loans`
--

CREATE TABLE `assigned_purpose_under_loans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` int(11) NOT NULL DEFAULT 0,
  `purpose_id` int(11) NOT NULL DEFAULT 0,
  `active` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assigned_purpose_under_loans`
--

INSERT INTO `assigned_purpose_under_loans` (`id`, `loan_id`, `purpose_id`, `active`, `created_at`, `updated_at`) VALUES
(3, 9, 1, 1, '2025-12-19 02:11:38', '2025-12-19 02:11:38'),
(4, 9, 2, 1, '2025-12-19 02:11:38', '2025-12-19 02:11:38'),
(7, 1, 3, 1, '2025-12-22 05:03:35', '2025-12-22 05:03:35'),
(8, 1, 2, 1, '2025-12-22 05:03:35', '2025-12-22 05:03:35');

-- --------------------------------------------------------

--
-- Table structure for table `assigned_slabs_under_loan`
--

CREATE TABLE `assigned_slabs_under_loan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` int(11) NOT NULL DEFAULT 0,
  `slab_id` int(11) NOT NULL DEFAULT 0,
  `active` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assigned_slabs_under_loan`
--

INSERT INTO `assigned_slabs_under_loan` (`id`, `loan_id`, `slab_id`, `active`, `created_at`, `updated_at`) VALUES
(1, 6, 2, 1, '2025-11-17 05:48:03', '2025-11-17 05:48:03'),
(2, 6, 3, 1, '2025-11-17 05:48:03', '2025-11-17 05:48:03'),
(3, 7, 2, 1, '2025-11-24 01:54:33', '2025-11-24 01:54:33'),
(4, 7, 3, 1, '2025-11-24 01:54:33', '2025-11-24 01:54:33'),
(7, 2, 3, 1, '2025-11-28 06:31:14', '2025-11-28 06:31:14'),
(8, 2, 2, 1, '2025-11-28 06:31:14', '2025-11-28 06:31:14'),
(11, 8, 3, 1, '2025-12-12 01:55:22', '2025-12-12 01:55:22'),
(12, 8, 2, 1, '2025-12-12 01:55:22', '2025-12-12 01:55:22'),
(17, 9, 1, 1, '2025-12-19 02:11:38', '2025-12-19 02:11:38'),
(18, 9, 2, 1, '2025-12-19 02:11:38', '2025-12-19 02:11:38'),
(23, 1, 1, 1, '2025-12-22 05:03:35', '2025-12-22 05:03:35'),
(24, 1, 2, 1, '2025-12-22 05:03:35', '2025-12-22 05:03:35');

-- --------------------------------------------------------

--
-- Table structure for table `company_master`
--

CREATE TABLE `company_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `contact_no` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'PGK',
  `currency_symbol` varchar(5) NOT NULL DEFAULT 'K',
  `base_interest_rate` decimal(5,2) DEFAULT NULL,
  `active_status` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_master`
--

INSERT INTO `company_master` (`id`, `company_name`, `address`, `contact_no`, `email`, `currency`, `currency_symbol`, `base_interest_rate`, `active_status`, `created_at`, `updated_at`) VALUES
(1, 'Agro Advance Aben Ltd.', 'Downtown Business Center, Port Moresby', '+675-320-1234', 'info@pacificfinance.pg', 'PGK', 'K', 12.50, 'Y', NULL, NULL),
(2, 'Highlands Credit Union', 'Main Street, Mt. Hagen', '+675-321-5678', 'support@highlandscredit.pg', 'PGK', 'K', 10.00, 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT 'Added for tracking which user created the customer',
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `organisation_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `marital_status` enum('Single','Married','Divorced','Widowed') DEFAULT NULL,
  `no_of_dependents` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `payroll_number` varchar(150) DEFAULT NULL,
  `home_province` text DEFAULT NULL,
  `district_village` text DEFAULT NULL,
  `spouse_full_name` varchar(150) DEFAULT NULL,
  `spouse_contact` varchar(20) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `employee_no` varchar(50) DEFAULT NULL,
  `employer_department` varchar(200) DEFAULT NULL,
  `employer_address` text DEFAULT NULL,
  `work_district` text DEFAULT NULL,
  `work_province` varchar(100) DEFAULT NULL,
  `immediate_supervisor` varchar(100) DEFAULT NULL,
  `years_at_current_employer` int(11) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `employment_type` enum('Permanent','Contract') DEFAULT NULL,
  `date_joined` date DEFAULT NULL,
  `monthly_salary` decimal(10,2) DEFAULT NULL,
  `net_salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `work_location` varchar(100) DEFAULT NULL,
  `video_consent_path` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `company_id`, `organisation_id`, `first_name`, `last_name`, `gender`, `dob`, `marital_status`, `no_of_dependents`, `phone`, `email`, `payroll_number`, `home_province`, `district_village`, `spouse_full_name`, `spouse_contact`, `present_address`, `permanent_address`, `employee_no`, `employer_department`, `employer_address`, `work_district`, `work_province`, `immediate_supervisor`, `years_at_current_employer`, `designation`, `employment_type`, `date_joined`, `monthly_salary`, `net_salary`, `work_location`, `video_consent_path`, `status`, `created_at`, `updated_at`) VALUES
(1, 0, 1, 1, 'John', 'Doe', 'Male', '1990-05-12', 'Married', 2, '7001234567', 'john.doe@example.com', NULL, NULL, NULL, NULL, NULL, '123 Main Street, Port Moresby', '456 Elm Street, Port Moresby', 'EMP001', NULL, NULL, NULL, NULL, NULL, NULL, 'Accountant', 'Permanent', '2015-06-01', 4500.00, 0.00, 'Head Office', NULL, 'Active', NULL, NULL),
(2, 0, 1, 1, 'Jane', 'Smith', 'Female', '1988-09-21', 'Single', 0, '7012345678', 'jane.smith@example.com', NULL, NULL, NULL, NULL, NULL, '456 Market Road, Lae', '789 Ocean Ave, Lae', 'EMP002', NULL, NULL, NULL, NULL, NULL, NULL, 'Loan Officer', 'Permanent', '2018-01-15', 5200.00, 0.00, 'Branch Office', NULL, 'Active', NULL, NULL),
(3, 0, 1, 1, 'Michael', 'Brown', 'Male', '1992-03-17', 'Single', 1, '7023456789', 'michael.brown@example.com', NULL, NULL, NULL, NULL, NULL, '99 Highland St, Madang', '99 Highland St, Madang', 'EMP003', NULL, NULL, NULL, NULL, NULL, NULL, 'IT Officer', 'Contract', '2020-09-01', 3800.00, 0.00, 'Remote', NULL, 'Active', NULL, NULL),
(4, 0, 2, 2, 'First', 'Customer', 'Male', '1980-01-01', 'Married', 5, '8546328940', 'user@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Present Address', 'Permanent Address', 'EMP101', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2022-01-01', 500.00, 0.00, 'png', NULL, 'Active', '2025-10-15 07:06:38', '2025-10-15 07:06:38'),
(5, 0, 1, 1, 'New', 'Customer', 'Male', '1980-01-02', 'Married', 2, '7539514860', 'demo@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP105', NULL, NULL, NULL, NULL, NULL, NULL, 'developer', 'Contract', '2022-05-07', 456.00, 0.00, 'png', NULL, 'Active', '2025-10-16 06:37:29', '2025-10-16 06:37:29'),
(6, 0, 2, 2, 'Demo', 'Cust', 'Male', '1977-04-05', 'Married', 3, '8523697410', 'demouser@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP112', NULL, NULL, NULL, NULL, NULL, NULL, 'manager', 'Permanent', NULL, 1000.00, 0.00, 'png', NULL, 'Active', '2025-10-16 06:54:01', '2025-10-16 06:54:01'),
(7, 0, 1, 2, 'Someone', 'Customer', 'Male', '1987-02-26', 'Married', 3, '7894563870', 'demo1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP122', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales', 'Permanent', '2022-09-03', 800.00, 0.00, 'png', NULL, 'Active', '2025-10-16 06:57:29', '2025-10-16 06:57:29'),
(8, 0, 1, 2, 'New', 'Customer', 'Female', '1987-02-03', 'Single', 5, '8520963074', 'demo@email1.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP701', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2025-01-25', 456.00, 0.00, 'png', NULL, 'Active', '2025-10-21 06:02:03', '2025-10-21 06:02:03'),
(9, 0, 1, 2, 'Brand New', 'Customer', 'Male', '1986-01-02', 'Married', 5, '7539514568', 'accounts@email.co', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP902', NULL, NULL, NULL, NULL, NULL, NULL, 'Developer', 'Permanent', '2019-05-02', 700.00, 0.00, 'png', NULL, 'Active', '2025-10-21 06:52:27', '2025-10-21 06:52:27'),
(10, 0, 1, 1, 'Today', 'First', 'Male', '1985-05-03', 'Married', 7, '7894573872', 'account@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP182', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', '2024-01-01', 589.00, 0.00, 'png', NULL, 'Active', '2025-10-22 00:26:13', '2025-10-22 00:26:13'),
(11, 0, 1, 1, 'Today', 'Second', 'Female', '1985-01-01', 'Married', 3, '9222555678', 'newemail@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP192', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Persons', 'Permanent', '2023-05-03', 456.00, 0.00, 'png', NULL, 'Active', '2025-10-22 00:31:09', '2025-10-22 00:31:09'),
(12, 0, 1, 1, 'New', 'Cust', 'Male', '1976-02-03', 'Married', 3, '7510514868', 'newmail@email.in', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP899', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2007-02-01', 855.00, 0.00, 'Port Moresby', NULL, 'Active', '2025-10-22 02:14:47', '2025-10-22 02:14:47'),
(13, 0, 2, 2, 'Test', 'Customer', 'Male', '1977-01-01', 'Married', 5, '8569713029', 'myemail1@mail.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP799', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 980.00, 0.00, 'Port Moresby', NULL, 'Active', '2025-10-22 02:22:53', '2025-10-22 02:22:53'),
(14, 0, 1, 1, 'demo', 'demo', 'Male', '1989-05-25', 'Single', 5, '9539516860', 'user2@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP987', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2005-01-02', 955.00, 0.00, 'png', NULL, 'Active', '2025-10-22 02:33:56', '2025-10-22 02:33:56'),
(15, 0, 1, 1, 'New1', 'Customer', 'Male', '1978-05-01', 'Married', 4, '7523697419', 'newemail@company.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP133', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', '2005-07-06', 899.00, 0.00, 'png', NULL, 'Active', '2025-10-22 02:36:48', '2025-10-22 02:36:48'),
(16, 0, 1, 2, 'Bank', 'Customer', 'Male', '1984-05-06', 'Married', 4, '7794563872', 'bankcust@mail.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP152', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', '2004-05-06', 955.00, 0.00, 'Port Moresby', NULL, 'Active', '2025-10-22 02:48:17', '2025-10-22 02:48:17'),
(17, 0, 1, 1, 'Customer', 'Name', 'Male', '1986-02-01', 'Single', 3, '8523857410', 'new1e@email.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'EMP1885', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2004-05-06', 852.00, 0.00, 'png', NULL, 'Active', '2025-10-22 06:31:02', '2025-10-22 06:31:02'),
(18, 0, 1, 1, 'First', 'Chanda', 'Male', '1985-05-02', 'Married', 5, '7534514860', 'admin44@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP901', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', '2007-05-02', 789.00, 0.00, 'png', NULL, 'Inactive', '2025-10-23 00:36:54', '2025-10-23 00:36:54'),
(19, 0, 1, 2, 'Created', 'Customer', 'Male', NULL, NULL, NULL, '8529746910', 'createdcus@mail.co', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, NULL, 'Active', '2025-10-23 05:54:19', '2025-10-23 05:54:19'),
(20, 0, 2, 1, 'Edited2', 'Check', 'Male', NULL, NULL, NULL, '7539578903', 'un@email.com', NULL, NULL, NULL, NULL, NULL, 'This record has been edited2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, NULL, 'Inactive', '2025-10-23 05:58:43', '2025-10-23 06:12:34'),
(21, 0, 1, 1, 'The', 'Customer', 'Male', NULL, NULL, NULL, '8788992310', 'newunemail@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, NULL, 'Active', '2025-10-28 23:55:35', '2025-10-28 23:55:35'),
(22, 0, 1, 1, 'Alice', 'Fernandez', 'Male', NULL, NULL, 4, '+675-7000-9012', 'alice.fernandez@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0003', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', NULL, NULL, 5500.00, 0.00, 'location', NULL, 'Active', '2025-11-04 05:58:22', '2025-12-17 02:45:45'),
(23, 0, 1, 1, 'Fatima', 'Yusuf', NULL, NULL, NULL, 4, '+675-7000-4321', 'fatima.yusuf@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0007', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 5300.00, 0.00, 'location', NULL, 'Active', '2025-11-04 06:22:33', '2025-11-04 06:22:33'),
(24, 0, 1, 1, '11New', 'Custoom', 'Male', NULL, NULL, 4, '9112852567', 'user234@gmail.com', '6784569765', NULL, NULL, NULL, NULL, NULL, NULL, 'Emp45678', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 5000.00, 4500.00, 'Demo', NULL, 'Active', '2025-11-12 00:32:03', '2025-12-17 05:49:50'),
(25, 0, 1, 1, 'Michael', 'Osei', 'Male', NULL, NULL, 4, '+675-7000-3456', 'michael.osei@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0004', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 6200.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 00:44:40', '2025-11-19 00:44:40'),
(26, 0, 1, 1, 'Priya', 'Nair', NULL, NULL, NULL, 4, '+675-7000-7890', 'priya.nair@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0005', NULL, NULL, NULL, NULL, NULL, NULL, 'developer', 'Permanent', NULL, 5800.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 01:35:39', '2025-11-19 01:35:39'),
(27, 0, 1, 1, 'Liam', 'Chen', NULL, NULL, NULL, 4, '+675-7000-6543', 'liam.chen@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0006', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 6100.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 01:41:11', '2025-11-19 01:41:11'),
(28, 0, 1, 1, 'New', 'Cust Name33', NULL, NULL, NULL, 4, '7910397564', 'newuniq33@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP75395123', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales', 'Permanent', NULL, 1100.00, 0.00, 'demo', NULL, 'Active', '2025-11-24 02:00:36', '2025-11-24 02:00:36'),
(29, 0, 1, 1, 'New', 'Customer11', NULL, NULL, NULL, 5, '8597432103', 'customer115@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0159', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales', 'Permanent', NULL, 5500.00, 0.00, 'demo', NULL, 'Active', '2025-11-24 02:21:50', '2025-11-24 02:21:50'),
(30, 0, 1, 1, 'New', 'DeptCust555', 'Male', NULL, NULL, 4, '7597316980', 'newdeptcust.11@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP159787', NULL, NULL, NULL, NULL, NULL, NULL, 'manager', 'Permanent', NULL, 5000.00, 0.00, 'demo', NULL, 'Active', '2025-11-24 23:24:12', '2025-11-24 23:24:12'),
(31, 2, 1, 1, 'Philip', 'Ruth', 'Male', NULL, NULL, 4, '8546328940', 'newcustuser@gmail.com', 'rr4358435', NULL, NULL, NULL, NULL, NULL, NULL, '00585688', 'Deptuniq', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 5247.49, 5000.00, 'demo', NULL, 'Active', '2025-11-28 05:16:12', '2025-11-28 05:16:12'),
(32, 2, 1, 1, 'Mewa,', 'Cathy', NULL, NULL, NULL, 4, '7598566980', 'useruni77@gmail.com', '62665765', NULL, NULL, NULL, NULL, NULL, NULL, '13514735', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 1229.02, 1100.00, 'demo', NULL, 'Active', '2025-11-28 05:50:19', '2025-11-28 05:50:19'),
(33, 2, 1, 1, 'Fonn', 'Tolopato Mary', NULL, NULL, NULL, 4, '8547530940', 'fonn@email.com', '4358435', NULL, NULL, NULL, NULL, NULL, NULL, '00488518', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 1510.62, 1400.00, 'demo', NULL, 'Active', '2025-12-01 02:36:31', '2025-12-01 02:36:31'),
(34, 2, 1, 1, 'Rema', 'Jorem', NULL, NULL, NULL, 4, '7597741980', 'rema@email.com', '4302535', NULL, NULL, NULL, NULL, NULL, NULL, '10210703', 'demo', NULL, NULL, NULL, NULL, NULL, 'demo', 'Permanent', NULL, 1889.48, 1600.00, 'demo', NULL, 'Active', '2025-12-01 02:52:30', '2025-12-01 02:52:30'),
(35, 2, 1, 1, 'Ananga', 'Jerusha', NULL, NULL, NULL, 4, '8546328940', 'ananga@gmail.com', '4358435', NULL, NULL, NULL, NULL, NULL, NULL, '11250661', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 1413.24, 1400.00, 'demo', NULL, 'Active', '2025-12-11 22:57:20', '2025-12-11 22:57:20'),
(36, 2, 1, 1, 'Ananga', 'Jerusha', NULL, NULL, NULL, 4, '9112345678', 'ananga@gmail.com', '678756765', NULL, NULL, NULL, NULL, NULL, NULL, '11250661', 'Dept589', NULL, NULL, NULL, NULL, NULL, 'demo', 'Permanent', NULL, 1413.24, 1300.00, 'demo', NULL, 'Active', '2025-12-12 02:05:57', '2025-12-12 02:05:57'),
(37, 2, 1, 1, 'Ananga', 'Jerusha', NULL, NULL, NULL, 4, '+67575009012', 'ananga@email.com', '678100765', NULL, NULL, NULL, NULL, NULL, NULL, '11250661', 'Dept566', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 1413.24, 1300.00, 'demo', NULL, 'Active', '2025-12-15 00:32:24', '2025-12-15 00:32:24'),
(38, 2, 1, 1, 'Bibi', 'Julie', NULL, NULL, NULL, 4, '8546789940', 'bibi@email.com', '435435800', NULL, NULL, NULL, NULL, NULL, NULL, '13275983', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 1229.02, 1200.00, 'demo', NULL, 'Active', '2025-12-15 00:50:48', '2025-12-15 00:50:48'),
(39, 2, 1, 1, 'Auma', 'Lotter', 'Male', NULL, 'Single', 4, '8552628940', 'auma@email.com', '67878765', NULL, NULL, NULL, NULL, NULL, NULL, '10322535', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 1468.83, 1400.00, 'demo', NULL, 'Active', '2025-12-15 02:41:02', '2025-12-15 02:41:02'),
(40, 2, 1, 1, 'Dauri', 'Wendy', 'Female', NULL, NULL, 4, '8548562940', 'dauri@email.com', '67877765', NULL, NULL, NULL, NULL, NULL, NULL, '13512563', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 1266.52, 1200.00, 'demo', NULL, 'Active', '2025-12-15 05:23:26', '2025-12-18 05:19:49'),
(41, 2, 1, 1, 'Tubai', 'Tupolam', NULL, NULL, NULL, 4, '9114569678', 'tubai@email.com', '678100765', NULL, NULL, NULL, NULL, NULL, NULL, '0060066A', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 1468.83, 1300.00, 'demo', NULL, 'Active', '2025-12-15 23:48:09', '2025-12-15 23:48:09'),
(42, 2, 1, 1, 'GOGUSO', 'Gipson', NULL, NULL, NULL, 4, '9112753678', 'goguso@email.com', '67866765', NULL, NULL, NULL, NULL, NULL, NULL, '13477913', 'Deptuniq', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 1266.52, 1100.00, 'demo', NULL, 'Active', '2025-12-16 02:38:23', '2025-12-16 02:38:23'),
(43, 2, 1, 1, 'Jimberi', 'Jacklyn', NULL, NULL, NULL, 4, '8548108940', 'jimberi@email.com', '6786576509', NULL, NULL, NULL, NULL, NULL, NULL, '12481532', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Manager', 'Permanent', NULL, 1384.48, 1200.00, 'demo', NULL, 'Active', '2025-12-16 02:54:39', '2025-12-16 02:54:39'),
(44, 2, 1, 4, 'Aditya', 'Paul', 'Male', NULL, 'Divorced', 5, '7539512368', 'aditya@email.com', '6745869765', NULL, NULL, NULL, NULL, NULL, NULL, 'Badmash420', 'Dept', NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 5500.00, 3000.00, 'Demo', NULL, 'Active', '2025-12-18 06:48:36', '2025-12-18 06:48:36'),
(45, 2, 1, 4, 'Nega', 'Salagowato', NULL, NULL, NULL, 4, '9752345670', 'naganew@email.com', '6759069765', NULL, NULL, NULL, NULL, NULL, NULL, '10321646', 'Dept', NULL, NULL, NULL, NULL, NULL, 'manager', 'Permanent', NULL, 1507.42, 1450.00, 'demo', NULL, 'Active', '2025-12-23 02:21:47', '2025-12-23 02:21:47'),
(46, 2, 1, 2, 'demo', 'surname', 'Male', NULL, NULL, 4, '85201365', 'demo1001@gmail.com', '100001', NULL, NULL, NULL, NULL, NULL, NULL, 'demo1001', 'dept1001', NULL, NULL, NULL, NULL, 0, 'desig1001', 'Permanent', '2026-01-09', 6000.00, 5000.00, 'demo', NULL, 'Active', '2026-01-09 01:13:32', '2026-01-09 01:13:32'),
(47, 2, 1, 4, 'Alice', 'Fernandez1', 'Male', NULL, NULL, 4, '75395456', 'demo9001@email.com', '6869765', NULL, NULL, NULL, NULL, NULL, NULL, 'emp9001', 'dept9001', NULL, NULL, NULL, NULL, 0, 'Manager', 'Permanent', NULL, 5500.00, 5000.00, 'demo9001', NULL, 'Active', '2026-01-09 02:53:28', '2026-01-09 02:53:28');

-- --------------------------------------------------------

--
-- Table structure for table `customer_drafts`
--

CREATE TABLE `customer_drafts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cus_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_no` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `marital_status` varchar(255) DEFAULT NULL,
  `no_of_dependents` int(11) DEFAULT 0,
  `spouse_full_name` varchar(255) DEFAULT NULL,
  `spouse_contact` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `home_province` varchar(255) DEFAULT NULL,
  `district_village` varchar(255) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `payroll_number` varchar(255) DEFAULT NULL,
  `employer_department` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `date_joined` date DEFAULT NULL,
  `monthly_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `immediate_supervisor` varchar(255) DEFAULT NULL,
  `years_at_current_employer` varchar(255) DEFAULT NULL,
  `work_district` varchar(255) DEFAULT NULL,
  `work_province` varchar(255) DEFAULT NULL,
  `employer_address` text DEFAULT NULL,
  `work_location` text DEFAULT NULL,
  `organisation_id` bigint(20) UNSIGNED DEFAULT 0,
  `company_id` bigint(20) UNSIGNED DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_eligibility_history`
--

CREATE TABLE `customer_eligibility_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `gross_salary_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `temp_allowances_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overtime_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `superannuation_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_after_tax_superannuation_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_net_pay_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bank_2_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_net_salary_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_other_deductions_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_50_percent_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_50_percent_available_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_fincorp_deduction_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `other_deductions_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_allowable_pva_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `proposed_pva_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_based_on_proposed_pva_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shortage_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `checked_by_user_id` int(11) DEFAULT NULL,
  `is_eligible_for_loan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_eligibility_history`
--

INSERT INTO `customer_eligibility_history` (`id`, `customer_id`, `gross_salary_amt`, `temp_allowances_amt`, `overtime_amt`, `tax_amt`, `superannuation_amt`, `net_after_tax_superannuation_amt`, `current_net_pay_amt`, `bank_2_amt`, `total_net_salary_amt`, `total_other_deductions_amt`, `net_50_percent_amt`, `net_50_percent_available_amt`, `current_fincorp_deduction_amt`, `other_deductions_amt`, `max_allowable_pva_amt`, `proposed_pva_amt`, `net_based_on_proposed_pva_amt`, `shortage_amt`, `checked_by_user_id`, `is_eligible_for_loan`, `created_at`, `updated_at`) VALUES
(1, 1, 3572.50, 0.00, 0.00, 1113.24, 68.97, 2390.29, 1631.89, 0.00, 1631.89, 758.40, 1195.15, 436.75, 358.40, 0.00, 795.14, 742.50, 889.39, 52.63, 1, 1, '2025-10-30 06:46:44', '2025-10-30 06:46:44'),
(2, 10, 1400.00, 0.00, 0.00, 850.00, 80.00, 470.00, 1300.00, 0.00, 1300.00, -830.00, 235.00, 1065.00, 385.00, 0.00, 1449.99, 900.00, 400.00, 549.99, 1, 1, '2025-11-04 03:49:15', '2025-11-04 03:49:15'),
(3, 3, 10000.00, 100.00, 10.00, 900.00, 100.00, 9110.00, 1000.00, 100.00, 1100.00, 8010.00, 4555.00, -3455.00, 100.00, 100.00, -3255.01, 1000.00, 100.00, -4255.01, 1, 0, '2025-11-04 04:22:36', '2025-11-04 04:22:36'),
(4, 3, 1000.00, 100.00, 10.00, 900.00, 100.00, 110.00, 1000.00, 100.00, 1100.00, -990.00, 55.00, 1045.00, 100.00, 100.00, 1244.99, 1000.00, 100.00, 244.99, 1, 1, '2025-11-04 04:22:49', '2025-11-04 04:22:49'),
(5, 3, 1400.00, 0.00, 0.00, 850.00, 90.00, 460.00, 1300.00, 0.00, 1300.00, -840.00, 230.00, 1070.00, 385.00, 0.00, 1454.99, 900.00, 400.00, 554.99, 1, 1, '2025-11-04 04:38:47', '2025-11-04 04:38:47'),
(6, 1, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 510.00, 0.00, 1664.99, 900.00, 400.00, 764.99, 1, 1, '2025-11-04 04:53:14', '2025-11-04 04:53:14'),
(7, 1, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 510.00, 0.00, 1664.99, 1700.00, -400.00, -35.01, 1, 0, '2025-11-04 04:53:24', '2025-11-04 04:53:24'),
(8, 1, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 510.00, 0.00, 1664.99, 1600.00, -300.00, 64.99, 1, 1, '2025-11-04 04:56:30', '2025-11-04 04:56:30'),
(9, 5, 1400.00, 0.00, 0.00, 510.00, 110.00, 780.00, 1300.00, 0.00, 1300.00, -520.00, 390.00, 910.00, 455.00, 0.00, 1364.99, 1700.00, -400.00, -335.01, 1, 0, '2025-11-04 04:58:22', '2025-11-04 04:58:22'),
(10, 5, 1400.00, 0.00, 0.00, 510.00, 110.00, 780.00, 1300.00, 0.00, 1300.00, -520.00, 390.00, 910.00, 455.00, 0.00, 1364.99, 1600.00, -300.00, -235.01, 1, 0, '2025-11-04 05:02:13', '2025-11-04 05:02:13'),
(11, 5, 1400.00, 0.00, 0.00, 510.00, 110.00, 780.00, 1300.00, 0.00, 1300.00, -520.00, 390.00, 910.00, 455.00, 0.00, 1364.99, 1200.00, 100.00, 164.99, 1, 1, '2025-11-04 05:02:22', '2025-11-04 05:02:22'),
(12, 5, 1400.00, 0.00, 0.00, 510.00, 110.00, 780.00, 1300.00, 0.00, 1300.00, -520.00, 390.00, 910.00, 455.00, 0.00, 1364.99, 1700.00, -400.00, -335.01, 1, 0, '2025-11-04 05:02:28', '2025-11-04 05:02:28'),
(13, 22, 1500.00, 0.00, 0.00, 108.00, 110.00, 1282.00, 1400.00, 0.00, 1400.00, -118.00, 641.00, 759.00, 410.00, 0.00, 1168.99, 1349.95, 50.05, -180.96, 1, 0, '2025-11-04 05:58:59', '2025-11-04 05:58:59'),
(14, 22, 1500.00, 0.00, 0.00, 108.00, 110.00, 1282.00, 1400.00, 0.00, 1400.00, -118.00, 641.00, 759.00, 410.00, 0.00, 1168.99, 1100.00, 300.00, 68.99, 1, 1, '2025-11-04 05:59:11', '2025-11-04 05:59:11'),
(15, 23, 1400.00, 0.00, 0.00, 950.00, 90.00, 360.00, 1300.00, 0.00, 1300.00, -940.00, 180.00, 1120.00, 410.00, 0.00, 1529.99, 1150.00, 150.00, 379.99, 1, 1, '2025-11-04 06:23:26', '2025-11-04 06:23:26'),
(16, 23, 1400.00, 0.00, 0.00, 950.00, 90.00, 360.00, 1300.00, 0.00, 1300.00, -940.00, 180.00, 1120.00, 410.00, 0.00, 1529.99, 1600.00, -300.00, -70.01, 1, 0, '2025-11-04 06:23:53', '2025-11-04 06:23:53'),
(17, 3, 1400.00, 0.00, 0.00, 900.00, 112.00, 388.00, 1300.00, 0.00, 1300.00, -912.00, 194.00, 1106.00, 450.00, 0.00, 1555.99, 1300.00, 0.00, 255.99, 1, 1, '2025-11-07 01:38:07', '2025-11-07 01:38:07'),
(18, 3, 1400.00, 0.00, 0.00, 900.00, 112.00, 388.00, 1300.00, 0.00, 1300.00, -912.00, 194.00, 1106.00, 450.00, 0.00, 1555.99, 1600.00, -300.00, -44.01, 1, 0, '2025-11-07 01:38:37', '2025-11-07 01:38:37'),
(19, 18, 1400.00, 0.00, 0.00, 955.00, 80.00, 365.00, 1300.00, 0.00, 1300.00, -935.00, 182.50, 1117.50, 420.00, 0.00, 1537.49, 900.00, 400.00, 637.49, 1, 1, '2025-11-07 01:44:17', '2025-11-07 01:44:17'),
(20, 4, 1400.00, 0.00, 0.00, 955.00, 110.00, 335.00, 1300.00, 0.00, 1300.00, -965.00, 167.50, 1132.50, 430.00, 0.00, 1562.49, 1100.00, 200.00, 462.49, 1, 1, '2025-11-07 01:48:15', '2025-11-07 01:48:15'),
(21, 2, 1400.00, 0.00, 0.00, 955.00, 110.00, 335.00, 1300.00, 0.00, 1300.00, -965.00, 167.50, 1132.50, 430.00, 0.00, 1562.49, 900.00, 400.00, 662.49, 1, 1, '2025-11-07 01:48:48', '2025-11-07 01:48:48'),
(22, 8, 1400.00, 0.00, 0.00, 900.00, 100.00, 400.00, 1300.00, 0.00, 1300.00, -900.00, 200.00, 1100.00, 410.00, 0.00, 1509.99, 1100.00, 200.00, 409.99, 1, 1, '2025-11-11 03:41:13', '2025-11-11 03:41:13'),
(23, 8, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1100.00, 200.00, 459.99, 1, 1, '2025-11-11 03:52:01', '2025-11-11 03:52:01'),
(24, 2, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 900.00, 400.00, 659.99, 1, 1, '2025-11-11 03:54:21', '2025-11-11 03:54:21'),
(25, 24, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1100.00, 200.00, 459.99, 1, 1, '2025-11-12 00:32:49', '2025-11-12 00:32:49'),
(26, 24, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1600.00, -300.00, -40.01, 1, 0, '2025-11-12 00:33:18', '2025-11-12 00:33:18'),
(27, 24, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1400.00, -100.00, 159.99, 1, 1, '2025-11-12 00:33:55', '2025-11-12 00:33:55'),
(28, 24, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 900.00, 400.00, 659.99, 1, 1, '2025-11-12 00:34:01', '2025-11-12 00:34:01'),
(29, 24, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1100.00, 200.00, 459.99, 1, 1, '2025-11-12 00:36:37', '2025-11-12 00:36:37'),
(30, 14, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1100.00, 200.00, 459.99, 1, 1, '2025-11-12 01:48:46', '2025-11-12 01:48:46'),
(31, 26, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 410.00, 0.00, 1564.99, 1100.00, 200.00, 464.99, 1, 1, '2025-11-19 01:38:10', '2025-11-19 01:38:10'),
(32, 26, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 410.00, 0.00, 1564.99, 1600.00, -300.00, -35.01, 1, 0, '2025-11-19 01:38:45', '2025-11-19 01:38:45'),
(33, 27, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 410.00, 0.00, 1564.99, 1200.00, 100.00, 364.99, 1, 1, '2025-11-19 01:41:28', '2025-11-19 01:41:28'),
(34, 28, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1200.00, 100.00, 359.99, 2, 1, '2025-11-24 02:01:55', '2025-11-24 02:01:55'),
(35, 28, 1400.00, 0.00, 0.00, 1000.00, 100.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1600.00, -300.00, -40.01, 2, 0, '2025-11-24 02:02:25', '2025-11-24 02:02:25'),
(36, 29, 1400.00, 0.00, 0.00, 1000.00, 410.00, -10.00, 1300.00, 0.00, 1300.00, -1310.00, -5.00, 1305.00, 100.00, 0.00, 1404.99, 1200.00, 100.00, 204.99, 2, 1, '2025-11-24 02:22:15', '2025-11-24 02:22:15'),
(37, 30, 5000.00, 0.00, 0.00, 1000.00, 100.00, 3900.00, 4000.00, 0.00, 4000.00, -100.00, 1950.00, 2050.00, 410.00, 0.00, 2459.99, 1600.00, 2400.00, 859.99, 2, 1, '2025-11-24 23:26:24', '2025-11-24 23:26:24'),
(38, 30, 5000.00, 0.00, 0.00, 1000.00, 100.00, 3900.00, 4000.00, 0.00, 4000.00, -100.00, 1950.00, 2050.00, 410.00, 0.00, 2459.99, 2500.00, 1500.00, -40.01, 2, 0, '2025-11-24 23:27:09', '2025-11-24 23:27:09'),
(39, 31, 5250.00, 0.00, 0.00, 1200.00, 110.00, 3940.00, 5000.00, 0.00, 5000.00, -1060.00, 1970.00, 3030.00, 410.00, 0.00, 3439.99, 2000.00, 3000.00, 1439.99, 2, 1, '2025-11-28 05:17:27', '2025-11-28 05:17:27'),
(40, 31, 5250.00, 0.00, 0.00, 1200.00, 110.00, 3940.00, 5000.00, 0.00, 5000.00, -1060.00, 1970.00, 3030.00, 410.00, 0.00, 3439.99, 4000.00, 1000.00, -560.01, 2, 0, '2025-11-28 05:17:33', '2025-11-28 05:17:33'),
(41, 32, 1200.00, 0.00, 0.00, 800.00, 110.00, 290.00, 1100.00, 0.00, 1100.00, -810.00, 145.00, 955.00, 326.00, 0.00, 1280.99, 1000.00, 100.00, 280.99, 2, 1, '2025-11-28 05:50:46', '2025-11-28 05:50:46'),
(42, 32, 1200.00, 0.00, 0.00, 800.00, 110.00, 290.00, 1100.00, 0.00, 1100.00, -810.00, 145.00, 955.00, 326.00, 0.00, 1280.99, 1000.00, 100.00, 280.99, 2, 1, '2025-11-28 05:52:16', '2025-11-28 05:52:16'),
(43, 32, 1200.00, 0.00, 0.00, 800.00, 110.00, 290.00, 1100.00, 0.00, 1100.00, -810.00, 145.00, 955.00, 326.00, 0.00, 1280.99, 1500.00, -400.00, -219.01, 2, 0, '2025-11-28 05:52:25', '2025-11-28 05:52:25'),
(44, 32, 1200.00, 0.00, 0.00, 800.00, 110.00, 290.00, 1100.00, 0.00, 1100.00, -810.00, 145.00, 955.00, 326.00, 0.00, 1280.99, 1100.00, 0.00, 180.99, 2, 1, '2025-11-28 05:52:36', '2025-11-28 05:52:36'),
(45, 32, 1200.00, 0.00, 0.00, 899.00, 110.00, 191.00, 1100.00, 0.00, 1100.00, -909.00, 95.50, 1004.50, 410.00, 0.00, 1414.49, 1100.00, 0.00, 314.49, 2, 1, '2025-11-28 05:53:36', '2025-11-28 05:53:36'),
(46, 32, 1200.00, 0.00, 0.00, 900.00, 110.00, 190.00, 1100.00, 0.00, 1100.00, -910.00, 95.00, 1005.00, 410.00, 0.00, 1414.99, 1100.00, 0.00, 314.99, 2, 1, '2025-11-28 05:58:20', '2025-11-28 05:58:20'),
(47, 2, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1200.00, 0.00, 1200.00, -810.00, 195.00, 1005.00, 410.00, 0.00, 1414.99, 1100.00, 100.00, 314.99, 2, 1, '2025-11-28 06:40:33', '2025-11-28 06:40:33'),
(48, 3, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 410.00, 0.00, 1564.99, 1100.00, 200.00, 464.99, 2, 1, '2025-12-01 00:08:43', '2025-12-01 00:08:43'),
(49, 33, 1500.00, 0.00, 0.00, 900.00, 110.00, 490.00, 1400.00, 0.00, 1400.00, -910.00, 245.00, 1155.00, 410.00, 0.00, 1564.99, 1200.00, 200.00, 364.99, 2, 1, '2025-12-01 02:37:06', '2025-12-01 02:37:06'),
(50, 33, 1500.00, 0.00, 0.00, 900.00, 110.00, 490.00, 1400.00, 0.00, 1400.00, -910.00, 245.00, 1155.00, 410.00, 0.00, 1564.99, 1600.00, -200.00, -35.01, 2, 0, '2025-12-01 02:37:29', '2025-12-01 02:37:29'),
(51, 33, 1500.00, 0.00, 0.00, 900.00, 110.00, 490.00, 1400.00, 0.00, 1400.00, -910.00, 245.00, 1155.00, 410.00, 0.00, 1564.99, 1400.00, 0.00, 164.99, 2, 1, '2025-12-01 02:38:05', '2025-12-01 02:38:05'),
(52, 34, 1800.00, 0.00, 0.00, 1000.00, 120.00, 680.00, 1600.00, 0.00, 1600.00, -920.00, 340.00, 1260.00, 450.00, 0.00, 1709.99, 1500.00, 100.00, 209.99, 2, 1, '2025-12-01 02:52:54', '2025-12-01 02:52:54'),
(53, 34, 1800.00, 0.00, 0.00, 1000.00, 120.00, 680.00, 1600.00, 0.00, 1600.00, -920.00, 340.00, 1260.00, 450.00, 0.00, 1709.99, 1800.00, -200.00, -90.01, 2, 0, '2025-12-01 02:53:04', '2025-12-01 02:53:04'),
(54, 3, 1400.00, 0.00, 0.00, 900.00, 150.00, 350.00, 1300.00, 0.00, 1300.00, -950.00, 175.00, 1125.00, 450.00, 0.00, 1574.99, 1600.00, -300.00, -25.01, 2, 0, '2025-12-02 07:15:15', '2025-12-02 07:15:15'),
(55, 3, 1400.00, 0.00, 0.00, 900.00, 150.00, 350.00, 1300.00, 0.00, 1300.00, -950.00, 175.00, 1125.00, 450.00, 0.00, 1574.99, 1500.00, -200.00, 74.99, 2, 1, '2025-12-02 07:15:30', '2025-12-02 07:15:30'),
(56, 22, 1400.00, 0.00, 0.00, 410.00, 110.00, 880.00, 1300.00, 0.00, 1300.00, -420.00, 440.00, 860.00, 110.00, 0.00, 969.99, 1100.00, 200.00, -130.01, 2, 0, '2025-12-11 07:53:29', '2025-12-11 07:53:29'),
(57, 22, 1400.00, 0.00, 0.00, 410.00, 110.00, 880.00, 1300.00, 0.00, 1300.00, -420.00, 440.00, 860.00, 110.00, 0.00, 969.99, 900.00, 400.00, 69.99, 2, 1, '2025-12-11 07:53:51', '2025-12-11 07:53:51'),
(58, 35, 1415.00, 0.00, 0.00, 1000.00, 110.00, 305.00, 1400.00, 0.00, 1400.00, -1095.00, 152.50, 1247.50, 410.00, 0.00, 1657.49, 1200.00, 200.00, 457.49, 2, 1, '2025-12-11 22:59:44', '2025-12-11 22:59:44'),
(59, 36, 1455.00, 0.00, 0.00, 900.00, 110.00, 445.00, 1300.00, 0.00, 1300.00, -855.00, 222.50, 1077.50, 410.00, 0.00, 1487.49, 1200.00, 100.00, 287.49, 2, 1, '2025-12-12 02:06:34', '2025-12-12 02:06:34'),
(60, 36, 1455.00, 0.00, 0.00, 900.00, 110.00, 445.00, 1300.00, 0.00, 1300.00, -855.00, 222.50, 1077.50, 410.00, 0.00, 1487.49, 1600.00, -300.00, -112.51, 2, 0, '2025-12-12 02:07:15', '2025-12-12 02:07:15'),
(61, 36, 1455.00, 0.00, 0.00, 900.00, 110.00, 445.00, 1300.00, 0.00, 1300.00, -855.00, 222.50, 1077.50, 410.00, 0.00, 1487.49, 1200.00, 100.00, 287.49, 2, 1, '2025-12-12 02:07:38', '2025-12-12 02:07:38'),
(62, 37, 1430.00, 0.00, 0.00, 900.00, 110.00, 420.00, 1299.99, 0.00, 1299.99, -879.99, 210.00, 1089.99, 410.00, 0.00, 1499.98, 1500.00, -200.01, -0.02, 2, 0, '2025-12-15 00:33:11', '2025-12-15 00:33:11'),
(63, 37, 1430.00, 0.00, 0.00, 900.00, 110.00, 420.00, 1299.99, 0.00, 1299.99, -879.99, 210.00, 1089.99, 410.00, 0.00, 1499.98, 1400.00, -100.01, 99.98, 2, 1, '2025-12-15 00:33:17', '2025-12-15 00:33:17'),
(64, 38, 1215.00, 0.00, 0.00, 900.00, 110.00, 205.00, 1200.00, 0.00, 1200.00, -995.00, 102.50, 1097.50, 410.00, 0.00, 1507.49, 1100.00, 100.00, 407.49, 2, 1, '2025-12-15 00:51:28', '2025-12-15 00:51:28'),
(65, 38, 1215.00, 0.00, 0.00, 900.00, 110.00, 205.00, 1200.00, 0.00, 1200.00, -995.00, 102.50, 1097.50, 410.00, 0.00, 1507.49, 1300.00, -100.00, 207.49, 2, 1, '2025-12-15 00:51:36', '2025-12-15 00:51:36'),
(66, 39, 1468.83, 0.00, 0.00, 900.00, 98.00, 470.83, 1400.00, 0.00, 1400.00, -929.17, 235.42, 1164.59, 399.00, 0.00, 1563.58, 1200.00, 200.00, 363.58, 2, 1, '2025-12-15 02:41:33', '2025-12-15 02:41:33'),
(67, 39, 1468.83, 0.00, 0.00, 900.00, 98.00, 470.83, 1400.00, 0.00, 1400.00, -929.17, 235.42, 1164.59, 399.00, 0.00, 1563.58, 1400.00, 0.00, 163.58, 2, 1, '2025-12-15 02:41:40', '2025-12-15 02:41:40'),
(68, 6, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1300.00, 0.00, 1300.00, -910.00, 195.00, 1105.00, 410.00, 0.00, 1514.99, 1200.00, 100.00, 314.99, 2, 1, '2025-12-15 03:34:11', '2025-12-15 03:34:11'),
(69, 40, 1266.52, 0.00, 0.00, 900.00, 110.00, 256.52, 1200.00, 0.00, 1200.00, -943.48, 128.26, 1071.74, 410.00, 0.00, 1481.73, 1200.00, 0.00, 281.73, 2, 1, '2025-12-15 05:23:52', '2025-12-15 05:23:52'),
(70, 40, 1266.52, 0.00, 0.00, 900.00, 110.00, 256.52, 1200.00, 0.00, 1200.00, -943.48, 128.26, 1071.74, 410.00, 0.00, 1481.73, 1300.00, -100.00, 181.73, 2, 1, '2025-12-15 05:23:58', '2025-12-15 05:23:58'),
(71, 40, 1266.52, 0.00, 0.00, 900.00, 110.00, 256.52, 1200.00, 0.00, 1200.00, -943.48, 128.26, 1071.74, 410.00, 0.00, 1481.73, 1400.00, -200.00, 81.73, 2, 1, '2025-12-15 05:26:29', '2025-12-15 05:26:29'),
(72, 40, 1266.52, 0.00, 0.00, 900.00, 110.00, 256.52, 1200.00, 0.00, 1200.00, -943.48, 128.26, 1071.74, 410.00, 0.00, 1481.73, 1400.00, -200.00, 81.73, 2, 1, '2025-12-15 05:26:33', '2025-12-15 05:26:33'),
(73, 3, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1300.00, 0.00, 1300.00, -910.00, 195.00, 1105.00, 410.00, 0.00, 1514.99, 1200.00, 100.00, 314.99, 2, 1, '2025-12-15 23:40:38', '2025-12-15 23:40:38'),
(74, 3, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1300.00, 0.00, 1300.00, -910.00, 195.00, 1105.00, 410.00, 0.00, 1514.99, 1400.00, -100.00, 114.99, 2, 1, '2025-12-15 23:41:41', '2025-12-15 23:41:41'),
(75, 3, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1300.00, 0.00, 1300.00, -910.00, 195.00, 1105.00, 410.00, 0.00, 1514.99, 1600.00, -300.00, -85.01, 2, 0, '2025-12-15 23:41:46', '2025-12-15 23:41:46'),
(76, 3, 1400.00, 0.00, 0.00, 900.00, 110.00, 390.00, 1300.00, 0.00, 1300.00, -910.00, 195.00, 1105.00, 410.00, 0.00, 1514.99, 900.00, 400.00, 614.99, 2, 1, '2025-12-15 23:42:06', '2025-12-15 23:42:06'),
(77, 41, 1468.83, 0.00, 0.00, 900.00, 110.00, 458.83, 1300.00, 0.00, 1300.00, -841.17, 229.42, 1070.59, 410.00, 0.00, 1480.58, 1300.00, 0.00, 180.58, 2, 1, '2025-12-15 23:48:33', '2025-12-15 23:48:33'),
(78, 43, 1384.48, 0.00, 0.00, 988.00, 98.00, 298.48, 1200.00, 0.00, 1200.00, -901.52, 149.24, 1050.76, 425.00, 0.00, 1475.75, 1200.00, 0.00, 275.75, 2, 1, '2025-12-16 02:55:08', '2025-12-16 02:55:08'),
(79, 31, 5247.49, 0.00, 0.00, 998.00, 110.00, 4139.49, 5000.00, 0.00, 5000.00, -860.51, 2069.75, 2930.26, 410.00, 0.00, 3340.25, 1500.00, 3500.00, 1840.25, 2, 1, '2025-12-17 01:54:26', '2025-12-17 01:54:26'),
(80, 22, 5500.00, 0.00, 0.00, 998.00, 110.00, 4392.00, 0.00, 0.00, 0.00, 4392.00, 2196.00, -2196.00, 410.00, 0.00, -1786.01, 1200.00, -1200.00, -2986.01, 2, 0, '2025-12-17 02:45:59', '2025-12-17 02:45:59'),
(81, 22, 5500.00, 0.00, 0.00, 998.00, 110.00, 4392.00, 5000.00, 0.00, 5000.00, -608.00, 2196.00, 2804.00, 410.00, 0.00, 3213.99, 1200.00, 3800.00, 2013.99, 2, 1, '2025-12-17 02:46:11', '2025-12-17 02:46:11'),
(82, 22, 5500.00, 0.00, 0.00, 998.00, 110.00, 4392.00, 5000.00, 0.00, 5000.00, -608.00, 2196.00, 2804.00, 410.00, 0.00, 3213.99, 3000.00, 2000.00, 213.99, 2, 1, '2025-12-17 02:46:18', '2025-12-17 02:46:18'),
(83, 24, 5000.00, 0.00, 0.00, 980.00, 110.00, 3910.00, 0.00, 0.00, 0.00, 3910.00, 1955.00, -1955.00, 410.00, 0.00, -1545.01, 1200.00, -1200.00, -2745.01, 2, 0, '2025-12-17 05:25:05', '2025-12-17 05:25:05'),
(84, 24, 5000.00, 0.00, 0.00, 980.00, 110.00, 3910.00, 4000.00, 0.00, 4000.00, -90.00, 1955.00, 2045.00, 410.00, 0.00, 2454.99, 1200.00, 2800.00, 1254.99, 2, 1, '2025-12-17 05:25:45', '2025-12-17 05:25:45'),
(85, 24, 5000.00, 0.00, 0.00, 980.00, 110.00, 3910.00, 4000.00, 0.00, 4000.00, -90.00, 1955.00, 2045.00, 410.00, 0.00, 2454.99, 2000.00, 2000.00, 454.99, 2, 1, '2025-12-17 05:25:51', '2025-12-17 05:25:51'),
(86, 24, 5000.00, 0.00, 0.00, 900.00, 110.00, 3990.00, 4500.00, 0.00, 4500.00, -510.00, 1995.00, 2505.00, 410.00, 0.00, 2914.99, 1500.00, 3000.00, 1414.99, 2, 1, '2025-12-17 05:50:01', '2025-12-17 05:50:01'),
(87, 24, 5000.00, 0.00, 0.00, 900.00, 110.00, 3990.00, 4500.00, 0.00, 4500.00, -510.00, 1995.00, 2505.00, 410.00, 0.00, 2914.99, 2000.00, 2500.00, 914.99, 2, 1, '2025-12-17 05:50:05', '2025-12-17 05:50:05'),
(88, 24, 5000.00, 0.00, 0.00, 1000.00, 120.00, 3880.00, 4500.00, 0.00, 4500.00, -620.00, 1940.00, 2560.00, 399.00, 0.00, 2958.99, 1500.00, 3000.00, 1458.99, 2, 1, '2025-12-17 05:52:58', '2025-12-17 05:52:58'),
(89, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 1600.00, 2900.00, 1364.99, 2, 1, '2025-12-17 05:56:03', '2025-12-17 05:56:03'),
(90, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 1600.00, 2900.00, 1364.99, 2, 1, '2025-12-17 05:57:36', '2025-12-17 05:57:36'),
(91, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 1500.00, 3000.00, 1464.99, 2, 1, '2025-12-17 06:40:03', '2025-12-17 06:40:03'),
(92, 13, 1400.00, 0.00, 0.00, 988.00, 110.00, 302.00, 1300.00, 0.00, 1300.00, -998.00, 151.00, 1149.00, 410.00, 0.00, 1558.99, 1500.00, -200.00, 58.99, 2, 1, '2025-12-17 07:09:37', '2025-12-17 07:09:37'),
(93, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 1500.00, 3000.00, 1464.99, 2, 1, '2025-12-17 08:35:15', '2025-12-17 08:35:15'),
(94, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2000.00, 2500.00, 964.99, 2, 1, '2025-12-17 08:35:20', '2025-12-17 08:35:20'),
(95, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 3000.00, 1500.00, -35.01, 2, 0, '2025-12-17 08:39:05', '2025-12-17 08:39:05'),
(96, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2800.00, 1700.00, 164.99, 2, 1, '2025-12-17 08:39:11', '2025-12-17 08:39:11'),
(97, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2899.00, 1601.00, 65.99, 2, 1, '2025-12-17 08:41:30', '2025-12-17 08:41:30'),
(98, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2550.00, 1950.00, 414.99, 2, 1, '2025-12-17 08:41:54', '2025-12-17 08:41:54'),
(99, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2550.00, 1950.00, 414.99, 2, 1, '2025-12-17 08:52:17', '2025-12-17 08:52:17'),
(100, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 1500.00, 3000.00, 1464.99, 2, 1, '2025-12-18 01:29:46', '2025-12-18 01:29:46'),
(101, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2000.00, 2500.00, 964.99, 2, 1, '2025-12-18 01:29:52', '2025-12-18 01:29:52'),
(102, 24, 5000.00, 0.00, 0.00, 1000.00, 110.00, 3890.00, 4500.00, 0.00, 4500.00, -610.00, 1945.00, 2555.00, 410.00, 0.00, 2964.99, 2000.00, 2500.00, 964.99, 2, 1, '2025-12-18 01:32:29', '2025-12-18 01:32:29'),
(103, 44, 5500.00, 0.00, 0.00, 988.00, 110.00, 4402.00, 3000.00, 0.00, 3000.00, 1402.00, 2201.00, 799.00, 410.00, 0.00, 1208.99, 1500.00, 1500.00, -291.01, 2, 0, '2025-12-18 06:49:01', '2025-12-18 06:49:01'),
(104, 44, 5500.00, 0.00, 0.00, 988.00, 110.00, 4402.00, 3000.00, 0.00, 3000.00, 1402.00, 2201.00, 799.00, 410.00, 0.00, 1208.99, 1200.00, 1800.00, 8.99, 2, 1, '2025-12-18 06:49:06', '2025-12-18 06:49:06'),
(105, 9, 5500.00, 0.00, 0.00, 899.00, 110.00, 4491.00, 4500.00, 0.00, 4500.00, -9.00, 2245.50, 2254.50, 410.00, 0.00, 2664.49, 2000.00, 2500.00, 664.49, 2, 1, '2025-12-18 07:35:04', '2025-12-18 07:35:04'),
(106, 24, 5000.00, 0.00, 0.00, 998.00, 110.00, 3892.00, 4500.00, 0.00, 4500.00, -608.00, 1946.00, 2554.00, 410.00, 0.00, 2963.99, 1500.00, 3000.00, 1463.99, 2, 1, '2025-12-19 00:43:48', '2025-12-19 00:43:48'),
(107, 24, 5000.00, 0.00, 0.00, 998.00, 110.00, 3892.00, 4500.00, 0.00, 4500.00, -608.00, 1946.00, 2554.00, 410.00, 0.00, 2963.99, 1500.00, 3000.00, 1463.99, 2, 1, '2025-12-19 00:45:08', '2025-12-19 00:45:08'),
(108, 24, 5000.00, 0.00, 0.00, 998.00, 110.00, 3892.00, 4999.00, 0.00, 4999.00, -1107.00, 1946.00, 3053.00, 410.00, 0.00, 3462.99, 1500.00, 3499.00, 1962.99, 2, 1, '2025-12-19 00:54:10', '2025-12-19 00:54:10'),
(109, 24, 5000.00, 0.00, 0.00, 998.00, 110.00, 3892.00, 4500.00, 0.00, 4500.00, -608.00, 1946.00, 2554.00, 410.00, 0.00, 2963.99, 1500.00, 3000.00, 1463.99, 2, 1, '2025-12-19 00:56:12', '2025-12-19 00:56:12'),
(110, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:27', '2025-12-19 01:02:27'),
(111, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:31', '2025-12-19 01:02:31'),
(112, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:34', '2025-12-19 01:02:34'),
(113, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:35', '2025-12-19 01:02:35'),
(114, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:37', '2025-12-19 01:02:37'),
(115, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:02:40', '2025-12-19 01:02:40'),
(116, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:03:37', '2025-12-19 01:03:37'),
(117, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:03:39', '2025-12-19 01:03:39'),
(118, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:03:44', '2025-12-19 01:03:44'),
(119, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:03:45', '2025-12-19 01:03:45'),
(120, 24, 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 4500.00, 0.00, 4500.00, 500.00, 2500.00, 2000.00, 0.00, 0.00, 1999.99, 0.00, 4500.00, 1999.99, 2, 1, '2025-12-19 01:07:51', '2025-12-19 01:07:51'),
(121, 8, 1500.00, 0.00, 0.00, 990.00, 110.00, 400.00, 1450.00, 0.00, 1450.00, -1050.00, 200.00, 1250.00, 410.00, 0.00, 1659.99, 1700.00, -250.00, -40.01, 2, 0, '2025-12-22 02:10:19', '2025-12-22 02:10:19'),
(122, 8, 1500.00, 0.00, 0.00, 990.00, 110.00, 400.00, 1450.00, 0.00, 1450.00, -1050.00, 200.00, 1250.00, 410.00, 0.00, 1659.99, 1600.00, -150.00, 59.99, 2, 1, '2025-12-22 02:10:24', '2025-12-22 02:10:24'),
(123, 5, 1400.00, 0.00, 0.00, 990.00, 110.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1500.00, -200.00, 59.99, 2, 1, '2025-12-22 03:35:49', '2025-12-22 03:35:49'),
(124, 8, 1400.00, 0.00, 0.00, 990.00, 110.00, 300.00, 1300.00, 0.00, 1300.00, -1000.00, 150.00, 1150.00, 410.00, 0.00, 1559.99, 1500.00, -200.00, 59.99, 2, 1, '2025-12-22 03:38:50', '2025-12-22 03:38:50'),
(125, 5, 1400.00, 0.00, 0.00, 998.00, 110.00, 292.00, 1350.00, 0.00, 1350.00, -1058.00, 146.00, 1204.00, 455.00, 0.00, 1658.99, 1800.00, -450.00, -141.01, 2, 0, '2025-12-22 05:02:06', '2025-12-22 05:02:06'),
(126, 5, 1400.00, 0.00, 0.00, 998.00, 110.00, 292.00, 1350.00, 0.00, 1350.00, -1058.00, 146.00, 1204.00, 455.00, 0.00, 1658.99, 1600.00, -250.00, 58.99, 2, 1, '2025-12-22 05:02:12', '2025-12-22 05:02:12'),
(127, 5, 1400.00, 0.00, 0.00, 1100.00, 110.00, 190.00, 1350.00, 0.00, 1350.00, -1160.00, 95.00, 1255.00, 455.00, 0.00, 1709.99, 1500.00, -150.00, 209.99, 2, 1, '2025-12-22 05:31:52', '2025-12-22 05:31:52'),
(128, 44, 5500.00, 0.00, 0.00, 1000.00, 110.00, 4390.00, 3000.00, 0.00, 3000.00, 1390.00, 2195.00, 805.00, 410.00, 0.00, 1214.99, 1500.00, 1500.00, -285.01, 2, 0, '2025-12-23 04:45:23', '2025-12-23 04:45:23'),
(129, 44, 5500.00, 0.00, 0.00, 1000.00, 110.00, 4390.00, 3000.00, 0.00, 3000.00, 1390.00, 2195.00, 805.00, 410.00, 0.00, 1214.99, 1200.00, 1800.00, 14.99, 2, 1, '2025-12-23 04:45:27', '2025-12-23 04:45:27'),
(130, 44, 5500.00, 0.00, 0.00, 1000.00, 110.00, 4390.00, 3000.00, 0.00, 3000.00, 1390.00, 2195.00, 805.00, 410.00, 0.00, 1214.99, 2500.00, 500.00, -1285.01, 2, 0, '2026-01-05 05:56:22', '2026-01-05 05:56:22'),
(131, 46, 6000.00, 0.00, 0.00, 1000.00, 110.00, 4890.00, 5000.00, 0.00, 5000.00, -110.00, 2445.00, 2555.00, 410.00, 0.00, 2964.99, 1200.00, 3800.00, 1764.99, 2, 1, '2026-01-09 01:13:55', '2026-01-09 01:13:55'),
(132, 46, 6000.00, 0.00, 0.00, 1000.00, 110.00, 4890.00, 5000.00, 0.00, 5000.00, -110.00, 2445.00, 2555.00, 410.00, 0.00, 2964.99, 2500.00, 2500.00, 464.99, 2, 1, '2026-01-09 01:14:02', '2026-01-09 01:14:02'),
(133, 46, 6000.00, 0.00, 0.00, 1000.00, 110.00, 4890.00, 5000.00, 0.00, 5000.00, -110.00, 2445.00, 2555.00, 410.00, 0.00, 2964.99, 3000.00, 2000.00, -35.01, 2, 0, '2026-01-09 01:14:18', '2026-01-09 01:14:18'),
(134, 46, 6000.00, 0.00, 0.00, 1000.00, 110.00, 4890.00, 5000.00, 0.00, 5000.00, -110.00, 2445.00, 2555.00, 410.00, 0.00, 2964.99, 2500.00, 2500.00, 464.99, 2, 1, '2026-01-09 01:14:25', '2026-01-09 01:14:25'),
(135, 47, 5500.00, 0.00, 0.00, 1000.00, 110.00, 4390.00, 5000.00, 0.00, 5000.00, -610.00, 2195.00, 2805.00, 410.00, 0.00, 3214.99, 2500.00, 2500.00, 714.99, 2, 1, '2026-01-09 02:53:53', '2026-01-09 02:53:53'),
(136, 11, 1000.00, 0.00, 0.00, 0.00, 0.00, 1000.00, 800.00, 0.00, 800.00, 200.00, 500.00, 300.00, 0.00, 0.00, 299.99, 300.00, 500.00, -0.01, 2, 0, '2026-01-12 03:40:45', '2026-01-12 03:40:45'),
(137, 11, 1000.00, 0.00, 0.00, 0.00, 0.00, 1000.00, 800.00, 0.00, 800.00, 200.00, 500.00, 300.00, 0.00, 0.00, 299.99, 299.00, 501.00, 0.99, 2, 1, '2026-01-12 03:40:57', '2026-01-12 03:40:57'),
(138, 44, 1000.00, 0.00, 0.00, 0.00, 0.00, 1000.00, 800.00, 0.00, 800.00, 200.00, 500.00, 300.00, 0.00, 0.00, 299.99, 300.00, 500.00, -0.01, 2, 0, '2026-01-12 06:19:03', '2026-01-12 06:19:03');

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doc_key` varchar(255) NOT NULL,
  `doc_name` varchar(255) NOT NULL,
  `min_size_kb` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `max_size_kb` int(10) UNSIGNED NOT NULL DEFAULT 20480,
  `is_required` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 = mandatory, 0 = optional',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `document_types`
--

INSERT INTO `document_types` (`id`, `doc_key`, `doc_name`, `min_size_kb`, `max_size_kb`, `is_required`, `active`, `created_at`, `updated_at`) VALUES
(1, 'ID', 'Identity Document', 10, 20480, 1, 1, NULL, NULL),
(2, 'Payslip', 'Payslip', 10, 20480, 1, 1, NULL, NULL),
(3, 'BankStatement', 'Bank Statement', 10, 20480, 1, 1, NULL, NULL),
(4, 'EmploymentLetter', 'Employment Letter', 10, 20480, 1, 1, NULL, NULL),
(5, 'ResumptionSheet', 'Resumption Sheet', 10, 20480, 0, 1, NULL, NULL),
(6, 'ISDA_Signed', 'ISDA Signed', 10, 20480, 1, 1, NULL, NULL),
(7, 'LoanForm_Scanned', 'Loan Form (Scanned)', 10, 20480, 1, 1, NULL, NULL),
(10, 'Signature', 'Signature', 20, 200, 1, 1, '2026-01-09 02:38:24', '2026-01-09 02:38:24');

-- --------------------------------------------------------

--
-- Table structure for table `document_upload`
--

CREATE TABLE `document_upload` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `doc_type` varchar(100) DEFAULT 'Other',
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_by_user_id` int(11) NOT NULL DEFAULT 0,
  `uploaded_on` datetime NOT NULL DEFAULT current_timestamp(),
  `verified_by` int(11) DEFAULT 0,
  `verified_on` datetime DEFAULT NULL,
  `verification_status` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `rejected_on` timestamp NULL DEFAULT NULL,
  `rejected_by_user_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `rejection_reason_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `has_reuploaded_after_rejection` tinyint(4) NOT NULL DEFAULT 0,
  `reupload_date` timestamp NULL DEFAULT NULL,
  `reuploaded_by_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `document_upload`
--

INSERT INTO `document_upload` (`id`, `loan_id`, `customer_id`, `doc_type`, `file_name`, `file_path`, `uploaded_by`, `uploaded_by_user_id`, `uploaded_on`, `verified_by`, `verified_on`, `verification_status`, `rejected_on`, `rejected_by_user_id`, `rejection_reason_id`, `has_reuploaded_after_rejection`, `reupload_date`, `reuploaded_by_id`, `notes`, `created_at`, `updated_at`) VALUES
(1, 5, 11, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/mLMtlcbIS3pkeb70pJD1RFDuui8TmIvw2MW7zUKH.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 06:43:38', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 01:13:38', '2025-10-22 01:13:38'),
(2, 5, 11, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/GCfDQHXyqoM4PgAPqIg5Mc3DvNhqK7BRbPW64B4u.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 07:36:11', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 02:06:11', '2025-10-22 02:06:11'),
(3, 6, 12, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/iYBnPhzKCiIN7h03cB9yccoj48fLH7RbYaq1LRAC.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 07:46:05', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 02:16:05', '2025-10-22 02:16:05'),
(4, 9, 15, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/mCykGxirVQbBfiMIaf5xDQ6OX50HKedwfJrp5jKE.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 08:07:45', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 02:37:45', '2025-10-22 02:37:45'),
(5, 10, 16, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/qaNaFcFYdKUYIWRTgaDnOocMvFL9kda6Qo3HMNg8.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 08:19:15', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 02:49:15', '2025-10-22 02:49:15'),
(6, 11, 17, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/METs15Hnj4jEQydamIFjy2fhRD4MgqtNdhAPUK6A.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 12:02:58', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-22 06:32:58', '2025-10-22 06:32:58'),
(7, 14, 2, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/yr10qZmMjkWCqgh9WdJmiSmPxKvYxh1EfRh3WqTy.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:41', 1, '2025-11-03 11:28:20', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:41', '2025-11-03 05:58:20'),
(8, 14, 2, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/1828sO3VbW7gUC0kjcEIUNc5WKt0ihwK6KEKs4Bw.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:41', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:41', '2025-10-31 03:47:41'),
(9, 14, 2, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/Eb5pxJqQzjDHB6VBrJb9vgmP9iJxGmReGMKLjqM6.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:42', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:42', '2025-10-31 03:47:42'),
(10, 14, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/wKKCbb0fLk3VbkTncUEnsnytHWdDgJS9OBM0USLk.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:43', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:43', '2025-10-31 03:47:43'),
(11, 14, 2, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/Q8ZEFd3ZN6ciU7Wamcn7k38MT4Vn1RWKbhNH8PbQ.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:44', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:44', '2025-10-31 03:47:44'),
(12, 14, 2, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/SqIJRCmq4y223YqaxehbD51SRe5o8UC7ada0Bcqt.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:45', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:45', '2025-10-31 03:47:45'),
(13, 14, 2, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/LSQF2Z1wNhBKklRrKaMF8ovj5hB3G1P7elBY6pKC.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:45', NULL, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-10-31 03:47:45', '2025-10-31 03:47:45'),
(14, 15, 2, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/6BOYus07TBiNEC9g9IsVzp3fvz1sn6NmnWnqM2YI.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:11', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:11', '2025-11-04 00:50:11'),
(15, 15, 2, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/IhGuMQMa0dYT672kyx5t2zo1X5PtQU3La9a9JTRf.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:12', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:12', '2025-11-04 00:50:12'),
(16, 15, 2, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/zbxQgogKs1uEwk8mjR6YG2hElCtByP3C8QEcgLEf.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:13', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:13', '2025-11-04 00:50:13'),
(17, 15, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Eof4K3bk6XAAbLlRyx65E3iqrYyDMbdIOrLAq51w.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:14', '2025-11-04 00:50:14'),
(18, 15, 2, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/IrTqwo0h890JUom3jJqpVOrGZhoZhw9yFQGyCYE5.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:14', '2025-11-04 00:50:14'),
(19, 15, 2, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/QsQk6oHEASdSqbdFK5AclqrYld33dU70KUjMCUUB.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:15', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:15', '2025-11-04 00:50:15'),
(20, 15, 2, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/4NmH7MZzwSGiUR9d83wY06bzMNuW4Hk4HWmkxw9i.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:16', 1, '2025-11-05 11:16:17', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 00:50:16', '2025-11-05 05:46:17'),
(21, 22, 22, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/lq8sCd4JcDbM1ID38sKyZu7USCzJrIOPc8pTG3BI.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:27', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:27', '2025-11-04 06:03:27'),
(22, 22, 22, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/CW5ST0IxIpmM5pUunqLVtsGP2geETeriuJZIgUNm.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:28', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:28', '2025-11-04 06:03:28'),
(23, 22, 22, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/b9MTkYyYbLqwsg1uL39zqhlTA3gHwgfqzLCDNiwX.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:29', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:29', '2025-11-04 06:03:29'),
(24, 22, 22, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/TSEb1yRnkSBc9Qh3xYPQHIjecCm59Ak31irnOtIR.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:30', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:30', '2025-11-04 06:03:30'),
(25, 22, 22, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/UuZ38FW1B9ZVQaY3eWb399QY36OSnpw9vo4QtrfH.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:31', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:31', '2025-11-04 06:03:31'),
(26, 22, 22, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/VlRPKSZF4keRtX4ijUtDYx1cPSiWIAD7iYHOfWht.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:31', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:31', '2025-11-04 06:03:31'),
(27, 22, 22, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/ujBhbT6vzDqSb614tMW9f91wKRV7Iu5NKmo6vRV1.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:32', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:03:32', '2025-11-04 06:03:32'),
(28, 24, 4, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/5Xw4DfvxbMoYTkojgvz0InWzHtDjFhhDa9jnFUQ9.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:16', 1, '2025-11-04 12:14:57', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:16', '2025-11-04 06:44:57'),
(29, 24, 4, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/E7IFPWYRQOWGyMVKgrng2ByjrLNTi2mjvspOeobh.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:17', 1, '2025-11-05 11:07:18', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:17', '2025-11-05 05:37:18'),
(30, 24, 4, 'BankStatement', 'education_format.pdf', 'uploads/documents/JyMz9yAgT7veQegdsWdJcnfhRur5f9OJZXoZx1Ys.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:18', 1, '2025-11-05 12:41:34', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:18', '2025-11-05 07:11:34'),
(31, 24, 4, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/GReZwDmB0mxqF73t90O2WszLFowgnkTReQDpfEUN.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:18', 1, '2025-11-11 12:12:10', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:18', '2025-11-11 06:42:10'),
(32, 24, 4, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/8TmgOBjMZYC52eCibAF8byMPGqAp621bBHYU2VTu.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:19', 1, '2025-11-11 12:12:12', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:19', '2025-11-11 06:42:12'),
(33, 24, 4, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/SMFuDYYOGmIPYBnW3mKtPxgcaPMp3SlTkYj0VPAr.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:20', 1, '2025-11-11 12:12:13', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:20', '2025-11-11 06:42:13'),
(34, 24, 4, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/4mpNa2BoFew6GWBcecXKUWaWtiggPI5AO4wiLucL.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:21', 1, '2025-11-11 12:12:14', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-04 06:39:21', '2025-11-11 06:42:14'),
(35, 25, 3, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/SrdUmbeb9wx8sk0gAwSR48q3M2D7BkdX7mWjJ94h.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:03', 1, '2025-11-11 12:07:20', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:03', '2025-11-11 06:37:20'),
(36, 25, 3, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/MHxGGG1aVDvpU6wrNodD1DM5RclMRuW8agK9fFPJ.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:04', 1, '2025-11-11 12:07:21', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:04', '2025-11-11 06:37:21'),
(37, 25, 3, 'BankStatement', 'education_format.pdf', 'uploads/documents/4hcIREKHASfCpaahZE34qYp9VYWjo9IcRWw0qcKO.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:05', 1, '2025-11-11 12:07:22', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:05', '2025-11-11 06:37:22'),
(38, 25, 3, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/AH7Qj7YzmFdWWKqcJzJTB2A42475rKcsMljCDiEL.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:05', 1, '2025-11-11 12:07:22', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:05', '2025-11-11 06:37:22'),
(39, 25, 3, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/1pkRPIDgiDrfgbIUDTXg5m8YXbk9Rnt9zW3ATZqG.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:06', 1, '2025-11-11 12:07:23', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:06', '2025-11-11 06:37:23'),
(40, 25, 3, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/gxOGZSv3lpG217UArElQtvNA7jYJdjvwVPyA4F3k.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:07', 1, '2025-11-11 12:07:24', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:07', '2025-11-11 06:37:24'),
(41, 25, 3, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/W9ojAbdLoOJhXoKqCuuc3t9YT1liSnpMaz7LoeEm.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:07', 1, '2025-11-11 12:07:24', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-05 22:50:07', '2025-11-11 06:37:24'),
(42, 26, 2, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/VWIFAtlnFZiWelrVsHMX109J4GCKuRve5TzCMg1P.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:12', 1, '2025-11-10 06:36:29', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:12', '2025-11-10 01:06:29'),
(43, 26, 2, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/fZPGqQA39UoVWI0wzeYPqT8StwXsK9DvwWdZ7gJT.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:14', 1, '2025-11-10 06:36:31', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:14', '2025-11-10 01:06:31'),
(44, 26, 2, 'BankStatement', 'education_format.pdf', 'uploads/documents/ZSpqMdDWkpDNqnZs5alVEMogHIjErIr3TNTBMq81.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:15', 1, '2025-11-10 06:36:32', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:15', '2025-11-10 01:06:32'),
(45, 26, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/CfI3SNHTGstjM8T4Zz7T0DyyXbS529BdMZYYmUp1.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:15', 1, '2025-11-10 06:36:32', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:15', '2025-11-10 01:06:32'),
(46, 26, 2, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/Xu9NfKvzdJroTNop8UZznx90eOfEd7MZ8VYO3Fwt.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:16', 1, '2025-11-10 06:36:33', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:16', '2025-11-10 01:06:33'),
(47, 26, 2, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/7uc7YsHYL3qVn5PdL8oLLFREcXdz5phSw4nbicBm.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:17', 1, '2025-11-10 06:36:33', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:17', '2025-11-10 01:06:33'),
(48, 26, 2, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/DDCWpVUqsvf17rr5iXSbZ1LZ5FKURUNTvm58lQCE.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:17', 1, '2025-11-10 06:36:34', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-10 01:03:17', '2025-11-10 01:06:34'),
(49, 16, 10, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/Z1BMDAoPzzg4wsE29jPHjL7EYv3bBIkkSQE06Hb2.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:49', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:49', '2025-11-11 03:43:49'),
(50, 16, 10, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/JbJDPocVveV8Ms3OQeQnXcNexXScy2fPXJ6nlrEb.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:50', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:50', '2025-11-11 03:43:50'),
(51, 16, 10, 'BankStatement', 'education_format.pdf', 'uploads/documents/PpwVzSvsRiq7Alf99NhoGafBovjwafQBfWdtuq6c.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:51', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:51', '2025-11-11 03:43:51'),
(52, 16, 10, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/BhtWu0W8dF9LhlzlfK3geoyzY8G9aehcyvhHzphV.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:52', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:52', '2025-11-11 03:43:52'),
(53, 16, 10, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/1HDTsOPRm9zAI1h5qn2CI6p4n0DOVVnQigY6iz6w.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:52', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:52', '2025-11-11 03:43:52'),
(54, 16, 10, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/aosucM4SyaVnhZcrP5E9EEralTRX6UnGW0nbBRQ5.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:53', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:53', '2025-11-11 03:43:53'),
(55, 16, 10, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/COUIyeDZA465AH8BBcAxI4kWtZFNhgrFaE26yvRu.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:54', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-11 03:43:54', '2025-11-11 03:43:54'),
(56, 27, 24, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/ZJktJ6WgNwfHtSr8osggvQYF0IGObIRWRL7LsiLP.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:55', 1, '2025-11-12 06:11:39', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:39:55', '2025-11-12 00:41:39'),
(57, 27, 24, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/r4XB1RqOZyZ3iaqq2gK0LAibQSKVid20VTPPc1NE.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:56', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:39:56', '2025-11-12 00:39:56'),
(58, 27, 24, 'BankStatement', 'education_format.pdf', 'uploads/documents/Hj2zbjFbe3JC9cx03NSZ6eg34nm9eF7vefPSlLEY.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:57', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:39:57', '2025-11-12 00:39:57'),
(59, 27, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/cpWppHOCrbLBghqvo2Sj9081vWt9imy5RsqQaopd.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:58', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:39:58', '2025-11-12 00:39:58'),
(60, 27, 24, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/NWTpNmYP7BQLU8Xx6mb6ec6Gt8rk9kS0HLAT2dJK.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:59', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:39:59', '2025-11-12 00:39:59'),
(61, 27, 24, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/bbgju4q5TygcXYAAvqUfo6fnbpe3Jk3FzHYGpvzj.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:10:00', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:40:00', '2025-11-12 00:40:00'),
(62, 27, 24, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/f0ZPtKlLRFOvds8lRZoHg4HOhXD5SiBuswYYPYuo.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:10:01', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-12 00:40:01', '2025-11-12 00:40:01'),
(63, 29, 27, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/ozCx2XfRhRyH2jiQbhmKmno1Z4APx33iRSYrlQOR.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:03', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:03', '2025-11-19 01:46:03'),
(64, 29, 27, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/dEJ6yAjBFYp9ynupWxWbYQdQe5moBZLmYT9v98i9.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:03', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:03', '2025-11-19 01:46:03'),
(65, 29, 27, 'BankStatement', 'education_format.pdf', 'uploads/documents/qrfHwST8TXoOxlGkduFRk8RYbFDNId4BtE8X0fYP.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:04', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:04', '2025-11-19 01:46:04'),
(66, 29, 27, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/rtP3hEt6U53qeApxXHfIWgSVJPXiPkkoXCCNKity.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:05', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:05', '2025-11-19 01:46:05'),
(67, 29, 27, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/bjgaBXnRep4phFASyW1ChloiXFASfb2BTuIVTuTl.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:06', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:06', '2025-11-19 01:46:06'),
(68, 29, 27, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/SLwUqczh60VF6KPp05xhI0ovzfIHR45Z7fqOdNL8.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:07', '2025-11-19 01:46:07'),
(69, 29, 27, 'LoanForm_Scanned', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/W7g5VgORmzTy8sPTUIxxU6fffoDKKUhIA6335vYm.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-19 01:46:08', '2025-11-19 01:46:08'),
(70, 30, 28, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/q0zf3rJIsObzM6UsOTVMCzyfGH2dpzcBLLJf2SlB.pdf', 'user', 2, '2025-11-24 07:38:04', 1, '2025-11-24 07:42:03', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:04', '2025-11-24 02:12:03'),
(71, 30, 28, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/zr4ubiRCgCj9oDBQKqgTEBdi43m0Xf7bR8gc3ur4.pdf', 'user', 2, '2025-11-24 07:38:06', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:06', '2025-11-24 02:08:06'),
(72, 30, 28, 'BankStatement', 'education_format.pdf', 'uploads/documents/tx8ybbRYaAgRYHeRZVDfCGs4SoQeyYefRBSq7r5S.pdf', 'user', 2, '2025-11-24 07:38:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:07', '2025-11-24 02:08:07'),
(73, 30, 28, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/yBofDlzFLDi1qx1hrnT7NYPdDpZ3hDxV3mx3HX8B.pdf', 'user', 2, '2025-11-24 07:38:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:07', '2025-11-24 02:08:07'),
(74, 30, 28, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/RIkUS43c1zst8N04oyzNNPhiMzwztAHAWI7nkep4.pdf', 'user', 2, '2025-11-24 07:38:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:08', '2025-11-24 02:08:08'),
(75, 30, 28, 'ISDA_Signed', 'health_format.pdf', 'uploads/documents/oBvf6YMN6qsx6TWPUKi2vWu0MGM7rM1Q7IqNljt3.pdf', 'user', 2, '2025-11-24 07:38:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:09', '2025-11-24 02:08:09'),
(76, 30, 28, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/rDBBpoD8fXKCkXbj52sBeGmxTbTjI6p9GC1WGcuK.pdf', 'user', 2, '2025-11-24 07:38:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-24 02:08:10', '2025-11-24 02:08:10'),
(77, 32, 30, 'ID', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/gZgklwLc419OzmhYsKuIvHcUw86rJpqyFSzyuWRL.pdf', 'user', 2, '2025-11-25 06:24:52', 1, '2025-11-27 05:09:50', 'Verified', '2025-11-25 04:49:55', 1, 0, 1, '2025-11-26 23:37:08', 2, NULL, '2025-11-25 00:54:52', '2025-11-26 23:39:50'),
(78, 32, 30, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/Tto1oA2P4Edej7zbYdDcXgklTUflIuC24AHG4OHm.pdf', 'user', 2, '2025-11-25 06:24:53', 1, '2025-11-27 05:09:53', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:53', '2025-11-26 23:39:53'),
(79, 32, 30, 'BankStatement', 'education_format.pdf', 'uploads/documents/fFqi7fQLgeNqelmoHlo4PKWtcALKLpRpaQ8WmBau.pdf', 'user', 2, '2025-11-25 06:24:54', 1, '2025-11-27 05:09:54', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:54', '2025-11-26 23:39:54'),
(80, 32, 30, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/GbByrO1nf1ZrGI5IedcxiBfOC2qVs2SGUoiwSU1w.pdf', 'user', 2, '2025-11-25 06:24:55', 1, '2025-11-27 05:09:55', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:55', '2025-11-26 23:39:55'),
(81, 32, 30, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/ZhwIjY6nFbXejvQ8hOmBO9UoWdvSRyZWnLJqumrX.pdf', 'user', 2, '2025-11-25 06:24:55', 1, '2025-11-27 05:09:56', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:55', '2025-11-26 23:39:56'),
(82, 32, 30, 'LoanForm_Scanned', 'Loan Management System.pdf', 'uploads/documents/X9xk1iGf4YzZWRC8tx7UIDd2lyKAsjTtJvBjjjQK.pdf', 'user', 2, '2025-11-25 06:24:56', 1, '2025-11-27 05:09:57', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:56', '2025-11-26 23:39:57'),
(83, 32, 30, 'ISDA_Signed', 'loan-process-details.pdf', 'uploads/documents/H4ZVgT3J5xfKuJRxmwWkmxwQ5ng53cGETMTZf9nr.pdf', 'user', 2, '2025-11-25 06:24:57', 1, '2025-11-27 05:09:59', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-25 00:54:57', '2025-11-26 23:39:59'),
(84, 31, 29, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/r1S8QcfgWckNPaCNJQqgh2PdGeNXSnBsXC9tCiIS.pdf', 'user', 2, '2025-11-28 09:05:20', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:20', '2025-11-28 03:35:20'),
(85, 31, 29, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/U5YthYoitOEG7VTmKbHMAHAVUgw9gTYhxkFH3av9.pdf', 'user', 2, '2025-11-28 09:05:21', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:21', '2025-11-28 03:35:21'),
(86, 31, 29, 'BankStatement', 'education_format.pdf', 'uploads/documents/6kELxYtRwDcWl8EAJvSqStCFBJZy6iNBAeFx8DUE.pdf', 'user', 2, '2025-11-28 09:05:22', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:22', '2025-11-28 03:35:22'),
(87, 31, 29, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/BJ33puRXDibNEIx1J3T2ceWdnWoTyzIC69cLoxvw.pdf', 'user', 2, '2025-11-28 09:05:23', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:23', '2025-11-28 03:35:23'),
(88, 31, 29, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/ZhvUyo8S8QY2ltcrJ1mVGRmK3hICD35UGixaiyxW.pdf', 'user', 2, '2025-11-28 09:05:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:24', '2025-11-28 03:35:24'),
(89, 31, 29, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/RWp5QNYqia79A0nkHdaOVhZl4iWLDVtweDo7wB1o.pdf', 'user', 2, '2025-11-28 09:05:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:24', '2025-11-28 03:35:24'),
(90, 31, 29, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/GgNoIIE0Izupr1AbWxkFKxEDfJolkE1fTcP9aqUO.pdf', 'user', 2, '2025-11-28 09:05:25', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 03:35:25', '2025-11-28 03:35:25'),
(91, 34, 32, 'ID', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ceboIUoL9wR0iVjkd77R8Ivdn4E3zkHXCBgp389c.pdf', 'Normal User', 2, '2025-11-28 11:29:33', 1, '2025-11-28 11:34:39', 'Rejected', '2025-12-03 07:01:47', 1, 2, 1, '2025-12-01 01:37:26', 2, NULL, '2025-11-28 05:59:33', '2025-12-03 07:01:47'),
(92, 34, 32, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/iv7UymLqvPGoRRxeQf8c7rEqLG2AV0WV5et8LKFp.pdf', 'Normal User', 2, '2025-11-28 11:29:35', 1, '2025-11-28 11:34:39', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 05:59:35', '2025-11-28 06:04:39'),
(93, 34, 32, 'BankStatement', 'health_format.pdf', 'uploads/documents/tTVXuAY20jwdvbwHOpRraz6M2UbymFOmi3f8lZz8.pdf', 'Normal User', 2, '2025-11-28 11:29:35', 1, '2025-11-28 11:34:41', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 05:59:35', '2025-11-28 06:04:41'),
(94, 34, 32, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/wtMJ7BQAwB4YCnW8kE1ZzRoBMK6lx2cVw2KKR1DW.pdf', 'Normal User', 2, '2025-11-28 11:29:37', 1, '2025-11-28 11:34:42', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 05:59:37', '2025-11-28 06:04:42'),
(95, 34, 32, 'ResumptionSheet', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/xzjYmWzh6sTAiciL1Eklt64Tw1giFojX5KCd9vWS.pdf', 'Normal User', 2, '2025-11-28 11:29:38', 1, '2025-11-28 11:38:36', 'Verified', '2025-11-28 06:04:47', 1, 0, 1, '2025-11-28 06:08:20', 2, NULL, '2025-11-28 05:59:38', '2025-11-28 06:08:36'),
(96, 34, 32, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/jTu6v5zwNvqIHfQEWNyPkPwBx4w3Vf1VPv7CRoWh.pdf', 'Normal User', 2, '2025-11-28 11:29:40', 1, '2025-11-28 11:34:53', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-11-28 05:59:40', '2025-11-28 06:04:53'),
(97, 34, 32, 'LoanForm_Scanned', 'eligibility_check_formula.pdf', 'uploads/documents/JlxCOqdb6BAtUBIAEhalqGIaim1h0xzjZMdDmWiF.pdf', 'Normal User', 2, '2025-11-28 11:29:41', 1, '2025-11-28 11:34:55', 'Pending', NULL, 0, 0, 1, '2025-11-28 06:09:45', 2, NULL, '2025-11-28 05:59:41', '2025-11-28 06:09:45'),
(98, 35, 33, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/UtvUZrB7F7MB8SUIhsV9ORtYCn0HRnev2kIvEfXp.pdf', 'Normal User', 2, '2025-12-01 08:13:41', 1, '2025-12-01 08:15:23', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:41', '2025-12-01 02:45:23'),
(99, 35, 33, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/NMkeahpUwNsmVipts9VgGefbtvFSsCiZ4cWDeX0f.pdf', 'Normal User', 2, '2025-12-01 08:13:43', 1, '2025-12-01 08:15:27', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:43', '2025-12-01 02:45:27'),
(100, 35, 33, 'BankStatement', 'education_format.pdf', 'uploads/documents/ZKi3XDECj6xTAdYa0Fr40l2oWjGkBMy6t2MXGq7k.pdf', 'Normal User', 2, '2025-12-01 08:13:44', 1, '2025-12-01 08:18:31', 'Verified', '2025-12-01 02:46:39', 1, 0, 1, '2025-12-01 02:47:52', 2, NULL, '2025-12-01 02:43:44', '2025-12-01 02:48:31'),
(101, 35, 33, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/H80NLu4nAB4qnbO6qRwca2MqbTnAWgLIeaLUjASj.pdf', 'Normal User', 2, '2025-12-01 08:13:46', 1, '2025-12-01 08:16:52', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:46', '2025-12-01 02:46:52'),
(102, 35, 33, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/eo6QIhutYHKeybOM8v0RQB7Y9kHDWkGPiweVJV2H.pdf', 'Normal User', 2, '2025-12-01 08:13:47', 1, '2025-12-01 08:16:54', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:47', '2025-12-01 02:46:54'),
(103, 35, 33, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/sK3PSjaxP122HcEN0WpwPTxygXNkyOOEgLy0gRpz.pdf', 'Normal User', 2, '2025-12-01 08:13:49', 1, '2025-12-01 08:16:55', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:49', '2025-12-01 02:46:55'),
(104, 35, 33, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/k1frww3qxOUbxeJgPvoxWuDXtiWSq5xWWDtm0bhv.pdf', 'Normal User', 2, '2025-12-01 08:13:50', 1, '2025-12-01 08:16:57', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:43:50', '2025-12-01 02:46:57'),
(105, 36, 34, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/zcJ1KZON6pXxbbX95e4URKq9gbjVgnalqCO4MObz.pdf', 'Normal User', 2, '2025-12-01 08:27:05', 0, NULL, 'Rejected', '2025-12-01 02:59:27', 1, 1, 0, NULL, 0, NULL, '2025-12-01 02:57:05', '2025-12-01 02:59:27'),
(106, 36, 34, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/MpiSboojGnSGFdgB59YjsJOgm0dlPjJ8nKuFLkkS.pdf', 'Normal User', 2, '2025-12-01 08:27:07', 0, NULL, 'Rejected', '2025-12-01 03:00:26', 1, 2, 0, NULL, 0, NULL, '2025-12-01 02:57:07', '2025-12-01 03:00:26'),
(107, 36, 34, 'BankStatement', 'education_format.pdf', 'uploads/documents/AtOj6RC7xgAdeNtljel1QZ3OT9NDR6PlYcLGWcXQ.pdf', 'Normal User', 2, '2025-12-01 08:27:08', 0, NULL, 'Rejected', '2025-12-01 03:00:31', 1, 2, 0, NULL, 0, NULL, '2025-12-01 02:57:08', '2025-12-01 03:00:31'),
(108, 36, 34, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/AwiQYN0GjGPvCoCyjsj69PkKhNfNGoXFqGEZf3wv.pdf', 'Normal User', 2, '2025-12-01 08:27:09', 1, '2025-12-01 08:30:40', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:57:09', '2025-12-01 03:00:40'),
(109, 36, 34, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/gBABTkkVvSUPN5snr55B5Zrxg6Aco84TJAFrbpaa.pdf', 'Normal User', 2, '2025-12-01 08:27:10', 1, '2025-12-01 08:30:44', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-01 02:57:10', '2025-12-01 03:00:44'),
(110, 36, 34, 'ISDA_Signed', 'health_format.pdf', 'uploads/documents/zmtVBDwRGV3OqeIlkIrl6kuj3imIwcXFHWGc5foF.pdf', 'Normal User', 2, '2025-12-01 08:27:11', 0, NULL, 'Rejected', '2025-12-01 03:00:51', 1, 2, 0, NULL, 0, NULL, '2025-12-01 02:57:11', '2025-12-01 03:00:51'),
(111, 36, 34, 'LoanForm_Scanned', 'Loan Management System.pdf', 'uploads/documents/9FIQsmv9v4fTTye5Oy6BCrlPo4HWzmukXjosJLKX.pdf', 'Normal User', 2, '2025-12-01 08:27:12', 0, NULL, 'Rejected', '2025-12-01 03:00:57', 1, 2, 0, NULL, 0, NULL, '2025-12-01 02:57:12', '2025-12-01 03:00:57'),
(112, 37, 22, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/GW839zVczmM9cUI612hccqfn4acvwiPPSvThbKya.pdf', 'Normal User', 2, '2025-12-11 13:34:36', 1, '2025-12-11 13:45:17', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 08:04:36', '2025-12-11 08:15:17'),
(113, 37, 22, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/otntKXhPYOSYek74E4BnjXM1e85ki4rXkF0koYIr.pdf', 'Normal User', 2, '2025-12-11 13:34:37', 0, NULL, 'Rejected', '2025-12-11 08:15:36', 1, 1, 0, NULL, 0, NULL, '2025-12-11 08:04:37', '2025-12-11 08:15:36'),
(114, 37, 22, 'BankStatement', 'education_format.pdf', 'uploads/documents/2ki0Am1aXmyAu4BxvWukN7gJd0PgGCIrzBRH50ux.pdf', 'Normal User', 2, '2025-12-11 13:34:38', 1, '2025-12-11 13:45:45', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 08:04:38', '2025-12-11 08:15:45'),
(115, 37, 22, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/R5z8jC0Ke5plIbT5i2SdIeEg2OwRPUR63zTyxFV4.pdf', 'Normal User', 2, '2025-12-11 13:34:39', 1, '2025-12-11 13:52:26', 'Verified', '2025-12-11 08:15:50', 1, 0, 1, '2025-12-11 08:21:52', 2, NULL, '2025-12-11 08:04:39', '2025-12-11 08:22:26'),
(116, 37, 22, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/28dNgxyLB5Ff6unuhMUAVPPZd7OlRBu6gUN2FLfE.pdf', 'Normal User', 2, '2025-12-11 13:34:39', 1, '2025-12-11 13:46:06', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 08:04:39', '2025-12-11 08:16:06'),
(117, 37, 22, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/nWuPF4mAvrRuIz3sIQ0FdQhmkxcwovfbfZs59NKq.pdf', 'Normal User', 2, '2025-12-11 13:34:40', 1, '2025-12-11 13:46:09', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 08:04:40', '2025-12-11 08:16:09'),
(118, 37, 22, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/zMtswzaPKeboyCZWXexbSDaUNK4zcb8xxII5FuZk.pdf', 'Normal User', 2, '2025-12-11 13:34:41', 1, '2025-12-11 13:52:51', 'Verified', '2025-12-11 08:16:28', 1, 0, 0, NULL, 0, NULL, '2025-12-11 08:04:41', '2025-12-11 08:22:51'),
(119, 38, 35, 'ID', 'Loan Management System.pdf', 'uploads/documents/rhglKpvJpGeH5CcCjIyHpX31jYjerPeeM2gjH3lq.pdf', 'Normal User', 2, '2025-12-12 04:32:05', 0, NULL, 'Pending', '2025-12-11 23:02:54', 1, 2, 1, '2025-12-11 23:07:17', 2, NULL, '2025-12-11 23:02:05', '2025-12-11 23:07:17'),
(120, 38, 35, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/dSK1r79IUooUpGptqQJkhu5sg3617XrKB5SukisV.pdf', 'Normal User', 2, '2025-12-12 04:32:06', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:06', '2025-12-11 23:02:06'),
(121, 38, 35, 'BankStatement', 'education_format.pdf', 'uploads/documents/WOyuDt8KBUjqPYu4oS9cpPjNNAxXO1HzQ4jeuotZ.pdf', 'Normal User', 2, '2025-12-12 04:32:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:07', '2025-12-11 23:02:07'),
(122, 38, 35, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/yYXr2ctWtqNG36SdN06UmBfnPZAjQoNBSdDu4YvG.pdf', 'Normal User', 2, '2025-12-12 04:32:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:08', '2025-12-11 23:02:08'),
(123, 38, 35, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/rAFm9aa0kdkB153eHHMItOjeQGl3CAk3vVMb3UuE.pdf', 'Normal User', 2, '2025-12-12 04:32:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:09', '2025-12-11 23:02:09'),
(124, 38, 35, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/1QZU3FBvtnzptwZTlylkM9CHMj4rbgT2xjeCwSfF.pdf', 'Normal User', 2, '2025-12-12 04:32:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:10', '2025-12-11 23:02:10'),
(125, 38, 35, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/3HV8P1yCS3mhIbnBMB4GR03PSD8QYK2971dHaNn4.pdf', 'Normal User', 2, '2025-12-12 04:32:11', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-11 23:02:11', '2025-12-11 23:02:11'),
(126, 39, 36, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/G4X8OybbWFG2SMTRQVIh0fHXCIb99Rht4DctbG10.pdf', 'Normal User', 2, '2025-12-12 07:39:30', 1, '2025-12-12 07:45:36', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-12 02:09:30', '2025-12-12 02:15:36'),
(127, 39, 36, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/0B61swxNLqM8YU7uscZ3h70b8Ep41Qev48woBfga.pdf', 'Normal User', 2, '2025-12-12 07:39:31', 1, '2025-12-12 07:45:38', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-12 02:09:31', '2025-12-12 02:15:38'),
(128, 39, 36, 'BankStatement', 'Loan Management System.pdf', 'uploads/documents/ez1UxAa46MLUY6LHbMrxTSWPIGAZ7FCksHIUnA0P.pdf', 'Normal User', 2, '2025-12-12 07:39:32', 1, '2025-12-12 07:49:14', 'Verified', '2025-12-12 02:16:07', 1, 0, 1, '2025-12-12 02:18:46', 2, NULL, '2025-12-12 02:09:32', '2025-12-12 02:19:14'),
(129, 39, 36, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/eqcpdtye1YiZBlHU0v3PeMIvKb5o2gPyWiWRVUF3.pdf', 'Normal User', 2, '2025-12-12 07:39:33', 0, NULL, 'Rejected', '2025-12-12 02:16:37', 1, 1, 0, NULL, 0, NULL, '2025-12-12 02:09:33', '2025-12-12 02:16:37'),
(130, 39, 36, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/Bc1YLtnMsBjnsovBlLbiswNEIKyGBaXAY3RNUfAv.pdf', 'Normal User', 2, '2025-12-12 07:39:34', 1, '2025-12-12 07:46:55', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-12 02:09:34', '2025-12-12 02:16:55'),
(131, 39, 36, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/EUVlRjYcN97cFBi3gC9pCauNmD46B0waJq2NXL1A.pdf', 'Normal User', 2, '2025-12-12 07:39:35', 1, '2025-12-12 07:46:57', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-12 02:09:35', '2025-12-12 02:16:57'),
(132, 39, 36, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/Hr9pkaQ8f1va78byoQCzJ9CFycp9GAiUuWSTYsBm.pdf', 'Normal User', 2, '2025-12-12 07:39:36', 1, '2025-12-12 07:46:59', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-12 02:09:36', '2025-12-12 02:16:59'),
(133, 40, 37, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/7OvXGLef6rKC5FVDDPv5NZM1lU4EOFKATboYNzi7.pdf', 'Normal User', 2, '2025-12-15 06:04:37', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:37', '2025-12-15 00:34:37'),
(134, 40, 37, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/q7Wvv2RZCVtBP8KFVIbchlniNIfq0ipxVPzcssfx.pdf', 'Normal User', 2, '2025-12-15 06:04:38', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:38', '2025-12-15 00:34:38'),
(135, 40, 37, 'BankStatement', 'education_format.pdf', 'uploads/documents/yZW420avNePaUF8GRAngqlspq0JpaORSu1huwsBD.pdf', 'Normal User', 2, '2025-12-15 06:04:39', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:39', '2025-12-15 00:34:39'),
(136, 40, 37, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/dZW22TGLBiyzbwEYsXfliJaRDyQC30zSWYxn773a.pdf', 'Normal User', 2, '2025-12-15 06:04:40', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:40', '2025-12-15 00:34:40'),
(137, 40, 37, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/AYN2OWfgpUm8jssxsP5M4d5trTPv14nhIckzm6kQ.pdf', 'Normal User', 2, '2025-12-15 06:04:41', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:41', '2025-12-15 00:34:41'),
(138, 40, 37, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/Tugi27E6sbtENhivYRN111hr8p4IZAOnPwRmqhnd.pdf', 'Normal User', 2, '2025-12-15 06:04:42', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:42', '2025-12-15 00:34:42'),
(139, 40, 37, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/lJGGjzvzW5FSZTFIMV5gjqxPLdtohnnUIR0JsHwb.pdf', 'Normal User', 2, '2025-12-15 06:04:43', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:34:43', '2025-12-15 00:34:43'),
(140, 41, 38, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/pTj4VnsVahT6QwodzuT7RHeC0FEJt9CJnALD6UYu.pdf', 'Normal User', 2, '2025-12-15 06:22:33', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:33', '2025-12-15 00:52:33'),
(141, 41, 38, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/YtNtytvHvFBg0Hie8y10sklA7ZQ8JOjEuimuM2Cg.pdf', 'Normal User', 2, '2025-12-15 06:22:34', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:34', '2025-12-15 00:52:34'),
(142, 41, 38, 'BankStatement', 'education_format.pdf', 'uploads/documents/WcDqkdg5nrwLYYAk9DlaMO503zRqUKk1gYRWn9Zq.pdf', 'Normal User', 2, '2025-12-15 06:22:35', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:35', '2025-12-15 00:52:35'),
(143, 41, 38, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/moDteYkN9S8rePHaxjlDCAMuc5IHF1tEImw8OEJ0.pdf', 'Normal User', 2, '2025-12-15 06:22:35', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:35', '2025-12-15 00:52:35'),
(144, 41, 38, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/8u7PtCODQaopHUAs2h0phDSOazwPHUIZeMm07Yb6.pdf', 'Normal User', 2, '2025-12-15 06:22:36', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:36', '2025-12-15 00:52:36'),
(145, 41, 38, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/m9JeZlfw6UwO4IK46RndHY2dC6r5RP5IDccxSw4b.pdf', 'Normal User', 2, '2025-12-15 06:22:37', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:37', '2025-12-15 00:52:37'),
(146, 41, 38, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/2TEugFkLH5KbDB3ooicMKaax7uNhvmVTudHqJpLE.pdf', 'Normal User', 2, '2025-12-15 06:22:38', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 00:52:38', '2025-12-15 00:52:38'),
(147, 42, 39, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/RsRKDQWqoL7AlpMzLA10IqC98rCO0ozSZjPTVeS4.pdf', 'Normal User', 2, '2025-12-15 08:13:45', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:45', '2025-12-15 02:43:45'),
(148, 42, 39, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/PhhVPgLoAEreSNGOzkRRn69hGeeseQIz5RtQWhrN.pdf', 'Normal User', 2, '2025-12-15 08:13:46', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:46', '2025-12-15 02:43:46'),
(149, 42, 39, 'BankStatement', 'education_format.pdf', 'uploads/documents/R1hpcN34yTMtXvxM4DEP28VBfAJD3hXVG1uFGnOs.pdf', 'Normal User', 2, '2025-12-15 08:13:47', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:47', '2025-12-15 02:43:47'),
(150, 42, 39, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/zV1mKx8fNzT0KwC2xJWDCNzMr2zKl0Vp7pupDbrw.pdf', 'Normal User', 2, '2025-12-15 08:13:47', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:47', '2025-12-15 02:43:47'),
(151, 42, 39, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/wSxVax9Uz5MB7XdRtp2vtnv28EHuy8ckkyzVtx5x.pdf', 'Normal User', 2, '2025-12-15 08:13:48', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:48', '2025-12-15 02:43:48'),
(152, 42, 39, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/AFByq5UXbmPwwk0WGpTyJOdFjd0pYfohRB7iBzyK.pdf', 'Normal User', 2, '2025-12-15 08:13:49', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:49', '2025-12-15 02:43:49'),
(153, 42, 39, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/CYAendTD9qRSQ9Rb1FVenKlHnM1vAebeOXAecybX.pdf', 'Normal User', 2, '2025-12-15 08:13:49', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 02:43:49', '2025-12-15 02:43:49'),
(154, 43, 40, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/xC9TnU0jFccICBdyKIDsMvudUdk3BYDKmyCnrkq7.pdf', 'Normal User', 2, '2025-12-15 10:58:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:09', '2025-12-15 05:28:09'),
(155, 43, 40, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/Gk4sGgVk6YdzRwG5lEo1qCRQ3ZOwlKjf5OOfm5Ek.pdf', 'Normal User', 2, '2025-12-15 10:58:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:10', '2025-12-15 05:28:10'),
(156, 43, 40, 'BankStatement', 'education_format.pdf', 'uploads/documents/rx0v9H8DFEe2JsP86ApB9p7gdwrxos22DUSwWPSD.pdf', 'Normal User', 2, '2025-12-15 10:58:11', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:11', '2025-12-15 05:28:11'),
(157, 43, 40, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Z6Z2u4IsG3fqnrAFtPp4Y6MXkzJnJKSZtZJJapgn.pdf', 'Normal User', 2, '2025-12-15 10:58:12', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:12', '2025-12-15 05:28:12'),
(158, 43, 40, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/x0PA8303x7IM7I66HdyHdj667AameQkkZQmijUfN.pdf', 'Normal User', 2, '2025-12-15 10:58:13', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:13', '2025-12-15 05:28:13'),
(159, 43, 40, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/0tUAnAL8FaUBc0Ujk7V0o6M9gu9DUcdBNsHAeILD.pdf', 'Normal User', 2, '2025-12-15 10:58:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 05:28:14', '2025-12-15 05:28:14'),
(160, 44, 41, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/iuystCP26Xf879GRkmbV2YHxtBZMTnyFsS1c7vk8.pdf', 'Normal User', 2, '2025-12-16 05:20:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:08', '2025-12-15 23:50:08'),
(161, 44, 41, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/qkcKqcGTcLVFTykfxTb3pd7iugwTg97h5zlglLDW.pdf', 'Normal User', 2, '2025-12-16 05:20:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:08', '2025-12-15 23:50:08'),
(162, 44, 41, 'BankStatement', 'education_format.pdf', 'uploads/documents/O8RG9WJ20VIo9yhB4SLVcmyO5rsKbKC5puwJD1Lu.pdf', 'Normal User', 2, '2025-12-16 05:20:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:09', '2025-12-15 23:50:09'),
(163, 44, 41, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/cToQMqUy4VbSTyavNe3mnDJg8fkchsXEwj9v0tSM.pdf', 'Normal User', 2, '2025-12-16 05:20:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:09', '2025-12-15 23:50:09'),
(164, 44, 41, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/QUzKPuBsewmw5h4B8yXdTyeiWrABXrz49SWJX3XX.pdf', 'Normal User', 2, '2025-12-16 05:20:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:10', '2025-12-15 23:50:10'),
(165, 44, 41, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/qdY9rqvpLZp8SNWPDrwUFzsdAepToFKFuQWE6dHI.pdf', 'Normal User', 2, '2025-12-16 05:20:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:10', '2025-12-15 23:50:10'),
(166, 44, 41, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/h5tgHzEJb24KWuOjKQxJffS9RXfXrDpNdWFr7G6h.pdf', 'Normal User', 2, '2025-12-16 05:20:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-15 23:50:10', '2025-12-15 23:50:10'),
(167, 45, 43, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/JlHh5DatRR4x24vPzJJSDKqjnQy5fV42W5CAHx8y.pdf', 'Normal User', 2, '2025-12-16 08:26:33', 1, '2025-12-17 06:36:55', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:33', '2025-12-17 01:06:55'),
(168, 45, 43, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ZHtZq5koP0nz6nbt5slYUvksoLGxb7SEUC0LlNSX.pdf', 'Normal User', 2, '2025-12-16 08:26:34', 0, NULL, 'Rejected', '2025-12-17 01:07:13', 1, 1, 0, NULL, 0, NULL, '2025-12-16 02:56:34', '2025-12-17 01:07:13'),
(169, 45, 43, 'BankStatement', 'education_format.pdf', 'uploads/documents/cQR5Cra7k17RiuMIiGaVTGbYEexZuWdGUdPPL3Cg.pdf', 'Normal User', 2, '2025-12-16 08:26:35', 1, '2025-12-17 06:36:56', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:35', '2025-12-17 01:06:56'),
(170, 45, 43, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/UdnzVsGs6MayOPEk8TwJjp2LVatlXomI8xJ8VFnl.pdf', 'Normal User', 2, '2025-12-16 08:26:35', 1, '2025-12-17 06:36:58', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:35', '2025-12-17 01:06:58'),
(171, 45, 43, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/25nLs0XRiHVxcXgOfgLbMgab71Fp3aBBOB5IJUO7.pdf', 'Normal User', 2, '2025-12-16 08:26:36', 1, '2025-12-17 06:36:59', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:36', '2025-12-17 01:06:59'),
(172, 45, 43, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/G9p6UEKywKlW3miZwUzLwPHFJfJNds3AvmHOPziv.pdf', 'Normal User', 2, '2025-12-16 08:26:37', 1, '2025-12-17 06:37:01', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:37', '2025-12-17 01:07:01'),
(173, 45, 43, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/viIL1opfKhoUXNnAPpGoR7ctC0zfeXlGEpl2kEqj.pdf', 'Normal User', 2, '2025-12-16 08:26:38', 1, '2025-12-17 06:37:02', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:56:38', '2025-12-17 01:07:02'),
(174, 1, 8, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/BWOEnTl5fT0c30o7m7GEb8pXAcnWFCy9dorgSHOW.pdf', 'Normal User', 2, '2025-12-16 08:28:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:24', '2025-12-16 02:58:24'),
(175, 1, 8, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/1PpeATu2z5JxMIlaNansBIlSTdfwNWsripld3RZZ.pdf', 'Normal User', 2, '2025-12-16 08:28:25', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:25', '2025-12-16 02:58:25'),
(176, 1, 8, 'BankStatement', 'education_format.pdf', 'uploads/documents/Qyz1T3UmOZH6jY193xwsuzDYV3AhpGJ7h57RVT0s.pdf', 'Normal User', 2, '2025-12-16 08:28:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:26', '2025-12-16 02:58:26'),
(177, 1, 8, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/acnSaclRKjxm8hEnEJHcqZOnFCMQqRgiTN9q8Fbt.pdf', 'Normal User', 2, '2025-12-16 08:28:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:26', '2025-12-16 02:58:26'),
(178, 1, 8, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/ORoweGybFj6IVbj57F42fDqOm5DatPDhwmEejMw8.pdf', 'Normal User', 2, '2025-12-16 08:28:27', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:27', '2025-12-16 02:58:27'),
(179, 1, 8, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/lNe4NZvjCo3hSAZszueNtf3EgxcwZ8StZXplCAzL.pdf', 'Normal User', 2, '2025-12-16 08:28:28', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:28', '2025-12-16 02:58:28'),
(180, 1, 8, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/a1G2NZC54nqtIS9JEyRhbFx9L2nwaRt5hL9L0W3i.pdf', 'Normal User', 2, '2025-12-16 08:28:29', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-16 02:58:29', '2025-12-16 02:58:29'),
(181, 46, 31, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/MqrjNplPcr19IorH2nxLBrua5hOlGEhOoMaSFh2F.pdf', 'Normal User', 2, '2025-12-17 07:28:22', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:22', '2025-12-17 01:58:22'),
(182, 46, 31, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/sJAiW6LWXGKAYTKW0PWjBXD4qotAAu2WuHIlPvDG.pdf', 'Normal User', 2, '2025-12-17 07:28:23', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:23', '2025-12-17 01:58:23');
INSERT INTO `document_upload` (`id`, `loan_id`, `customer_id`, `doc_type`, `file_name`, `file_path`, `uploaded_by`, `uploaded_by_user_id`, `uploaded_on`, `verified_by`, `verified_on`, `verification_status`, `rejected_on`, `rejected_by_user_id`, `rejection_reason_id`, `has_reuploaded_after_rejection`, `reupload_date`, `reuploaded_by_id`, `notes`, `created_at`, `updated_at`) VALUES
(183, 46, 31, 'BankStatement', 'eligibility_check_formula.pdf', 'uploads/documents/mDnPesYouSTOQbcBKvIYQ1VjbTjB8dXsX7R1KLJf.pdf', 'Normal User', 2, '2025-12-17 07:28:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:24', '2025-12-17 01:58:24'),
(184, 46, 31, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/dYWKFCVP9SB3iyrZxwKh0H6a4ssirZqExmPpVOwm.pdf', 'Normal User', 2, '2025-12-17 07:28:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:26', '2025-12-17 01:58:26'),
(185, 46, 31, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/cw2padcumhd2YR0lZRCYtMc33SiZnT3bQ0jlMbqc.pdf', 'Normal User', 2, '2025-12-17 07:28:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:26', '2025-12-17 01:58:26'),
(186, 46, 31, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/do2JoyN2tkLlIq6XaZBn8c6PdDBl0KcTDmmcDvvX.pdf', 'Normal User', 2, '2025-12-17 07:28:27', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:27', '2025-12-17 01:58:27'),
(187, 46, 31, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/gT4f5zMvlxAQ9C5QowLjao9YWwSvoKMlBKCOHLwj.pdf', 'Normal User', 2, '2025-12-17 07:28:28', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 01:58:28', '2025-12-17 01:58:28'),
(188, 47, 22, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/qTUIPOsDFsyDMlboOblGyvuZj86tcmmQGjqqhXKt.pdf', 'Normal User', 2, '2025-12-17 08:17:22', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:22', '2025-12-17 02:47:22'),
(189, 47, 22, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ItQqU5rLNNG3KlI4BThnNHOnqYYdB23BWL3QKTLQ.pdf', 'Normal User', 2, '2025-12-17 08:17:23', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:23', '2025-12-17 02:47:23'),
(190, 47, 22, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/EBnRZEdvyBzH7sgJXl7nZtZY7OP04mJUIRLKuz2r.pdf', 'Normal User', 2, '2025-12-17 08:17:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:24', '2025-12-17 02:47:24'),
(191, 47, 22, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/IYQEmTv80NErQ7iRdpdICbsaIEmkQxAkvQtUeRn0.pdf', 'Normal User', 2, '2025-12-17 08:17:25', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:25', '2025-12-17 02:47:25'),
(192, 47, 22, 'BankStatement', 'health_format.pdf', 'uploads/documents/5NnivupXMpUHenIEOLWtPJS3IlLqn1rFFjHAKaay.pdf', 'Normal User', 2, '2025-12-17 08:17:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:26', '2025-12-17 02:47:26'),
(193, 47, 22, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/RbnhJn7VSC5Lciek5jUdshBEJJxsgniSCOE8i2AI.pdf', 'Normal User', 2, '2025-12-17 08:17:26', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:26', '2025-12-17 02:47:26'),
(194, 47, 22, 'ID', 'loan-process-details.pdf', 'uploads/documents/cXzRYYdq0THV7AkNSH21evPIbHjke4ESN3MBPajb.pdf', 'Normal User', 2, '2025-12-17 08:17:27', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 02:47:27', '2025-12-17 02:47:27'),
(195, 48, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/Ffo0KRg15gXRQ6OjFq2mrXvuekCzESkTIdcZDXBb.pdf', 'Normal User', 2, '2025-12-17 10:57:11', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:11', '2025-12-17 05:27:11'),
(196, 48, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/9BVJZBH7L7Xz4atolVNalj6s3jH7ctr8FOqtcGcM.pdf', 'Normal User', 2, '2025-12-17 10:57:13', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:13', '2025-12-17 05:27:13'),
(197, 48, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/fUQOAPY1sddZwisJcORBSlkjYLbJphkOKLxE2lQX.pdf', 'Normal User', 2, '2025-12-17 10:57:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:14', '2025-12-17 05:27:14'),
(198, 48, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/pYxmA54dlbvFdbsDM8VwFmcTyB7NP5Pvdo5dd2SL.pdf', 'Normal User', 2, '2025-12-17 10:57:15', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:15', '2025-12-17 05:27:15'),
(199, 48, 24, 'BankStatement', 'Loan Management System.pdf', 'uploads/documents/Uz0QUc16LlH0gyLoxZecjvbO2xPcIgXMzM6n8eyv.pdf', 'Normal User', 2, '2025-12-17 10:57:16', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:16', '2025-12-17 05:27:16'),
(200, 48, 24, 'Payslip', 'health_format.pdf', 'uploads/documents/Xh2DLVJYRHNg9uvRrSgq0S7m4RItkMRKlejrhqjn.pdf', 'Normal User', 2, '2025-12-17 10:57:17', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:17', '2025-12-17 05:27:17'),
(201, 48, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/6hzVBvvj8EHNOglUz9PdVknuiQCYiz99OsHBtrRc.pdf', 'Normal User', 2, '2025-12-17 10:57:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:27:18', '2025-12-17 05:27:18'),
(202, 49, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/gRDDv1ySXHmY1HTHj2ncpyZjMs8hPM8SJJkjXg0T.pdf', 'Normal User', 2, '2025-12-17 11:21:37', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:37', '2025-12-17 05:51:37'),
(203, 49, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/RqF1GWJ9ryut4NT4VyGYiHYdarwfwERnUpkEATV8.pdf', 'Normal User', 2, '2025-12-17 11:21:38', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:38', '2025-12-17 05:51:38'),
(204, 49, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/6tb4Rpb1a10drGHeZRX0IwNEhzjdgIJJ8pzbKrXY.pdf', 'Normal User', 2, '2025-12-17 11:21:39', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:39', '2025-12-17 05:51:39'),
(205, 49, 24, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/06VIa4pAy6fzHfkEfoT7UEquwri2i0DLXuxzEkcs.pdf', 'Normal User', 2, '2025-12-17 11:21:40', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:40', '2025-12-17 05:51:40'),
(206, 49, 24, 'BankStatement', 'Loan Management System.pdf', 'uploads/documents/0tl00yAFtHK7U0A8CT0njiKzkKPViiLFL1QsArx8.pdf', 'Normal User', 2, '2025-12-17 11:21:41', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:41', '2025-12-17 05:51:41'),
(207, 49, 24, 'Payslip', 'eligibility_check_formula.pdf', 'uploads/documents/yphcuzXjURMf9hvdgrs5WAPK7pGqM4iSm2OrdGyW.pdf', 'Normal User', 2, '2025-12-17 11:21:42', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:42', '2025-12-17 05:51:42'),
(208, 49, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/5QOPJ30Qhmql2nRwtcpgM0fbx5g9WEhXb4XLriwg.pdf', 'Normal User', 2, '2025-12-17 11:21:44', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:51:44', '2025-12-17 05:51:44'),
(209, 50, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/yrV9T9E6okIeAw4rIMMbVuW2Gwo6J7xM0ghA1jbP.pdf', 'Normal User', 2, '2025-12-17 11:24:13', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:13', '2025-12-17 05:54:13'),
(210, 50, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/4QOvXU6dHGhPREpIhugzuwDX90eTuQTd1AblaCX8.pdf', 'Normal User', 2, '2025-12-17 11:24:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:14', '2025-12-17 05:54:14'),
(211, 50, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/rL74zHWM4VmlM5ChI3Apq1rYzyAqmAPpuhbdg6hh.pdf', 'Normal User', 2, '2025-12-17 11:24:15', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:15', '2025-12-17 05:54:15'),
(212, 50, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/TwaOeAACh6SYLYZlDVAIGGgfypbrynwABtbuYaum.pdf', 'Normal User', 2, '2025-12-17 11:24:16', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:16', '2025-12-17 05:54:16'),
(213, 50, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/B8pAXpQkSuugtKnoDjAGf93xzjVHBvuuU5XFdgis.pdf', 'Normal User', 2, '2025-12-17 11:24:16', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:16', '2025-12-17 05:54:16'),
(214, 50, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/yGDTOwasRLlyF7G4lWePX4tmyiE77mwGVO06R3Vo.pdf', 'Normal User', 2, '2025-12-17 11:24:17', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:17', '2025-12-17 05:54:17'),
(215, 50, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/YtFmJE8MHVxNKFQmu78UoaZDUYL4RPBl7ad8psOj.pdf', 'Normal User', 2, '2025-12-17 11:24:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:54:18', '2025-12-17 05:54:18'),
(216, 51, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/b9LZblvBtaQ6K1GsO7xjgFxDjZjp9ayhU6FrMqST.pdf', 'Normal User', 2, '2025-12-17 11:26:45', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:45', '2025-12-17 05:56:45'),
(217, 51, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/85sw4xEfisOfAskZ9TCSGJ9ReWv5XkzRQknRq2a6.pdf', 'Normal User', 2, '2025-12-17 11:26:46', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:46', '2025-12-17 05:56:46'),
(218, 51, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/16WfMm7N5iaq3u9h3gq1aISQnp39PPdaRIvxSyWm.pdf', 'Normal User', 2, '2025-12-17 11:26:47', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:47', '2025-12-17 05:56:47'),
(219, 51, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Xurp68VgS1aNKmUaHRqMIoUYmDv43mzJ2Vc8SVfu.pdf', 'Normal User', 2, '2025-12-17 11:26:48', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:48', '2025-12-17 05:56:48'),
(220, 51, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/lnSf409cuWE6TMc7xXcq6vWykySLjL7hd4N1OlTn.pdf', 'Normal User', 2, '2025-12-17 11:26:49', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:49', '2025-12-17 05:56:49'),
(221, 51, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/kFmpCxOAIhEfnvqpJyCKG0aZ9VptMfCkp0mldTjk.pdf', 'Normal User', 2, '2025-12-17 11:26:50', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:50', '2025-12-17 05:56:50'),
(222, 51, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/lvrRlERZC4NVl8Wf1hXYismnfg84YLMtEY1F0mns.pdf', 'Normal User', 2, '2025-12-17 11:26:51', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:56:51', '2025-12-17 05:56:51'),
(223, 52, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/oeUmlGQHRdVodWW89WibLI9hkaAucwytkDXKmUxA.pdf', 'Normal User', 2, '2025-12-17 11:28:14', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:14', '2025-12-17 05:58:14'),
(224, 52, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ySP0S0kUc63FLLYv2yi4lTP1NalTQVVDXRL914KL.pdf', 'Normal User', 2, '2025-12-17 11:28:15', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:15', '2025-12-17 05:58:15'),
(225, 52, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/ouBR0ZRbTU0ugoD1BywBZ1dYT2Z7wv1qgwzMJSAq.pdf', 'Normal User', 2, '2025-12-17 11:28:16', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:16', '2025-12-17 05:58:16'),
(226, 52, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/VvAunBUVJa1CzS3DEnNnkhzuWnlB8oL0HpLdXC6f.pdf', 'Normal User', 2, '2025-12-17 11:28:17', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:17', '2025-12-17 05:58:17'),
(227, 52, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/z3guZVj6EZf5p3LMu587BZJrQStOGE9SegS6lFrX.pdf', 'Normal User', 2, '2025-12-17 11:28:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:18', '2025-12-17 05:58:18'),
(228, 52, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/GHEJB1ZWyoU2wFruDuwTfvdz6mffCxO7bMCFNCPx.pdf', 'Normal User', 2, '2025-12-17 11:28:19', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:19', '2025-12-17 05:58:19'),
(229, 52, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/f9ZXbc84cjJRVXuJgTbkQ1X8h0jZY1eTnat24iWJ.pdf', 'Normal User', 2, '2025-12-17 11:28:20', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 05:58:20', '2025-12-17 05:58:20'),
(230, 53, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/iNrTo4DAHIZ6CUkYU7lHSQoyERqNGwcQzF1N1Pny.pdf', 'Normal User', 2, '2025-12-17 12:11:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:18', '2025-12-17 06:41:18'),
(231, 53, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/PF49yvSs5zLROU9tNjy7Ax7ABAJXgDx117MwzI6u.pdf', 'Normal User', 2, '2025-12-17 12:11:19', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:19', '2025-12-17 06:41:19'),
(232, 53, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/AmnMbHSBgW3HWw9y3acHZMwSVA0YQKDETOhM14wy.pdf', 'Normal User', 2, '2025-12-17 12:11:20', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:20', '2025-12-17 06:41:20'),
(233, 53, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/TYQj192BZXxAgDXgcmWpoMc0FxOFXL3iW4nyxnBA.pdf', 'Normal User', 2, '2025-12-17 12:11:21', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:21', '2025-12-17 06:41:21'),
(234, 53, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/csCf91vhGS4qbq3tqAzPCwTeCQKwKPQRmdR69Dsj.pdf', 'Normal User', 2, '2025-12-17 12:11:22', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:22', '2025-12-17 06:41:22'),
(235, 53, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/OnJLayzdhfaRcHzwcSBGWKYWpWILmEuvJEL9iSpR.pdf', 'Normal User', 2, '2025-12-17 12:11:23', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:23', '2025-12-17 06:41:23'),
(236, 53, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/Le03k0TNXW0cTFl1J4WnWUWQRotQKLg4ybs9uUDj.pdf', 'Normal User', 2, '2025-12-17 12:11:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 06:41:24', '2025-12-17 06:41:24'),
(237, 54, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/xQ17vl9i3iqE5FcgXbyk6ZmKTWU4aO4HiskwFL6A.pdf', 'Normal User', 2, '2025-12-17 14:06:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:18', '2025-12-17 08:36:18'),
(238, 54, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/QbQMDRznWzxhenkj1fkr2D6jv2hKIRb8Aw3Uhku8.pdf', 'Normal User', 2, '2025-12-17 14:06:19', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:19', '2025-12-17 08:36:19'),
(239, 54, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/Jgou4zGbZA2tSRn7ONf4dsxqQ2wWg6RYpvPLh1WP.pdf', 'Normal User', 2, '2025-12-17 14:06:20', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:20', '2025-12-17 08:36:20'),
(240, 54, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/UaVAJEzu3AQv6Llr32yNSUdagli8IFdmUKC2kdoU.pdf', 'Normal User', 2, '2025-12-17 14:06:21', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:21', '2025-12-17 08:36:21'),
(241, 54, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/P3RHXrZvh8Lb8bcI7JaUq7WMUtPdS0VMvHDWpxNW.pdf', 'Normal User', 2, '2025-12-17 14:06:22', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:22', '2025-12-17 08:36:22'),
(242, 54, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/fz0ICVH3oGKxhXrkloXPTjh9fMJSW4CQvnqN7jqF.pdf', 'Normal User', 2, '2025-12-17 14:06:23', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:23', '2025-12-17 08:36:23'),
(243, 54, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/vjwb5yaV2ejfkuAwoMhYPzWXZ5YtHbksiUIGFK5t.pdf', 'Normal User', 2, '2025-12-17 14:06:24', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:36:24', '2025-12-17 08:36:24'),
(244, 55, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/XQA88a1UeE5YL88vP7ApQMTYtiDeJsTD2ZcJ86Z2.pdf', 'Normal User', 2, '2025-12-17 14:10:04', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:04', '2025-12-17 08:40:04'),
(245, 55, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/Z7KfPGsQFnqg068qGqDTOsV6O3Jutk1aisokDd3N.pdf', 'Normal User', 2, '2025-12-17 14:10:05', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:05', '2025-12-17 08:40:05'),
(246, 55, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/YDu7AV7EmQYFvZjWDk2kpfwsIVX8lxr8Tq0uuKeL.pdf', 'Normal User', 2, '2025-12-17 14:10:06', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:06', '2025-12-17 08:40:06'),
(247, 55, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/bEoQ94SNYJUSo2k3pLpU9cneOpVObaBPZIgRWbWA.pdf', 'Normal User', 2, '2025-12-17 14:10:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:07', '2025-12-17 08:40:07'),
(248, 55, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/3CcoWGbxaDmPgRAB25jPIR6DjlhRt6GO3Ck8KXtk.pdf', 'Normal User', 2, '2025-12-17 14:10:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:08', '2025-12-17 08:40:08'),
(249, 55, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/gV8IS3bfGA9KHVoksFEoueYmfYC8bpqafy66EMKv.pdf', 'Normal User', 2, '2025-12-17 14:10:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:09', '2025-12-17 08:40:09'),
(250, 55, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/FJ4MGYyVa1FOeAUnCoWNQiu9dhBN53qnJ71kUTgI.pdf', 'Normal User', 2, '2025-12-17 14:10:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:40:10', '2025-12-17 08:40:10'),
(251, 56, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/UiYSPoyoKqu7xoLVxQzOjVOoyeOvtx46UzV2SWmT.pdf', 'Normal User', 2, '2025-12-17 14:12:46', 1, '2026-01-12 12:11:31', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:46', '2026-01-12 06:41:31'),
(252, 56, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/OU102uXj41e3nLDfIyfv3LBu4HxOIi37qvwFyeNH.pdf', 'Normal User', 2, '2025-12-17 14:12:47', 1, '2026-01-12 12:11:33', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:47', '2026-01-12 06:41:33'),
(253, 56, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/DZjRC8nIIjkDXt09hssk3MWPDCC1sxE16fgrTo28.pdf', 'Normal User', 2, '2025-12-17 14:12:48', 1, '2026-01-12 12:11:34', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:48', '2026-01-12 06:41:34'),
(254, 56, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/BBq0XkL6rm49VRZN1f3AHCZcq8D0JLWimKfnR0D0.pdf', 'Normal User', 2, '2025-12-17 14:12:49', 1, '2026-01-12 12:11:36', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:49', '2026-01-12 06:41:36'),
(255, 56, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/74f7h46XsJjSEtGwmTfrM6yRw58C6ib1O9pIjrva.pdf', 'Normal User', 2, '2025-12-17 14:12:50', 1, '2026-01-12 12:11:37', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:50', '2026-01-12 06:41:37'),
(256, 56, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/bmVKGMG0EFaVMQi7quPJ0E9zz4e0LuUxc0dO2lb3.pdf', 'Normal User', 2, '2025-12-17 14:12:51', 1, '2026-01-12 12:11:38', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:51', '2026-01-12 06:41:38'),
(257, 56, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/oD2ZrtofKPofPeNgy1AP5VohNn7Zt58ayV2HWuTN.pdf', 'Normal User', 2, '2025-12-17 14:12:52', 1, '2026-01-12 12:11:39', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:42:52', '2026-01-12 06:41:39'),
(258, 57, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/hnxlXBC7q0jGNNg8yb4KX7Vjm5upMhq3feMlLFnI.pdf', 'Normal User', 2, '2025-12-17 14:22:58', 1, '2025-12-18 08:01:01', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:52:58', '2025-12-18 02:31:01'),
(259, 57, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/XekOO24AZjbeJBKbaiUTpVxU8LTnpHtJpWIRm01X.pdf', 'Normal User', 2, '2025-12-17 14:22:59', 1, '2025-12-18 08:01:05', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:52:59', '2025-12-18 02:31:05'),
(260, 57, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/6A0EFkqxhHTnu3sFECo8Y3YiQoLNRa8NAkiR0phk.pdf', 'Normal User', 2, '2025-12-17 14:23:01', 1, '2025-12-18 08:01:03', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:53:01', '2025-12-18 02:31:03'),
(261, 57, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/8xMcVNhrlLTwoUKvnw4mjSp0KZhDvM80EtrrodmI.pdf', 'Normal User', 2, '2025-12-17 14:23:01', 1, '2025-12-18 08:01:06', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:53:01', '2025-12-18 02:31:06'),
(262, 57, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/KO1pRscdKq5al2WW2d8nzInG1ub42noSfeZJE52V.pdf', 'Normal User', 2, '2025-12-17 14:23:02', 1, '2025-12-18 08:01:07', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:53:02', '2025-12-18 02:31:07'),
(263, 57, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/cbbTY7iwiaMmriur7tENBBmLWybwIzFI722F55K3.pdf', 'Normal User', 2, '2025-12-17 14:23:03', 1, '2025-12-18 08:01:08', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:53:03', '2025-12-18 02:31:08'),
(264, 57, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/WUvwOVJuE6y3NGkbGeUlhHI5plYTc3hETt3WVuol.pdf', 'Normal User', 2, '2025-12-17 14:23:05', 1, '2025-12-18 08:01:09', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-17 08:53:05', '2025-12-18 02:31:09'),
(265, 58, 24, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/RXIylEb2EttFx2exSuS7uWqERmUIGdQvLA9Lz8MY.pdf', 'Normal User', 2, '2025-12-18 07:03:58', 1, '2025-12-18 07:57:12', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:33:58', '2025-12-18 02:27:12'),
(266, 58, 24, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/szPYhd0qeAgg06IPdgcNOHuRVu36ZsUOAGdYoCtl.pdf', 'Normal User', 2, '2025-12-18 07:03:59', 1, '2025-12-18 07:57:15', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:33:59', '2025-12-18 02:27:15'),
(267, 58, 24, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/OST716SqPJetv4rhKKQNn7QzOsHfeutgR0WmZVJe.pdf', 'Normal User', 2, '2025-12-18 07:04:00', 1, '2025-12-18 07:57:17', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:34:00', '2025-12-18 02:27:17'),
(268, 58, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Lb1aYV4ziBRIulgrvIHCJbQPOUfzOUXIoOTzZvDR.pdf', 'Normal User', 2, '2025-12-18 07:04:01', 1, '2025-12-18 07:57:19', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:34:01', '2025-12-18 02:27:19'),
(269, 58, 24, 'BankStatement', 'health_format.pdf', 'uploads/documents/I8nRJC7wAsRZN06KLILPqGPIIr2E5jXQICbVuQJD.pdf', 'Normal User', 2, '2025-12-18 07:04:02', 1, '2025-12-18 07:57:20', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:34:02', '2025-12-18 02:27:20'),
(270, 58, 24, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/DkEvIt5WSJwaRaUB8CGQBcpKKTT1oGZ6gi8iuody.pdf', 'Normal User', 2, '2025-12-18 07:04:02', 1, '2025-12-18 07:57:21', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:34:02', '2025-12-18 02:27:21'),
(271, 58, 24, 'ID', 'loan-process-details.pdf', 'uploads/documents/l78QhUFNKqRDEmpda4TyYHfmhkDcfuMIXanHCq4H.pdf', 'Normal User', 2, '2025-12-18 07:04:03', 1, '2025-12-18 07:57:23', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 01:34:03', '2025-12-18 02:27:23'),
(272, 59, 44, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/js7W02jidyQGdFtcvDYCY5UTXm66QE7V9ia5JV73.pdf', 'Normal User', 2, '2025-12-18 12:22:16', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:16', '2025-12-18 06:52:16'),
(273, 59, 44, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ufCh60I1yS4Gy5tbShvCBjYRIQq0pTCS0FSizvPt.pdf', 'Normal User', 2, '2025-12-18 12:22:17', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:17', '2025-12-18 06:52:17'),
(274, 59, 44, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/datU43Fx8XHlSc9YLiXmPpqbW967C9fxzG0HY9RY.pdf', 'Normal User', 2, '2025-12-18 12:22:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:18', '2025-12-18 06:52:18'),
(275, 59, 44, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/v0pGG3D1IRFKJdEG2HiFGVYDGKuPH8PZYZCTt3IM.pdf', 'Normal User', 2, '2025-12-18 12:22:18', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:18', '2025-12-18 06:52:18'),
(276, 59, 44, 'BankStatement', 'health_format.pdf', 'uploads/documents/LnHOlFqAMZJUeRgZBLA2guaXRSMgUZE6qr8Vykqi.pdf', 'Normal User', 2, '2025-12-18 12:22:19', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:19', '2025-12-18 06:52:19'),
(277, 59, 44, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/K6C0CkVJZca0fChuDHSFiLxSXyQ1vHsARz72zMHb.pdf', 'Normal User', 2, '2025-12-18 12:22:20', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:20', '2025-12-18 06:52:20'),
(278, 59, 44, 'ID', 'loan-process-details.pdf', 'uploads/documents/g4cYvKCrkLydaeQFHT5zkWsMvL91ltlDTmSuHOOO.pdf', 'Normal User', 2, '2025-12-18 12:22:21', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-18 06:52:21', '2025-12-18 06:52:21'),
(279, 60, 44, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/SaYfAZJLUiaegYvPmU09bOhQpH7ZHI3A5WQqFg0V.pdf', 'Normal User', 2, '2025-12-23 10:21:06', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:06', '2025-12-23 04:51:06'),
(280, 60, 44, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/Z4EeuL77dV1tgiwRfbT8unDklHRjxlCXe0NcmPLk.pdf', 'Normal User', 2, '2025-12-23 10:21:07', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:07', '2025-12-23 04:51:07'),
(281, 60, 44, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/3B0HeoujzxwUWq2K3qTb0BBL9njTbutIJflLa3rB.pdf', 'Normal User', 2, '2025-12-23 10:21:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:08', '2025-12-23 04:51:08'),
(282, 60, 44, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Umu0dc6pWHh4tn87PklAsf0Vm2U2g3l3RHg5w1Mi.pdf', 'Normal User', 2, '2025-12-23 10:21:08', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:08', '2025-12-23 04:51:08'),
(283, 60, 44, 'BankStatement', 'health_format.pdf', 'uploads/documents/GQHDSGkFSsYPp7QUkWenq46LGUZRbILf6YT48aRk.pdf', 'Normal User', 2, '2025-12-23 10:21:09', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:09', '2025-12-23 04:51:09'),
(284, 60, 44, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/gXvKGN0EXF0a1cWplQ0hQfpSzIIwlgkWjFrK7HcJ.pdf', 'Normal User', 2, '2025-12-23 10:21:10', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:10', '2025-12-23 04:51:10'),
(285, 60, 44, 'ID', 'loan-process-details.pdf', 'uploads/documents/xSskbqAUbgAf6fpX9453rfEUn7yWuRg5PpFa1gm7.pdf', 'Normal User', 2, '2025-12-23 10:21:11', 0, NULL, 'Pending', NULL, 0, 0, 0, NULL, 0, NULL, '2025-12-23 04:51:11', '2025-12-23 04:51:11'),
(286, 62, 46, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/zOu8MpwQXnGyL3oYEyZIkf76g9b8lVSOgVVdn5x3.pdf', 'Normal User', 2, '2026-01-09 06:46:16', 1, '2026-01-09 06:55:49', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:16', '2026-01-09 01:25:49'),
(287, 62, 46, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/ODGaemfwprGSqpd9zVuLqlPEDjyGenCluUe8iqgw.pdf', 'Normal User', 2, '2026-01-09 06:46:17', 0, NULL, 'Rejected', '2026-01-09 01:26:08', 1, 1, 0, NULL, 0, NULL, '2026-01-09 01:16:17', '2026-01-09 01:26:08'),
(288, 62, 46, 'ResumptionSheet', 'education_format.pdf', 'uploads/documents/uEJPvobtJMgeAqgpw0RjH48a3iseP0JszJq8YsAW.pdf', 'Normal User', 2, '2026-01-09 06:46:18', 1, '2026-01-09 06:55:52', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:18', '2026-01-09 01:25:52'),
(289, 62, 46, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/6J5UvXhCkM25YfQ9IiQYVYGlWdOx7MSnpcXvqLaq.pdf', 'Normal User', 2, '2026-01-09 06:46:19', 1, '2026-01-09 06:55:56', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:19', '2026-01-09 01:25:56'),
(290, 62, 46, 'BankStatement', 'health_format.pdf', 'uploads/documents/PDSs1zDHXoQTEcrOVAMIssQEbHdRWazwj6Rczs6X.pdf', 'Normal User', 2, '2026-01-09 06:46:20', 1, '2026-01-09 06:55:57', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:20', '2026-01-09 01:25:57'),
(291, 62, 46, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/gM78L3Y778ZRXY61LlBoGR5cOMWn3WyGj097PHcA.pdf', 'Normal User', 2, '2026-01-09 06:46:21', 1, '2026-01-09 06:55:59', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:21', '2026-01-09 01:25:59'),
(292, 62, 46, 'ID', 'loan-process-details.pdf', 'uploads/documents/n4gu8hNBrtgrvdJzn2HW08QqkBAKtxa9PHSNv5U0.pdf', 'Normal User', 2, '2026-01-09 06:46:22', 1, '2026-01-09 06:56:00', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 01:16:22', '2026-01-09 01:26:00'),
(293, 63, 47, 'LoanForm_Scanned', 'aaa_loan_application_form.pdf', 'uploads/documents/EVusd22xAyPrJ5mPrPgJ5ONDWlYpK9iQ6d4sLnLr.pdf', 'Normal User', 2, '2026-01-09 08:29:57', 1, '2026-01-09 08:42:37', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 02:59:57', '2026-01-09 03:12:37'),
(294, 63, 47, 'Signature', 'jsaha_cv.pdf', 'uploads/documents/zsSJgUWpF0J9KdKP9hXCexFh8rM1WzJe1DoBQW0r.pdf', 'Normal User', 2, '2026-01-09 08:29:58', 1, '2026-01-09 08:42:35', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 02:59:58', '2026-01-09 03:12:35'),
(295, 63, 47, 'ISDA_Signed', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/gox3Z4BPQP0CdCJjPB6BI1dVmhslyfKAqsSaTBiP.pdf', 'Normal User', 2, '2026-01-09 08:29:59', 0, NULL, 'Rejected', '2026-01-09 03:13:16', 1, 1, 0, NULL, 0, NULL, '2026-01-09 02:59:59', '2026-01-09 03:13:16'),
(296, 63, 47, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/VTBjoqCoNHrSGolL6wYAEQ2CyZHdG6EVQAnVlZfG.pdf', 'Normal User', 2, '2026-01-09 08:30:00', 1, '2026-01-09 08:42:38', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 03:00:00', '2026-01-09 03:12:38'),
(297, 63, 47, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/RrVK3suY7NV6zNUdZ2AyDR0UViQgYEQPk5KEkQqv.pdf', 'Normal User', 2, '2026-01-09 08:30:01', 1, '2026-01-09 08:42:27', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 03:00:01', '2026-01-09 03:12:27'),
(298, 63, 47, 'BankStatement', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/H2pJgncos85HV7xd7awVKMPrk2husi1N0kmHSb19.pdf', 'Normal User', 2, '2026-01-09 08:30:02', 1, '2026-01-09 08:42:28', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 03:00:02', '2026-01-09 03:12:28'),
(299, 63, 47, 'Payslip', 'Loan Management System.pdf', 'uploads/documents/Vi5w0YY3haNY16txGu6BIlOTMcitTh26Jb01oRtU.pdf', 'Normal User', 2, '2026-01-09 08:30:03', 1, '2026-01-09 08:42:30', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 03:00:03', '2026-01-09 03:12:30'),
(300, 63, 47, 'ID', 'education_format.pdf', 'uploads/documents/VTJEv2pBkD4hVkIuS4DgGC0JvdqfHLdruLjNE4It.pdf', 'Normal User', 2, '2026-01-09 08:30:04', 1, '2026-01-09 08:42:31', 'Verified', NULL, 0, 0, 0, NULL, 0, NULL, '2026-01-09 03:00:04', '2026-01-09 03:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `installment_details`
--

CREATE TABLE `installment_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `collection_uid` varchar(20) DEFAULT NULL,
  `installment_no` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `emi_amount` decimal(10,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_mode` enum('EmployerDeduction','Cash','Transfer') DEFAULT NULL,
  `late_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('Pending','Paid','Overdue') NOT NULL DEFAULT 'Pending',
  `employer_reference_no` varchar(100) DEFAULT NULL,
  `emi_collected_by_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `emi_collected_date` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `installment_details`
--

INSERT INTO `installment_details` (`id`, `loan_id`, `collection_uid`, `installment_no`, `due_date`, `emi_amount`, `payment_date`, `payment_mode`, `late_fee`, `status`, `employer_reference_no`, `emi_collected_by_id`, `emi_collected_date`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 26, 'B89AC85', 1, '2025-11-10', 55.55, '2025-11-10', NULL, 0.00, 'Paid', NULL, 1, '2025-11-10 06:39:46', NULL, '2025-11-10 06:39:46', '2025-11-10 06:39:46'),
(12, 24, 'C79DB22', 1, '2025-11-21', 61.96, '2025-11-21', NULL, 0.00, 'Paid', NULL, 1, '2025-11-20 23:49:53', NULL, '2025-11-20 23:49:53', '2025-11-20 23:49:53'),
(16, 25, '1DDC550', 1, '2025-12-01', 80.55, '2025-12-01', NULL, 0.00, 'Paid', NULL, 1, '2025-12-01 03:05:45', NULL, '2025-12-01 03:05:45', '2025-12-01 03:05:45'),
(17, 26, '1DDC550', 2, '2025-12-01', 55.55, '2025-12-01', NULL, 0.00, 'Paid', NULL, 1, '2025-12-01 03:05:45', NULL, '2025-12-01 03:05:45', '2025-12-01 03:05:45'),
(18, 29, 'A74E568', 1, '2025-12-08', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(19, 29, 'A74E568', 2, '2025-12-22', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(20, 29, 'A74E568', 3, '2026-01-05', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(21, 29, 'A74E568', 4, '2026-01-19', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(22, 29, 'A74E568', 5, '2026-02-02', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(23, 29, 'A74E568', 6, '2026-02-16', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(24, 29, 'A74E568', 7, '2026-03-02', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(25, 29, 'A74E568', 8, '2026-03-16', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(26, 29, 'A74E568', 9, '2026-03-30', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(27, 29, 'A74E568', 10, '2026-04-13', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(28, 29, 'A74E568', 11, '2026-04-27', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(29, 29, 'A74E568', 12, '2026-05-11', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(30, 29, 'A74E568', 13, '2026-05-25', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(31, 29, 'A74E568', 14, '2026-06-08', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(32, 29, 'A74E568', 15, '2026-06-22', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(33, 29, 'A74E568', 16, '2026-07-06', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(34, 29, 'A74E568', 17, '2026-07-20', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(35, 29, 'A74E568', 18, '2026-08-03', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(36, 29, 'A74E568', 19, '2026-08-17', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(37, 29, 'A74E568', 20, '2026-08-31', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(38, 29, 'A74E568', 21, '2026-09-14', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(39, 29, 'A74E568', 22, '2026-09-28', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(40, 29, 'A74E568', 23, '2026-10-12', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(41, 29, 'A74E568', 24, '2026-10-26', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(42, 29, 'A74E568', 25, '2026-11-09', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(43, 29, 'A74E568', 26, '2026-11-23', 74.35, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(44, 24, 'A74E568', 2, '2025-12-08', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(45, 24, 'A74E568', 3, '2025-12-22', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(46, 24, 'A74E568', 4, '2026-01-05', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(47, 24, 'A74E568', 5, '2026-01-19', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(48, 24, 'A74E568', 6, '2026-02-02', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(49, 24, 'A74E568', 7, '2026-02-16', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(50, 24, 'A74E568', 8, '2026-03-02', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(51, 24, 'A74E568', 9, '2026-03-16', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(52, 24, 'A74E568', 10, '2026-03-30', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(53, 24, 'A74E568', 11, '2026-04-13', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(54, 24, 'A74E568', 12, '2026-04-27', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(55, 24, 'A74E568', 13, '2026-05-11', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(56, 24, 'A74E568', 14, '2026-05-25', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(57, 24, 'A74E568', 15, '2026-06-08', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(58, 24, 'A74E568', 16, '2026-06-22', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(59, 24, 'A74E568', 17, '2026-07-06', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(60, 24, 'A74E568', 18, '2026-07-20', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(61, 24, 'A74E568', 19, '2026-08-03', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(62, 24, 'A74E568', 20, '2026-08-17', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(63, 24, 'A74E568', 21, '2026-08-31', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(64, 24, 'A74E568', 22, '2026-09-14', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(65, 24, 'A74E568', 23, '2026-09-28', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(66, 24, 'A74E568', 24, '2026-10-12', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(67, 24, 'A74E568', 25, '2026-10-26', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(68, 24, 'A74E568', 26, '2026-11-09', 61.96, '2025-12-08', NULL, 0.00, 'Paid', NULL, 2, '2025-12-08 06:22:28', NULL, '2025-12-08 06:22:28', '2025-12-08 06:22:28'),
(69, 25, 'COL1766486321786', 2, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(70, 25, 'COL1766486321786', 3, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(71, 25, 'COL1766486321786', 4, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(72, 25, 'COL1766486321786', 5, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(73, 25, 'COL1766486321786', 6, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(74, 25, 'COL1766486321786', 7, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(75, 25, 'COL1766486321786', 8, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(76, 25, 'COL1766486321786', 9, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(77, 25, 'COL1766486321786', 10, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(78, 25, 'COL1766486321786', 11, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(79, 25, 'COL1766486321786', 12, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(80, 25, 'COL1766486321786', 13, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(81, 25, 'COL1766486321786', 14, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(82, 25, 'COL1766486321786', 15, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(83, 25, 'COL1766486321786', 16, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(84, 25, 'COL1766486321786', 17, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(85, 25, 'COL1766486321786', 18, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(86, 25, 'COL1766486321786', 19, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(87, 25, 'COL1766486321786', 20, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(88, 25, 'COL1766486321786', 21, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(89, 25, 'COL1766486321786', 22, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(90, 25, 'COL1766486321786', 23, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(91, 25, 'COL1766486321786', 24, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(92, 25, 'COL1766486321786', 25, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46'),
(93, 25, 'COL1766486321786', 26, '2025-12-23', 80.55, '2025-12-23', NULL, 0.00, 'Paid', NULL, 2, '2025-12-23 07:31:46', NULL, '2025-12-23 07:31:46', '2025-12-23 07:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `loan_applications`
--

CREATE TABLE `loan_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `organisation_id` bigint(20) UNSIGNED NOT NULL,
  `loan_type` int(11) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `purpose_id` bigint(20) UNSIGNED DEFAULT NULL,
  `other_purpose_text` varchar(255) DEFAULT NULL,
  `loan_amount_applied` double NOT NULL DEFAULT 0,
  `loan_amount_approved` double DEFAULT 0,
  `tenure_fortnight` int(11) NOT NULL,
  `emi_amount` double DEFAULT 0,
  `interest_rate` double DEFAULT 0,
  `total_no_emi` int(11) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `elegible_amount` double DEFAULT 0,
  `min_repay_amt_for_next_loan` double DEFAULT 0,
  `total_repay_amt` double DEFAULT 0,
  `total_interest_amt` double DEFAULT 0,
  `processing_fee` double DEFAULT 0,
  `grace_period_days` int(11) DEFAULT NULL,
  `disbursement_date` date DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_branch` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `status` enum('Rejected','Pending','Verified','Approved','HigherApproval','Disbursed','Closed') NOT NULL DEFAULT 'Pending',
  `approved_by` varchar(100) DEFAULT NULL,
  `approved_by_id` int(11) NOT NULL DEFAULT 0,
  `approved_date` datetime DEFAULT NULL,
  `higher_approved_by` varchar(100) DEFAULT NULL,
  `higher_approved_by_id` int(11) NOT NULL DEFAULT 0,
  `higher_approved_date` datetime DEFAULT NULL,
  `is_loan_re_updated_after_higher_approval` int(11) NOT NULL DEFAULT 0 COMMENT '0 = No, 1 = Yes',
  `isda_file_name` varchar(255) DEFAULT NULL,
  `isda_signed_upload_path` varchar(255) DEFAULT NULL,
  `isada_upload_date` date DEFAULT NULL,
  `isada_upload_by` int(11) NOT NULL DEFAULT 0,
  `isda_is_verified` int(11) NOT NULL DEFAULT 0,
  `isda_rejection_reason_id` int(11) NOT NULL DEFAULT 0,
  `isda_verified_by_id` int(11) NOT NULL DEFAULT 0,
  `isda_verified_on` timestamp NULL DEFAULT NULL,
  `org_signed_file_name` varchar(255) DEFAULT NULL,
  `org_is_verified` int(11) NOT NULL DEFAULT 0,
  `org_rejection_reason_id` int(11) NOT NULL DEFAULT 0,
  `org_verified_by_id` int(11) NOT NULL DEFAULT 0,
  `org_verified_on` timestamp NULL DEFAULT NULL,
  `video_consent_is_verified` int(11) NOT NULL DEFAULT 0,
  `video_consent_rejection_reason_id` int(11) NOT NULL DEFAULT 0,
  `video_consent_verified_by_id` int(11) NOT NULL DEFAULT 0,
  `video_consent_verified_on` timestamp NULL DEFAULT NULL,
  `org_signed_upload_path` varchar(255) DEFAULT NULL,
  `org_signed_upload_date` date DEFAULT NULL,
  `org_signed_upload_by` int(11) NOT NULL DEFAULT 0,
  `video_consent_file_name` varchar(250) DEFAULT NULL,
  `video_consent_path` varchar(250) DEFAULT NULL,
  `video_consent_upload_date` date DEFAULT NULL,
  `video_consent_uploaded_by_user_id` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `loan_reject_reason_id` bigint(20) UNSIGNED DEFAULT NULL,
  `loan_reject_by_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_temp_rejection` tinyint(4) NOT NULL DEFAULT 0,
  `has_fixed_temp_rejection` tinyint(4) NOT NULL DEFAULT 0,
  `loan_reject_date` timestamp NULL DEFAULT NULL,
  `temp_reject_fix_date` timestamp NULL DEFAULT NULL,
  `is_ack_downloaded` tinyint(4) NOT NULL DEFAULT 0,
  `is_sent_for_approval` tinyint(4) NOT NULL DEFAULT 0,
  `ack_downloaded_date` timestamp NULL DEFAULT NULL,
  `client_status` int(11) NOT NULL DEFAULT 1 COMMENT '1=New Customer, 0=Existing Customer',
  `any_existing_loan` int(11) NOT NULL DEFAULT 0 COMMENT '1=Yes, 0=No',
  `existing_loan_amt` double DEFAULT 0,
  `existing_loan_id` int(11) NOT NULL DEFAULT 0,
  `is_elegible` int(11) NOT NULL DEFAULT 1 COMMENT '1=elegible, 0=Not Elegible',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loan_applications`
--

INSERT INTO `loan_applications` (`id`, `company_id`, `customer_id`, `organisation_id`, `loan_type`, `purpose`, `purpose_id`, `other_purpose_text`, `loan_amount_applied`, `loan_amount_approved`, `tenure_fortnight`, `emi_amount`, `interest_rate`, `total_no_emi`, `next_due_date`, `elegible_amount`, `min_repay_amt_for_next_loan`, `total_repay_amt`, `total_interest_amt`, `processing_fee`, `grace_period_days`, `disbursement_date`, `bank_name`, `bank_branch`, `bank_account_no`, `status`, `approved_by`, `approved_by_id`, `approved_date`, `higher_approved_by`, `higher_approved_by_id`, `higher_approved_date`, `is_loan_re_updated_after_higher_approval`, `isda_file_name`, `isda_signed_upload_path`, `isada_upload_date`, `isada_upload_by`, `isda_is_verified`, `isda_rejection_reason_id`, `isda_verified_by_id`, `isda_verified_on`, `org_signed_file_name`, `org_is_verified`, `org_rejection_reason_id`, `org_verified_by_id`, `org_verified_on`, `video_consent_is_verified`, `video_consent_rejection_reason_id`, `video_consent_verified_by_id`, `video_consent_verified_on`, `org_signed_upload_path`, `org_signed_upload_date`, `org_signed_upload_by`, `video_consent_file_name`, `video_consent_path`, `video_consent_upload_date`, `video_consent_uploaded_by_user_id`, `remarks`, `loan_reject_reason_id`, `loan_reject_by_id`, `is_temp_rejection`, `has_fixed_temp_rejection`, `loan_reject_date`, `temp_reject_fix_date`, `is_ack_downloaded`, `is_sent_for_approval`, `ack_downloaded_date`, `client_status`, `any_existing_loan`, `existing_loan_amt`, `existing_loan_id`, `is_elegible`, `created_at`, `updated_at`) VALUES
(1, 2, 8, 2, 1, '', NULL, NULL, 10000, NULL, 5, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo bank', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo First Loan Application data', NULL, NULL, 0, 0, NULL, NULL, 0, 1, NULL, 1, 0, NULL, 0, 1, '2025-10-21 06:11:38', '2025-12-16 02:59:03'),
(2, 1, 1, 1, 2, '', NULL, NULL, 855, NULL, 2, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'demo', 'demo', '8564789320', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'second demo loan application data', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-21 06:14:23', '2025-10-21 06:14:23'),
(3, 1, 9, 2, 1, '', NULL, NULL, 999, NULL, 20, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Latest One', NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-12-06 02:19:10', 1, 0, NULL, 0, 1, '2025-10-21 06:53:25', '2025-12-06 02:19:10'),
(4, 1, 9, 2, 1, '', NULL, NULL, 999, NULL, 20, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Latest One', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-21 06:54:31', '2025-10-21 06:54:31'),
(5, 1, 11, 1, 1, '', NULL, NULL, 2000, NULL, 30, NULL, 15, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '783456568985', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 00:33:22', '2025-10-22 00:33:22'),
(6, 1, 12, 1, 1, '', NULL, NULL, 2500, NULL, 25, NULL, 22, NULL, NULL, NULL, NULL, NULL, NULL, 30, NULL, NULL, 'demo bank', 'demo branch', '883456568986', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo Remarks', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:15:36', '2025-10-22 02:15:36'),
(7, 2, 13, 2, 1, '', NULL, NULL, 3000, NULL, 35, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 22, NULL, NULL, 'PNG Bank', 'PNG Bank Branch', '873456568686', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Some Remarks', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:25:04', '2025-10-22 02:25:04'),
(8, 1, 14, 1, 1, '', NULL, NULL, 3200, NULL, 35, NULL, 25, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '883458568987', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:34:31', '2025-10-22 02:34:31'),
(9, 1, 15, 1, 1, '', NULL, NULL, 3700, NULL, 35, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '787558568989', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:37:27', '2025-10-22 02:37:27'),
(10, 1, 16, 2, 1, '', NULL, NULL, 4500, NULL, 36, NULL, 30, NULL, NULL, NULL, NULL, NULL, NULL, 22, NULL, NULL, 'demo bank', 'demo branch', '783100568988', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:49:02', '2025-10-22 02:49:02'),
(11, 1, 17, 1, 2, '', NULL, NULL, 5000, NULL, 40, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '873456568686', 'Approved', 'Jyotirmoy Saha', 0, '2025-10-29 10:49:40', NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-22 06:32:09', '2025-10-29 05:19:40'),
(12, 1, 1, 1, 1, '', NULL, NULL, 742.5, NULL, 60, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '873456568686', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'efce', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-30 06:43:44', '2025-10-30 06:43:44'),
(13, 1, 18, 1, 1, '', NULL, NULL, 700, NULL, 26, NULL, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '787512368980', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Some remarks\nwith formula', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-31 02:25:55', '2025-10-31 02:25:55'),
(14, 1, 2, 1, 1, '', NULL, NULL, 700, NULL, 26, 43.37, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'PNG Bank', 'PNG Bank Branch', '725456568988', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/QThQZSKpHvmmOrbXFgT0BwVc28zsYdfrmswAUeHM.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-10-31 03:46:12', '2025-11-03 06:35:34'),
(15, 1, 2, 1, 1, '', NULL, NULL, 700, NULL, 26, 43.37, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/8ZSLHx1jOx9JoOK1Gfy8IKwmvjrvmXfvRcLS7IY0.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 'movie.mp4', '/storage/uploads/video_consents/GIN2UNiABCnN7CQUnhqQL81xKwUiD8Hpf9zc2Pq5.mp4', '2025-11-04', 1, 'Some Remarks', NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, NULL, 0, 1, '2025-11-04 00:49:14', '2025-11-04 00:57:51'),
(16, 1, 10, 1, 1, '', NULL, NULL, 900, 0, 26, 55.77, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 03:45:19', '2025-11-04 03:45:19'),
(17, 1, 3, 1, 1, '', NULL, NULL, 900, 0, 26, 55.77, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:14:48', '2025-11-04 04:14:48'),
(18, 1, 3, 1, 1, '', NULL, NULL, 900, 0, 26, 0, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:23:03', '2025-11-04 04:23:03'),
(19, 1, 1, 1, 1, '', NULL, NULL, 900, 0, 26, 55.765384615385, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:44:06', '2025-11-04 04:44:06'),
(20, 1, 5, 1, 1, '', NULL, NULL, 900, 0, 26, 55.765384615385, 2.35, NULL, NULL, 1664.99, 0, 1449.9, 549.9, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:56:46', '2025-11-04 04:56:46'),
(21, 2, 4, 2, 0, NULL, NULL, NULL, 1650, 0, 0, 0, 0, NULL, NULL, 1604.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 0, '2025-11-04 05:43:56', '2025-11-04 05:43:56'),
(22, 1, 22, 1, 1, '', NULL, NULL, 1100, 0, 26, 68.157692307692, 2.35, NULL, NULL, 1168.99, 0, 1772.1, 672.1, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 05:59:36', '2025-11-04 05:59:36'),
(23, 1, 23, 1, 0, NULL, NULL, NULL, 1600, 1600, 0, 99.14, 0, NULL, NULL, 1529.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'HigherApproval', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-11-24 06:38:27', 1, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 06:24:19', '2025-11-24 01:13:06'),
(24, 2, 4, 2, 1, '', NULL, NULL, 1000, 1000, 26, 61.961538461538, 2.35, 26, '2026-11-23', 1559.99, 1288.8, 1611, 611, 20, NULL, '2025-11-11', NULL, NULL, NULL, 'Closed', 'Jyotirmoy Saha', 1, '2025-11-11 12:22:48', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/NtZWru4dXXqAIXnZX27aBu1n45Ob3cOdW783m67p.pdf', '2025-11-11', 1, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/VwXDZ8LU9yfH9pNzfN4bXoD0ujUYG6WbBiajsxFh.pdf', '2025-11-11', 1, 'movie.mp4', '/storage/uploads/video_consents/toKq4cWL5KyzFxogFx5uC7sNRtoJy89QwmtPT7Al.mp4', '2025-11-11', 1, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-04 06:38:26', '2025-12-08 06:22:28'),
(25, 1, 3, 1, 1, '', NULL, NULL, 1300, 1300, 26, 80.55, 2.35, 26, NULL, 1499.99, 1675.44, 2094.3, 794.3, 20, NULL, '2025-11-11', NULL, NULL, NULL, 'Closed', 'Jyotirmoy Saha', 1, '2025-11-11 12:08:05', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/4GTjOmsBUbFF6CZEbGJAV1Uz6tEuXAB21pAhDD0g.pdf', '2025-11-11', 1, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/wbm0nIOqiqOnq5FJTQn3jVYcVObGywQkfYtNJsGx.pdf', '2025-11-11', 1, 'movie.mp4', '/storage/uploads/video_consents/zEVW8XjdkdmWyAv5ce5XzRNLaT4KMCmh7LSdVL5W.mp4', '2025-11-11', 1, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-05 22:49:09', '2025-12-23 07:31:46'),
(26, 1, 2, 1, 1, '', NULL, NULL, 1300, 1300, 52, 55.55, 2.35, 52, '2025-12-10', 1559.99, 0, 2888.6, 1588.6, 20, NULL, '2025-11-10', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-11-10 06:36:39', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/wHbToywaXrDnQVZvZ6CjtIVeT5u3Q0xLtj1GcG0n.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/lKD4TytWYYs5S5Q8gNYos7JaXWtqTu7PmzkrzCpt.pdf', '2025-11-10', 1, 'movie.mp4', '/storage/uploads/video_consents/2fuzW4GC77v2Szx2ODdtrklU16MFDMv1oUaAZxGI.mp4', '2025-11-07', 1, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-06 05:29:10', '2025-12-01 03:05:45'),
(27, 1, 24, 1, 2, '', NULL, NULL, 1100, 0, 26, 64.307692307692, 2, NULL, NULL, 1559.99, 0, 1672, 572, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-11-28 04:22:36', 1, 0, 0, 0, 1, '2025-11-12 00:38:32', '2025-11-28 04:22:36'),
(28, 1, 26, 1, 0, NULL, NULL, NULL, 1600, 1600, 0, 70.93, 0, NULL, NULL, 1564.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'HigherApproval', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-11-21 08:23:20', 1, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-19 01:40:19', '2025-11-21 03:00:02'),
(29, 1, 27, 1, 1, '', NULL, NULL, 1200, 1200, 26, 74.353846153846, 2.35, 26, '2026-12-07', 1564.99, 1546.56, 1933.2, 733.2, 20, NULL, '2025-11-19', NULL, NULL, NULL, 'Closed', 'user', 2, '2025-11-19 08:06:49', NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-19 01:42:16', '2025-12-08 06:22:28'),
(30, 1, 28, 1, 0, NULL, NULL, NULL, 1600, 1600, 0, 99.14, 0, NULL, NULL, 1559.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'HigherApproval', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-11-24 07:34:51', 1, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-11-24 02:03:10', '2025-11-24 02:06:21'),
(31, 1, 29, 1, 1, '', NULL, NULL, 1200, 0, 26, 74.35, 2.35, NULL, NULL, 1404.99, 0, 1933.2, 733.2, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-11-28 03:58:53', 1, 0, 0, 0, 1, '2025-11-24 02:22:28', '2025-11-28 03:58:53'),
(32, 1, 30, 1, 1, '', NULL, NULL, 2500, 2500, 26, 154.9, 2.35, NULL, NULL, 2459.99, 0, 4027.5, 1527.5, 20, NULL, NULL, NULL, NULL, NULL, 'Rejected', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-11-25 05:17:31', 1, NULL, '/storage/uploads/isda_signed/1jHjQPm4thtnXK91KMzFTBrautXnJAe6zKPS3Thg.pdf', '2025-11-27', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/ku6RiO42U1snAHPsJ8jNzMFSLSuuNJuRlcABKgsD.pdf', '2025-11-27', 2, 'movie.mp4', '/storage/uploads/video_consents/RTBPNiU0fVjjdMpSLsvd3pXmu1dLISEOTSUEEdTc.mp4', '2025-11-27', 2, NULL, 3, 1, 1, 0, '2025-11-27 03:52:18', NULL, 1, 0, '2025-11-25 00:50:47', 1, 0, 0, 0, 1, '2025-11-24 23:27:53', '2025-11-27 03:52:18'),
(33, 1, 31, 1, 1, '', NULL, NULL, 4000, 4000, 26, 247.85, 2.35, 26, NULL, 3439.99, 0, 6444, 2444, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-11-28 11:16:20', 1, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-11-28 05:47:02', 1, 0, 0, 0, 1, '2025-11-28 05:17:40', '2025-11-28 05:47:02'),
(34, 1, 32, 1, 1, '', NULL, NULL, 1100, 0, 10, 135.85, 2.35, NULL, NULL, 1414.99, 0, 1358.5, 258.5, 20, NULL, NULL, NULL, NULL, NULL, 'Rejected', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/ZSxJl3h1xR49D74nJoPyGnleZeZZiVvV8uKxNMRB.pdf', '2025-11-28', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/LTzJFMtk0UrLhidiwkHqxmRSZBOdIQ7GXsSpsvT0.pdf', '2025-11-28', 2, 'movie.mp4', '/storage/uploads/video_consents/0SobB6QBUGXAjkZQrBvbs9imKlBBIOhjAmQiBtzk.mp4', '2025-11-28', 2, NULL, 3, 1, 1, 1, '2025-11-28 06:08:55', NULL, 1, 0, '2025-11-28 06:04:14', 1, 0, 0, 0, 1, '2025-11-28 05:58:33', '2025-12-01 01:37:26'),
(35, 1, 33, 1, 1, '', NULL, NULL, 1400, 1400, 14, 132.9, 2.35, 14, '2025-12-15', 1564.99, 1488.48, 1860.6, 460.6, 20, NULL, '2025-12-01', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-12-01 08:21:18', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/W4CIVZTb5P36Cblts7RRxPzAcvWTIjyyXQvkhgCl.pdf', '2025-12-01', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/nbbbo0e3UNkYGNL2kXMWt222GTAqDP0v9cyUKLbq.pdf', '2025-12-01', 2, 'movie.mp4', '/storage/uploads/video_consents/0K7csUeBOPVBYuIbpXCEViaAhnkeXKiXuK7tlPeQ.mp4', '2025-12-01', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-12-01 02:48:57', 1, 0, 0, 0, 1, '2025-12-01 02:40:31', '2025-12-01 02:51:18'),
(36, 1, 34, 1, 1, '', NULL, NULL, 1800, 1800, 20, 132.3, 2.35, 20, NULL, 1709.99, 0, 2646, 846, 20, NULL, NULL, NULL, NULL, NULL, 'Rejected', NULL, 0, NULL, 'Jyotirmoy Saha', 1, '2025-12-01 08:23:56', 1, NULL, '/storage/uploads/isda_signed/DVpuTLtc0UZIK045O3cvP3MgFSh6q48kv383kdlx.pdf', '2025-12-01', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/RXrRc8yLTTNlkBhiD56IPeT7Z1L7Qncbxptt3euK.pdf', '2025-12-01', 2, 'movie.mp4', '/storage/uploads/video_consents/Q5xts1kHUknWjngiiBPP6m9mVR5dVN5R0JrzKwxx.mp4', '2025-12-01', 2, NULL, 4, 1, 0, 0, '2025-12-01 03:01:36', NULL, 1, 0, '2025-12-01 02:56:14', 1, 0, 0, 0, 1, '2025-12-01 02:53:13', '2025-12-01 03:01:36'),
(37, 1, 22, 1, 1, 'Personal Expenses', 2, NULL, 900, 900, 24, 58.65, 2.35, 24, '2025-12-25', 969.99, 1126.08, 1407.6, 507.6, 20, NULL, '2025-12-11', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-12-11 13:53:18', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/8aJo5PV2YfbuvdUUCeyCHObmNnaCHIrx4mAurECC.pdf', '2025-12-11', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/WERqYewY4uHq0GRZ566yWa6qQBvjELV49bU0Z9Qe.pdf', '2025-12-11', 2, 'movie.mp4', '/storage/uploads/video_consents/LPYdrMJGY6cRkCB9p6pIf4LZjkz5IhUZwq4mXo23.mp4', '2025-12-11', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, NULL, 1, 0, 0, 0, 1, '2025-12-11 08:02:30', '2025-12-11 08:23:18'),
(38, 1, 35, 1, 1, 'Personal Expenses', 2, NULL, 1200, 0, 22, 82.75, 2.35, NULL, NULL, 1657.49, 0, 1820.4, 620.4, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/4WeYvlazzzgetGEIVmWmTLTCT2O4RrNp1wX1fb37.pdf', '2025-12-12', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/q2Bprx8pN95qePJ310YnQk8wfZESI8bFF5RiDaJU.pdf', '2025-12-12', 2, 'movie.mp4', '/storage/uploads/video_consents/UFoquHeZ0YXjcUuFVtj7J0Zi9q6xRvUtNRJVY4lx.mp4', '2025-12-12', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 1, '2025-12-11 23:11:36', 1, 0, 0, 0, 1, '2025-12-11 23:00:06', '2025-12-11 23:12:28'),
(39, 1, 36, 1, 1, 'Personal Expenses', 2, NULL, 1200, 1200, 22, 82.75, 2.35, 22, '2025-12-26', 1487.49, 1456.32, 1820.4, 620.4, 20, NULL, '2025-12-12', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-12-12 07:49:32', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/XCHzd72VsauXuyRWBze4FbIC4kQpcMMuEK6a8IK4.pdf', '2025-12-12', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/1QncPwIW34keD5ccjSW6v9yhWda2wj9X9JYA5A62.pdf', '2025-12-12', 2, 'movie.mp4', '/storage/uploads/video_consents/lBSQ9UHY5XrMMKr236ktez9b6GmUVY0AyGwRfodH.mp4', '2025-12-12', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 1, '2025-12-12 02:10:39', 1, 0, 0, 0, 1, '2025-12-12 02:08:45', '2025-12-12 02:19:32'),
(40, 1, 37, 1, 1, 'School Fee', 1, NULL, 1400, 0, 22, 96.54, 2.35, NULL, NULL, 1499.98, 0, 2123.8, 723.8, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-15 00:33:38', '2025-12-15 00:33:38'),
(41, 1, 38, 1, 1, 'Funeral Expenses', 3, NULL, 1300, 0, 12, 138.88, 2.35, NULL, NULL, 1507.49, 0, 1666.6, 366.6, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-15 00:51:50', '2025-12-15 00:51:50'),
(42, 1, 39, 1, 1, 'Personal Expenses', 2, NULL, 1400, 0, 20, 102.9, 2.35, NULL, NULL, 1563.58, 0, 2058, 658, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-15 02:41:59', '2025-12-15 02:41:59'),
(43, 1, 40, 1, 1, 'Personal Expenses', 2, NULL, 1400, 0, 22, 89.64, 2.35, NULL, NULL, 1481.73, 0, 1972.1, 672.1, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-15 05:26:41', '2025-12-15 05:26:41'),
(44, 1, 41, 1, 1, 'Funeral Expenses', 3, NULL, 1300, 0, 5, 290.55, 2.35, NULL, NULL, 1480.58, 0, 1452.75, 152.75, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-15 23:49:12', '2025-12-15 23:49:12'),
(45, 1, 43, 1, 1, 'Personal Expenses', 2, NULL, 1200, 0, 5, 268.2, 2.35, NULL, NULL, 1475.75, 0, 1341, 141, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/KYL3pmhhGhjoz7uX3DHxqfQnqoE9owv7q6CZW82S.pdf', '2025-12-16', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/qRIkGMXH0I20YNG71cmTx2GHhKgVGETMiAVyGcYi.pdf', '2025-12-16', 2, 'movie.mp4', '/storage/uploads/video_consents/PpqTL48vJspnGr3eYlJvOKVL8JIGjBGqpormLJMu.mp4', '2025-12-16', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-12-16 02:57:07', 1, 0, 0, 0, 1, '2025-12-16 02:55:47', '2025-12-16 05:31:12'),
(46, 1, 31, 1, 1, NULL, NULL, NULL, 1500, 0, 22, 103.43, 2.35, NULL, NULL, 3340.25, 0, 2275.5, 775.5, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 01:57:05', '2025-12-17 01:57:05'),
(47, 1, 22, 1, 2, NULL, NULL, NULL, 3000, 0, 10, 360, 2, NULL, NULL, 3213.99, 0, 3600, 600, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 02:46:45', '2025-12-17 02:46:45'),
(48, 1, 24, 1, 1, NULL, NULL, NULL, 2000, 0, 24, 130.33, 2.35, NULL, NULL, 2454.99, 0, 3128, 1128, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 05:26:09', '2025-12-17 05:26:09'),
(49, 1, 24, 1, 1, 'School Fee', 1, NULL, 2000, 0, 5, 447, 2.35, NULL, NULL, 2914.99, 0, 2235, 235, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 05:50:23', '2025-12-17 05:50:23'),
(50, 1, 24, 1, 1, 'Personal Expenses', 2, NULL, 1500, 0, 22, 103.43, 2.35, NULL, NULL, 2958.99, 0, 2275.5, 775.5, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 05:53:07', '2025-12-17 05:53:07'),
(51, 1, 24, 1, 1, 'Personal Expenses', 2, NULL, 1600, 0, 20, 117.6, 2.35, NULL, NULL, 2964.99, 0, 2352, 752, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 05:56:15', '2025-12-17 05:56:15'),
(52, 1, 24, 1, 1, 'School Fee', 1, NULL, 1600, 0, 5, 0, 2.35, NULL, NULL, 2964.99, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 05:57:45', '2025-12-17 05:57:45'),
(53, 1, 24, 1, 1, 'Personal Expenses', 2, NULL, 1500, 0, 25, 95.25, 2.35, NULL, NULL, 2964.99, 0, 2381.25, 881.25, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 06:40:20', '2025-12-17 06:40:20'),
(54, 1, 24, 1, 1, NULL, NULL, NULL, 2000, 0, 5, 447, 2.35, NULL, NULL, 2964.99, 0, 2235, 235, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 08:35:43', '2025-12-17 08:35:43'),
(55, 1, 24, 1, 1, NULL, NULL, NULL, 2800, 0, 5, 625.8, 2.35, NULL, NULL, 2964.99, 0, 3129, 329, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-17 08:39:26', '2025-12-17 08:39:26'),
(56, 1, 24, 1, 1, NULL, NULL, NULL, 2550, 0, 25, 184.09, 2.35, NULL, NULL, 2964.99, 0, 4602.1625, 1703.1625, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/bZStCuGrotqKQxU06UmH0M8bgU87Ct3VXK89kAyY.pdf', '2026-01-12', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/ltK0EaMGVjqxKNJlUOygSAOTbVdyqW0H2Bgp2ezG.pdf', '2026-01-12', 2, 'movie.mp4', '/storage/uploads/video_consents/iFzXDByKMgFdsZzla6TcDWW2k56OL72nde2OSHAc.mp4', '2026-01-12', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 1, '2026-01-12 06:42:05', 1, 0, 0, 0, 1, '2025-12-17 08:42:00', '2026-01-12 06:44:44'),
(57, 1, 24, 1, 1, 'School Fee', 1, NULL, 2550, 2550, 25, 161.93, 2.35, 25, '2026-01-01', 2964.99, 3238.5, 4048.125, 1498.125, 20, NULL, '2025-12-18', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-12-18 08:02:26', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/dLN4QXbJej2ZEwpJvbn4O83NOxU3PhF5lGOmxFED.pdf', '2025-12-18', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/aATKWeh1ePof4M8jA6TWtT09ub3ZIG2hP3xNtCXd.pdf', '2025-12-18', 2, 'movie.mp4', '/storage/uploads/video_consents/OJkgUPLwOa7FPypo3PBoihBSjFr1P8b9kzvNdzge.mp4', '2025-12-18', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 1, '2025-12-18 02:31:43', 1, 0, 0, 0, 1, '2025-12-17 08:52:28', '2025-12-18 02:32:26'),
(58, 1, 24, 1, 1, NULL, 2, NULL, 2000, 2000, 22, 137.91, 2.35, 22, '2026-01-01', 2964.99, 2427.2, 3034, 1034, 20, NULL, '2025-12-18', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-12-18 07:59:33', NULL, 0, NULL, 0, NULL, '/storage/uploads/isda_signed/9sDQz3fM3U3wrIGWJVxJefD4HXBEiL9Rktr8unyM.pdf', '2025-12-18', 2, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/GN2xRJCIFKMP2latZw1Kaug2XhAJdG26wyvyJTgY.pdf', '2025-12-18', 2, 'movie.mp4', '/storage/uploads/video_consents/6kKxHpZOdcxTQo0Sb8rHjahqGQCrgTOYWPoYScWD.mp4', '2025-12-18', 2, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 1, '2025-12-18 02:28:32', 1, 0, 0, 0, 1, '2025-12-18 01:32:38', '2025-12-18 02:29:33'),
(59, 1, 44, 4, 2, NULL, 3, NULL, 1200, 0, 22, 78.55, 2, NULL, NULL, 1208.99, 0, 1728, 528, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 0, 0, NULL, 1, 0, 0, 0, 1, '2025-12-18 06:51:17', '2025-12-18 06:51:17'),
(60, 1, 44, 4, 2, NULL, 4, NULL, 1200, 0, 25, 72, 2, NULL, NULL, 1214.99, 0, 1800, 600, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2025-12-23 04:54:37', 1, 0, 0, 0, 1, '2025-12-23 04:45:49', '2025-12-23 04:54:37'),
(62, 1, 46, 2, 1, NULL, 2, NULL, 2500, 0, 15, 225.42, 2.35, NULL, NULL, 2964.99, 0, 3381.25, 881.25, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2026-01-09 01:16:46', 1, 0, 0, 0, 1, '2026-01-09 01:15:13', '2026-01-09 01:16:46'),
(63, 1, 47, 4, 2, NULL, 4, NULL, 2500, 0, 20, 175, 2, NULL, NULL, 3214.99, 0, 3500, 1000, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 1, 0, '2026-01-09 03:00:29', 1, 0, 0, 0, 1, '2026-01-09 02:56:09', '2026-01-09 03:00:29');

-- --------------------------------------------------------

--
-- Table structure for table `loan_purposes`
--

CREATE TABLE `loan_purposes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purpose_name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loan_purposes`
--

INSERT INTO `loan_purposes` (`id`, `purpose_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'School Fee', 1, '2025-12-17 22:56:55', '2025-12-17 22:56:55'),
(2, 'Personal Expenses', 1, '2025-12-17 22:56:55', '2025-12-17 22:56:55'),
(3, 'Funeral Expenses', 1, '2025-12-17 22:56:55', '2025-12-17 22:56:55'),
(4, 'Refinancing', 1, '2025-12-17 22:56:55', '2025-12-17 22:56:55'),
(5, 'Other', 1, '2025-12-17 22:56:55', '2025-12-17 22:56:55'),
(8, 'new purpose', 1, '2026-01-09 02:39:56', '2026-01-09 02:39:56');

-- --------------------------------------------------------

--
-- Table structure for table `loan_settings`
--

CREATE TABLE `loan_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_desc` varchar(100) DEFAULT NULL,
  `org_id` int(11) NOT NULL DEFAULT 0,
  `slab_id` int(11) NOT NULL DEFAULT 2,
  `min_loan_amount` double NOT NULL DEFAULT 0,
  `max_loan_amount` double NOT NULL DEFAULT 0,
  `interest_rate` double NOT NULL DEFAULT 0,
  `amt_multiplier` int(11) NOT NULL DEFAULT 0,
  `min_loan_term_months` int(11) NOT NULL DEFAULT 0,
  `max_loan_term_months` int(11) NOT NULL DEFAULT 0,
  `process_fees` double NOT NULL DEFAULT 0,
  `min_repay_percentage_for_next_loan` int(11) NOT NULL DEFAULT 0,
  `late_fees` double(12,2) NOT NULL DEFAULT 0.00,
  `installment_frequency_in_days` int(11) NOT NULL DEFAULT 0,
  `tier1_min_amount` decimal(10,2) DEFAULT 200.00,
  `tier1_max_amount` decimal(10,2) DEFAULT 300.00,
  `tier1_min_term` int(11) DEFAULT 1,
  `tier1_max_term` int(11) DEFAULT 1,
  `tier2_min_amount` decimal(10,2) DEFAULT 350.00,
  `tier2_max_amount` decimal(10,2) DEFAULT 600.00,
  `tier2_min_term` int(11) DEFAULT 5,
  `tier2_max_term` int(11) DEFAULT 8,
  `tier3_min_amount` decimal(10,2) DEFAULT 550.00,
  `tier3_max_amount` decimal(10,2) DEFAULT 950.00,
  `tier3_min_term` int(11) DEFAULT 5,
  `tier3_max_term` int(11) DEFAULT 26,
  `tier4_min_amount` decimal(10,2) DEFAULT 951.00,
  `tier4_max_amount` decimal(10,2) DEFAULT 20000.00,
  `tier4_min_term` int(11) DEFAULT 5,
  `tier4_max_term` int(11) DEFAULT 52,
  `effect_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loan_settings`
--

INSERT INTO `loan_settings` (`id`, `loan_desc`, `org_id`, `slab_id`, `min_loan_amount`, `max_loan_amount`, `interest_rate`, `amt_multiplier`, `min_loan_term_months`, `max_loan_term_months`, `process_fees`, `min_repay_percentage_for_next_loan`, `late_fees`, `installment_frequency_in_days`, `tier1_min_amount`, `tier1_max_amount`, `tier1_min_term`, `tier1_max_term`, `tier2_min_amount`, `tier2_max_amount`, `tier2_min_term`, `tier2_max_term`, `tier3_min_amount`, `tier3_max_amount`, `tier3_min_term`, `tier3_max_term`, `tier4_min_amount`, `tier4_max_amount`, `tier4_min_term`, `tier4_max_term`, `effect_date`, `end_date`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'New', 1, 2, 200, 20000, 2.35, 50, 5, 52, 20, 80, 0.00, 14, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, NULL, NULL, 1, '2025-10-30 02:59:39', '2025-10-30 02:59:39'),
(2, 'Consolidation', 1, 1, 100, 20000, 2, 50, 5, 52, 20, 80, 0.00, 14, 100.00, 100.00, 4, 4, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, NULL, NULL, 1, '2025-10-30 02:59:39', '2025-10-30 02:59:39'),
(3, 'Rollover', 1, 3, 5000, 20000, 2.35, 50, 5, 52, 40, 80, 0.00, 14, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, NULL, NULL, 1, '2025-10-30 02:59:39', '2025-11-12 01:39:00'),
(4, 'Top-Up', 1, 2, 200, 20000, 2.35, 50, 5, 52, 20, 80, 0.00, 14, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, NULL, NULL, 1, '2025-10-30 02:59:39', '2025-10-30 02:59:39'),
(5, 'New 1', 1, 2, 100, 0, 0, 0, 0, 0, 0, 0, 0.00, 0, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, NULL, NULL, 0, NULL, NULL),
(6, 'High Value', 0, 2, 5000, 15000, 5, 50, 8, 52, 20, 85, 0.00, 0, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, '2025-11-17', '2025-12-31', 0, '2025-11-17 05:48:03', '2025-11-17 05:48:03'),
(7, 'New Loan Type', 0, 2, 200, 20000, 2.35, 50, 5, 26, 10, 80, 0.00, 0, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, '2025-11-24', '2025-12-31', 0, '2025-11-24 01:54:33', '2025-11-24 01:54:33'),
(9, 'Test Loan Description', 0, 2, 500, 50000, 20, 50, 10, 52, 20, 80, 0.00, 0, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, '2025-12-19', NULL, 0, '2025-12-19 02:02:31', '2025-12-19 02:02:31');

-- --------------------------------------------------------

--
-- Table structure for table `loan_temp_customers`
--

CREATE TABLE `loan_temp_customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `organisation_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `marital_status` varchar(255) DEFAULT NULL,
  `no_of_dependents` int(11) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `employee_no` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `date_joined` date DEFAULT NULL,
  `monthly_salary` decimal(10,2) DEFAULT NULL,
  `work_location` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loan_tier_rules`
--

CREATE TABLE `loan_tier_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_setting_id` bigint(20) UNSIGNED NOT NULL,
  `tier_type` varchar(50) DEFAULT NULL,
  `min_amount` decimal(10,2) NOT NULL,
  `max_amount` decimal(10,2) NOT NULL,
  `min_term_fortnight` int(11) DEFAULT NULL,
  `max_term_fortnight` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loan_tier_rules`
--

INSERT INTO `loan_tier_rules` (`id`, `loan_setting_id`, `tier_type`, `min_amount`, `max_amount`, `min_term_fortnight`, `max_term_fortnight`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tier 1', 200.00, 300.00, 5, 5, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(2, 1, 'Tier 2', 350.00, 600.00, 5, 8, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(3, 1, 'Tier 3', 550.00, 950.00, 5, 26, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(4, 1, 'Tier 4', 951.00, 20000.00, 5, 52, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(5, 2, 'Tier 1', 200.00, 300.00, 5, 5, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(6, 2, 'Tier 2', 350.00, 600.00, 5, 8, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(7, 2, 'Tier 3', 550.00, 950.00, 5, 26, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(8, 2, 'Tier 4', 951.00, 20000.00, 5, 52, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(9, 3, 'Tier 1', 200.00, 300.00, 5, 5, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(10, 3, 'Tier 2', 350.00, 600.00, 5, 8, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(11, 3, 'Tier 3', 550.00, 950.00, 5, 26, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(12, 3, 'Tier 4', 951.00, 20000.00, 5, 52, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(13, 4, 'Tier 1', 200.00, 300.00, 5, 5, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(14, 4, 'Tier 2', 350.00, 600.00, 5, 8, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(15, 4, 'Tier 3', 550.00, 950.00, 5, 26, '2025-11-06 06:24:32', '2025-11-06 06:24:32'),
(16, 4, 'Tier 4', 951.00, 20000.00, 5, 52, '2025-11-06 06:24:32', '2025-11-06 06:24:32');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_10_14_081845_create_company_master_table', 1),
(6, '2025_10_14_081931_create_organisation_master_table', 1),
(7, '2025_10_14_081932_create_customers_table', 1),
(8, '2025_10_14_083757_create_loan_applications_table', 1),
(9, '2025_10_14_083759_create_document_upload_table', 1),
(10, '2025_10_14_083846_create_installment_details_table', 1),
(11, '2025_10_15_074818_create_loan_temp_customers_table', 2),
(12, '2025_10_23_100717_add_emi_and_repayment_fields_to_loan_applications_table', 3),
(13, '2025_10_23_101809_create_customer_eligibility_history_table', 4),
(14, '2025_10_28_074658_add_more_columns_to_customers_table', 5),
(15, '2025_10_28_080245_add_more_columns_to_loan_applications_table', 5),
(16, '2025_10_30_044626_add_admin_column_to_users_table', 6),
(17, '2025_10_30_045458_create_table_loan_settings_table', 7),
(18, '2025_10_30_054332_add_columns_to_loan_settings_table', 8),
(19, '2025_10_30_073611_add_column_to_loan_settings_table', 9),
(20, '2025_10_30_125447_change_col_type_to_loan_applications_table', 10),
(21, '2025_10_31_061346_add_more_column_to_customers_table', 11),
(22, '2025_10_31_084637_add_one_column_to_loan_applications_table', 12),
(23, '2025_11_03_061735_add_video_consent_column_to_loan_applications', 13),
(24, '2025_11_03_111842_change_column_type_to_document_upload_table', 14),
(25, '2025_11_04_064234_create_all_cust_master_table', 15),
(26, '2025_11_04_072252_add_more_column_to_all_cust_master_table', 16),
(27, '2025_11_04_072852_change_column_type_to_all_cust_master_table', 17),
(28, '2025_11_04_083244_change_column_type_to_loan_applications_table', 18),
(29, '2025_11_04_104133_add_col_to_loan_applications_table', 19),
(30, '2025_11_05_055833_add_user_col_to_document_upload_table', 20),
(31, '2025_11_06_094248_add_tiered_fn_cols_to_loan_settings_table', 21),
(32, '2025_11_06_110102_create_loan_tier_rules_table', 22),
(33, '2025_11_07_082602_add_org_doc_col_to_loan_applications_table', 23),
(34, '2025_11_10_054901_add_user_col_to_loan_applications_table', 24),
(35, '2025_11_10_080253_add_cols_to_installment_details_table', 25),
(36, '2025_11_11_042648_add_cols_to_loan_settings_table', 26),
(37, '2025_11_13_064730_add_new_cols_to_loan_applications_table', 27),
(38, '2025_11_13_091325_create_rejection_reasons_table', 28),
(39, '2025_11_13_091913_create_salary_slabs_table', 28),
(41, '2025_11_17_101442_create_assigned_slabs_under_loan_table', 29),
(42, '2025_11_17_103459_create_table_assigned_loans_under_org_table', 30),
(43, '2025_11_20_094205_add_cols_to_loan_applications_table', 31),
(44, '2025_11_20_194903_add_collection_uid_to_installment_details', 32),
(45, '2025_11_20_184631_add_higher_apprv_user_id_col_to_loan_applications_table', 33),
(46, '2025_11_24_053748_modify_col_loan_applications_table', 34),
(47, '2025_11_24_103427_add_rejection_columns_to_loan_applications_table', 35),
(48, '2025_11_25_061714_add_ack_dwnld_date_col_to_loan_applications_table', 36),
(49, '2025_11_25_100540_add_rejection_columns_to_document_upload_table', 37),
(50, '2025_12_12_035923_add_send_approval_col_to_loan_applications', 38),
(51, '2025_12_15_113604_create_document_types_table', 39),
(52, '2025_12_16_053142_add_emp_code_indexes_to_customer_tables', 40),
(53, '2025_12_16_055208_change_doc_type_enum_to_string_in_document_upload', 41),
(54, '2025_12_18_042540_create_loan_purposes_table', 42),
(55, '2025_12_18_042706_change_purpose_column_type_in_loan_applications_table', 43),
(56, '2025_12_18_042822_add_purpose_id_to_loan_applications_table', 44),
(57, '2025_12_18_042912_map_existing_loan_purposes_to_purpose_id', 45),
(59, '2025_11_13_102526_add_new_cols_to_loan_settings_table', 28),
(60, '2025_11_14_085341_add_org_new_col_to_salary_slabs_table', 28),
(61, '2025_12_02_080226_add_indexes_to_customer_tables', 46),
(62, '2025_12_12_131707_modify_collection_uid_in_installment_details_table', 46),
(63, '2025_12_19_065222_create_assigned_purpose_under_loans_table', 46),
(64, '2025_12_22_104640_create_customer_drafts_table', 47);

-- --------------------------------------------------------

--
-- Table structure for table `organisation_master`
--

CREATE TABLE `organisation_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `organisation_name` varchar(255) NOT NULL,
  `sector_type` enum('Education','Health','Other') NOT NULL DEFAULT 'Other',
  `department_code` varchar(50) DEFAULT NULL,
  `location_code` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_no` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organisation_master`
--

INSERT INTO `organisation_master` (`id`, `company_id`, `organisation_name`, `sector_type`, `department_code`, `location_code`, `address`, `province`, `contact_person`, `contact_no`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Central Government', 'Education', NULL, NULL, 'Waigani, Port Moresby', NULL, NULL, '+675-312-1000', 'contact@gov.pg', 'Active', NULL, NULL),
(2, 1, 'National Bank PNG', 'Health', 'DPT502085', 'LOC753955', 'Banking Street, Lae', 'state', 'demo', '+675-324-2000', 'admin@nbpng.pg', 'Active', NULL, '2025-12-18 07:34:53'),
(3, 1, 'Other Organization edit', 'Other', 'DPT502', '753955', 'demo', 'demo', 'demo person', '7533954680', 'demo@email.com', 'Active', '2025-11-18 23:58:37', '2025-11-19 00:01:22'),
(4, 1, 'New Org', 'Education', 'DPT505', '755855', 'demo', 'demo', 'demo', '7533456680', 'demo@email.com', 'Active', '2025-11-24 01:58:29', '2025-11-24 01:58:29');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rejection_reasons`
--

CREATE TABLE `rejection_reasons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reason_desc` text DEFAULT NULL,
  `do_allow_reapply` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Allows reapply, 0 = Doesn''t allow reapply',
  `reason_type` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Document, 2 = Loan',
  `created_by` int(11) NOT NULL DEFAULT 0 COMMENT 'Created by user id',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rejection_reasons`
--

INSERT INTO `rejection_reasons` (`id`, `reason_desc`, `do_allow_reapply`, `reason_type`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Document is expired or invalid', 0, 1, 0, '2025-11-13 04:24:27', '2025-11-13 04:24:27'),
(2, 'Document is not visually clear', 1, 1, 0, '2025-11-13 04:24:27', '2025-11-13 04:24:27'),
(3, 'Insufficient income to support loan amount', 1, 2, 0, '2025-11-13 04:24:27', '2025-11-13 04:24:27'),
(4, 'Failed background verification', 0, 2, 0, '2025-11-13 04:24:27', '2025-11-13 04:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `salary_slabs`
--

CREATE TABLE `salary_slabs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `org_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `slab_desc` varchar(255) DEFAULT NULL,
  `starting_salary` double(12,2) NOT NULL DEFAULT 0.00,
  `ending_salary` double(12,2) NOT NULL DEFAULT 0.00,
  `active` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_slabs`
--

INSERT INTO `salary_slabs` (`id`, `org_id`, `slab_desc`, `starting_salary`, `ending_salary`, `active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Entry Level', 0.00, 5000.00, 1, '2025-11-13 04:24:38', '2025-11-13 04:24:38'),
(2, 1, 'Mid Level', 5000.00, 15000.00, 1, '2025-11-13 04:24:38', '2025-11-19 02:01:06'),
(3, 1, 'Senior Level', 15000.00, 50000.00, 1, '2025-11-13 04:24:38', '2025-11-21 00:42:20'),
(7, 4, 'New Slab', 20000.00, 100000.00, 1, '2025-12-12 07:32:43', '2025-12-12 07:33:35'),
(8, 4, 'new slab', 30000.00, 50000.00, 1, '2026-01-09 02:36:06', '2026-01-09 02:36:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` int(11) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `is_admin`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Jyotirmoy Saha', 'jsaha.adzguru@gmail.com', NULL, '$2y$12$UNPMbfzj8fXh4G0C0AGAWed5wBan6fM2D.2I2iSNBaJ3jjTeHCTLi', 1, 'prSu5YNZzzkL2VpW9L76QrRyhb06CJx7OrFnkemQiDOYqhKBYPKoKHB6cdrz', '2025-10-14 07:11:33', '2025-10-14 07:11:33'),
(2, 'Normal User', 'user@email.com', NULL, '$2y$12$kMuJMhShl93leEdBLLsJ/eb9Dmn/Jq438R2fTY/t7hTuKTkzoQVc2', 0, NULL, '2025-11-19 01:50:47', '2025-11-28 05:49:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `all_cust_master`
--
ALTER TABLE `all_cust_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_all_cust_master_emp_code` (`emp_code`),
  ADD KEY `idx_allcust_empcode` (`emp_code`);

--
-- Indexes for table `assigned_loans_under_org`
--
ALTER TABLE `assigned_loans_under_org`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assigned_purpose_under_loans`
--
ALTER TABLE `assigned_purpose_under_loans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assigned_slabs_under_loan`
--
ALTER TABLE `assigned_slabs_under_loan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_master`
--
ALTER TABLE `company_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_company_id_foreign` (`company_id`),
  ADD KEY `customers_organisation_id_foreign` (`organisation_id`),
  ADD KEY `idx_customers_employee_no` (`employee_no`),
  ADD KEY `idx_customers_employeeno` (`employee_no`);

--
-- Indexes for table `customer_drafts`
--
ALTER TABLE `customer_drafts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_drafts_user_id_unique` (`user_id`);

--
-- Indexes for table `customer_eligibility_history`
--
ALTER TABLE `customer_eligibility_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_eligibility_history_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `document_types_doc_key_unique` (`doc_key`);

--
-- Indexes for table `document_upload`
--
ALTER TABLE `document_upload`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document_upload_loan_id_foreign` (`loan_id`),
  ADD KEY `document_upload_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `installment_details`
--
ALTER TABLE `installment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `installment_details_loan_id_foreign` (`loan_id`),
  ADD KEY `installment_details_collection_uid_index` (`collection_uid`);

--
-- Indexes for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loan_applications_company_id_foreign` (`company_id`),
  ADD KEY `loan_applications_customer_id_foreign` (`customer_id`),
  ADD KEY `loan_applications_organisation_id_foreign` (`organisation_id`),
  ADD KEY `loan_applications_purpose_index` (`purpose`),
  ADD KEY `loan_applications_purpose_id_foreign` (`purpose_id`);

--
-- Indexes for table `loan_purposes`
--
ALTER TABLE `loan_purposes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `loan_purposes_purpose_name_unique` (`purpose_name`);

--
-- Indexes for table `loan_settings`
--
ALTER TABLE `loan_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loan_temp_customers`
--
ALTER TABLE `loan_temp_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loan_tier_rules`
--
ALTER TABLE `loan_tier_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loan_tier_rules_loan_setting_id_foreign` (`loan_setting_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organisation_master`
--
ALTER TABLE `organisation_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organisation_master_company_id_foreign` (`company_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `rejection_reasons`
--
ALTER TABLE `rejection_reasons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_slabs`
--
ALTER TABLE `salary_slabs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `all_cust_master`
--
ALTER TABLE `all_cust_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `assigned_loans_under_org`
--
ALTER TABLE `assigned_loans_under_org`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `assigned_purpose_under_loans`
--
ALTER TABLE `assigned_purpose_under_loans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assigned_slabs_under_loan`
--
ALTER TABLE `assigned_slabs_under_loan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `company_master`
--
ALTER TABLE `company_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `customer_drafts`
--
ALTER TABLE `customer_drafts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer_eligibility_history`
--
ALTER TABLE `customer_eligibility_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `document_types`
--
ALTER TABLE `document_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `document_upload`
--
ALTER TABLE `document_upload`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installment_details`
--
ALTER TABLE `installment_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `loan_applications`
--
ALTER TABLE `loan_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `loan_purposes`
--
ALTER TABLE `loan_purposes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `loan_settings`
--
ALTER TABLE `loan_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `loan_temp_customers`
--
ALTER TABLE `loan_temp_customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `loan_tier_rules`
--
ALTER TABLE `loan_tier_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `organisation_master`
--
ALTER TABLE `organisation_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rejection_reasons`
--
ALTER TABLE `rejection_reasons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `salary_slabs`
--
ALTER TABLE `salary_slabs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `company_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customers_organisation_id_foreign` FOREIGN KEY (`organisation_id`) REFERENCES `organisation_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_eligibility_history`
--
ALTER TABLE `customer_eligibility_history`
  ADD CONSTRAINT `customer_eligibility_history_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `document_upload`
--
ALTER TABLE `document_upload`
  ADD CONSTRAINT `document_upload_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_upload_loan_id_foreign` FOREIGN KEY (`loan_id`) REFERENCES `loan_applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `installment_details`
--
ALTER TABLE `installment_details`
  ADD CONSTRAINT `installment_details_loan_id_foreign` FOREIGN KEY (`loan_id`) REFERENCES `loan_applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD CONSTRAINT `loan_applications_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `company_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `loan_applications_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `loan_applications_organisation_id_foreign` FOREIGN KEY (`organisation_id`) REFERENCES `organisation_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `loan_applications_purpose_id_foreign` FOREIGN KEY (`purpose_id`) REFERENCES `loan_purposes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `loan_tier_rules`
--
ALTER TABLE `loan_tier_rules`
  ADD CONSTRAINT `loan_tier_rules_loan_setting_id_foreign` FOREIGN KEY (`loan_setting_id`) REFERENCES `loan_settings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organisation_master`
--
ALTER TABLE `organisation_master`
  ADD CONSTRAINT `organisation_master_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `company_master` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
