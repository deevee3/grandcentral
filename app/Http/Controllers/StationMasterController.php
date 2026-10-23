<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Task;
use App\Models\Train;
use App\Services\OpenAiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class StationMasterController extends Controller
{
    public function show(Train $train): Response
    {
        $train->load(['milestones.tasks', 'tasks' => function ($query) {
            $query->whereNull('milestone_id');
        }, 'fingerprint']);

        $markdownFiles = $this->getMarkdownFiles($train->path);

        return Inertia::render('station-master/show', [
            'train' => $train,
            'milestones' => $train->milestones,
            'looseTasks' => $train->tasks->whereNull('milestone_id')->values(),
            'markdownFiles' => $markdownFiles,
            'fingerprint' => $train->fingerprint,
        ]);
    }

    public function updateTrain(Request $request, Train $train)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $train->update($validated);

        return redirect()->back();
    }

    public function getMarkdownFile(Train $train, string $filename)
    {
        if (! str_ends_with(strtolower($filename), '.md')) {
            return response()->json(['error' => 'Only markdown files allowed'], 403);
        }

        $filePath = $train->path.'/'.$filename;

        if (! File::exists($filePath)) {
            return response()->json(['content' => '', 'exists' => false]);
        }

        return response()->json([
            'content' => File::get($filePath),
            'exists' => true,
        ]);
    }

    public function updateMarkdownFile(Request $request, Train $train, string $filename)
    {
        if (! str_ends_with(strtolower($filename), '.md')) {
            return response()->json(['error' => 'Only markdown files allowed'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $filePath = $train->path.'/'.$filename;
        File::put($filePath, $validated['content']);

        return response()->json(['success' => true]);
    }

    public function suggestSchedule(Request $request, Train $train, OpenAiService $openAi)
    {
        \Log::info('suggestSchedule called', ['train_id' => $train->id, 'configured' => $openAi->isConfigured()]);

        if (! $openAi->isConfigured()) {
            \Log::warning('OpenAI not configured');

            return response()->json(['error' => 'OpenAI API key not configured. Go to Settings > AI Settings to add your key.'], 400);
        }

        $markdownContent = $this->collectMarkdownContent($train->path);
        \Log::info('Markdown content collected', ['length' => strlen($markdownContent)]);

        try {
            $schedule = $openAi->generateProjectSchedule($train, $markdownContent);

            if (! $schedule) {
                \Log::error('AI returned null schedule');

                return response()->json(['error' => 'AI returned no results. Check logs for details.'], 500);
            }

            \Log::info('Schedule generated successfully');

            return response()->json([
                'success' => true,
                'suggestions' => $schedule,
            ]);
        } catch (\Exception $e) {
            \Log::error('Schedule generation exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return response()->json(['error' => 'AI Error: '.$e->getMessage()], 500);
        }
    }

    public function applySchedule(Request $request, Train $train)
    {
        $validated = $request->validate([
            'milestones' => 'array',
            'milestones.*.title' => 'required|string|max:255',
            'milestones.*.description' => 'nullable|string',
            'milestones.*.due_date' => 'nullable|date',
            'milestones.*.tasks' => 'array',
            'milestones.*.tasks.*.title' => 'required|string|max:255',
            'milestones.*.tasks.*.description' => 'nullable|string',
            'milestones.*.tasks.*.priority' => 'in:low,medium,high',
            'loose_tasks' => 'array',
            'loose_tasks.*.title' => 'required|string|max:255',
            'loose_tasks.*.description' => 'nullable|string',
            'loose_tasks.*.priority' => 'in:low,medium,high',
        ]);

        $this->applyScheduleToProject($train, $validated);

        return redirect()->back()->with('success', 'Schedule applied successfully!');
    }

    private function getMarkdownFiles(string $path): array
    {
        $files = [];

        if (! File::isDirectory($path)) {
            return $files;
        }

        $allFiles = File::files($path);

        foreach ($allFiles as $file) {
            if (strtolower($file->getExtension()) === 'md') {
                $files[] = [
                    'name' => $file->getFilename(),
                    'exists' => true,
                    'size' => $file->getSize(),
                ];
            }
        }

        if (empty($files)) {
            $defaultNames = ['README.md', 'TODO.md', 'PRD.md', 'NOTES.md'];
            foreach ($defaultNames as $name) {
                $files[] = [
                    'name' => $name,
                    'exists' => false,
                    'size' => 0,
                ];
            }
        }

        return $files;
    }

    private function collectMarkdownContent(string $path): string
    {
        $content = '';

        if (! File::isDirectory($path)) {
            return $content;
        }

        $allFiles = File::files($path);

        foreach ($allFiles as $file) {
            if (strtolower($file->getExtension()) === 'md') {
                $fileContent = File::get($file->getPathname());
                $content .= "\n\n--- {$file->getFilename()} ---\n\n".mb_substr($fileContent, 0, 4000);
            }
        }

        return $content;
    }

    private function applyScheduleToProject(Train $train, array $schedule): void
    {
        foreach ($schedule['milestones'] ?? [] as $milestoneData) {
            $milestone = $train->milestones()->create([
                'title' => $milestoneData['title'],
                'description' => $milestoneData['description'] ?? null,
                'due_date' => $milestoneData['due_date'] ?? null,
                'status' => 'pending',
            ]);

            foreach ($milestoneData['tasks'] ?? [] as $taskData) {
                $train->tasks()->create([
                    'milestone_id' => $milestone->id,
                    'title' => $taskData['title'],
                    'description' => $taskData['description'] ?? null,
                    'priority' => $taskData['priority'] ?? 'medium',
                    'status' => 'pending',
                ]);
            }
        }

        foreach ($schedule['loose_tasks'] ?? [] as $taskData) {
            $train->tasks()->create([
                'milestone_id' => null,
                'title' => $taskData['title'],
                'description' => $taskData['description'] ?? null,
                'priority' => $taskData['priority'] ?? 'medium',
                'status' => 'pending',
            ]);
        }
    }

    public function storeMilestone(Request $request, Train $train)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $train->milestones()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'due_date' => $validated['due_date'],
            'status' => 'pending',
        ]);

        return redirect()->back();
    }

    public function updateMilestone(Request $request, Train $train, Milestone $milestone)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:pending,completed,missed',
        ]);

        $milestone->update($validated);

        return redirect()->back();
    }

    public function storeTask(Request $request, Train $train)
    {
        $validated = $request->validate([
            'milestone_id' => 'nullable|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'assigned_crew' => 'nullable|string',
        ]);

        $train->tasks()->create([
            'milestone_id' => $validated['milestone_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'assigned_crew' => $validated['assigned_crew'],
            'status' => 'pending',
        ]);

        return redirect()->back();
    }

    public function updateTask(Request $request, Train $train, Task $task)
    {
        $validated = $request->validate([
            'milestone_id' => 'nullable|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'assigned_crew' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update($validated);

        return redirect()->back();
    }

    public function updateFingerprint(Request $request, Train $train)
    {
        $validated = $request->validate([
            'core_purpose' => 'nullable|string|max:1000',
            'tech_stack' => 'array',
            'tech_stack.*' => 'string|max:100',
            'current_state' => 'required|in:draft,mvp,maintenance,abandoned',
        ]);

        $fingerprint = $train->fingerprint;

        if ($fingerprint) {
            $fingerprint->update($validated);
        } else {
            $train->fingerprint()->create($validated);
        }

        return redirect()->back();
    }
}
