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
        Schema::create('loan_settings', function (Blueprint $table) {
            $table->id();
            $table->double('min_loan_amount')->default(0);
            $table->double('max_loan_amount')->default(0);
            $table->double('interest_rate')->default(0);
            $table->integer('amt_multiplier')->default(0);
            $table->integer('min_loan_term_months')->default(0);
            $table->integer('min_repay_percentage_for_next_loan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_settings');
    }
};
