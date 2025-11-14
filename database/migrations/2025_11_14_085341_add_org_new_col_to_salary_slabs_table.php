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
        Schema::table('salary_slabs', function (Blueprint $table) {
            // Add column (nullable or without default)
            $table->unsignedBigInteger('org_id')->default(0)->after('id');

            // Add foreign key constraint
            // $table->foreign('org_id')
            //     ->references('id')
            //     ->on('organisation_master') // or 'organisation_masters' if that's your actual table name
            //     ->onDelete('cascade'); 
        });
    }

    public function down(): void
    {
        Schema::table('salary_slabs', function (Blueprint $table) {
            // Drop foreign key first
            // $table->dropForeign(['org_id']);

            // Then drop the column
            $table->dropColumn('org_id');
        });
    }
};
