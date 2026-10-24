<?php

namespace App\Http\Controllers;

use App\Models\Train;
use App\Services\BotFleetService;
use App\Services\MissionControlService;
use Illuminate\Http\RedirectResponse;

class TrainAboardController extends Controller
{
    public function __invoke(
        Train $train,
        MissionControlService $mc,
        BotFleetService $bots
    ): RedirectResponse {
        $train->forceFill([
            'last_departure' => now(),
            'status' => 'on_time',
        ])->save();

        if ($train->mc_project_id) {
            $mc->logActivity(
                'departure',
                'project',
                (string) $train->mc_project_id,
                "Boarded {$train->name} in Windsurf from Grand Central"
            );
        }

        $bots->logEvent(
            'train_departure',
            "Boarded {$train->name} in Windsurf",
            "path={$train->path} platform={$train->platform}"
        );

        return redirect()->away($this->windsurfFileUrl($train->path));
    }

    private function windsurfFileUrl(string $path): string
    {
        $trimmed = ltrim($path, '/');
        $parts = array_filter(explode('/', $trimmed), fn ($part) => $part !== '');
        $encodedPath = implode('/', array_map('rawurlencode', $parts));

        return 'windsurf://file/'.$encodedPath;
    }
}
