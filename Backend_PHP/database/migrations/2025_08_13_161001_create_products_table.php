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
        $table->id();
        $table->string('product_name');
        $table->string('category');
        $table->integer('quantity'); // in kg
        $table->decimal('price_per_kg', 10, 2);
        $table->string('location');
        $table->boolean('home_delivery')->default(false);
        $table->boolean('self_pickup')->default(false);
        $table->string('product_image')->nullable(); // path to image
        $table->text('description')->nullable();
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
