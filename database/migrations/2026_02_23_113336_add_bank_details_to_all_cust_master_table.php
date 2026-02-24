<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {

            $table->string('bank1_name', 150)->nullable()->after('net_pay');
            $table->string('bank1_branch', 150)->nullable()->after('bank1_name');
            $table->string('bank1_account_no', 100)->nullable()->after('bank1_branch');

            $table->string('bank2_name', 150)->nullable()->after('bank1_account_no');
            $table->string('bank2_branch', 150)->nullable()->after('bank2_name');
            $table->string('bank2_account_no', 100)->nullable()->after('bank2_branch');

        });
    }

    public function down(): void
    {
        Schema::table('all_cust_master', function (Blueprint $table) {

            $table->dropColumn([
                'bank1_name',
                'bank1_branch',
                'bank1_account_no',
                'bank2_name',
                'bank2_branch',
                'bank2_account_no',
            ]);

        });
    }
};