<?php

namespace App\Http\Controllers;

use App\Models\Train;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function show(): Response
    {
        $trains = Train::query()
            ->orderByRaw("coalesce(platform, '') asc")
            ->orderBy('name')
            ->get()
            ->map(fn (Train $train) => [
                'id' => $train->id,
                'name' => $train->name,
                'path' => $train->path,
                'status' => $train->status,
                'statusLabel' => $train->getStatusLabel(),
                'platform' => $train->platform,
                'lastDeparture' => $train->last_departure?->toIso8601String(),
                'mcProjectId' => $train->mc_project_id,
                'mcProjectTitle' => $train->mc_project_title,
                'aboardUrl' => route('trains.aboard', $train, false),
                'stationMasterUrl' => route('station-master.show', $train, false),
            ]);

        return Inertia::render('dashboard', [
            'trains' => $trains,
        ]);
    }
}
