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
        Schema::create('emi_payroll_txn_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained('loan_applications')->cascadeOnDelete();
            $table->foreignId('installment_detail_id')->nullable()->constrained('installment_details')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();

            $table->string('collection_uid', 20)->nullable()->index();
            $table->date('payment_date')->nullable();

            $table->string('emp_code', 50)->nullable()->index();
            $table->string('payroll_emp_code', 50)->nullable()->index();
            $table->string('job', 50)->nullable();
            $table->string('employee_name', 255)->nullable();

            $table->decimal('payroll_this_period', 15, 2)->default(0);
            $table->decimal('payroll_last_period', 15, 2)->default(0);
            $table->decimal('payroll_variance', 15, 2)->default(0);
            $table->decimal('payroll_arrears', 15, 2)->default(0);

            $table->decimal('required_emi_amount', 15, 2)->default(0);
            $table->decimal('expected_emi_amount', 15, 2)->default(0);
            $table->unsignedInteger('requested_emi_count')->default(0);
            $table->unsignedInteger('processed_emi_count')->default(0);
            $table->enum('status', ['Success', 'Failed'])->default('Failed')->index();
            $table->text('failure_reason')->nullable();

            $table->string('paycode', 100)->nullable();
            $table->unsignedInteger('payroll_year')->nullable();
            $table->unsignedInteger('payroll_period')->nullable();
            $table->unsignedBigInteger('processed_by_id')->nullable()->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emi_payroll_txn_data');
    }
};
