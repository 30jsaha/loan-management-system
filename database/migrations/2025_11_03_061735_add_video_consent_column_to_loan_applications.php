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
            $table->string('video_consent_file_name',250)->nullable()->after('isda_signed_upload_path');
            $table->string('video_consent_path',250)->nullable()->after('video_consent_file_name');
            $table->date('video_consent_upload_date')->nullable()->after('video_consent_path');
            $table->integer('video_consent_uploaded_by_user_id')->nullable()->after('video_consent_upload_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn([
                'video_consent_file_name',
                'video_consent_path',
                'video_consent_upload_date',
                'video_consent_uploaded_by_user_id'
            ]);
        });
    }
};
