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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('category_id')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->decimal('regular_price', 8, 2)->nullable()->default(0);
            $table->decimal('discount_price', 8, 2)->nullable()->default(0);
            $table->json('discount_properties')->nullable()->comment('Properties has contain type (flat or percentage) and value (numeric) fields.');
            $table->boolean('is_featured')->nullable();
            $table->integer('rating')->nullable();
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
        Schema::dropIfExists('products');
    }
};
