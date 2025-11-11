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
            $table->float('late_fees', 12,2)->default(0.00)->after('min_repay_percentage_for_next_loan');
            $table->integer('installment_frequency_in_days')->default(14)->after('late_fees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_settings', function (Blueprint $table) {
            $table->dropColumn(['late_fees', 'installment_frequency_in_days']);
        });
    }
};
