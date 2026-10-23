<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Train;
use Inertia\Inertia;
use Inertia\Response;

class CentralTowerController extends Controller
{
    public function index(): Response
    {
        $trains = Train::with(['milestones', 'tasks'])->get();

        $allTasks = Task::with('train:id,name,status')
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
                'train_id' => $task->train_id,
                'train_name' => $task->train?->name,
                'train_status' => $task->train?->status,
                'created_at' => $task->created_at?->toIso8601String(),
            ]);

        $taskStats = [
            'total' => $allTasks->count(),
            'pending' => $allTasks->where('status', 'pending')->count(),
            'in_progress' => $allTasks->where('status', 'in_progress')->count(),
            'completed' => $allTasks->where('status', 'completed')->count(),
            'high_priority' => $allTasks->where('priority', 'high')->where('status', '!=', 'completed')->count(),
        ];

        return Inertia::render('central-tower/index', [
            'trains' => $trains,
            'allTasks' => $allTasks,
            'taskStats' => $taskStats,
        ]);
    }
}
