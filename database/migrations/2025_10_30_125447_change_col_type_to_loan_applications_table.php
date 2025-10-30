<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            // Drop the default before changing type
            DB::statement("ALTER TABLE loan_applications MODIFY loan_type INT NULL");
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            DB::statement("ALTER TABLE loan_applications MODIFY loan_type ENUM('New', 'Consolidation', 'Rollover', 'Top-Up') NULL");
        });
    }
};

