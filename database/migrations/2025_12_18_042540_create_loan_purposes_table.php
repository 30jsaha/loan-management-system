<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_purposes', function (Blueprint $table) {
            $table->id();
            $table->string('purpose_name', 255)->unique();
            $table->tinyInteger('status')->default(1); // 1 = active
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_purposes');
    }
};
