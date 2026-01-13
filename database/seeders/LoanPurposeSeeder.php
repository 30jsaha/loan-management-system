<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoanPurposeSeeder extends Seeder
{
    public function run(): void
    {
        $purposes = [
            'School Fee',
            'Personal Expenses',
            'Funeral Expenses',
            'Refinancing',
            'Other',
        ];

        foreach ($purposes as $purpose) {
            DB::table('loan_purposes')->insert([
                'purpose_name' => $purpose,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
