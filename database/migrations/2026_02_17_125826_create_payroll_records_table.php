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
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->string('emp_code');
            $table->string('job')->nullable();
            $table->string('name');
            $table->decimal('this_period', 15, 2)->default(0);
            $table->decimal('last_period', 15, 2)->default(0);
            $table->decimal('variance', 15, 2)->default(0);
            $table->decimal('arrears', 15, 2)->default(0);

            $table->string('paycode')->nullable();
            $table->integer('year');
            $table->integer('period');

            $table->date('uploaded_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_records');
    }
};
