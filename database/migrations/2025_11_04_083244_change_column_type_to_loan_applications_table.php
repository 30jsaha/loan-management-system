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
            $table->double('elegible_amount', 25, 2)->default(0.00)->change();
            $table->double('min_repay_amt_for_next_loan', 25, 2)->default(0.00)->change();
            $table->double('total_repay_amt', 25, 2)->default(0.00)->change();
            $table->double('total_interest_amt', 25, 2)->default(0.00)->change();
            $table->double('processing_fee', 25, 2)->default(0.00)->change();
            $table->double('existing_loan_amt', 25, 2)->default(0.00)->change();
            $table->double('emi_amount', 25, 2)->default(0.00)->change();
            $table->double('interest_rate', 25, 2)->default(0.00)->change();
            $table->double('loan_amount_applied', 25, 2)->default(0.00)->change();
            $table->double('loan_amount_approved', 25, 2)->default(0.00)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->decimal('elegible_amount', 25, 2)->default(0.00)->change();
            $table->decimal('min_repay_amt_for_next_loan', 25, 2)->default(0.00)->change();
            $table->decimal('total_repay_amt', 25, 2)->default(0.00)->change();
            $table->decimal('total_interest_amt', 25, 2)->default(0.00)->change();
            $table->decimal('processing_fee', 25, 2)->default(0.00)->change();
            $table->decimal('existing_loan_amt', 25, 2)->default(0.00)->change();
            $table->decimal('emi_amount', 25, 2)->default(0.00)->change();
            $table->decimal('interest_rate', 25, 2)->default(0.00)->change();
            $table->decimal('loan_amount_applied', 25, 2)->default(0.00)->change();
            $table->decimal('loan_amount_approved', 25, 2)->default(0.00)->change();
        });
    }
};
