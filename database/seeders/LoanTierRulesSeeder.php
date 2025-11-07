<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\LoanSetting;

class LoanTierRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tierData = [
            [
                'tier_type' => 'Tier 1',
                'min_amount' => 200,
                'max_amount' => 300,
                'min_term_fortnight' => 5,
                'max_term_fortnight' => 5,
            ],
            [
                'tier_type' => 'Tier 2',
                'min_amount' => 350,
                'max_amount' => 600,
                'min_term_fortnight' => 5,
                'max_term_fortnight' => 8,
            ],
            [
                'tier_type' => 'Tier 3',
                'min_amount' => 550,
                'max_amount' => 950,
                'min_term_fortnight' => 5,
                'max_term_fortnight' => 26,
            ],
            [
                'tier_type' => 'Tier 4',
                'min_amount' => 951,
                'max_amount' => 20000,
                'min_term_fortnight' => 5,
                'max_term_fortnight' => 52,
            ],
        ];

        // Fetch all loan settings (loan types)
        $loanSettings = LoanSetting::all();

        if ($loanSettings->isEmpty()) {
            $this->command->warn("⚠️ No loan settings found. Please seed the loan_settings table first.");
            return;
        }

        foreach ($loanSettings as $setting) {
            foreach ($tierData as $tier) {
                DB::table('loan_tier_rules')->insert([
                    'loan_setting_id' => $setting->id,
                    'tier_type' => $tier['tier_type'],
                    'min_amount' => $tier['min_amount'],
                    'max_amount' => $tier['max_amount'],
                    'min_term_fortnight' => $tier['min_term_fortnight'],
                    'max_term_fortnight' => $tier['max_term_fortnight'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ Loan tier rules seeded successfully for all loan settings.');
    }
}
