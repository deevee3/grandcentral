<?php

namespace App\Services;

use App\Models\AiSetting;
use App\Models\Task;
use App\Models\Train;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BotFleetService
{
    private const HQ_USER_AGENT = 'GlenrideBotHQ/1.0 (+https://bots.dvaughnhouse.com)';

    private const BOT_ID = 'grand-central';

    private const BOT_NAME = 'Grand Central Conductor';

    private string $hqUrl;

    private ?string $hqKey;

    private string $gatewayUrl;

    public function __construct()
    {
        $this->hqUrl = AiSetting::getBotHqUrl();
        $this->hqKey = AiSetting::getBotHqKey();
        $this->gatewayUrl = rtrim((string) config('grandcentral.bot_hq.openclaw_gateway_url', 'http://127.0.0.1:18789'), '/');
    }

    public function isHqConfigured(): bool
    {
        return $this->hqUrl !== '' && is_string($this->hqKey) && $this->hqKey !== '';
    }

    public function isOpenClawOnline(): bool
    {
        try {
            $resp = Http::timeout(3)->get($this->gatewayUrl.'/health');

            return $resp->successful() && ($resp->json('ok') === true || $resp->json('status') === 'live');
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Return the full Bot Fleet roster supporting Mission Control & Grand Central.
     */
    public function getCrewRoster(): array
    {
        $openClawLive = $this->isOpenClawOnline();
        $hqConfigured = $this->isHqConfigured();
        $lmStudioConfigured = AiSetting::readLocalLmStudioConfig() !== null;

        return [
            [
                'id' => 'openclaw',
                'name' => 'OpenClaw',
                'role' => 'Autonomous Repo & Sweep Agent (iMac Gateway)',
                'status' => $openClawLive ? 'online' : ($lmStudioConfigured ? 'standby' : 'offline'),
                'capabilities' => ['code-audit', 'task-execution', 'yard-sweep'],
            ],
            [
                'id' => 'janine',
                'name' => 'Janine',
                'role' => 'Mission Control AI Operator & Task Strategist',
                'status' => 'online',
                'capabilities' => ['task-instructions', 'schedule-dispatch', 'project-rethink'],
            ],
            [
                'id' => 'community-manager',
                'name' => 'Community Manager',
                'role' => 'Discord, Telegram & Email Intake Bot (Bot HQ)',
                'status' => $hqConfigured ? 'online' : 'standby',
                'capabilities' => ['community-triage', 'digest', 'faq'],
            ],
            [
                'id' => 'prism',
                'name' => 'Prism',
                'role' => 'Telegram Moderation & Crosspost Bot (Bot HQ)',
                'status' => $hqConfigured ? 'online' : 'standby',
                'capabilities' => ['moderation', 'crosspost', 'digest'],
            ],
            [
                'id' => 'trading-bot',
                'name' => 'Trading Bot',
                'role' => 'Market Data, Strategy & Panelbook Bot (Bot HQ)',
                'status' => $hqConfigured ? 'online' : 'standby',
                'capabilities' => ['market-analysis', 'alerts', 'backtest'],
            ],
        ];
    }

    public function status(): array
    {
        return [
            'hq_url' => $this->hqUrl,
            'hq_configured' => $this->isHqConfigured(),
            'openclaw_gateway_url' => $this->gatewayUrl,
            'openclaw_online' => $this->isOpenClawOnline(),
            'lmstudio_configured' => AiSetting::readLocalLmStudioConfig() !== null,
            'roster' => $this->getCrewRoster(),
        ];
    }

    /**
     * Send a heartbeat from Grand Central to Bot HQ.
     */
    public function heartbeat(?string $detail = null): bool
    {
        if (! $this->isHqConfigured()) {
            return false;
        }

        if ($detail === null) {
            $trainCount = Train::count();
            $activeCount = Train::where('status', 'on_time')->count();
            $openTasks = Task::where('status', '!=', 'completed')->count();
            $detail = "trains={$trainCount} on_time={$activeCount} open_tasks={$openTasks}";
        }

        return $this->hqRequest('POST', '/api/heartbeat', [
            'bot_id' => self::BOT_ID,
            'name' => self::BOT_NAME,
            'status' => 'online',
            'detail' => mb_substr($detail, 0, 500),
            'capabilities' => ['yard-sweep', 'task-dispatch'],
        ]) !== null;
    }

    /**
     * Log an event to Bot HQ.
     */
    public function logEvent(string $kind, string $title, string $detail = '', string $botId = self::BOT_ID): bool
    {
        if (! $this->isHqConfigured()) {
            return false;
        }

        return $this->hqRequest('POST', '/api/events', [
            'bot_id' => $botId,
            'kind' => $kind,
            'title' => mb_substr($title, 0, 200),
            'detail' => mb_substr($detail, 0, 500),
        ]) !== null;
    }

    /**
     * Post a message to a bot on Bot HQ.
     */
    public function sendBotMessage(string $botId, string $body): bool
    {
        if (! $this->isHqConfigured()) {
            return false;
        }

        return $this->hqRequest('POST', '/api/messages', [
            'bot_id' => $botId,
            'body' => mb_substr($body, 0, 4000),
        ]) !== null;
    }

    /**
     * Dispatch a Station Master task to its assigned bot crew (Janine, OpenClaw, or Bot HQ bot).
     */
    public function dispatchTask(Task $task, MissionControlService $mc, OpenAiService $ai): array
    {
        $task->loadMissing('train');
        $train = $task->train;
        $crewName = trim((string) ($task->assigned_crew ?: 'Janine'));
        $crewKey = $this->resolveBotId($crewName);

        $task->forceFill([
            'assigned_crew' => $crewName,
            'bot_dispatch_status' => 'dispatched',
            'bot_dispatched_at' => now(),
        ])->save();

        $this->logEvent(
            'task_dispatch',
            "Grand Central dispatched task to {$crewName}: {$task->title}",
            "train={$train?->name} priority={$task->priority} path={$train?->path}"
        );

        // 1. Janine (Mission Control Operator): Generate step-by-step completion instructions
        if ($crewKey === 'janine') {
            $guide = $mc->generateTaskInstructionsWithJanine($task);
            if (! $guide) {
                $guide = $ai->generateJanineTaskGuide($task);
            }

            if ($guide) {
                $task->forceFill([
                    'completion_steps' => $guide,
                    'bot_dispatch_status' => 'completed',
                    'bot_dispatch_reply' => $guide,
                    'bot_dispatched_at' => now(),
                ])->save();

                $mc->pushTask($task);

                return [
                    'ok' => true,
                    'bot' => 'Janine',
                    'status' => 'completed',
                    'reply' => $guide,
                ];
            }

            $fallback = $this->buildDeterministicGuide($task);
            $task->forceFill([
                'completion_steps' => $fallback,
                'bot_dispatch_status' => 'completed',
                'bot_dispatch_reply' => $fallback,
                'bot_dispatched_at' => now(),
            ])->save();

            return [
                'ok' => true,
                'bot' => 'Janine',
                'status' => 'completed',
                'reply' => $fallback,
            ];
        }

        // 2. OpenClaw: Local autonomous coding/repo agent + Bot HQ
        if ($crewKey === 'openclaw') {
            $reply = $ai->generateOpenClawTaskExecution($task);
            if (! $reply) {
                $reply = $this->buildDeterministicGuide($task);
            }

            $this->logEvent(
                'openclaw_task',
                "OpenClaw received Grand Central task: {$task->title}",
                "repo={$train?->path}",
                'openclaw'
            );

            $task->forceFill([
                'status' => $task->status === 'pending' ? 'in_progress' : $task->status,
                'completion_steps' => $task->completion_steps ?: $reply,
                'bot_dispatch_status' => 'completed',
                'bot_dispatch_reply' => $reply,
                'bot_dispatched_at' => now(),
            ])->save();

            $mc->pushTask($task);

            return [
                'ok' => true,
                'bot' => 'OpenClaw',
                'status' => 'completed',
                'reply' => $reply,
            ];
        }

        // 3. Other Bot HQ bots (community-manager, prism, trading-bot, or custom crew)
        $messageBody = sprintf(
            "[Grand Central Dispatch]\nProject: %s (%s)\nTask: %s\nPriority: %s\nDetails: %s",
            $train?->name ?? 'Unknown',
            $train?->path ?? '',
            $task->title,
            strtoupper($task->priority),
            $task->description ?: 'No additional details.'
        );

        $sentToHq = $this->sendBotMessage($crewKey, $messageBody);
        $this->logEvent('bot_dispatch', "Task assigned to {$crewName}: {$task->title}", "project={$train?->name}", $crewKey);

        $guide = $ai->generateJanineTaskGuide($task) ?: $this->buildDeterministicGuide($task);
        $replyText = ($sentToHq ? "Dispatched to {$crewName} via Bot HQ ({$this->hqUrl}).\n\n" : "Queued for {$crewName}.\n\n").$guide;

        $task->forceFill([
            'status' => $task->status === 'pending' ? 'in_progress' : $task->status,
            'completion_steps' => $task->completion_steps ?: $guide,
            'bot_dispatch_status' => 'completed',
            'bot_dispatch_reply' => $replyText,
            'bot_dispatched_at' => now(),
        ])->save();

        $mc->pushTask($task);

        return [
            'ok' => true,
            'bot' => $crewName,
            'status' => 'completed',
            'reply' => $replyText,
        ];
    }

    public function resolveBotId(string $crewName): string
    {
        $normalized = strtolower(trim($crewName));

        return match (true) {
            str_contains($normalized, 'openclaw') || str_contains($normalized, 'claw') => 'openclaw',
            str_contains($normalized, 'janine') || str_contains($normalized, 'mission control') => 'janine',
            str_contains($normalized, 'community') => 'community-manager',
            str_contains($normalized, 'prism') || str_contains($normalized, 'telegram') => 'prism',
            str_contains($normalized, 'trading') || str_contains($normalized, 'market') => 'trading-bot',
            default => 'janine',
        };
    }

    private function buildDeterministicGuide(Task $task): string
    {
        $trainName = $task->train?->name ?? 'project';
        $path = $task->train?->path ?? 'repository';
        $platform = $task->train?->platform ?? 'application';

        return implode("\n", [
            "Inspect {$trainName} workspace — Open {$path} and review current branch and modified files.",
            "Scope {$task->title} — Locate the relevant {$platform} modules and verify existing tests.",
            'Implement & verify — Apply the change, run the local test suite, and mark the task completed in Station Master.',
        ]);
    }

    private function hqRequest(string $method, string $path, ?array $payload = null): ?array
    {
        if (! $this->isHqConfigured()) {
            return null;
        }

        try {
            $req = Http::withHeaders([
                'X-Bot-Key' => (string) $this->hqKey,
                'User-Agent' => self::HQ_USER_AGENT,
                'Accept' => 'application/json',
            ])->timeout(8);

            $url = $this->hqUrl.$path;
            $resp = strtoupper($method) === 'POST'
                ? $req->post($url, $payload ?? [])
                : $req->get($url);

            if ($resp->successful()) {
                return $resp->json() ?? [];
            }

            Log::warning("Bot HQ {$method} {$path} returned {$resp->status()}");
        } catch (\Throwable $e) {
            Log::warning("Bot HQ {$method} {$path} failed", ['error' => $e->getMessage()]);
        }

        return null;
    }
}
