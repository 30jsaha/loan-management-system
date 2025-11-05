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
        Schema::create('installment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained('loan_applications')->cascadeOnDelete();
            $table->integer('installment_no');
            $table->date('due_date');
            $table->decimal('emi_amount', 10, 2);
            $table->date('payment_date')->nullable();
            $table->enum('payment_mode', ['EmployerDeduction','Cash','Transfer'])->nullable();
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->enum('status', ['Pending','Paid','Overdue'])->default('Pending');
            $table->string('employer_reference_no', 100)->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installment_details');
    }
};
