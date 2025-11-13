<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SalarySlabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('salary_slabs')->insert([
            [
                'slab_desc' => 'Entry Level',
                'starting_salary' => 0.00,
                'ending_salary' => 5000.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slab_desc' => 'Mid Level',
                'starting_salary' => 5000.01,
                'ending_salary' => 15000.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slab_desc' => 'Senior Level',
                'starting_salary' => 15000.01,
                'ending_salary' => 50000.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
