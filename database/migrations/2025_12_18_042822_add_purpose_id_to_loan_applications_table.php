<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->unsignedBigInteger('purpose_id')
                  ->nullable()
                  ->after('purpose');

            // Optional FK (recommended)
            $table->foreign('purpose_id')
                  ->references('id')
                  ->on('loan_purposes')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropForeign(['purpose_id']);
            $table->dropColumn('purpose_id');
        });
    }
};
