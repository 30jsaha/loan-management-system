<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Build map: purpose_name => id
        $purposeMap = DB::table('loan_purposes')
            ->pluck('id', 'purpose_name')
            ->toArray();

        // Fetch all loans with purpose string
        $loans = DB::table('loan_applications')
            ->select('id', 'purpose')
            ->whereNotNull('purpose')
            ->get();

        foreach ($loans as $loan) {
            if (isset($purposeMap[$loan->purpose])) {
                DB::table('loan_applications')
                    ->where('id', $loan->id)
                    ->update([
                        'purpose_id' => $purposeMap[$loan->purpose]
                    ]);
            }
        }
    }

    public function down(): void
    {
        // Rollback only clears purpose_id (safe)
        DB::table('loan_applications')->update([
            'purpose_id' => null
        ]);
    }
};
