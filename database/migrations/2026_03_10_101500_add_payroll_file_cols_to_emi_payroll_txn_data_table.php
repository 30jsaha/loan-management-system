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
        Schema::table('emi_payroll_txn_data', function (Blueprint $table) {
            $table->string('payroll_file_name', 255)->nullable()->after('payroll_period');
            $table->string('payroll_file_path', 500)->nullable()->after('payroll_file_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('emi_payroll_txn_data', function (Blueprint $table) {
            $table->dropColumn(['payroll_file_name', 'payroll_file_path']);
        });
    }
};
