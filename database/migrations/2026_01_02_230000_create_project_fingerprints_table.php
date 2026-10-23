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
        Schema::create('project_fingerprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('train_id')->constrained()->cascadeOnDelete();
            $table->text('core_purpose')->nullable();
            $table->json('tech_stack')->nullable();
            $table->enum('current_state', ['draft', 'mvp', 'maintenance', 'abandoned'])->default('draft');
            $table->text('summary')->nullable();
            $table->json('embedding')->nullable();
            $table->timestamp('last_analyzed_at')->nullable();
            $table->integer('tokens_used')->default(0);
            $table->timestamps();

            $table->unique('train_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_fingerprints');
    }
};
