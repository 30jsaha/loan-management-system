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
        Schema::table('installment_details', function (Blueprint $table) {
             $table->string('collection_uid', 10)
                  ->nullable()
                  ->after('loan_id')
                  ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('installment_details', function (Blueprint $table) {
            $table->dropColumn('collection_uid');
        });
    }
};
