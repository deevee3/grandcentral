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
