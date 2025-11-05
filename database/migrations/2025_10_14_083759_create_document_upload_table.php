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
        Schema::create('document_upload', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->nullable()->constrained('loan_applications')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->cascadeOnDelete();
            $table->enum('doc_type', [
                'ID','Payslip','BankStatement','EmploymentLetter',
                'ResumptionSheet','ISDA_Signed','LoanForm_Scanned',
                'ConsentVideo','Other'
            ])->default('Other');
            $table->string('file_name', 255);
            $table->string('file_path', 255);
            $table->string('uploaded_by', 100)->nullable();
            $table->dateTime('uploaded_on')->useCurrent();
            $table->string('verified_by', 100)->nullable();
            $table->dateTime('verified_on')->nullable();
            $table->enum('verification_status', ['Pending','Verified','Rejected'])->default('Pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_upload');
    }
};
