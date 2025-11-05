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
        Schema::create('customer_eligibility_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->decimal('gross_salary_amt', 10, 2)->default(0);
            $table->decimal('temp_allowances_amt', 10, 2)->default(0);
            $table->decimal('overtime_amt', 10, 2)->default(0);
            $table->decimal('tax_amt', 10, 2)->default(0);
            $table->decimal('superannuation_amt', 10, 2)->default(0);
            $table->decimal('net_after_tax_superannuation_amt', 10, 2)->default(0);
            $table->decimal('current_net_pay_amt', 10, 2)->default(0);
            $table->decimal('bank_2_amt', 10, 2)->default(0);
            $table->decimal('total_net_salary_amt', 10, 2)->default(0);
            $table->decimal('total_other_deductions_amt', 10, 2)->default(0);
            $table->decimal('net_50_percent_amt', 10, 2)->default(0);
            $table->decimal('net_50_percent_available_amt', 10, 2)->default(0);
            $table->decimal('current_fincorp_deduction_amt', 10, 2)->default(0);
            $table->decimal('other_deductions_amt', 10, 2)->default(0);
            $table->decimal('max_allowable_pva_amt', 10, 2)->default(0);
            $table->decimal('proposed_pva_amt', 10, 2)->default(0);
            $table->decimal('net_based_on_proposed_pva_amt', 10, 2)->default(0);
            $table->decimal('shortage_amt', 10, 2)->default(0);
            $table->integer('checked_by_user_id')->nullable();
            $table->integer('is_eligible_for_loan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_eligibility_history');
    }
};
