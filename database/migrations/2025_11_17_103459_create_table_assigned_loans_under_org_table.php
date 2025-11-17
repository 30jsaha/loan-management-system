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
        Schema::create('assigned_loans_under_org', function (Blueprint $table) {
            $table->id();
            $table->integer('org_id')->default(0);
            $table->integer('loan_id')->default(0);
            $table->integer('active')->default(1)->comment("1 = Active, 0 = Inactive");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_loans_under_org');
    }
};
