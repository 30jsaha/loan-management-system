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
        Schema::table('document_upload', function (Blueprint $table) {

            $table->timestamp('rejected_on')->nullable()->after('verification_status');
            $table->unsignedBigInteger('rejected_by_user_id')->default(0)->after('rejected_on');
            $table->unsignedBigInteger('rejection_reason_id')->default(0)->after('rejected_by_user_id');

            $table->tinyInteger('has_reuploaded_after_rejection')->default(0)->after('rejection_reason_id');

            $table->timestamp('reupload_date')->nullable()->after('has_reuploaded_after_rejection');
            $table->unsignedBigInteger('reuploaded_by_id')->default(0)->after('reupload_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_upload', function (Blueprint $table) {
            $table->dropColumn([
                'rejected_on',
                'rejected_by_user_id',
                'rejection_reason_id',
                'has_reuploaded_after_rejection',
                'reupload_date',
                'reuploaded_by_id',
            ]);
        });
    }
};
