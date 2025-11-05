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
            $table->integer('org_id')->default(0)->after('id');
            $table->integer('max_loan_term_months')->default(0)->after('min_loan_term_months');
            $table->double('process_fees')->default(0.00)->after('max_loan_term_months');
            $table->date('effect_date')->nullable()->after('min_repay_percentage_for_next_loan');
            $table->date('end_date')->nullable()->after('effect_date');
            $table->integer('user_id')->default(0)->after('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_settings', function (Blueprint $table) {
            $table->dropColumn(['org_id', 'max_loan_term_months', 'process_fees', 'effect_date', 'end_date', 'user_id']);
        });
    }
};
