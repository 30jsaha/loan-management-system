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
        Schema::create('loan_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('company_master')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('organisation_id')->constrained('organisation_master')->cascadeOnDelete();

            $table->enum('loan_type', ['New','Consolidation','Rollover','Top-Up'])->default('New');
            $table->enum('purpose', ['Tuition','Living','Medical','Appliance','Car','Travel','HomeImprovement','Other'])->nullable();
            $table->string('other_purpose_text', 255)->nullable();

            $table->decimal('loan_amount_applied', 10, 2);
            $table->decimal('loan_amount_approved', 10, 2)->nullable();
            $table->integer('tenure_fortnight');
            $table->decimal('emi_amount', 10, 2)->nullable();
            $table->decimal('interest_rate', 5, 2)->nullable();
            $table->decimal('processing_fee', 10, 2)->nullable();
            $table->integer('grace_period_days')->nullable();

            $table->date('disbursement_date')->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('bank_branch', 100)->nullable();
            $table->string('bank_account_no', 50)->nullable();

            $table->enum('status', ['Pending','Verified','Approved','HigherApproval','Disbursed','Closed'])
                  ->default('Pending');

            $table->string('approved_by', 100)->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('higher_approved_by', 100)->nullable();
            $table->dateTime('higher_approved_date')->nullable();

            $table->string('isda_generated_path', 255)->nullable();
            $table->string('isda_signed_upload_path', 255)->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_applications');
    }
};
