<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFingerprint extends Model
{
    protected $fillable = [
        'train_id',
        'core_purpose',
        'tech_stack',
        'current_state',
        'summary',
        'embedding',
        'last_analyzed_at',
        'tokens_used',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'embedding' => 'array',
        'last_analyzed_at' => 'datetime',
    ];

    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    public function getStateLabel(): string
    {
        return match ($this->current_state) {
            'draft' => 'Draft',
            'mvp' => 'MVP',
            'maintenance' => 'Maintenance',
            'abandoned' => 'Abandoned',
            default => 'Unknown'
        };
    }
}
