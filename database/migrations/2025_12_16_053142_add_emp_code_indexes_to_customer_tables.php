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
            // Index for faster exclusion & search
            if (!Schema::hasColumn('all_cust_master', 'emp_code')) {
                return;
            }
            $table->index('emp_code', 'idx_all_cust_master_emp_code');
        });

        Schema::table('customers', function (Blueprint $table) {
            // Index for faster NOT IN subquery
            if (!Schema::hasColumn('customers', 'employee_no')) {
                return;
            }
            $table->index('employee_no', 'idx_customers_employee_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {
            $table->dropIndex('idx_all_cust_master_emp_code');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex('idx_customers_employee_no');
        });
    }
};
