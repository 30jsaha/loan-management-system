<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LoanSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('loan_settings')->insert([
            [
                'org_id' => 1,
                'loan_desc' => 'New',
                'min_loan_amount' => 200,
                'max_loan_amount' => 20000,
                'interest_rate' => 2.35,
                'amt_multiplier' => 50,
                'min_loan_term_months' => 5,
                'max_loan_term_months' => 52,
                'process_fees' => 20.00,
                'min_repay_percentage_for_next_loan' => 80,
                'user_id' => Auth::id() ?? 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'org_id' => 1,
                'loan_desc' => 'Consolidation',
                'min_loan_amount' => 200,
                'max_loan_amount' => 20000,
                'interest_rate' => 2.35,
                'amt_multiplier' => 50,
                'min_loan_term_months' => 5,
                'max_loan_term_months' => 52,
                'process_fees' => 20.00,
                'min_repay_percentage_for_next_loan' => 80,
                'user_id' => Auth::id() ?? 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'org_id' => 1,
                'loan_desc' => 'Rollover',
                'min_loan_amount' => 200,
                'max_loan_amount' => 20000,
                'interest_rate' => 2.35,
                'amt_multiplier' => 50,
                'min_loan_term_months' => 5,
                'max_loan_term_months' => 52,
                'process_fees' => 20.00,
                'min_repay_percentage_for_next_loan' => 80,
                'user_id' => Auth::id() ?? 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'org_id' => 1,
                'loan_desc' => 'Top-Up',
                'min_loan_amount' => 200,
                'max_loan_amount' => 20000,
                'interest_rate' => 2.35,
                'amt_multiplier' => 50,
                'min_loan_term_months' => 5,
                'max_loan_term_months' => 52,
                'process_fees' => 20.00,
                'min_repay_percentage_for_next_loan' => 80,
                'user_id' => Auth::id() ?? 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
