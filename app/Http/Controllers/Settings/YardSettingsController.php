<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use App\Models\Train;
use App\Services\Conductor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YardSettingsController extends Controller
{
    public function edit(): Response
    {
        $yardPath = AiSetting::getYardPath();
        $scanMaxDepth = AiSetting::getScanMaxDepth();
        $exists = is_dir($yardPath);

        $detectedDirectories = [];
        if ($exists && is_readable($yardPath)) {
            $detectedDirectories = collect(scandir($yardPath) ?: [])
                ->filter(fn ($item) => ! in_array($item, ['.', '..', '.git', 'node_modules', 'vendor'], true))
                ->filter(fn ($item) => is_dir($yardPath.DIRECTORY_SEPARATOR.$item))
                ->values()
                ->take(12)
                ->all();
        }

        return Inertia::render('settings/yard', [
            'yardPath' => $yardPath,
            'scanMaxDepth' => $scanMaxDepth,
            'exists' => $exists,
            'projectCount' => Train::count(),
            'detectedDirectories' => $detectedDirectories,
            'status' => session('status'),
            'stats' => session('stats'),
        ]);
    }

    public function update(Request $request, Conductor $conductor): RedirectResponse
    {
        $validated = $request->validate([
            'yard_path' => ['required', 'string', 'max:1024'],
            'scan_max_depth' => ['required', 'integer', 'min:1', 'max:5'],
            'rescan_now' => ['nullable', 'boolean'],
        ]);

        $path = rtrim(trim($validated['yard_path']), '/');
        $depth = (int) $validated['scan_max_depth'];

        if (! is_dir($path)) {
            return back()->withErrors([
                'yard_path' => "The directory '{$path}' does not exist or is not readable.",
            ]);
        }

        AiSetting::setYardPath($path);
        AiSetting::setScanMaxDepth($depth);

        $stats = null;
        if (! empty($validated['rescan_now'])) {
            try {
                $stats = $conductor->inspect($path, $depth);
            } catch (\Throwable $e) {
                return back()->withErrors([
                    'yard_path' => 'Yard updated, but rescan failed: '.$e->getMessage(),
                ]);
            }
        }

        return back()->with([
            'status' => 'yard-updated',
            'stats' => $stats,
        ]);
    }

    public function rescan(Request $request, Conductor $conductor): RedirectResponse
    {
        $yardPath = AiSetting::getYardPath();
        $scanMaxDepth = AiSetting::getScanMaxDepth();

        if (! is_dir($yardPath)) {
            return back()->withErrors([
                'yard_path' => "Current yard directory '{$yardPath}' does not exist.",
            ]);
        }

        try {
            $stats = $conductor->inspect($yardPath, $scanMaxDepth);

            return back()->with([
                'status' => 'yard-rescanned',
                'stats' => $stats,
            ]);
        } catch (\Throwable $e) {
            return back()->withErrors([
                'yard_path' => 'Rescan failed: '.$e->getMessage(),
            ]);
        }
    }
}
