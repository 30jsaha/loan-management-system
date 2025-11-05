<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CompanyMaster;

class CompanyMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CompanyMaster::insert([
            [
                'company_name' => 'Agro Advance Aben Ltd.',
                'address' => 'Downtown Business Center, Port Moresby',
                'contact_no' => '+675-320-1234',
                'email' => 'info@pacificfinance.pg',
                'currency' => 'PGK',
                'currency_symbol' => 'K',
                'base_interest_rate' => 12.5,
                'active_status' => 'Y',
            ]
        ]);
    }
}
