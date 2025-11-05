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
        Schema::create('organisation_master', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('company_master')->cascadeOnDelete();
            $table->string('organisation_name');
            $table->enum('sector_type', ['Education', 'Health', 'Other'])->default('Other');
            $table->string('department_code', 50)->nullable();
            $table->string('location_code', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('province', 100)->nullable();
            $table->string('contact_person', 100)->nullable();
            $table->string('contact_no', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->enum('status', ['Active','Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organisation_master');
    }
};
