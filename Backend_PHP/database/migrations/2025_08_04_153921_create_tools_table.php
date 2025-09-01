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
    Schema::create('tools', function (Blueprint $table) {
        $table->id();
        $table->string('tool_name');
        $table->string('category');
        $table->decimal('rental_price', 8, 2);
        $table->date('available_from');
        $table->date('available_to');
        $table->string('location');
        $table->boolean('pickup_available')->default(false);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tools');
    }
};
