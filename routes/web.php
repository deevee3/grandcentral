<?php

use App\Http\Controllers\CentralTowerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StationMasterController;
use App\Http\Controllers\TrainAboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show'])->name('dashboard');

    Route::get('trains/{train}/aboard', TrainAboardController::class)
        ->name('trains.aboard');

    Route::get('station-master/{train}', [StationMasterController::class, 'show'])
        ->name('station-master.show');

    Route::put('station-master/{train}', [StationMasterController::class, 'updateTrain'])
        ->name('station-master.update');

    Route::post('station-master/{train}/milestones', [StationMasterController::class, 'storeMilestone'])
        ->name('station-master.milestones.store');

    Route::put('station-master/{train}/milestones/{milestone}', [StationMasterController::class, 'updateMilestone'])
        ->name('station-master.milestones.update');

    Route::post('station-master/{train}/tasks', [StationMasterController::class, 'storeTask'])
        ->name('station-master.tasks.store');

    Route::put('station-master/{train}/tasks/{task}', [StationMasterController::class, 'updateTask'])
        ->name('station-master.tasks.update');

    Route::get('station-master/{train}/markdown/{filename}', [StationMasterController::class, 'getMarkdownFile'])
        ->name('station-master.markdown.show');

    Route::put('station-master/{train}/markdown/{filename}', [StationMasterController::class, 'updateMarkdownFile'])
        ->name('station-master.markdown.update');

    Route::post('station-master/{train}/suggest-schedule', [StationMasterController::class, 'suggestSchedule'])
        ->name('station-master.suggest-schedule');

    Route::post('station-master/{train}/apply-schedule', [StationMasterController::class, 'applySchedule'])
        ->name('station-master.apply-schedule');

    Route::put('station-master/{train}/fingerprint', [StationMasterController::class, 'updateFingerprint'])
        ->name('station-master.fingerprint.update');

    Route::get('central-tower', [CentralTowerController::class, 'index'])
        ->name('central-tower.index');
});

require __DIR__.'/settings.php';
