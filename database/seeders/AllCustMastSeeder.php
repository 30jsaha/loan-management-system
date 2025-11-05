<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllCustMastSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('all_cust_master')->insert([
            [
                'cust_name' => 'Alice Fernandez',
                'emp_code' => 'EMP0003',
                'phone' => '+675-7000-9012',
                'email' => 'alice.fernandez@email.com',
                'organization_id' => 1,
                'company_id' => 1,
                'gross_pay' => 5500.00,
                'net_pay' => 4400.00,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'cust_name' => 'Michael Osei',
                'emp_code' => 'EMP0004',
                'phone' => '+675-7000-3456',
                'email' => 'michael.osei@email.com',
                'organization_id' => 1,
                'company_id' => 1,
                'gross_pay' => 6200.00,
                'net_pay' => 5000.00,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'cust_name' => 'Priya Nair',
                'emp_code' => 'EMP0005',
                'phone' => '+675-7000-7890',
                'email' => 'priya.nair@email.com',
                'organization_id' => 1,
                'company_id' => 1,
                'gross_pay' => 5800.00,
                'net_pay' => 4600.00,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'cust_name' => 'Liam Chen',
                'emp_code' => 'EMP0006',
                'phone' => '+675-7000-6543',
                'email' => 'liam.chen@email.com',
                'organization_id' => 1,
                'company_id' => 1,
                'gross_pay' => 6100.00,
                'net_pay' => 4900.00,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'cust_name' => 'Fatima Yusuf',
                'emp_code' => 'EMP0007',
                'phone' => '+675-7000-4321',
                'email' => 'fatima.yusuf@email.com',
                'organization_id' => 1,
                'company_id' => 1,
                'gross_pay' => 5300.00,
                'net_pay' => 4200.00,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
