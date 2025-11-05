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
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->integer('total_no_emi')->nullable()->after('interest_rate');
            $table->date('next_due_date')->nullable()->after('total_no_emi');
            $table->decimal('elegible_amount', 10, 2)->nullable()->after('next_due_date');
            $table->decimal('min_repay_amt_for_next_loan', 10, 2)->nullable()->after('elegible_amount');
            $table->decimal('total_repay_amt', 10, 2)->nullable()->after('min_repay_amt_for_next_loan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn(['total_no_emi', 'next_due_date', 'elegible_amount', 'min_repay_amt_for_next_loan', 'total_repay_amt']);
        });
    }
};
