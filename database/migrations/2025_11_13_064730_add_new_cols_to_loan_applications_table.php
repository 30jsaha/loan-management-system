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
            // ✅ Rename existing column first
            $table->renameColumn('isda_generated_path', 'isda_file_name');

            // ✅ Add new columns
            $table->integer('isda_is_verified')->default(0)->after('isada_upload_by');
            $table->integer('isda_rejection_reason_id')->default(0)->after('isda_is_verified');
            $table->integer('isda_verified_by_id')->default(0)->after('isda_rejection_reason_id');
            $table->timestamp('isda_verified_on')->nullable()->after('isda_verified_by_id');

            $table->string('org_signed_file_name')->nullable()->after('isda_verified_on');
            $table->integer('org_is_verified')->default(0)->after('org_signed_file_name');
            $table->integer('org_rejection_reason_id')->default(0)->after('org_is_verified');
            $table->integer('org_verified_by_id')->default(0)->after('org_rejection_reason_id');
            $table->timestamp('org_verified_on')->nullable()->after('org_verified_by_id');

            $table->integer('video_consent_is_verified')->default(0)->after('org_verified_on');
            $table->integer('video_consent_rejection_reason_id')->default(0)->after('video_consent_is_verified');
            $table->integer('video_consent_verified_by_id')->default(0)->after('video_consent_rejection_reason_id');
            $table->timestamp('video_consent_verified_on')->nullable()->after('video_consent_verified_by_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            // ✅ Drop new columns first
            $table->dropColumn([
                'isda_is_verified',
                'isda_rejection_reason_id',
                'isda_verified_by_id',
                'isda_verified_on',
                'org_signed_file_name',
                'org_is_verified',
                'org_rejection_reason_id',
                'org_verified_by_id',
                'org_verified_on',
                'video_consent_is_verified',
                'video_consent_rejection_reason_id',
                'video_consent_verified_by_id',
                'video_consent_verified_on',
            ]);

            // ✅ Rename back last
            $table->renameColumn('isda_file_name', 'isda_generated_path');
        });
    }
};
