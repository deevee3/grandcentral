<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\Train;
use App\Services\BotFleetService;
use App\Services\MissionControlService;
use App\Services\OpenAiService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ConductorExportSnapshot extends Command
{
    protected $signature = 'conductor:export-snapshot';

    protected $description = 'Export a static JSON snapshot of trains, milestones, tasks, Mission Control links, and Bot HQ roster for Cloudflare Pages builds.';

    public function handle(
        MissionControlService $mc,
        BotFleetService $bots,
        OpenAiService $openAi
    ): int {
        $trains = Train::with(['milestones.tasks', 'tasks', 'fingerprint'])
            ->orderByRaw("coalesce(platform, '') asc")
            ->orderBy('name')
            ->get();

        $dashboardTrains = $trains->map(fn (Train $train) => [
            'id' => $train->id,
            'name' => $train->name,
            'path' => $train->path,
            'status' => $train->status,
            'statusLabel' => $train->getStatusLabel(),
            'platform' => $train->platform,
            'lastDeparture' => $train->last_departure?->toIso8601String(),
            'mcProjectId' => $train->mc_project_id,
            'mcProjectTitle' => $train->mc_project_title,
            'aboardUrl' => '/trains/'.$train->id.'/aboard',
            'stationMasterUrl' => '/station-master/'.$train->id,
        ])->values()->all();

        $allTasks = Task::with('train:id,name,status,mc_project_id,mc_project_title')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByRaw("CASE status WHEN 'in_progress' THEN 1 WHEN 'pending' THEN 2 ELSE 3 END")
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'assigned_crew' => $task->assigned_crew,
                'mc_task_id' => $task->mc_task_id,
                'bot_dispatch_status' => $task->bot_dispatch_status,
                'train_id' => $task->train_id,
                'train_name' => $task->train?->name,
                'train_status' => $task->train?->status,
                'created_at' => $task->created_at?->toIso8601String(),
            ])->values();

        $taskStats = [
            'total' => $allTasks->count(),
            'pending' => $allTasks->where('status', 'pending')->count(),
            'in_progress' => $allTasks->where('status', 'in_progress')->count(),
            'completed' => $allTasks->where('status', 'completed')->count(),
            'high_priority' => $allTasks->where('priority', 'high')->where('status', '!=', 'completed')->count(),
        ];

        $mcProjects = collect($mc->listProjects())
            ->map(fn (array $p) => [
                'id' => (int) ($p['id'] ?? 0),
                'title' => (string) ($p['title'] ?? 'Untitled'),
                'status' => (string) ($p['status'] ?? 'active'),
                'stage' => (string) ($p['stage'] ?? ''),
            ])
            ->sortBy('title')
            ->values()
            ->all();

        $mcStatus = $mc->status();
        $botStatus = $bots->status();
        $botRoster = $bots->getCrewRoster();
        $aiProvider = $openAi->activeProviderName();

        $stationMasterByTrain = [];
        foreach ($trains as $train) {
            $stationMasterByTrain[$train->id] = [
                'train' => $train->only([
                    'id',
                    'name',
                    'path',
                    'status',
                    'platform',
                    'last_departure',
                    'mc_project_id',
                    'mc_project_title',
                    'mc_synced_at',
                ]),
                'milestones' => $train->milestones->values()->all(),
                'looseTasks' => $train->tasks->whereNull('milestone_id')->values()->all(),
                'markdownFiles' => [
                    ['name' => 'README.md', 'exists' => File::exists($train->path.'/README.md'), 'size' => File::exists($train->path.'/README.md') ? File::size($train->path.'/README.md') : 0],
                    ['name' => 'TODO.md', 'exists' => File::exists($train->path.'/TODO.md'), 'size' => File::exists($train->path.'/TODO.md') ? File::size($train->path.'/TODO.md') : 0],
                ],
                'fingerprint' => $train->fingerprint,
                'mcStatus' => $mcStatus,
                'mcProjects' => $mcProjects,
                'suggestedMcProjectId' => $train->mc_project_id,
                'botRoster' => $botRoster,
                'aiProvider' => $aiProvider,
            ];
        }

        $snapshot = [
            'generatedAt' => now()->toIso8601String(),
            'dashboard' => [
                'trains' => $dashboardTrains,
            ],
            'centralTower' => [
                'trains' => $trains->values()->all(),
                'allTasks' => $allTasks->all(),
                'taskStats' => $taskStats,
                'mcStatus' => $mcStatus,
                'mcActivity' => $mc->listActivity(12),
                'botStatus' => $botStatus,
            ],
            'stationMaster' => $stationMasterByTrain,
            'aiSettings' => [
                'hasApiKey' => false,
                'activeProvider' => $aiProvider,
                'mcStatus' => $mcStatus,
                'botStatus' => $botStatus,
            ],
        ];

        $targetDir = resource_path('js/data');
        File::ensureDirectoryExists($targetDir);
        File::put($targetDir.'/yard-snapshot.json', json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->info('Exported snapshot to resources/js/data/yard-snapshot.json');

        return Command::SUCCESS;
    }
}
