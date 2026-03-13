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
        Schema::table('customer_salary_histories', function (Blueprint $table) {
            $table->double('previous_monthly_salary', 25, 2)->nullable()->after('loan_application_id');
            $table->double('previous_net_salary', 25, 2)->nullable()->after('previous_monthly_salary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_salary_histories', function (Blueprint $table) {
            $table->dropColumn(['previous_monthly_salary', 'previous_net_salary']);
        });
    }
};
