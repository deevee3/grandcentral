<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'train_id',
        'milestone_id',
        'title',
        'description',
        'status',
        'priority',
        'assigned_crew',
        'mc_task_id',
        'completion_steps',
        'bot_dispatch_status',
        'bot_dispatch_reply',
        'bot_dispatched_at',
    ];

    protected $casts = [
        'bot_dispatched_at' => 'datetime',
    ];

    public function train()
    {
        return $this->belongsTo(Train::class);
    }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }
}
