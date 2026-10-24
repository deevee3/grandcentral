<?php

namespace App\Services;

use App\Models\AiSetting;
use App\Models\ProjectFingerprint;
use App\Models\Task;
use App\Models\Train;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiService
{
    private const EMBEDDING_MODEL = 'text-embedding-3-small';

    private const FAST_MODEL = 'gpt-4o-mini';

    private const SMART_MODEL = 'gpt-4o';

    private const JANINE_PERSONA = "You are Janine, the AI operator inside D'Vaughn House's Mission Control and Grand Central dashboard. "
        ."D'Vaughn is an independent AI orchestrator building small and large projects (Glenride, SpinWave/STANZA, Mission Control, Grand Central). "
        .'Be direct and concrete: short sentences, no fluff, no sycophancy. '
        .'Prefer free tools and $0 options. Output practical, reversible engineering steps.';

    private ?string $apiKey;

    private ?array $lmStudioConfig;

    public function __construct()
    {
        $this->apiKey = AiSetting::getOpenAiKey();
        $this->lmStudioConfig = AiSetting::readLocalLmStudioConfig();
    }

    public function isConfigured(): bool
    {
        return $this->hasOpenAiKey() || $this->lmStudioConfig !== null || AiSetting::hasMissionControlToken();
    }

    public function hasOpenAiKey(): bool
    {
        return $this->apiKey !== null && $this->apiKey !== '';
    }

    public function activeProviderName(): string
    {
        if ($this->hasOpenAiKey()) {
            return 'OpenAI (GPT-4o)';
        }

        if ($this->lmStudioConfig !== null) {
            return 'OpenClaw / LM Studio ('.$this->lmStudioConfig['model'].')';
        }

        if (AiSetting::hasMissionControlToken()) {
            return 'Janine (Mission Control Workers AI)';
        }

        return 'Janine Local Engine';
    }

    public function analyzeProject(Train $train, bool $deepAudit = false): ?ProjectFingerprint
    {
        $context = $this->buildProjectContext($train);
        $prompt = $this->buildAnalysisPrompt($context);

        $content = $this->completeText(
            'You are a code project analyst. Analyze projects and return structured JSON data about their purpose, tech stack, and current state. Be concise and return valid JSON.',
            $prompt,
            $deepAudit ? self::SMART_MODEL : self::FAST_MODEL,
            1000,
            true
        );

        if ($content) {
            $analysis = $this->extractJsonObject($content);
            if (is_array($analysis)) {
                return $this->saveFingerprint($train, $analysis, 0);
            }
        }

        // Fallback deterministic fingerprint from cargo & README so analysis works offline too
        $fallback = $this->buildFallbackAnalysis($train, $context);

        return $this->saveFingerprint($train, $fallback, 0);
    }

    public function generateEmbedding(string $text): ?array
    {
        if (! $this->hasOpenAiKey()) {
            return null;
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(30)
                ->post('https://api.openai.com/v1/embeddings', [
                    'model' => self::EMBEDDING_MODEL,
                    'input' => $text,
                ]);

            if (! $response->successful()) {
                Log::error('OpenAI embedding error', ['status' => $response->status()]);

                return null;
            }

            $data = $response->json();

            return $data['data'][0]['embedding'] ?? null;
        } catch (\Exception $e) {
            Log::error('OpenAI embedding failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public function generateProjectSchedule(Train $train, string $markdownContent): ?array
    {
        $prompt = $this->buildSchedulePrompt($train, $markdownContent);

        $content = $this->completeText(
            self::JANINE_PERSONA.' Analyze project documentation and create a structured schedule with milestones and tasks. Return only valid JSON.',
            $prompt,
            self::SMART_MODEL,
            2000,
            true
        );

        if ($content) {
            $decoded = $this->extractJsonObject($content);
            if (is_array($decoded) && (isset($decoded['milestones']) || isset($decoded['loose_tasks']))) {
                return $decoded;
            }
        }

        return $this->buildFallbackSchedule($train, $markdownContent);
    }

    public function generateJanineTaskGuide(Task $task): ?string
    {
        $task->loadMissing('train.fingerprint');
        $train = $task->train;

        $system = self::JANINE_PERSONA.' You write concrete, actionable step-by-step guides for completing tasks. Output one step per line in this exact format: "Step title — what to do". No preamble, no numbering, no closing remarks. Just 3-5 steps, each on its own line.';
        $user = sprintf(
            "Task: %s\nDetails: %s\nProject: %s (%s)\nPlatform: %s\nWrite the step-by-step completion guide.",
            $task->title,
            $task->description ?: 'none given',
            $train?->name ?? 'Unknown',
            $train?->path ?? '',
            $train?->platform ?? 'Application'
        );

        return $this->completeText($system, $user, self::FAST_MODEL, 600, false);
    }

    public function generateOpenClawTaskExecution(Task $task): ?string
    {
        $task->loadMissing('train.fingerprint');
        $train = $task->train;
        $context = $train ? $this->buildProjectContext($train) : [];

        $system = "You are OpenClaw, D'Vaughn's autonomous engineering agent connected to Grand Central and Bot HQ. "
            ."Given a task and local repository context, produce a concise execution brief with 3-5 concrete engineering steps ('Step title — action in repo'). No fluff.";
        $user = sprintf(
            "Repository: %s (%s)\nPlatform: %s\nTask: %s\nDescription: %s\nREADME excerpt: %s\nProvide the concrete execution steps for this repository.",
            $train?->name ?? 'Unknown',
            $train?->path ?? '',
            $train?->platform ?? 'Unknown',
            $task->title,
            $task->description ?: 'none',
            mb_substr((string) ($context['readme'] ?? ''), 0, 800)
        );

        return $this->completeText($system, $user, self::FAST_MODEL, 700, false);
    }

    public function chat(string $query, array $context = []): ?string
    {
        $systemPrompt = self::JANINE_PERSONA." You are Grand Central's AI assistant, helping navigate coding projects, Mission Control milestones, and Bot HQ crews.";

        if (! empty($context)) {
            $systemPrompt .= "\n\nRelevant project context:\n".json_encode($context, JSON_PRETTY_PRINT);
        }

        return $this->completeText($systemPrompt, $query, self::SMART_MODEL, 1500, false);
    }

    private function completeText(string $system, string $user, string $openAiModel, int $maxTokens = 1200, bool $jsonObject = false): ?string
    {
        // 1. Primary: OpenAI API if key is configured
        if ($this->hasOpenAiKey()) {
            try {
                $payload = [
                    'model' => $openAiModel,
                    'messages' => [
                        ['role' => 'system', 'content' => $system],
                        ['role' => 'user', 'content' => $user],
                    ],
                    'max_tokens' => $maxTokens,
                ];
                if ($jsonObject) {
                    $payload['response_format'] = ['type' => 'json_object'];
                }

                $response = Http::withToken((string) $this->apiKey)
                    ->timeout(45)
                    ->post('https://api.openai.com/v1/chat/completions', $payload);

                if ($response->successful()) {
                    $content = $response->json('choices.0.message.content');
                    if (is_string($content) && trim($content) !== '') {
                        return trim($content);
                    }
                } else {
                    Log::warning('OpenAI API returned non-success', ['status' => $response->status()]);
                }
            } catch (\Throwable $e) {
                Log::warning('OpenAI completion failed, trying local provider', ['error' => $e->getMessage()]);
            }
        }

        // 2. Secondary: Local OpenClaw / LM Studio provider (Tailscale / LAN)
        if ($this->lmStudioConfig !== null) {
            $candidates = array_values(array_unique(array_filter([
                $this->lmStudioConfig['base_url'] ?? null,
                'http://mac-studio.tail22a20c.ts.net:1234/v1',
                'http://100.70.123.107:1234/v1',
                'http://192.168.1.187:1234/v1',
            ])));

            foreach ($candidates as $baseUrl) {
                try {
                    $req = Http::timeout(12)->withHeaders(['Content-Type' => 'application/json']);
                    if (! empty($this->lmStudioConfig['api_key'])) {
                        $req = $req->withToken((string) $this->lmStudioConfig['api_key']);
                    }

                    $resp = $req->post(rtrim($baseUrl, '/').'/chat/completions', [
                        'model' => $this->lmStudioConfig['model'],
                        'messages' => [
                            ['role' => 'system', 'content' => $system],
                            ['role' => 'user', 'content' => $user],
                        ],
                        'max_tokens' => $maxTokens,
                        'temperature' => 0.3,
                    ]);

                    if ($resp->successful()) {
                        $text = trim((string) $resp->json('choices.0.message.content', ''));
                        if ($text !== '') {
                            return $text;
                        }
                    }
                } catch (\Throwable) {
                    // Continue to next candidate
                }
            }
        }

        return null;
    }

    private function extractJsonObject(string $raw): ?array
    {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        $start = strpos($raw, '{');
        $end = strrpos($raw, '}');
        if ($start !== false && $end !== false && $end > $start) {
            $slice = substr($raw, $start, $end - $start + 1);
            $decoded = json_decode($slice, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    private function buildSchedulePrompt(Train $train, string $markdownContent): string
    {
        $today = now()->format('Y-m-d');

        return <<<PROMPT
Analyze the following project documentation and create a project management schedule.

Project: {$train->name}
Platform: {$train->platform}
Today's Date: {$today}

Documentation:
{$markdownContent}

Create a JSON schedule with the following structure:
{
  "milestones": [
    {
      "title": "Milestone name (short, action-oriented)",
      "description": "Brief description of what this milestone achieves",
      "due_date": "YYYY-MM-DD format, realistic based on scope",
      "tasks": [
        {
          "title": "Specific task to complete",
          "description": "Details about the task",
          "priority": "high|medium|low"
        }
      ]
    }
  ],
  "loose_tasks": [
    {
      "title": "Tasks not tied to a specific milestone",
      "description": "Ongoing or miscellaneous tasks",
      "priority": "high|medium|low"
    }
  ]
}

Guidelines:
- Create 3-5 milestones based on project complexity
- Each milestone should have 2-4 tasks
- Space milestones 1-3 weeks apart
- Use action-oriented titles
- Return only the JSON object.
PROMPT;
    }

    private function buildFallbackSchedule(Train $train, string $markdownContent): array
    {
        $platform = $train->platform ?: 'Application';
        $headings = [];
        if (preg_match_all('/^##+\s+(.+)$/m', $markdownContent, $matches)) {
            foreach ($matches[1] as $h) {
                $clean = trim(strip_tags($h));
                if ($clean !== '' && strlen($clean) <= 60) {
                    $headings[] = $clean;
                }
            }
        }

        $firstFocus = $headings[0] ?? "{$train->name} Core Stabilization";
        $secondFocus = $headings[1] ?? "{$platform} Integration & QA";

        return [
            'milestones' => [
                [
                    'title' => "Complete {$firstFocus}",
                    'description' => "Deliver and verify the primary workflow for {$train->name} ({$platform}).",
                    'due_date' => now()->addDays(7)->format('Y-m-d'),
                    'tasks' => [
                        [
                            'title' => "Audit {$train->name} workspace & dependencies",
                            'description' => "Verify build scripts, environment config, and active branch status in {$train->path}.",
                            'priority' => 'high',
                        ],
                        [
                            'title' => "Implement core {$firstFocus} requirements",
                            'description' => 'Complete pending items documented in project markdown files.',
                            'priority' => 'high',
                        ],
                    ],
                ],
                [
                    'title' => "Finalize {$secondFocus} & Deployment Readiness",
                    'description' => 'Run test suites, sync status with Mission Control, and prepare production release.',
                    'due_date' => now()->addDays(18)->format('Y-m-d'),
                    'tasks' => [
                        [
                            'title' => 'Add automated verification & smoke tests',
                            'description' => "Ensure key user flows in {$train->name} pass without regressions.",
                            'priority' => 'medium',
                        ],
                        [
                            'title' => 'Sync release milestone with Mission Control HQ',
                            'description' => 'Update project readiness and record deployment checkpoint.',
                            'priority' => 'medium',
                        ],
                    ],
                ],
            ],
            'loose_tasks' => [
                [
                    'title' => "Update {$train->name} README.md and TODO.md",
                    'description' => 'Keep local documentation aligned with current Mission Control objectives.',
                    'priority' => 'low',
                ],
            ],
        ];
    }

    private function buildFallbackAnalysis(Train $train, array $context): array
    {
        $stack = array_values(array_filter([
            $train->platform,
            ($context['cargo']['has_composer'] ?? false) ? 'PHP / Composer' : null,
            ($context['cargo']['has_package'] ?? false) ? 'Node / TypeScript' : null,
        ]));

        return [
            'core_purpose' => "{$train->name} is a {$train->platform} project located at {$train->path}.",
            'tech_stack' => ! empty($stack) ? $stack : ['Software'],
            'current_state' => $train->status === 'on_time' ? 'mvp' : 'draft',
            'summary' => 'Managed in Grand Central and linked with Mission Control HQ.',
        ];
    }

    private function buildProjectContext(Train $train): array
    {
        $context = [
            'name' => $train->name,
            'path' => $train->path,
            'platform' => $train->platform,
            'cargo' => $train->cargo,
            'status' => $train->status,
            'last_departure' => $train->last_departure?->toDateTimeString(),
        ];

        $readmePath = $train->path.'/README.md';
        if (file_exists($readmePath)) {
            $readme = file_get_contents($readmePath);
            $context['readme'] = mb_substr((string) $readme, 0, 3000);
        }

        $todoPath = $train->path.'/TODO.md';
        if (file_exists($todoPath)) {
            $todo = file_get_contents($todoPath);
            $context['todo'] = mb_substr((string) $todo, 0, 1500);
        }

        return $context;
    }

    private function buildAnalysisPrompt(array $context): string
    {
        $json = json_encode($context, JSON_PRETTY_PRINT);

        return <<<PROMPT
Analyze this coding project and return a JSON object with the following structure:

{
  "core_purpose": "A 2-sentence summary of what this project does",
  "tech_stack": ["list", "of", "technologies", "detected"],
  "current_state": "one of: draft, mvp, maintenance, abandoned",
  "summary": "A brief paragraph summarizing the project's current state and next logical steps"
}

Project data:
{$json}

Return only valid JSON.
PROMPT;
    }

    private function saveFingerprint(Train $train, array $analysis, int $tokensUsed): ProjectFingerprint
    {
        $summaryText = ($analysis['core_purpose'] ?? '').' '.($analysis['summary'] ?? '');
        $embedding = $this->generateEmbedding($summaryText);

        return ProjectFingerprint::updateOrCreate(
            ['train_id' => $train->id],
            [
                'core_purpose' => $analysis['core_purpose'] ?? null,
                'tech_stack' => $analysis['tech_stack'] ?? [],
                'current_state' => $this->validateState($analysis['current_state'] ?? 'draft'),
                'summary' => $analysis['summary'] ?? null,
                'embedding' => $embedding,
                'last_analyzed_at' => now(),
                'tokens_used' => $tokensUsed,
            ]
        );
    }

    private function validateState(string $state): string
    {
        $valid = ['draft', 'mvp', 'maintenance', 'abandoned'];

        return in_array($state, $valid, true) ? $state : 'draft';
    }
}
