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
        Schema::create('loan_tier_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_setting_id')->constrained('loan_settings')->cascadeOnDelete();
            $table->string('tier_type', 50)->nullable(); // Example: 'Tier 1', 'Tier 2'
            $table->decimal('min_amount', 10, 2);
            $table->decimal('max_amount', 10, 2);
            $table->integer('min_term_fortnight')->nullable();
            $table->integer('max_term_fortnight')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_tier_rules');
    }
};
