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
            $table->unsignedBigInteger('loan_reject_reason_id')->nullable()->after('remarks');
            $table->unsignedBigInteger('loan_reject_by_id')->nullable()->after('loan_reject_reason_id');

            $table->tinyInteger('is_temp_rejection')->default(0)->after('loan_reject_by_id');
            $table->tinyInteger('has_fixed_temp_rejection')->default(0)->after('is_temp_rejection');

            $table->timestamp('loan_reject_date')->nullable()->after('has_fixed_temp_rejection');
            $table->timestamp('temp_reject_fix_date')->nullable()->after('loan_reject_date');

            $table->tinyInteger('is_ack_downloaded')->default(0)->after('temp_reject_fix_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn([
                'loan_reject_reason_id',
                'loan_reject_by_id',
                'is_temp_rejection',
                'has_fixed_temp_rejection',
                'loan_reject_date',
                'temp_reject_fix_date',
                'is_ack_downloaded',
            ]);
        });
    }
};
