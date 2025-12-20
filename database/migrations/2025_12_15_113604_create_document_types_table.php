<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();

            $table->string('doc_key')->unique(); 
            // Example: ID, Payslip, BankStatement

            $table->string('doc_name');
            // Human readable name

            $table->unsignedInteger('min_size_kb')->default(0);
            $table->unsignedInteger('max_size_kb')->default(20480);
            // Default max = 20MB

            $table->boolean('is_required')->default(1)
                  ->comment('1 = mandatory, 0 = optional');

            $table->boolean('active')->default(1);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};