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
        Schema::create('product_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('parent_id')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->boolean('is_featured')->nullable();
            $table->longText('description')->nullable();
            $table->json('attachments')->nullable();
            $table->enum('status', ['active', 'inactive'])->nullable()->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};
