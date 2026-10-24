<?php

use App\Models\AiSetting;
use App\Models\Task;
use App\Models\Train;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('station master can link and sync a train with mission control', function () {
    AiSetting::setMissionControlConfig('https://mission-control-hq-api.mwszghdkkf.workers.dev', 'test-mc-token');

    Http::fake([
        '*/api/projects' => Http::response([
            [
                'id' => 18,
                'title' => 'Grand Central Terminal',
                'status' => 'active',
                'stage' => 'build',
            ],
        ], 200),
        '*/api/milestones' => Http::response([
            [
                'id' => 101,
                'projectId' => 18,
                'title' => 'Cloudflare D1 Bridge Live',
                'evidence' => 'Two-way sync verified',
                'targetDate' => '2026-11-01',
                'status' => 'planned',
            ],
        ], 200),
        '*/api/tasks' => Http::response([
            [
                'id' => 202,
                'projectId' => 18,
                'title' => 'Wire Bot HQ crew dispatches',
                'details' => 'Extend OpenClaw and Janine to Station Master',
                'priority' => 'high',
                'status' => 'open',
                'completionSteps' => 'Inspect bridge — verify endpoints',
            ],
        ], 200),
        '*/api/events' => Http::response(['ok' => true], 200),
    ]);

    $user = User::factory()->create();
    $train = Train::create([
        'name' => 'grandcentral',
        'path' => '/tmp/grandcentral',
        'status' => 'on_time',
        'platform' => 'Laravel',
    ]);

    $this->actingAs($user)
        ->post(route('station-master.sync-mc', $train), [
            'mc_project_id' => 18,
        ])
        ->assertRedirect();

    $train->refresh();
    expect($train->mc_project_id)->toBe(18)
        ->and($train->mc_project_title)->toBe('Grand Central Terminal')
        ->and($train->milestones()->where('mc_milestone_id', 101)->exists())->toBeTrue()
        ->and($train->tasks()->where('mc_task_id', 202)->exists())->toBeTrue();
});

test('station master can dispatch a task to janine or openclaw bot crew', function () {
    Http::fake([
        '*' => Http::response(['ok' => true], 200),
    ]);

    $user = User::factory()->create();
    $train = Train::create([
        'name' => 'grandcentral',
        'path' => '/tmp/grandcentral',
        'status' => 'on_time',
        'platform' => 'Laravel',
    ]);

    $task = Task::create([
        'train_id' => $train->id,
        'title' => 'Add Bot HQ telemetry to Central Tower',
        'description' => 'Display live OpenClaw and Janine status',
        'priority' => 'high',
        'status' => 'pending',
        'assigned_crew' => 'Janine',
    ]);

    $this->actingAs($user)
        ->post(route('station-master.tasks.dispatch-bot', [$train, $task]), [
            'assigned_crew' => 'Janine',
        ])
        ->assertRedirect();

    $task->refresh();
    expect($task->bot_dispatch_status)->toBe('completed')
        ->and($task->completion_steps)->not->toBeEmpty()
        ->and($task->bot_dispatch_reply)->not->toBeEmpty();
});

test('station master suggest schedule works without paid openai key via local engine', function () {
    Http::fake([
        '*' => Http::response([], 500),
    ]);

    $user = User::factory()->create();
    $train = Train::create([
        'name' => 'grandcentral',
        'path' => base_path(),
        'status' => 'on_time',
        'platform' => 'Laravel',
    ]);

    $response = $this->actingAs($user)
        ->postJson(route('station-master.suggest-schedule', $train));

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'provider',
            'suggestions' => [
                'milestones',
                'loose_tasks',
            ],
        ]);
});
