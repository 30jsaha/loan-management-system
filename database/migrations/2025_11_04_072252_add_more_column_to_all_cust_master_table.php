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
            $table->decimal('gross_pay', 15, 2)->default(0.00)->after('company_id');
            $table->decimal('net_pay', 15, 2)->default(0.00)->after('gross_pay');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->dropColumn(['gross_pay', 'net_pay']);
        });
    }
};
