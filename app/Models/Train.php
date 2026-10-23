<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Model;

class Train extends Model
{
    protected $fillable = [
        'name',
        'path',
        'status',
        'last_departure',
        'platform',
        'cargo',
    ];

    protected $casts = [
        'last_departure' => 'datetime',
        'cargo' => AsArrayObject::class,
    ];

    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'on_time' => 'On Time',
            'delayed' => 'Delayed',
            'in_yard' => 'In the Yard',
            default => 'Unknown'
        };
    }

    public function getStatusColor(): string
    {
        return match ($this->status) {
            'on_time' => 'green',
            'delayed' => 'yellow',
            'in_yard' => 'gray',
            default => 'gray'
        };
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function fingerprint()
    {
        return $this->hasOne(ProjectFingerprint::class);
    }
}
