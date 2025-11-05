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
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->integer('client_status')->default(1)->comment('1=New Customer, 0=Existing Customer')->after('remarks');
            $table->integer('any_existing_loan')->default(0)->comment('1=Yes, 0=No')->after('client_status');
            $table->decimal('existing_loan_amt', 10, 2)->nullable()->after('any_existing_loan');
            $table->integer('existing_loan_id')->default(0)->after('existing_loan_amt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn(['client_status', 'any_existing_loan', 'existing_loan_amt', 'existing_loan_id']);
        });
    }
};
