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
        Schema::create('rejection_reasons', function (Blueprint $table) {
            $table->id();
            $table->text('reason_desc')->nullable();
            $table->integer('do_allow_reapply')->default(1)->comment("1 = Allows reapply, 0 = Doesn't allow reapply");
            $table->integer('reason_type')->default(1)->comment("1 = Document, 2 = Loan");
            $table->integer('created_by')->default(0)->comment("Created by user id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rejection_reasons');
    }
};
