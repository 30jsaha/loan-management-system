-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2025 at 01:23 PM
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
(8, '11New Custoom', 'Emp45678', '9112852567', 'user234@gmail.com', 0, 0, 5000, 0, '2025-11-12 00:30:48', '2025-11-12 00:30:48');

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
(8, 3, 6, 1, '2025-11-19 00:01:40', '2025-11-19 00:01:40');

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
(2, 6, 3, 1, '2025-11-17 05:48:03', '2025-11-17 05:48:03');

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
(22, 0, 1, 1, 'Alice', 'Fernandez', NULL, NULL, NULL, 4, '+675-7000-9012', 'alice.fernandez@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0003', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', NULL, NULL, 5500.00, 0.00, 'location', NULL, 'Active', '2025-11-04 05:58:22', '2025-11-04 05:58:22'),
(23, 0, 1, 1, 'Fatima', 'Yusuf', NULL, NULL, NULL, 4, '+675-7000-4321', 'fatima.yusuf@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0007', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 5300.00, 0.00, 'location', NULL, 'Active', '2025-11-04 06:22:33', '2025-11-04 06:22:33'),
(24, 0, 1, 1, '11New', 'Custoom', 'Male', NULL, NULL, 4, '9112852567', 'user234@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Emp45678', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 5000.00, 0.00, 'Demo', NULL, 'Active', '2025-11-12 00:32:03', '2025-11-12 00:32:03'),
(25, 0, 1, 1, 'Michael', 'Osei', 'Male', NULL, NULL, 4, '+675-7000-3456', 'michael.osei@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0004', NULL, NULL, NULL, NULL, NULL, NULL, 'Sales Person', 'Permanent', NULL, 6200.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 00:44:40', '2025-11-19 00:44:40'),
(26, 0, 1, 1, 'Priya', 'Nair', NULL, NULL, NULL, 4, '+675-7000-7890', 'priya.nair@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0005', NULL, NULL, NULL, NULL, NULL, NULL, 'developer', 'Permanent', NULL, 5800.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 01:35:39', '2025-11-19 01:35:39'),
(27, 0, 1, 1, 'Liam', 'Chen', NULL, NULL, NULL, 4, '+675-7000-6543', 'liam.chen@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP0006', NULL, NULL, NULL, NULL, NULL, NULL, 'Manager', NULL, NULL, 6100.00, 0.00, 'demo', NULL, 'Active', '2025-11-19 01:41:11', '2025-11-19 01:41:11');

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
(33, 27, 1400.00, 0.00, 0.00, 1000.00, 110.00, 290.00, 1300.00, 0.00, 1300.00, -1010.00, 145.00, 1155.00, 410.00, 0.00, 1564.99, 1200.00, 100.00, 364.99, 1, 1, '2025-11-19 01:41:28', '2025-11-19 01:41:28');

-- --------------------------------------------------------

--
-- Table structure for table `document_upload`
--

CREATE TABLE `document_upload` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `doc_type` enum('ID','Payslip','BankStatement','EmploymentLetter','ResumptionSheet','ISDA_Signed','LoanForm_Scanned','ConsentVideo','Other') NOT NULL DEFAULT 'Other',
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_by_user_id` int(11) NOT NULL DEFAULT 0,
  `uploaded_on` datetime NOT NULL DEFAULT current_timestamp(),
  `verified_by` int(11) DEFAULT 0,
  `verified_on` datetime DEFAULT NULL,
  `verification_status` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `document_upload`
--

INSERT INTO `document_upload` (`id`, `loan_id`, `customer_id`, `doc_type`, `file_name`, `file_path`, `uploaded_by`, `uploaded_by_user_id`, `uploaded_on`, `verified_by`, `verified_on`, `verification_status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 5, 11, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/mLMtlcbIS3pkeb70pJD1RFDuui8TmIvw2MW7zUKH.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 06:43:38', NULL, NULL, 'Pending', NULL, '2025-10-22 01:13:38', '2025-10-22 01:13:38'),
(2, 5, 11, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/GCfDQHXyqoM4PgAPqIg5Mc3DvNhqK7BRbPW64B4u.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 07:36:11', NULL, NULL, 'Pending', NULL, '2025-10-22 02:06:11', '2025-10-22 02:06:11'),
(3, 6, 12, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/iYBnPhzKCiIN7h03cB9yccoj48fLH7RbYaq1LRAC.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 07:46:05', NULL, NULL, 'Pending', NULL, '2025-10-22 02:16:05', '2025-10-22 02:16:05'),
(4, 9, 15, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/mCykGxirVQbBfiMIaf5xDQ6OX50HKedwfJrp5jKE.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 08:07:45', NULL, NULL, 'Pending', NULL, '2025-10-22 02:37:45', '2025-10-22 02:37:45'),
(5, 10, 16, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/qaNaFcFYdKUYIWRTgaDnOocMvFL9kda6Qo3HMNg8.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 08:19:15', NULL, NULL, 'Pending', NULL, '2025-10-22 02:49:15', '2025-10-22 02:49:15'),
(6, 11, 17, 'EmploymentLetter', 'Website PSD Template.pdf', 'uploads/documents/METs15Hnj4jEQydamIFjy2fhRD4MgqtNdhAPUK6A.pdf', 'Jyotirmoy Saha', 0, '2025-10-22 12:02:58', NULL, NULL, 'Pending', NULL, '2025-10-22 06:32:58', '2025-10-22 06:32:58'),
(7, 14, 2, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/yr10qZmMjkWCqgh9WdJmiSmPxKvYxh1EfRh3WqTy.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:41', 1, '2025-11-03 11:28:20', 'Verified', NULL, '2025-10-31 03:47:41', '2025-11-03 05:58:20'),
(8, 14, 2, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/1828sO3VbW7gUC0kjcEIUNc5WKt0ihwK6KEKs4Bw.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:41', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:41', '2025-10-31 03:47:41'),
(9, 14, 2, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/Eb5pxJqQzjDHB6VBrJb9vgmP9iJxGmReGMKLjqM6.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:42', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:42', '2025-10-31 03:47:42'),
(10, 14, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/wKKCbb0fLk3VbkTncUEnsnytHWdDgJS9OBM0USLk.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:43', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:43', '2025-10-31 03:47:43'),
(11, 14, 2, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/Q8ZEFd3ZN6ciU7Wamcn7k38MT4Vn1RWKbhNH8PbQ.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:44', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:44', '2025-10-31 03:47:44'),
(12, 14, 2, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/SqIJRCmq4y223YqaxehbD51SRe5o8UC7ada0Bcqt.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:45', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:45', '2025-10-31 03:47:45'),
(13, 14, 2, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/LSQF2Z1wNhBKklRrKaMF8ovj5hB3G1P7elBY6pKC.pdf', 'Jyotirmoy Saha', 0, '2025-10-31 09:17:45', NULL, NULL, 'Pending', NULL, '2025-10-31 03:47:45', '2025-10-31 03:47:45'),
(14, 15, 2, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/6BOYus07TBiNEC9g9IsVzp3fvz1sn6NmnWnqM2YI.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:11', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:11', '2025-11-04 00:50:11'),
(15, 15, 2, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/IhGuMQMa0dYT672kyx5t2zo1X5PtQU3La9a9JTRf.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:12', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:12', '2025-11-04 00:50:12'),
(16, 15, 2, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/zbxQgogKs1uEwk8mjR6YG2hElCtByP3C8QEcgLEf.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:13', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:13', '2025-11-04 00:50:13'),
(17, 15, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/Eof4K3bk6XAAbLlRyx65E3iqrYyDMbdIOrLAq51w.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:14', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:14', '2025-11-04 00:50:14'),
(18, 15, 2, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/IrTqwo0h890JUom3jJqpVOrGZhoZhw9yFQGyCYE5.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:14', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:14', '2025-11-04 00:50:14'),
(19, 15, 2, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/QsQk6oHEASdSqbdFK5AclqrYld33dU70KUjMCUUB.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:15', 0, NULL, 'Pending', NULL, '2025-11-04 00:50:15', '2025-11-04 00:50:15'),
(20, 15, 2, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/4NmH7MZzwSGiUR9d83wY06bzMNuW4Hk4HWmkxw9i.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 06:20:16', 1, '2025-11-05 11:16:17', 'Verified', NULL, '2025-11-04 00:50:16', '2025-11-05 05:46:17'),
(21, 22, 22, 'EmploymentLetter', 'aaa_loan_application_form.pdf', 'uploads/documents/lq8sCd4JcDbM1ID38sKyZu7USCzJrIOPc8pTG3BI.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:27', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:27', '2025-11-04 06:03:27'),
(22, 22, 22, 'EmploymentLetter', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/CW5ST0IxIpmM5pUunqLVtsGP2geETeriuJZIgUNm.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:28', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:28', '2025-11-04 06:03:28'),
(23, 22, 22, 'EmploymentLetter', 'education_format.pdf', 'uploads/documents/b9MTkYyYbLqwsg1uL39zqhlTA3gHwgfqzLCDNiwX.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:29', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:29', '2025-11-04 06:03:29'),
(24, 22, 22, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/TSEb1yRnkSBc9Qh3xYPQHIjecCm59Ak31irnOtIR.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:30', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:30', '2025-11-04 06:03:30'),
(25, 22, 22, 'EmploymentLetter', 'health_format.pdf', 'uploads/documents/UuZ38FW1B9ZVQaY3eWb399QY36OSnpw9vo4QtrfH.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:31', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:31', '2025-11-04 06:03:31'),
(26, 22, 22, 'EmploymentLetter', 'Loan Management System.pdf', 'uploads/documents/VlRPKSZF4keRtX4ijUtDYx1cPSiWIAD7iYHOfWht.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:31', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:31', '2025-11-04 06:03:31'),
(27, 22, 22, 'EmploymentLetter', 'loan-process-details.pdf', 'uploads/documents/ujBhbT6vzDqSb614tMW9f91wKRV7Iu5NKmo6vRV1.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 11:33:32', 0, NULL, 'Pending', NULL, '2025-11-04 06:03:32', '2025-11-04 06:03:32'),
(28, 24, 4, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/5Xw4DfvxbMoYTkojgvz0InWzHtDjFhhDa9jnFUQ9.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:16', 1, '2025-11-04 12:14:57', 'Verified', NULL, '2025-11-04 06:39:16', '2025-11-04 06:44:57'),
(29, 24, 4, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/E7IFPWYRQOWGyMVKgrng2ByjrLNTi2mjvspOeobh.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:17', 1, '2025-11-05 11:07:18', 'Verified', NULL, '2025-11-04 06:39:17', '2025-11-05 05:37:18'),
(30, 24, 4, 'BankStatement', 'education_format.pdf', 'uploads/documents/JyMz9yAgT7veQegdsWdJcnfhRur5f9OJZXoZx1Ys.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:18', 1, '2025-11-05 12:41:34', 'Verified', NULL, '2025-11-04 06:39:18', '2025-11-05 07:11:34'),
(31, 24, 4, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/GReZwDmB0mxqF73t90O2WszLFowgnkTReQDpfEUN.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:18', 1, '2025-11-11 12:12:10', 'Verified', NULL, '2025-11-04 06:39:18', '2025-11-11 06:42:10'),
(32, 24, 4, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/8TmgOBjMZYC52eCibAF8byMPGqAp621bBHYU2VTu.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:19', 1, '2025-11-11 12:12:12', 'Verified', NULL, '2025-11-04 06:39:19', '2025-11-11 06:42:12'),
(33, 24, 4, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/SMFuDYYOGmIPYBnW3mKtPxgcaPMp3SlTkYj0VPAr.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:20', 1, '2025-11-11 12:12:13', 'Verified', NULL, '2025-11-04 06:39:20', '2025-11-11 06:42:13'),
(34, 24, 4, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/4mpNa2BoFew6GWBcecXKUWaWtiggPI5AO4wiLucL.pdf', 'Jyotirmoy Saha', 0, '2025-11-04 12:09:21', 1, '2025-11-11 12:12:14', 'Verified', NULL, '2025-11-04 06:39:21', '2025-11-11 06:42:14'),
(35, 25, 3, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/SrdUmbeb9wx8sk0gAwSR48q3M2D7BkdX7mWjJ94h.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:03', 1, '2025-11-11 12:07:20', 'Verified', NULL, '2025-11-05 22:50:03', '2025-11-11 06:37:20'),
(36, 25, 3, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/MHxGGG1aVDvpU6wrNodD1DM5RclMRuW8agK9fFPJ.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:04', 1, '2025-11-11 12:07:21', 'Verified', NULL, '2025-11-05 22:50:04', '2025-11-11 06:37:21'),
(37, 25, 3, 'BankStatement', 'education_format.pdf', 'uploads/documents/4hcIREKHASfCpaahZE34qYp9VYWjo9IcRWw0qcKO.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:05', 1, '2025-11-11 12:07:22', 'Verified', NULL, '2025-11-05 22:50:05', '2025-11-11 06:37:22'),
(38, 25, 3, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/AH7Qj7YzmFdWWKqcJzJTB2A42475rKcsMljCDiEL.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:05', 1, '2025-11-11 12:07:22', 'Verified', NULL, '2025-11-05 22:50:05', '2025-11-11 06:37:22'),
(39, 25, 3, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/1pkRPIDgiDrfgbIUDTXg5m8YXbk9Rnt9zW3ATZqG.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:06', 1, '2025-11-11 12:07:23', 'Verified', NULL, '2025-11-05 22:50:06', '2025-11-11 06:37:23'),
(40, 25, 3, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/gxOGZSv3lpG217UArElQtvNA7jYJdjvwVPyA4F3k.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:07', 1, '2025-11-11 12:07:24', 'Verified', NULL, '2025-11-05 22:50:07', '2025-11-11 06:37:24'),
(41, 25, 3, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/W9ojAbdLoOJhXoKqCuuc3t9YT1liSnpMaz7LoeEm.pdf', 'Jyotirmoy Saha', 1, '2025-11-06 04:20:07', 1, '2025-11-11 12:07:24', 'Verified', NULL, '2025-11-05 22:50:07', '2025-11-11 06:37:24'),
(42, 26, 2, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/VWIFAtlnFZiWelrVsHMX109J4GCKuRve5TzCMg1P.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:12', 1, '2025-11-10 06:36:29', 'Verified', NULL, '2025-11-10 01:03:12', '2025-11-10 01:06:29'),
(43, 26, 2, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/fZPGqQA39UoVWI0wzeYPqT8StwXsK9DvwWdZ7gJT.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:14', 1, '2025-11-10 06:36:31', 'Verified', NULL, '2025-11-10 01:03:14', '2025-11-10 01:06:31'),
(44, 26, 2, 'BankStatement', 'education_format.pdf', 'uploads/documents/ZSpqMdDWkpDNqnZs5alVEMogHIjErIr3TNTBMq81.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:15', 1, '2025-11-10 06:36:32', 'Verified', NULL, '2025-11-10 01:03:15', '2025-11-10 01:06:32'),
(45, 26, 2, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/CfI3SNHTGstjM8T4Zz7T0DyyXbS529BdMZYYmUp1.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:15', 1, '2025-11-10 06:36:32', 'Verified', NULL, '2025-11-10 01:03:15', '2025-11-10 01:06:32'),
(46, 26, 2, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/Xu9NfKvzdJroTNop8UZznx90eOfEd7MZ8VYO3Fwt.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:16', 1, '2025-11-10 06:36:33', 'Verified', NULL, '2025-11-10 01:03:16', '2025-11-10 01:06:33'),
(47, 26, 2, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/7uc7YsHYL3qVn5PdL8oLLFREcXdz5phSw4nbicBm.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:17', 1, '2025-11-10 06:36:33', 'Verified', NULL, '2025-11-10 01:03:17', '2025-11-10 01:06:33'),
(48, 26, 2, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/DDCWpVUqsvf17rr5iXSbZ1LZ5FKURUNTvm58lQCE.pdf', 'Jyotirmoy Saha', 1, '2025-11-10 06:33:17', 1, '2025-11-10 06:36:34', 'Verified', NULL, '2025-11-10 01:03:17', '2025-11-10 01:06:34'),
(49, 16, 10, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/Z1BMDAoPzzg4wsE29jPHjL7EYv3bBIkkSQE06Hb2.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:49', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:49', '2025-11-11 03:43:49'),
(50, 16, 10, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/JbJDPocVveV8Ms3OQeQnXcNexXScy2fPXJ6nlrEb.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:50', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:50', '2025-11-11 03:43:50'),
(51, 16, 10, 'BankStatement', 'education_format.pdf', 'uploads/documents/PpwVzSvsRiq7Alf99NhoGafBovjwafQBfWdtuq6c.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:51', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:51', '2025-11-11 03:43:51'),
(52, 16, 10, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/BhtWu0W8dF9LhlzlfK3geoyzY8G9aehcyvhHzphV.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:52', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:52', '2025-11-11 03:43:52'),
(53, 16, 10, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/1HDTsOPRm9zAI1h5qn2CI6p4n0DOVVnQigY6iz6w.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:52', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:52', '2025-11-11 03:43:52'),
(54, 16, 10, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/aosucM4SyaVnhZcrP5E9EEralTRX6UnGW0nbBRQ5.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:53', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:53', '2025-11-11 03:43:53'),
(55, 16, 10, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/COUIyeDZA465AH8BBcAxI4kWtZFNhgrFaE26yvRu.pdf', 'Jyotirmoy Saha', 1, '2025-11-11 09:13:54', 0, NULL, 'Pending', NULL, '2025-11-11 03:43:54', '2025-11-11 03:43:54'),
(56, 27, 24, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/ZJktJ6WgNwfHtSr8osggvQYF0IGObIRWRL7LsiLP.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:55', 1, '2025-11-12 06:11:39', 'Verified', NULL, '2025-11-12 00:39:55', '2025-11-12 00:41:39'),
(57, 27, 24, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/r4XB1RqOZyZ3iaqq2gK0LAibQSKVid20VTPPc1NE.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:56', 0, NULL, 'Pending', NULL, '2025-11-12 00:39:56', '2025-11-12 00:39:56'),
(58, 27, 24, 'BankStatement', 'education_format.pdf', 'uploads/documents/Hj2zbjFbe3JC9cx03NSZ6eg34nm9eF7vefPSlLEY.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:57', 0, NULL, 'Pending', NULL, '2025-11-12 00:39:57', '2025-11-12 00:39:57'),
(59, 27, 24, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/cpWppHOCrbLBghqvo2Sj9081vWt9imy5RsqQaopd.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:58', 0, NULL, 'Pending', NULL, '2025-11-12 00:39:58', '2025-11-12 00:39:58'),
(60, 27, 24, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/NWTpNmYP7BQLU8Xx6mb6ec6Gt8rk9kS0HLAT2dJK.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:09:59', 0, NULL, 'Pending', NULL, '2025-11-12 00:39:59', '2025-11-12 00:39:59'),
(61, 27, 24, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/bbgju4q5TygcXYAAvqUfo6fnbpe3Jk3FzHYGpvzj.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:10:00', 0, NULL, 'Pending', NULL, '2025-11-12 00:40:00', '2025-11-12 00:40:00'),
(62, 27, 24, 'LoanForm_Scanned', 'loan-process-details.pdf', 'uploads/documents/f0ZPtKlLRFOvds8lRZoHg4HOhXD5SiBuswYYPYuo.pdf', 'Jyotirmoy Saha', 1, '2025-11-12 06:10:01', 0, NULL, 'Pending', NULL, '2025-11-12 00:40:01', '2025-11-12 00:40:01'),
(63, 29, 27, 'ID', 'aaa_loan_application_form.pdf', 'uploads/documents/ozCx2XfRhRyH2jiQbhmKmno1Z4APx33iRSYrlQOR.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:03', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:03', '2025-11-19 01:46:03'),
(64, 29, 27, 'Payslip', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/dEJ6yAjBFYp9ynupWxWbYQdQe5moBZLmYT9v98i9.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:03', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:03', '2025-11-19 01:46:03'),
(65, 29, 27, 'BankStatement', 'education_format.pdf', 'uploads/documents/qrfHwST8TXoOxlGkduFRk8RYbFDNId4BtE8X0fYP.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:04', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:04', '2025-11-19 01:46:04'),
(66, 29, 27, 'EmploymentLetter', 'eligibility_check_formula.pdf', 'uploads/documents/rtP3hEt6U53qeApxXHfIWgSVJPXiPkkoXCCNKity.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:05', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:05', '2025-11-19 01:46:05'),
(67, 29, 27, 'ResumptionSheet', 'health_format.pdf', 'uploads/documents/bjgaBXnRep4phFASyW1ChloiXFASfb2BTuIVTuTl.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:06', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:06', '2025-11-19 01:46:06'),
(68, 29, 27, 'ISDA_Signed', 'Loan Management System.pdf', 'uploads/documents/SLwUqczh60VF6KPp05xhI0ovzfIHR45Z7fqOdNL8.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:07', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:07', '2025-11-19 01:46:07'),
(69, 29, 27, 'LoanForm_Scanned', 'Agro Advance Aben Ltd Company Profile (2).pdf', 'uploads/documents/W7g5VgORmzTy8sPTUIxxU6fffoDKKUhIA6335vYm.pdf', 'Jyotirmoy Saha', 1, '2025-11-19 07:16:08', 0, NULL, 'Pending', NULL, '2025-11-19 01:46:08', '2025-11-19 01:46:08');

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

INSERT INTO `installment_details` (`id`, `loan_id`, `installment_no`, `due_date`, `emi_amount`, `payment_date`, `payment_mode`, `late_fee`, `status`, `employer_reference_no`, `emi_collected_by_id`, `emi_collected_date`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 26, 1, '2025-11-10', 55.55, '2025-11-10', NULL, 0.00, 'Paid', NULL, 1, '2025-11-10 06:39:46', NULL, '2025-11-10 06:39:46', '2025-11-10 06:39:46');

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
  `purpose` enum('Tuition','Living','Medical','Appliance','Car','Travel','HomeImprovement','Other') DEFAULT NULL,
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
  `status` enum('Pending','Verified','Approved','HigherApproval','Disbursed','Closed') NOT NULL DEFAULT 'Pending',
  `approved_by` varchar(100) DEFAULT NULL,
  `approved_by_id` int(11) NOT NULL DEFAULT 0,
  `approved_date` datetime DEFAULT NULL,
  `higher_approved_by` varchar(100) DEFAULT NULL,
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

INSERT INTO `loan_applications` (`id`, `company_id`, `customer_id`, `organisation_id`, `loan_type`, `purpose`, `other_purpose_text`, `loan_amount_applied`, `loan_amount_approved`, `tenure_fortnight`, `emi_amount`, `interest_rate`, `total_no_emi`, `next_due_date`, `elegible_amount`, `min_repay_amt_for_next_loan`, `total_repay_amt`, `total_interest_amt`, `processing_fee`, `grace_period_days`, `disbursement_date`, `bank_name`, `bank_branch`, `bank_account_no`, `status`, `approved_by`, `approved_by_id`, `approved_date`, `higher_approved_by`, `higher_approved_date`, `is_loan_re_updated_after_higher_approval`, `isda_file_name`, `isda_signed_upload_path`, `isada_upload_date`, `isada_upload_by`, `isda_is_verified`, `isda_rejection_reason_id`, `isda_verified_by_id`, `isda_verified_on`, `org_signed_file_name`, `org_is_verified`, `org_rejection_reason_id`, `org_verified_by_id`, `org_verified_on`, `video_consent_is_verified`, `video_consent_rejection_reason_id`, `video_consent_verified_by_id`, `video_consent_verified_on`, `org_signed_upload_path`, `org_signed_upload_date`, `org_signed_upload_by`, `video_consent_file_name`, `video_consent_path`, `video_consent_upload_date`, `video_consent_uploaded_by_user_id`, `remarks`, `client_status`, `any_existing_loan`, `existing_loan_amt`, `existing_loan_id`, `is_elegible`, `created_at`, `updated_at`) VALUES
(1, 2, 8, 2, 1, 'Living', NULL, 10000, NULL, 5, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo bank', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo First Loan Application data', 1, 0, NULL, 0, 1, '2025-10-21 06:11:38', '2025-10-21 06:11:38'),
(2, 1, 1, 1, 2, 'Living', NULL, 855, NULL, 2, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'demo', 'demo', '8564789320', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'second demo loan application data', 1, 0, NULL, 0, 1, '2025-10-21 06:14:23', '2025-10-21 06:14:23'),
(3, 1, 9, 2, 1, 'Travel', NULL, 999, NULL, 20, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Latest One', 1, 0, NULL, 0, 1, '2025-10-21 06:53:25', '2025-10-21 06:53:25'),
(4, 1, 9, 2, 1, 'Travel', NULL, 999, NULL, 20, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, 'demo', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Latest One', 1, 0, NULL, 0, 1, '2025-10-21 06:54:31', '2025-10-21 06:54:31'),
(5, 1, 11, 1, 1, 'Medical', NULL, 2000, NULL, 30, NULL, 15, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '783456568985', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo', 1, 0, NULL, 0, 1, '2025-10-22 00:33:22', '2025-10-22 00:33:22'),
(6, 1, 12, 1, 1, 'Medical', NULL, 2500, NULL, 25, NULL, 22, NULL, NULL, NULL, NULL, NULL, NULL, 30, NULL, NULL, 'demo bank', 'demo branch', '883456568986', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Demo Remarks', 1, 0, NULL, 0, 1, '2025-10-22 02:15:36', '2025-10-22 02:15:36'),
(7, 2, 13, 2, 1, 'Medical', NULL, 3000, NULL, 35, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 22, NULL, NULL, 'PNG Bank', 'PNG Bank Branch', '873456568686', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Some Remarks', 1, 0, NULL, 0, 1, '2025-10-22 02:25:04', '2025-10-22 02:25:04'),
(8, 1, 14, 1, 1, 'Medical', NULL, 3200, NULL, 35, NULL, 25, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '883458568987', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:34:31', '2025-10-22 02:34:31'),
(9, 1, 15, 1, 1, 'Medical', NULL, 3700, NULL, 35, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '787558568989', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:37:27', '2025-10-22 02:37:27'),
(10, 1, 16, 2, 1, 'Medical', NULL, 4500, NULL, 36, NULL, 30, NULL, NULL, NULL, NULL, NULL, NULL, 22, NULL, NULL, 'demo bank', 'demo branch', '783100568988', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, 1, '2025-10-22 02:49:02', '2025-10-22 02:49:02'),
(11, 1, 17, 1, 2, 'Medical', NULL, 5000, NULL, 40, NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '873456568686', 'Approved', 'Jyotirmoy Saha', 0, '2025-10-29 10:49:40', NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, 1, '2025-10-22 06:32:09', '2025-10-29 05:19:40'),
(12, 1, 1, 1, 1, 'Tuition', NULL, 742.5, NULL, 60, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '873456568686', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'efce', 1, 0, NULL, 0, 1, '2025-10-30 06:43:44', '2025-10-30 06:43:44'),
(13, 1, 18, 1, 1, 'Living', NULL, 700, NULL, 26, NULL, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '787512368980', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'Some remarks\nwith formula', 1, 0, NULL, 0, 1, '2025-10-31 02:25:55', '2025-10-31 02:25:55'),
(14, 1, 2, 1, 1, 'Medical', NULL, 700, NULL, 26, 43.37, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'PNG Bank', 'PNG Bank Branch', '725456568988', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, '/storage/uploads/isda_signed/QThQZSKpHvmmOrbXFgT0BwVc28zsYdfrmswAUeHM.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, 1, '2025-10-31 03:46:12', '2025-11-03 06:35:34'),
(15, 1, 2, 1, 1, 'Medical', NULL, 700, NULL, 26, 43.37, 2.35, NULL, NULL, NULL, NULL, NULL, NULL, 20, NULL, NULL, 'demo bank', 'demo branch', '123456789852', 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, '/storage/uploads/isda_signed/8ZSLHx1jOx9JoOK1Gfy8IKwmvjrvmXfvRcLS7IY0.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 'movie.mp4', '/storage/uploads/video_consents/GIN2UNiABCnN7CQUnhqQL81xKwUiD8Hpf9zc2Pq5.mp4', '2025-11-04', 1, 'Some Remarks', 1, 0, NULL, 0, 1, '2025-11-04 00:49:14', '2025-11-04 00:57:51'),
(16, 1, 10, 1, 1, 'Medical', NULL, 900, 0, 26, 55.77, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 03:45:19', '2025-11-04 03:45:19'),
(17, 1, 3, 1, 1, 'Medical', NULL, 900, 0, 26, 55.77, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:14:48', '2025-11-04 04:14:48'),
(18, 1, 3, 1, 1, 'Medical', NULL, 900, 0, 26, 0, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:23:03', '2025-11-04 04:23:03'),
(19, 1, 1, 1, 1, 'Medical', NULL, 900, 0, 26, 55.765384615385, 2.35, NULL, NULL, 0, 0, 0, 0, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:44:06', '2025-11-04 04:44:06'),
(20, 1, 5, 1, 1, 'Medical', NULL, 900, 0, 26, 55.765384615385, 2.35, NULL, NULL, 1664.99, 0, 1449.9, 549.9, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 04:56:46', '2025-11-04 04:56:46'),
(21, 2, 4, 2, 0, NULL, NULL, 1650, 0, 0, 0, 0, NULL, NULL, 1604.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, '2025-11-04 05:43:56', '2025-11-04 05:43:56'),
(22, 1, 22, 1, 1, 'Travel', NULL, 1100, 0, 26, 68.157692307692, 2.35, NULL, NULL, 1168.99, 0, 1772.1, 672.1, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-04 05:59:36', '2025-11-04 05:59:36'),
(23, 1, 23, 1, 0, NULL, NULL, 1600, 0, 0, 0, 0, NULL, NULL, 1529.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, '2025-11-04 06:24:19', '2025-11-04 06:24:19'),
(24, 2, 4, 2, 1, 'Medical', NULL, 1000, 1000, 26, 61.961538461538, 2.35, 26, '2025-11-12', 1559.99, 1288.8, 1611, 611, 20, NULL, '2025-11-11', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-11-11 12:22:48', NULL, NULL, 0, NULL, '/storage/uploads/isda_signed/NtZWru4dXXqAIXnZX27aBu1n45Ob3cOdW783m67p.pdf', '2025-11-11', 1, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/VwXDZ8LU9yfH9pNzfN4bXoD0ujUYG6WbBiajsxFh.pdf', '2025-11-11', 1, 'movie.mp4', '/storage/uploads/video_consents/toKq4cWL5KyzFxogFx5uC7sNRtoJy89QwmtPT7Al.mp4', '2025-11-11', 1, NULL, 1, 0, 0, 0, 1, '2025-11-04 06:38:26', '2025-11-12 00:48:41'),
(25, 1, 3, 1, 1, 'Medical', NULL, 1300, 1300, 26, 80.55, 2.35, 26, '2025-11-12', 1499.99, 1675.44, 2094.3, 794.3, 20, NULL, '2025-11-11', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-11-11 12:08:05', NULL, NULL, 0, NULL, '/storage/uploads/isda_signed/4GTjOmsBUbFF6CZEbGJAV1Uz6tEuXAB21pAhDD0g.pdf', '2025-11-11', 1, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/wbm0nIOqiqOnq5FJTQn3jVYcVObGywQkfYtNJsGx.pdf', '2025-11-11', 1, 'movie.mp4', '/storage/uploads/video_consents/zEVW8XjdkdmWyAv5ce5XzRNLaT4KMCmh7LSdVL5W.mp4', '2025-11-11', 1, NULL, 1, 0, 0, 0, 1, '2025-11-05 22:49:09', '2025-11-12 00:48:41'),
(26, 1, 2, 1, 1, 'Medical', NULL, 1300, 1300, 52, 55.55, 2.35, 52, '2025-11-24', 1559.99, 0, 2888.6, 1588.6, 20, NULL, '2025-11-10', NULL, NULL, NULL, 'Approved', 'Jyotirmoy Saha', 1, '2025-11-10 06:36:39', NULL, NULL, 0, NULL, '/storage/uploads/isda_signed/wHbToywaXrDnQVZvZ6CjtIVeT5u3Q0xLtj1GcG0n.pdf', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, '/storage/uploads/isda_signed/lKD4TytWYYs5S5Q8gNYos7JaXWtqTu7PmzkrzCpt.pdf', '2025-11-10', 1, 'movie.mp4', '/storage/uploads/video_consents/2fuzW4GC77v2Szx2ODdtrklU16MFDMv1oUaAZxGI.mp4', '2025-11-07', 1, NULL, 1, 0, 0, 0, 1, '2025-11-06 05:29:10', '2025-11-10 06:39:46'),
(27, 1, 24, 1, 2, 'Medical', NULL, 1100, 0, 26, 64.307692307692, 2, NULL, NULL, 1559.99, 0, 1672, 572, 20, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-12 00:38:32', '2025-11-12 00:38:32'),
(28, 1, 26, 1, 0, NULL, NULL, 1600, 0, 0, 0, 0, NULL, NULL, 1564.99, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, '2025-11-19 01:40:19', '2025-11-19 01:40:19'),
(29, 1, 27, 1, 1, 'Medical', NULL, 1200, 1200, 26, 74.353846153846, 2.35, 26, '2025-12-03', 1564.99, 1546.56, 1933.2, 733.2, 20, NULL, '2025-11-19', NULL, NULL, NULL, 'Approved', 'user', 2, '2025-11-19 08:06:49', NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 1, '2025-11-19 01:42:16', '2025-11-19 02:36:49');

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
(6, 'High Value', 0, 2, 5000, 15000, 5, 50, 8, 52, 20, 85, 0.00, 0, 200.00, 300.00, 1, 1, 350.00, 600.00, 5, 8, 550.00, 950.00, 5, 26, 951.00, 20000.00, 5, 52, '2025-11-17', '2025-12-31', 0, '2025-11-17 05:48:03', '2025-11-17 05:48:03');

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
(43, '2025_11_20_094205_add_cols_to_loan_applications_table', 31);

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
(2, 1, 'National Bank PNG', 'Health', NULL, NULL, 'Banking Street, Lae', NULL, NULL, '+675-324-2000', 'admin@nbpng.pg', 'Active', NULL, NULL),
(3, 1, 'Other Organization edit', 'Other', 'DPT502', '753955', 'demo', 'demo', 'demo person', '7533954680', 'demo@email.com', 'Active', '2025-11-18 23:58:37', '2025-11-19 00:01:22');

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
(1, 'Document is expired or invalid', 1, 1, 0, '2025-11-13 04:24:27', '2025-11-13 04:24:27'),
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
(3, 1, 'Senior Level', 15000.01, 50000.00, 1, '2025-11-13 04:24:38', '2025-11-13 04:24:38');

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
(1, 'Jyotirmoy Saha', 'jsaha.adzguru@gmail.com', NULL, '$2y$12$UNPMbfzj8fXh4G0C0AGAWed5wBan6fM2D.2I2iSNBaJ3jjTeHCTLi', 1, 'C1yBnNS369Z7OmPqt3gvWdmsBElpceIaYvhDe3T734smaxZyeqJazv7so0ff', '2025-10-14 07:11:33', '2025-10-14 07:11:33'),
(2, 'user', 'user@email.com', NULL, '$2y$12$kMuJMhShl93leEdBLLsJ/eb9Dmn/Jq438R2fTY/t7hTuKTkzoQVc2', 0, NULL, '2025-11-19 01:50:47', '2025-11-19 01:50:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `all_cust_master`
--
ALTER TABLE `all_cust_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assigned_loans_under_org`
--
ALTER TABLE `assigned_loans_under_org`
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
  ADD KEY `customers_organisation_id_foreign` (`organisation_id`);

--
-- Indexes for table `customer_eligibility_history`
--
ALTER TABLE `customer_eligibility_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_eligibility_history_customer_id_foreign` (`customer_id`);

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
  ADD KEY `installment_details_loan_id_foreign` (`loan_id`);

--
-- Indexes for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loan_applications_company_id_foreign` (`company_id`),
  ADD KEY `loan_applications_customer_id_foreign` (`customer_id`),
  ADD KEY `loan_applications_organisation_id_foreign` (`organisation_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assigned_loans_under_org`
--
ALTER TABLE `assigned_loans_under_org`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assigned_slabs_under_loan`
--
ALTER TABLE `assigned_slabs_under_loan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_master`
--
ALTER TABLE `company_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `customer_eligibility_history`
--
ALTER TABLE `customer_eligibility_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `document_upload`
--
ALTER TABLE `document_upload`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installment_details`
--
ALTER TABLE `installment_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `loan_applications`
--
ALTER TABLE `loan_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `loan_settings`
--
ALTER TABLE `loan_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `organisation_master`
--
ALTER TABLE `organisation_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rejection_reasons`
--
ALTER TABLE `rejection_reasons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `salary_slabs`
--
ALTER TABLE `salary_slabs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `loan_applications_organisation_id_foreign` FOREIGN KEY (`organisation_id`) REFERENCES `organisation_master` (`id`) ON DELETE CASCADE;

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
