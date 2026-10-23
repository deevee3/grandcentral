<?php

namespace App\Http\Controllers;

use App\Models\Train;
use Illuminate\Http\RedirectResponse;

class TrainAboardController extends Controller
{
    public function __invoke(Train $train): RedirectResponse
    {
        $train->forceFill([
            'last_departure' => now(),
            'status' => 'on_time',
        ])->save();

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
