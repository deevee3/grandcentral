<?php

namespace App\Services;

use App\Models\AiSetting;
use App\Models\ProjectFingerprint;
use App\Models\Train;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiService
{
    private const EMBEDDING_MODEL = 'text-embedding-3-small';

    private const FAST_MODEL = 'gpt-4o-mini';

    private const SMART_MODEL = 'gpt-4o';

    private ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = AiSetting::getOpenAiKey();
    }

    public function isConfigured(): bool
    {
        return $this->apiKey !== null && $this->apiKey !== '';
    }

    public function analyzeProject(Train $train, bool $deepAudit = false): ?ProjectFingerprint
    {
        if (! $this->isConfigured()) {
            Log::warning('OpenAI API key not configured');

            return null;
        }

        $context = $this->buildProjectContext($train);
        $model = $deepAudit ? self::SMART_MODEL : self::FAST_MODEL;

        $prompt = $this->buildAnalysisPrompt($context);

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(60)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a code project analyst. Analyze projects and return structured JSON data about their purpose, tech stack, and current state. Be concise but accurate.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'max_tokens' => 1000,
                ]);

            if (! $response->successful()) {
                Log::error('OpenAI API error', ['status' => $response->status(), 'body' => $response->body()]);

                return null;
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? null;
            $tokensUsed = $data['usage']['total_tokens'] ?? 0;

            if (! $content) {
                return null;
            }

            $analysis = json_decode($content, true);

            return $this->saveFingerprint($train, $analysis, $tokensUsed);
        } catch (\Exception $e) {
            Log::error('OpenAI analysis failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public function generateEmbedding(string $text): ?array
    {
        if (! $this->isConfigured()) {
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
        if (! $this->isConfigured()) {
            return null;
        }

        $prompt = $this->buildSchedulePrompt($train, $markdownContent);

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(90)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => self::SMART_MODEL,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a project management expert. Analyze project documentation and create a structured schedule with milestones and tasks. Be practical and realistic with timelines. Return only valid JSON.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'max_tokens' => 2000,
                ]);

            if (! $response->successful()) {
                $errorBody = $response->json();
                $errorMessage = $errorBody['error']['message'] ?? $response->body();
                Log::error('OpenAI schedule generation error', ['status' => $response->status(), 'body' => $response->body()]);
                throw new \Exception('OpenAI API: '.$errorMessage);
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? null;

            if (! $content) {
                return null;
            }

            return json_decode($content, true);
        } catch (\Exception $e) {
            Log::error('OpenAI schedule generation failed', ['error' => $e->getMessage()]);

            return null;
        }
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
- Create 3-6 milestones based on project complexity
- Each milestone should have 2-5 tasks
- Space milestones 1-4 weeks apart
- Prioritize based on dependencies and importance
- Use action-oriented titles (e.g., "Implement user authentication" not "User authentication")
- Be specific but concise

Return only the JSON object.
PROMPT;
    }

    public function chat(string $query, array $context = []): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $systemPrompt = "You are Grand Central's AI assistant, helping users understand and navigate their coding projects. You have access to project summaries and can help find relevant code, suggest next steps, and answer questions about the user's projects.";

        if (! empty($context)) {
            $systemPrompt .= "\n\nRelevant project context:\n".json_encode($context, JSON_PRETTY_PRINT);
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(60)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => self::SMART_MODEL,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $query],
                    ],
                    'max_tokens' => 2000,
                ]);

            if (! $response->successful()) {
                return null;
            }

            $data = $response->json();

            return $data['choices'][0]['message']['content'] ?? null;
        } catch (\Exception $e) {
            Log::error('OpenAI chat failed', ['error' => $e->getMessage()]);

            return null;
        }
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
            $context['readme'] = mb_substr($readme, 0, 3000);
        }

        $todoPath = $train->path.'/TODO.md';
        if (file_exists($todoPath)) {
            $todo = file_get_contents($todoPath);
            $context['todo'] = mb_substr($todo, 0, 1500);
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

Determine the current_state based on:
- draft: Early development, incomplete core features
- mvp: Has working core functionality but needs polish
- maintenance: Mature, stable, receiving updates
- abandoned: No recent activity, incomplete state

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
