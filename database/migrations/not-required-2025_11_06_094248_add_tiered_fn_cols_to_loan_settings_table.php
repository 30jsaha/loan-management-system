<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('loan_settings', function (Blueprint $table) {
            // Tier 1: 200–300 PGK → FN = 1
            $table->decimal('tier1_min_amount', 10, 2)->nullable()->default(200)->after('min_repay_percentage_for_next_loan');
            $table->decimal('tier1_max_amount', 10, 2)->nullable()->default(300)->after('tier1_min_amount');
            $table->integer('tier1_min_term')->nullable()->default(1)->after('tier1_max_amount');
            $table->integer('tier1_max_term')->nullable()->default(1)->after('tier1_min_term');

            // Tier 2: 350–600 PGK → FN 5–8
            $table->decimal('tier2_min_amount', 10, 2)->nullable()->default(350)->after('tier1_max_term');
            $table->decimal('tier2_max_amount', 10, 2)->nullable()->default(600)->after('tier2_min_amount');
            $table->integer('tier2_min_term')->nullable()->default(5)->after('tier2_max_amount');
            $table->integer('tier2_max_term')->nullable()->default(8)->after('tier2_min_term');

            // Tier 3: 550–950 PGK → FN up to 26
            $table->decimal('tier3_min_amount', 10, 2)->nullable()->default(550)->after('tier2_max_term');
            $table->decimal('tier3_max_amount', 10, 2)->nullable()->default(950)->after('tier3_min_amount');
            $table->integer('tier3_min_term')->nullable()->default(5)->after('tier3_max_amount');
            $table->integer('tier3_max_term')->nullable()->default(26)->after('tier3_min_term');

            // Tier 4: >950 → FN up to 52
            $table->decimal('tier4_min_amount', 10, 2)->nullable()->default(951)->after('tier3_max_term');
            $table->decimal('tier4_max_amount', 10, 2)->nullable()->default(20000)->after('tier4_min_amount');
            $table->integer('tier4_min_term')->nullable()->default(5)->after('tier4_max_amount');
            $table->integer('tier4_max_term')->nullable()->default(52)->after('tier4_min_term');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_settings', function (Blueprint $table) {
            $table->dropColumn([
                'tier1_min_amount',
                'tier1_max_amount',
                'tier1_min_term',
                'tier1_max_term',
                'tier2_min_amount',
                'tier2_max_amount',
                'tier2_min_term',
                'tier2_max_term',
                'tier3_min_amount',
                'tier3_max_amount',
                'tier3_min_term',
                'tier3_max_term',
                'tier4_min_amount',
                'tier4_max_amount',
                'tier4_min_term',
                'tier4_max_term',
            ]);
        });
    }
};
