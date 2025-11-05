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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('company_master')->cascadeOnDelete();
            $table->foreignId('organisation_id')->constrained('organisation_master')->cascadeOnDelete();

            // Personal Info
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['Male','Female','Other'])->nullable();
            $table->date('dob')->nullable();
            $table->enum('marital_status', ['Single','Married','Divorced','Widowed'])->nullable();
            $table->integer('no_of_dependents')->nullable();

            // Contact Info
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();

            // Employment Info
            $table->string('employee_no', 50)->nullable();
            $table->string('designation', 100)->nullable();
            $table->enum('employment_type', ['Permanent','Contract'])->nullable();
            $table->date('date_joined')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();
            $table->string('work_location', 100)->nullable();

            // Media / Status
            $table->string('video_consent_path', 255)->nullable();
            $table->enum('status', ['Active','Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
