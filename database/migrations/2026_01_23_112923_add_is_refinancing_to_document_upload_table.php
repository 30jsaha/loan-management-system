<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_upload', function (Blueprint $table) {
            $table->tinyInteger('is_refinancing')
                  ->default(2)
                  ->comment('2 = No, 1 = Yes')
                  ->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('document_upload', function (Blueprint $table) {
            $table->dropColumn('is_refinancing');
        });
    }
};
