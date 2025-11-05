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
        Schema::create('company_master', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->text('address')->nullable();
            $table->string('contact_no', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('currency', 10)->default('PGK');
            $table->string('currency_symbol', 5)->default('K');
            $table->decimal('base_interest_rate', 5, 2)->nullable();
            $table->enum('active_status', ['Y','N'])->default('Y');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_master');
    }
};
