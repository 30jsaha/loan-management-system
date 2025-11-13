<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RejectionReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rejection_reasons')->insert([
            [
                'reason_desc' => 'Document is expired or invalid',
                'do_allow_reapply' => 1,
                'reason_type' => 1,
                'created_by' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'reason_desc' => 'Document is not visually clear',
                'do_allow_reapply' => 1,
                'reason_type' => 1,
                'created_by' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'reason_desc' => 'Insufficient income to support loan amount',
                'do_allow_reapply' => 1,
                'reason_type' => 2,
                'created_by' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'reason_desc' => 'Failed background verification',
                'do_allow_reapply' => 0,
                'reason_type' => 2,
                'created_by' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
