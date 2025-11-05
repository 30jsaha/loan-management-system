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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('payroll_number',150)->nullable()->after('email');
            $table->text('home_province')->nullable()->after('payroll_number');
            $table->text('district_village')->nullable()->after('home_province');
            $table->string('spouse_full_name',150)->nullable()->after('district_village');
            $table->string('spouse_contact',20)->nullable()->after('spouse_full_name');
            $table->string('employer_department',200)->nullable()->after('employee_no');
            $table->text('employer_address')->nullable()->after('employer_department');
            $table->text('work_district')->nullable()->after('employer_address');
            $table->string('work_province',100)->nullable()->after('work_district');
            $table->string('immediate_supervisor',100)->nullable()->after('work_province');
            $table->integer('years_at_current_employer')->nullable()->after('immediate_supervisor');
            $table->decimal('net_salary',10,2)->default(0)->after('monthly_salary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'payroll_number',
                'home_province',
                'district_village',
                'spouse_full_name',
                'spouse_contact',
                'employer_department',
                'employer_address',
                'work_district',
                'work_province',
                'immediate_supervisor',
                'years_at_current_employer',
                'net_salary'
            ]);
        });
    }
};
