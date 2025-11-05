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
        Schema::create('all_cust_master', function (Blueprint $table) {
            $table->id();
            $table->string('cust_name',200)->nullable();
            $table->string('emp_code',50)->nullable();
            $table->string('phone',20)->nullable();
            $table->string('email',100)->nullable();
            $table->integer('organization_id')->default(0);
            $table->integer('company_id')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('all_cust_master');
    }
};
