<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganisationMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('organisation_master')->insert([
            [
                'company_id' => 1,
                'organisation_name' => 'Central Government',
                'address' => 'Waigani, Port Moresby',
                'contact_no' => '+675-312-1000',
                'email' => 'contact@gov.pg',
                'status' => 'Active',
            ],
            [
                'company_id' => 1,
                'organisation_name' => 'National Bank PNG',
                'address' => 'Banking Street, Lae',
                'contact_no' => '+675-324-2000',
                'email' => 'admin@nbpng.pg',
                'status' => 'Active',
            ],
        ]);
    }
}
