<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::insert([
            [
                'company_id' => 1,
                'organisation_id' => 1,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'gender' => 'Male',
                'dob' => '1990-05-12',
                'marital_status' => 'Married',
                'no_of_dependents' => 2,
                'phone' => '7001234567',
                'email' => 'john.doe@example.com',
                'present_address' => '123 Main Street, Port Moresby',
                'permanent_address' => '456 Elm Street, Port Moresby',
                'employee_no' => 'EMP001',
                'designation' => 'Accountant',
                'employment_type' => 'Permanent',
                'date_joined' => '2015-06-01',
                'monthly_salary' => 4500.00,
                'work_location' => 'Head Office',
                'status' => 'Active',
            ],
            [
                'company_id' => 1,
                'organisation_id' => 1,
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'gender' => 'Female',
                'dob' => '1988-09-21',
                'marital_status' => 'Single',
                'no_of_dependents' => 0,
                'phone' => '7012345678',
                'email' => 'jane.smith@example.com',
                'present_address' => '456 Market Road, Lae',
                'permanent_address' => '789 Ocean Ave, Lae',
                'employee_no' => 'EMP002',
                'designation' => 'Loan Officer',
                'employment_type' => 'Permanent',
                'date_joined' => '2018-01-15',
                'monthly_salary' => 5200.00,
                'work_location' => 'Branch Office',
                'status' => 'Active',
            ],
            [
                'company_id' => 1,
                'organisation_id' => 1,
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'gender' => 'Male',
                'dob' => '1992-03-17',
                'marital_status' => 'Single',
                'no_of_dependents' => 1,
                'phone' => '7023456789',
                'email' => 'michael.brown@example.com',
                'present_address' => '99 Highland St, Madang',
                'permanent_address' => '99 Highland St, Madang',
                'employee_no' => 'EMP003',
                'designation' => 'IT Officer',
                'employment_type' => 'Contract',
                'date_joined' => '2020-09-01',
                'monthly_salary' => 3800.00,
                'work_location' => 'Remote',
                'status' => 'Active',
            ],
        ]);
    }
}
