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
            $table->integer('uploaded_by_user_id')->default(0)->after('uploaded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_upload', function (Blueprint $table) {
            $table->dropColumn(['uploaded_by_user_id']);
        });
    }
};
