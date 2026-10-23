<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    protected $fillable = [
        'train_id',
        'title',
        'description',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function train()
    {
        return $this->belongsTo(Train::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
