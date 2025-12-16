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
        Schema::table('document_upload', function (Blueprint $table) {
            // Convert ENUM to VARCHAR
            $table->string('doc_type', 100)
                  ->nullable()
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_upload', function (Blueprint $table) {
            // Revert back to ENUM (original values)
            $table->enum('doc_type', [
                'ID',
                'Payslip',
                'BankStatement',
                'EmploymentLetter',
                'ResumptionSheet',
                'ISDA_Signed',
                'LoanForm_Scanned',
                'ConsentVideo',
                'Other',
            ])->nullable()->change();
        });
    }
};
