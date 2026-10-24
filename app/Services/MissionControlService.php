<?php

namespace App\Services;

use App\Models\AiSetting;
use App\Models\Milestone;
use App\Models\Task;
use App\Models\Train;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MissionControlService
{
    private const USER_AGENT = 'GrandCentral/1.0 (+https://mission.dvaughnhouse.com)';

    private string $baseUrl;

    private ?string $token;

    public function __construct()
    {
        $this->baseUrl = AiSetting::getMissionControlUrl();
        $this->token = AiSetting::getMissionControlToken();
    }

    public function isLiveConfigured(): bool
    {
        return is_string($this->token) && $this->token !== '';
    }

    public function hasLocalSeed(): bool
    {
        $path = (string) config('grandcentral.mission_control.seed_sql_path');

        return $path !== '' && is_file($path) && is_readable($path);
    }

    public function status(): array
    {
        $workerReachable = false;
        try {
            $resp = Http::withHeaders(['User-Agent' => self::USER_AGENT])
                ->timeout(5)
                ->get($this->baseUrl.'/api/health');
            $workerReachable = $resp->successful() && ($resp->json('ok') === true);
        } catch (\Throwable) {
            $workerReachable = false;
        }

        $projects = $this->listProjects();

        return [
            'url' => $this->baseUrl,
            'worker_reachable' => $workerReachable,
            'authenticated' => $this->isLiveConfigured(),
            'mode' => $this->isLiveConfigured() ? 'live' : ($this->hasLocalSeed() ? 'local_mirror' : 'disconnected'),
            'project_count' => count($projects),
            'linked_trains_count' => Train::whereNotNull('mc_project_id')->count(),
        ];
    }

    /**
     * Authenticate with Mission Control email + password to mint a 30-day session token.
     */
    public function login(string $password, string $email = 'dvaughn@dvaughnhouse.com'): ?string
    {
        try {
            $resp = Http::withHeaders(['User-Agent' => self::USER_AGENT])
                ->timeout(10)
                ->post($this->baseUrl.'/api/login', [
                    'email' => $email,
                    'password' => $password,
                ]);

            if ($resp->successful() && $resp->json('ok') && $resp->json('token')) {
                $token = (string) $resp->json('token');
                AiSetting::setMissionControlConfig($this->baseUrl, $token);
                $this->token = $token;

                return $token;
            }
        } catch (\Throwable $e) {
            Log::warning('Mission Control login failed', ['error' => $e->getMessage()]);
        }

        return null;
    }

    public function listProjects(): array
    {
        if ($this->isLiveConfigured()) {
            $live = $this->request('GET', '/api/projects');
            if (is_array($live)) {
                return $live;
            }
        }

        return $this->readSeedTable('projects');
    }

    public function listMilestones(?int $mcProjectId = null): array
    {
        $items = null;
        if ($this->isLiveConfigured()) {
            $items = $this->request('GET', '/api/milestones');
        }

        if (! is_array($items)) {
            $items = $this->readSeedTable('milestones');
        }

        if ($mcProjectId !== null) {
            return array_values(array_filter(
                $items,
                fn ($m) => isset($m['projectId']) && (int) $m['projectId'] === $mcProjectId
            ));
        }

        return $items;
    }

    public function listTasks(?int $mcProjectId = null): array
    {
        $items = null;
        if ($this->isLiveConfigured()) {
            $items = $this->request('GET', '/api/tasks');
        }

        if (! is_array($items)) {
            $items = $this->readSeedTable('tasks');
        }

        if ($mcProjectId !== null) {
            return array_values(array_filter(
                $items,
                fn ($t) => isset($t['projectId']) && (int) $t['projectId'] === $mcProjectId
            ));
        }

        return $items;
    }

    public function listActivity(int $limit = 15): array
    {
        $items = null;
        if ($this->isLiveConfigured()) {
            $items = $this->request('GET', '/api/activity');
        }

        if (! is_array($items)) {
            $items = $this->readSeedTable('activity');
        }

        usort($items, fn ($a, $b) => strcmp((string) ($b['createdAt'] ?? ''), (string) ($a['createdAt'] ?? '')));

        return array_slice($items, 0, $limit);
    }

    /**
     * Find the best matching Mission Control project for a Train.
     */
    public function findMatchingProject(Train $train, ?array $projects = null): ?array
    {
        $projects = $projects ?? $this->listProjects();
        if (empty($projects)) {
            return null;
        }

        if ($train->mc_project_id) {
            foreach ($projects as $project) {
                if ((int) ($project['id'] ?? 0) === (int) $train->mc_project_id) {
                    return $project;
                }
            }
        }

        $trainSlug = $this->normalizeSlug($train->name);
        $pathSlug = $this->normalizeSlug(basename($train->path));

        $knownMappings = [
            'grandcentral' => 18, // Grand Central Terminal
            'dquizz2' => 11, // D'Quizz relaunch
            'scratchdquizz' => 11,
            'scalar' => 32, // SCALAR tracker
            'tandem2' => 39, // Tandem API
            'glenriderepo' => 17, // Glenride think tank
            'glenrideagenda' => 16, // Glenride app store
            'glenrideagenda1' => 16,
            'glenridebloom' => 16,
            'glenridenews' => 16,
            'thinktankos' => 2, // AI chief-of-staff OS product
            'dvaughnportfolio' => 29, // Personal brand relaunch
            'dvaughnhouseportfolio2' => 12, // dvaughnhouse.org rebrand
            'scraper' => 38, // Startup job scraper
            'webscrapernode' => 38,
            'telegrambot3' => 9, // Content Engine bot
            'gameglenride' => 37, // STARBORN Unreal game system
            'forevergame2' => 37,
        ];

        $mappedId = $knownMappings[$trainSlug] ?? $knownMappings[$pathSlug] ?? null;
        if ($mappedId !== null) {
            foreach ($projects as $project) {
                if ((int) ($project['id'] ?? 0) === $mappedId) {
                    return $project;
                }
            }
        }

        foreach ($projects as $project) {
            $titleSlug = $this->normalizeSlug((string) ($project['title'] ?? ''));
            $titleClean = $this->normalizeSlug(preg_replace('/\(concept\)/i', '', (string) ($project['title'] ?? '')) ?? '');

            if ($titleSlug === $trainSlug || $titleClean === $trainSlug || ($pathSlug !== '' && $titleClean === $pathSlug)) {
                return $project;
            }

            if (strlen($trainSlug) >= 5 && (str_contains($titleClean, $trainSlug) || str_contains($trainSlug, $titleClean)) && strlen($titleClean) >= 5) {
                return $project;
            }
        }

        return null;
    }

    /**
     * Link a Train to a Mission Control project (or create one) and perform a two-way sync of milestones and tasks.
     */
    public function syncTrain(Train $train, ?int $mcProjectId = null, bool $createIfMissing = false): array
    {
        $projects = $this->listProjects();
        $mcProject = null;

        if ($mcProjectId !== null) {
            foreach ($projects as $p) {
                if ((int) ($p['id'] ?? 0) === $mcProjectId) {
                    $mcProject = $p;
                    break;
                }
            }
        } else {
            $mcProject = $this->findMatchingProject($train, $projects);
        }

        if (! $mcProject && $createIfMissing && $this->isLiveConfigured()) {
            $created = $this->request('POST', '/api/projects', [
                'title' => $train->name,
                'status' => $this->mapTrainStatusToMc($train->status),
                'stage' => 'build',
                'source' => 'grandcentral',
                'stableKey' => 'grandcentral-'.strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $train->name)),
                'objective' => $train->fingerprint?->core_purpose ?? "App repository at {$train->path}",
                'summary' => $train->fingerprint?->summary ?? "Managed in Grand Central ({$train->platform})",
                'createdAt' => now()->toIso8601String(),
                'updatedAt' => now()->toIso8601String(),
            ]);

            if (is_array($created) && isset($created['id'])) {
                $mcProject = $created;
            }
        }

        if (! $mcProject) {
            return [
                'synced' => false,
                'reason' => 'No matching Mission Control project found.',
                'milestones_pulled' => 0,
                'tasks_pulled' => 0,
                'milestones_pushed' => 0,
                'tasks_pushed' => 0,
            ];
        }

        $projectId = (int) $mcProject['id'];
        $train->forceFill([
            'mc_project_id' => $projectId,
            'mc_project_title' => (string) ($mcProject['title'] ?? $train->name),
            'mc_synced_at' => now(),
        ])->save();

        $milestonesPulled = 0;
        $tasksPulled = 0;
        $milestonesPushed = 0;
        $tasksPushed = 0;

        // 1. Pull Milestones from Mission Control for this project
        $mcMilestones = $this->listMilestones($projectId);
        foreach ($mcMilestones as $mcM) {
            $mcMId = (int) ($mcM['id'] ?? 0);
            $title = trim((string) ($mcM['title'] ?? ''));
            if ($title === '') {
                continue;
            }

            $existing = $train->milestones()
                ->where(function ($q) use ($mcMId, $title) {
                    if ($mcMId > 0) {
                        $q->where('mc_milestone_id', $mcMId)->orWhere('title', $title);
                    } else {
                        $q->where('title', $title);
                    }
                })
                ->first();

            $dueDate = ! empty($mcM['targetDate']) ? Carbon::parse($mcM['targetDate']) : null;
            $status = $this->mapMcMilestoneStatusToLocal((string) ($mcM['status'] ?? 'planned'));

            if ($existing) {
                $existing->update([
                    'mc_milestone_id' => $mcMId ?: $existing->mc_milestone_id,
                    'description' => $existing->description ?: ($mcM['evidence'] ?? null),
                    'due_date' => $existing->due_date ?: $dueDate,
                    'status' => $status,
                ]);
            } else {
                $train->milestones()->create([
                    'mc_milestone_id' => $mcMId ?: null,
                    'title' => $title,
                    'description' => ! empty($mcM['evidence']) ? (string) $mcM['evidence'] : 'Synced from Mission Control',
                    'due_date' => $dueDate,
                    'status' => $status,
                ]);
                $milestonesPulled++;
            }
        }

        // 2. Pull Tasks from Mission Control for this project
        $mcTasks = $this->listTasks($projectId);
        foreach ($mcTasks as $mcT) {
            $mcTId = (int) ($mcT['id'] ?? 0);
            $title = trim((string) ($mcT['title'] ?? ''));
            if ($title === '') {
                continue;
            }

            $existing = $train->tasks()
                ->where(function ($q) use ($mcTId, $title) {
                    if ($mcTId > 0) {
                        $q->where('mc_task_id', $mcTId)->orWhere('title', $title);
                    } else {
                        $q->where('title', $title);
                    }
                })
                ->first();

            $status = $this->mapMcTaskStatusToLocal((string) ($mcT['status'] ?? 'open'));
            $priority = $this->mapMcPriorityToLocal((string) ($mcT['priority'] ?? 'normal'));
            $steps = ! empty($mcT['completionSteps']) ? (string) $mcT['completionSteps'] : null;

            if ($existing) {
                $existing->update([
                    'mc_task_id' => $mcTId ?: $existing->mc_task_id,
                    'description' => $existing->description ?: ($mcT['details'] ?? null),
                    'status' => $status,
                    'priority' => $priority,
                    'completion_steps' => $steps ?: $existing->completion_steps,
                ]);
            } else {
                $train->tasks()->create([
                    'mc_task_id' => $mcTId ?: null,
                    'title' => $title,
                    'description' => ! empty($mcT['details']) ? (string) $mcT['details'] : null,
                    'status' => $status,
                    'priority' => $priority,
                    'completion_steps' => $steps,
                    'assigned_crew' => ! empty($mcT['aiGenerated']) ? 'Janine' : 'Mission Control',
                ]);
                $tasksPulled++;
            }
        }

        // 3. Push local unsynced Milestones & Tasks to Mission Control if live API is configured
        if ($this->isLiveConfigured()) {
            foreach ($train->milestones()->whereNull('mc_milestone_id')->get() as $localM) {
                if ($this->pushMilestone($localM)) {
                    $milestonesPushed++;
                }
            }

            foreach ($train->tasks()->whereNull('mc_task_id')->get() as $localT) {
                if ($this->pushTask($localT)) {
                    $tasksPushed++;
                }
            }

            // Update project progress in Mission Control
            $totalTasks = $train->tasks()->count();
            $completedTasks = $train->tasks()->where('status', 'completed')->count();
            $progressPct = $totalTasks > 0 ? (int) round(($completedTasks / $totalTasks) * 100) : ($mcProject['goalProgressPct'] ?? 0);

            $this->request('PATCH', "/api/projects/{$projectId}", [
                'goalProgressPct' => $progressPct,
                'updatedAt' => now()->toIso8601String(),
            ]);
        }

        return [
            'synced' => true,
            'mc_project_id' => $projectId,
            'mc_project_title' => $train->mc_project_title,
            'milestones_pulled' => $milestonesPulled,
            'tasks_pulled' => $tasksPulled,
            'milestones_pushed' => $milestonesPushed,
            'tasks_pushed' => $tasksPushed,
        ];
    }

    /**
     * Sync all Trains in the Yard that match Mission Control projects.
     */
    public function syncAllTrains(): array
    {
        $projects = $this->listProjects();
        $trains = Train::all();

        $matched = 0;
        $milestonesPulled = 0;
        $tasksPulled = 0;

        foreach ($trains as $train) {
            $project = $this->findMatchingProject($train, $projects);
            if ($project) {
                $res = $this->syncTrain($train, (int) $project['id']);
                if ($res['synced']) {
                    $matched++;
                    $milestonesPulled += $res['milestones_pulled'];
                    $tasksPulled += $res['tasks_pulled'];
                }
            }
        }

        return [
            'matched_trains' => $matched,
            'milestones_pulled' => $milestonesPulled,
            'tasks_pulled' => $tasksPulled,
        ];
    }

    public function pushMilestone(Milestone $milestone): ?int
    {
        if (! $this->isLiveConfigured()) {
            return null;
        }

        $train = $milestone->train;
        if (! $train || ! $train->mc_project_id) {
            return null;
        }

        $payload = [
            'projectId' => (int) $train->mc_project_id,
            'title' => $milestone->title,
            'evidence' => $milestone->description ?? '',
            'targetDate' => $milestone->due_date?->format('Y-m-d'),
            'status' => $this->mapLocalMilestoneStatusToMc($milestone->status),
        ];

        if ($milestone->mc_milestone_id) {
            $resp = $this->request('PATCH', "/api/milestones/{$milestone->mc_milestone_id}", $payload);

            return is_array($resp) ? (int) ($resp['id'] ?? $milestone->mc_milestone_id) : null;
        }

        $resp = $this->request('POST', '/api/milestones', $payload);
        if (is_array($resp) && isset($resp['id'])) {
            $milestone->forceFill(['mc_milestone_id' => (int) $resp['id']])->save();

            return (int) $resp['id'];
        }

        return null;
    }

    public function pushTask(Task $task): ?int
    {
        if (! $this->isLiveConfigured()) {
            return null;
        }

        $train = $task->train;
        if (! $train || ! $train->mc_project_id) {
            return null;
        }

        $payload = [
            'projectId' => (int) $train->mc_project_id,
            'title' => $task->title,
            'details' => $task->description ?? '',
            'priority' => $this->mapLocalPriorityToMc($task->priority),
            'status' => $this->mapLocalTaskStatusToMc($task->status),
            'updatedAt' => now()->toIso8601String(),
        ];

        if ($task->completion_steps) {
            $payload['completionSteps'] = $task->completion_steps;
        }

        if ($task->mc_task_id) {
            $resp = $this->request('PATCH', "/api/tasks/{$task->mc_task_id}", $payload);

            return is_array($resp) ? (int) ($resp['id'] ?? $task->mc_task_id) : null;
        }

        $payload['createdAt'] = now()->toIso8601String();
        $resp = $this->request('POST', '/api/tasks', $payload);
        if (is_array($resp) && isset($resp['id'])) {
            $task->forceFill(['mc_task_id' => (int) $resp['id']])->save();

            return (int) $resp['id'];
        }

        return null;
    }

    public function logActivity(string $action, string $entityType, string $entityId, string $detail): bool
    {
        if (! $this->isLiveConfigured()) {
            return false;
        }

        $resp = $this->request('POST', '/api/activity', [
            'action' => $action,
            'entityType' => $entityType,
            'entityId' => $entityId,
            'detail' => $detail,
            'createdAt' => now()->toIso8601String(),
        ]);

        return is_array($resp) && isset($resp['id']);
    }

    /**
     * Request Janine (Mission Control's AI operator) to generate step-by-step instructions for a Task.
     */
    public function generateTaskInstructionsWithJanine(Task $task): ?string
    {
        if ($this->isLiveConfigured()) {
            if (! $task->mc_task_id && $task->train?->mc_project_id) {
                $this->pushTask($task);
            }

            if ($task->mc_task_id) {
                $resp = $this->request('POST', '/api/ai/task-instructions', [
                    'taskId' => (int) $task->mc_task_id,
                ]);

                if (is_array($resp) && ! empty($resp['guide'])) {
                    $guide = trim((string) $resp['guide']);
                    $task->forceFill([
                        'completion_steps' => $guide,
                        'bot_dispatch_status' => 'completed',
                        'bot_dispatch_reply' => $guide,
                        'bot_dispatched_at' => now(),
                    ])->save();

                    return $guide;
                }
            }
        }

        return null;
    }

    private function client(): PendingRequest
    {
        $req = Http::withHeaders([
            'User-Agent' => self::USER_AGENT,
            'Accept' => 'application/json',
        ])->timeout(15);

        if ($this->isLiveConfigured()) {
            $req = $req->withToken((string) $this->token);
        }

        return $req;
    }

    private function request(string $method, string $path, ?array $payload = null): ?array
    {
        try {
            $url = $this->baseUrl.$path;
            $response = match (strtoupper($method)) {
                'GET' => $this->client()->get($url),
                'POST' => $this->client()->post($url, $payload ?? []),
                'PATCH' => $this->client()->patch($url, $payload ?? []),
                'DELETE' => $this->client()->delete($url),
                default => $this->client()->get($url),
            };

            if ($response->successful()) {
                $json = $response->json();

                return is_array($json) ? $json : [];
            }

            Log::warning("Mission Control API {$method} {$path} returned {$response->status()}");
        } catch (\Throwable $e) {
            Log::warning("Mission Control API {$method} {$path} failed", ['error' => $e->getMessage()]);
        }

        return null;
    }

    /**
     * Read local Mission Control seed.sql snapshot as a zero-config mirror fallback.
     */
    private function readSeedTable(string $table): array
    {
        $path = (string) config('grandcentral.mission_control.seed_sql_path');
        if ($path === '' || ! is_file($path) || ! is_readable($path)) {
            return [];
        }

        $prefix = "INSERT INTO {$table} (id, data) VALUES (";
        $rows = [];

        $handle = @fopen($path, 'r');
        if (! $handle) {
            return [];
        }

        while (($line = fgets($handle)) !== false) {
            $line = trim($line);
            if (! str_starts_with($line, $prefix)) {
                continue;
            }
            $quoteStart = strpos($line, ", '");
            if ($quoteStart === false) {
                continue;
            }
            $rawJson = substr($line, $quoteStart + 3);
            if (str_ends_with($rawJson, "');")) {
                $rawJson = substr($rawJson, 0, -3);
            }
            $rawJson = str_replace("''", "'", $rawJson);
            $decoded = json_decode($rawJson, true);
            if (is_array($decoded)) {
                $rows[] = $decoded;
            }
        }

        fclose($handle);

        return $rows;
    }

    private function normalizeSlug(string $value): string
    {
        return strtolower((string) preg_replace('/[^a-zA-Z0-9]+/', '', $value));
    }

    private function mapTrainStatusToMc(string $status): string
    {
        return match ($status) {
            'on_time' => 'active',
            'delayed' => 'blocked',
            default => 'waiting',
        };
    }

    private function mapMcMilestoneStatusToLocal(string $mcStatus): string
    {
        return match (strtolower($mcStatus)) {
            'done', 'completed', 'achieved', 'reached' => 'completed',
            'missed', 'blocked', 'overdue' => 'missed',
            default => 'pending',
        };
    }

    private function mapLocalMilestoneStatusToMc(string $status): string
    {
        return match ($status) {
            'completed' => 'done',
            'missed' => 'blocked',
            default => 'planned',
        };
    }

    private function mapMcTaskStatusToLocal(string $mcStatus): string
    {
        return match (strtolower($mcStatus)) {
            'done', 'completed' => 'completed',
            'in_progress', 'active', 'working' => 'in_progress',
            default => 'pending',
        };
    }

    private function mapLocalTaskStatusToMc(string $status): string
    {
        return match ($status) {
            'completed' => 'done',
            'in_progress' => 'in_progress',
            default => 'open',
        };
    }

    private function mapMcPriorityToLocal(string $mcPriority): string
    {
        return match (strtolower($mcPriority)) {
            'critical', 'high', 'urgent' => 'high',
            'low' => 'low',
            default => 'medium',
        };
    }

    private function mapLocalPriorityToMc(string $priority): string
    {
        return match ($priority) {
            'high' => 'high',
            'low' => 'low',
            default => 'normal',
        };
    }
}
