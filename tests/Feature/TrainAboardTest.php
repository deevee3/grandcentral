<?php

use App\Models\Train;
use App\Models\User;
use Illuminate\Support\Carbon;

test('guests cannot log a departure', function () {
    $train = Train::create([
        'name' => 'Alpha Line',
        'path' => '/tmp/alpha',
        'status' => 'in_yard',
        'platform' => 'Laravel',
        'cargo' => ['has_composer' => true, 'has_package' => false, 'has_env' => false],
    ]);

    $this->get(route('trains.aboard', $train))->assertRedirect(route('login'));
});

test('logging a departure updates last_departure and redirects to Windsurf', function () {
    $this->actingAs(User::factory()->create());

    $train = Train::create([
        'name' => 'Alpha Line',
        'path' => '/Users/example/My Project',
        'status' => 'in_yard',
        'platform' => 'Laravel',
        'cargo' => ['has_composer' => true, 'has_package' => false, 'has_env' => false],
    ]);

    $now = Carbon::create(2025, 1, 1, 12, 0, 0);
    $this->travelTo($now);

    $this->get(route('trains.aboard', $train))
        ->assertRedirect('windsurf://file/Users/example/My%20Project');

    $train->refresh();

    expect($train->status)->toBe('on_time');
    expect($train->last_departure)->not()->toBeNull();
    expect($train->last_departure?->timestamp)->toBe($now->timestamp);
});
