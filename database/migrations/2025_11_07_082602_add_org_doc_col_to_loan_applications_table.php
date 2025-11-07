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
            $table->date('isada_upload_date')->nullable()->after('isda_signed_upload_path');
            $table->integer('isada_upload_by')->default(0)->after('isada_upload_date');
            $table->string('org_signed_upload_path')->nullable()->after('isada_upload_by');
            $table->date('org_signed_upload_date')->nullable()->after('org_signed_upload_path');
            $table->integer('org_signed_upload_by')->default(0)->after('org_signed_upload_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn([
                'isada_upload_date',
                'isada_upload_by',
                'org_signed_upload_path',
                'org_signed_upload_date',
                'org_signed_upload_by'
            ]);
        });
    }
};
