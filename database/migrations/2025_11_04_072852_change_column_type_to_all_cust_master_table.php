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
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->double('gross_pay', 15, 2)->change();
            $table->double('net_pay', 15, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->decimal('gross_pay', 15, 2)->change();
            $table->decimal('net_pay', 15, 2)->change();
        });
    }
};
