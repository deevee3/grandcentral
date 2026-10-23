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
        Schema::create('trains', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Line Name - project folder name
            $table->string('path'); // Track Path - absolute local directory path
            $table->enum('status', ['on_time', 'delayed', 'in_yard']); // Schedule status
            $table->timestamp('last_departure')->nullable(); // Last Sync - last time folder was touched/opened
            $table->string('platform')->nullable(); // Platform assignment (Laravel, React, etc.)
            $table->json('cargo')->nullable(); // Tech stack detection results
            $table->timestamps();

            $table->unique('path'); // Ensure no duplicate paths
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trains');
    }
};
