<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Index for all_cust_master.emp_code
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->index('emp_code', 'idx_allcust_empcode');
        });

        // Index for customers.employee_no
        Schema::table('customers', function (Blueprint $table) {
            $table->index('employee_no', 'idx_customers_employeeno');
        });
    }

    public function down(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->dropIndex('idx_allcust_empcode');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex('idx_customers_employeeno');
        });
    }
};
