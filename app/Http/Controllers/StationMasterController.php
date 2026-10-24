<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Task;
use App\Models\Train;
use App\Services\BotFleetService;
use App\Services\MissionControlService;
use App\Services\OpenAiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class StationMasterController extends Controller
{
    public function show(
        Train $train,
        MissionControlService $mc,
        BotFleetService $bots,
        OpenAiService $openAi
    ): Response {
        $train->load(['milestones.tasks', 'tasks' => function ($query) {
            $query->whereNull('milestone_id');
        }, 'fingerprint']);

        $markdownFiles = $this->getMarkdownFiles($train->path);
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

        $suggestedMcProject = $mc->findMatchingProject($train);

        return Inertia::render('station-master/show', [
            'train' => $train,
            'milestones' => $train->milestones,
            'looseTasks' => $train->tasks->whereNull('milestone_id')->values(),
            'markdownFiles' => $markdownFiles,
            'fingerprint' => $train->fingerprint,
            'mcStatus' => $mc->status(),
            'mcProjects' => $mcProjects,
            'suggestedMcProjectId' => $suggestedMcProject ? (int) $suggestedMcProject['id'] : null,
            'botRoster' => $bots->getCrewRoster(),
            'aiProvider' => $openAi->activeProviderName(),
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

    public function syncMissionControl(
        Request $request,
        Train $train,
        MissionControlService $mc,
        BotFleetService $bots
    ) {
        $validated = $request->validate([
            'mc_project_id' => 'nullable|integer',
            'create_if_missing' => 'nullable|boolean',
        ]);

        $mcProjectId = isset($validated['mc_project_id']) ? (int) $validated['mc_project_id'] : null;
        $createIfMissing = (bool) ($validated['create_if_missing'] ?? false);

        $result = $mc->syncTrain($train, $mcProjectId, $createIfMissing);

        if ($result['synced']) {
            $bots->logEvent(
                'mc_sync',
                "Synced {$train->name} with Mission Control ({$result['mc_project_title']})",
                "milestones_pulled={$result['milestones_pulled']} tasks_pulled={$result['tasks_pulled']}"
            );
        }

        return redirect()->back();
    }

    public function dispatchTaskBot(
        Request $request,
        Train $train,
        Task $task,
        MissionControlService $mc,
        BotFleetService $bots,
        OpenAiService $openAi
    ) {
        $validated = $request->validate([
            'assigned_crew' => 'nullable|string|max:100',
        ]);

        if (! empty($validated['assigned_crew'])) {
            $task->update(['assigned_crew' => $validated['assigned_crew']]);
        }

        $bots->dispatchTask($task, $mc, $openAi);

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
        $markdownContent = $this->collectMarkdownContent($train->path);

        try {
            $schedule = $openAi->generateProjectSchedule($train, $markdownContent);

            if (! $schedule) {
                return response()->json(['error' => 'AI returned no results. Check logs for details.'], 500);
            }

            return response()->json([
                'success' => true,
                'provider' => $openAi->activeProviderName(),
                'suggestions' => $schedule,
            ]);
        } catch (\Exception $e) {
            \Log::error('Schedule generation exception', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'AI Error: '.$e->getMessage()], 500);
        }
    }

    public function applySchedule(Request $request, Train $train, MissionControlService $mc)
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

        $this->applyScheduleToProject($train, $validated, $mc);

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

    private function applyScheduleToProject(Train $train, array $schedule, MissionControlService $mc): void
    {
        foreach ($schedule['milestones'] ?? [] as $milestoneData) {
            $milestone = $train->milestones()->create([
                'title' => $milestoneData['title'],
                'description' => $milestoneData['description'] ?? null,
                'due_date' => $milestoneData['due_date'] ?? null,
                'status' => 'pending',
            ]);

            $mc->pushMilestone($milestone);

            foreach ($milestoneData['tasks'] ?? [] as $taskData) {
                $task = $train->tasks()->create([
                    'milestone_id' => $milestone->id,
                    'title' => $taskData['title'],
                    'description' => $taskData['description'] ?? null,
                    'priority' => $taskData['priority'] ?? 'medium',
                    'status' => 'pending',
                ]);

                $mc->pushTask($task);
            }
        }

        foreach ($schedule['loose_tasks'] ?? [] as $taskData) {
            $task = $train->tasks()->create([
                'milestone_id' => null,
                'title' => $taskData['title'],
                'description' => $taskData['description'] ?? null,
                'priority' => $taskData['priority'] ?? 'medium',
                'status' => 'pending',
            ]);

            $mc->pushTask($task);
        }
    }

    public function storeMilestone(Request $request, Train $train, MissionControlService $mc)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $milestone = $train->milestones()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'due_date' => $validated['due_date'],
            'status' => 'pending',
        ]);

        $mc->pushMilestone($milestone);

        return redirect()->back();
    }

    public function updateMilestone(Request $request, Train $train, Milestone $milestone, MissionControlService $mc)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:pending,completed,missed',
        ]);

        $milestone->update($validated);
        $mc->pushMilestone($milestone);

        return redirect()->back();
    }

    public function storeTask(
        Request $request,
        Train $train,
        MissionControlService $mc,
        BotFleetService $bots
    ) {
        $validated = $request->validate([
            'milestone_id' => 'nullable|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'assigned_crew' => 'nullable|string',
        ]);

        $task = $train->tasks()->create([
            'milestone_id' => $validated['milestone_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'assigned_crew' => $validated['assigned_crew'],
            'status' => 'pending',
        ]);

        $mc->pushTask($task);

        if (! empty($task->assigned_crew)) {
            $bots->logEvent(
                'task_assigned',
                "Task assigned to {$task->assigned_crew}: {$task->title}",
                "train={$train->name}"
            );
        }

        return redirect()->back();
    }

    public function updateTask(
        Request $request,
        Train $train,
        Task $task,
        MissionControlService $mc
    ) {
        $validated = $request->validate([
            'milestone_id' => 'nullable|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'assigned_crew' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'completion_steps' => 'nullable|string',
        ]);

        $task->update($validated);
        $mc->pushTask($task);

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
