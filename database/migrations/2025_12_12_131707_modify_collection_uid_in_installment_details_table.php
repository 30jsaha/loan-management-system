<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE `installment_details` 
            CHANGE `collection_uid` `collection_uid` VARCHAR(20) 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci 
            NULL DEFAULT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // If you want to revert back to previous type, adjust here.
        // Example: assume previous was VARCHAR(255) NOT NULL
        DB::statement("
            ALTER TABLE `installment_details` 
            CHANGE `collection_uid` `collection_uid` VARCHAR(255) 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci 
            NOT NULL
        ");
    }
};
