<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert ENUM to VARCHAR
        DB::statement("
            ALTER TABLE loan_applications 
            MODIFY COLUMN purpose VARCHAR(255) NULL
        ");

        // Add index
        DB::statement("
            CREATE INDEX loan_applications_purpose_index 
            ON loan_applications (purpose)
        ");
    }

    public function down(): void
    {
        // Remove index
        DB::statement("
            DROP INDEX loan_applications_purpose_index 
            ON loan_applications
        ");

        // Convert back to ENUM (rollback safety)
        DB::statement("
            ALTER TABLE loan_applications 
            MODIFY COLUMN purpose ENUM(
                'School Fee',
                'Personal Expenses',
                'Funeral Expenses',
                'Refinancing',
                'Other'
            ) NULL
        ");
    }
};
