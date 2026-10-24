<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trains', function (Blueprint $table) {
            $table->unsignedBigInteger('mc_project_id')->nullable()->index();
            $table->string('mc_project_title')->nullable();
            $table->timestamp('mc_synced_at')->nullable();
        });

        Schema::table('milestones', function (Blueprint $table) {
            $table->unsignedBigInteger('mc_milestone_id')->nullable()->index();
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedBigInteger('mc_task_id')->nullable()->index();
            $table->text('completion_steps')->nullable();
            $table->string('bot_dispatch_status')->nullable();
            $table->text('bot_dispatch_reply')->nullable();
            $table->timestamp('bot_dispatched_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'mc_task_id',
                'completion_steps',
                'bot_dispatch_status',
                'bot_dispatch_reply',
                'bot_dispatched_at',
            ]);
        });

        Schema::table('milestones', function (Blueprint $table) {
            $table->dropColumn(['mc_milestone_id']);
        });

        Schema::table('trains', function (Blueprint $table) {
            $table->dropColumn([
                'mc_project_id',
                'mc_project_title',
                'mc_synced_at',
            ]);
        });
    }
};
