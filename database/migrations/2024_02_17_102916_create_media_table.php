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
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary()->index();
            $table->string('company_id')->nullable()->index();
            $table->string('branch_id')->nullable()->index();
            $table->string('user_id')->nullable();
            $table->string('name')->nullable();
            $table->string('extension')->nullable();
            $table->string('type')->nullable();
            $table->string('size')->nullable();
            $table->text('path')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
