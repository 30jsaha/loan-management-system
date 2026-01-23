<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('installment_details', function (Blueprint $table) {
            $table->tinyInteger('is_refinancing')
                  ->default(2)
                  ->comment('2 = No, 1 = Yes')
                  ->after('remarks');
        });
    }

    public function down(): void
    {
        Schema::table('installment_details', function (Blueprint $table) {
            $table->dropColumn('is_refinancing');
        });
    }
};
