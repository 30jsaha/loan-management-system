<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refinanced_loans', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('existing_loan_id');
            $table->unsignedBigInteger('new_loan_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('organization_id');

            $table->double('gross_salary_amt')->default(0);
            $table->double('net_salary_amt')->default(0);
            $table->double('prev_loan_balance')->default(0);
            $table->double('amount_disbursed')->default(0);

            $table->timestamps();

            // 🔒 Optional foreign keys (recommended)
            $table->foreign('existing_loan_id')->references('id')->on('loan_applications');
            $table->foreign('new_loan_id')->references('id')->on('loan_applications');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('organization_id')->references('id')->on('organisation_master');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refinanced_loans');
    }
};
