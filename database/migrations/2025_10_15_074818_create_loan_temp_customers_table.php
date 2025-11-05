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
        Schema::create('loan_temp_customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // logged-in user
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('organisation_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            $table->string('marital_status')->nullable();
            $table->integer('no_of_dependents')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('employee_no')->nullable();
            $table->string('designation')->nullable();
            $table->string('employment_type')->nullable();
            $table->date('date_joined')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();
            $table->string('work_location')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_temp_customers');
    }
};
