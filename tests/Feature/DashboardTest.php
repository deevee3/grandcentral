<?php

use App\Models\Train;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    Train::create([
        'name' => 'Alpha Line',
        'path' => '/tmp/alpha',
        'status' => 'on_time',
        'platform' => 'Laravel',
        'cargo' => ['has_composer' => true, 'has_package' => false, 'has_env' => false],
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('trains', 1)
            ->where('trains.0.name', 'Alpha Line')
            ->where('trains.0.status', 'on_time')
        );
});
