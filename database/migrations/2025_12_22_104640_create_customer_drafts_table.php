<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_drafts', function (Blueprint $table) {
            $table->id();

            // 🔐 Auth user
            $table->unsignedBigInteger('user_id')->unique();

            // 🔹 Customer reference (optional)
            $table->unsignedBigInteger('cus_id')->nullable();

            // 🔹 Identification
            $table->string('employee_no')->nullable();

            // 🔹 Basic info
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            $table->string('marital_status')->nullable();

            $table->integer('no_of_dependents')->nullable()->default(0);
            $table->string('spouse_full_name')->nullable();
            $table->string('spouse_contact')->nullable();

            // 🔹 Contact
            $table->string('phone')->nullable();
            $table->string('email')->nullable();

            $table->string('home_province')->nullable();
            $table->string('district_village')->nullable();
            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();

            // 🔹 Employment
            $table->string('payroll_number')->nullable();
            $table->string('employer_department')->nullable();
            $table->string('designation')->nullable();
            $table->string('employment_type')->nullable();
            $table->date('date_joined')->nullable();

            $table->decimal('monthly_salary', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);

            $table->string('immediate_supervisor')->nullable();
            $table->string('years_at_current_employer')->nullable();
            $table->string('work_district')->nullable();
            $table->string('work_province')->nullable();
            $table->text('employer_address')->nullable();
            $table->text('work_location')->nullable();

            // 🔹 Org / Company
            $table->unsignedBigInteger('organisation_id')->nullable()->default(0);
            $table->unsignedBigInteger('company_id')->nullable()->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_drafts');
    }
};
