<?php

use App\Models\Train;
use Illuminate\Support\Facades\File;

function grandcentralTempDir(string $prefix): string
{
    return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
        .DIRECTORY_SEPARATOR
        .$prefix
        .uniqid('', true);
}

test('conductor:inspect creates trains from yard projects and ignores common directories', function () {
    $yard = grandcentralTempDir('grandcentral-yard-');

    File::makeDirectory($yard, 0755, true);

    try {
        $laravelProject = $yard.'/alpha';
        File::makeDirectory($laravelProject, 0755, true);
        File::put($laravelProject.'/manifest.json', json_encode([
            'name' => 'Alpha Line',
            'platform' => 'Platform 1',
        ]));
        File::put($laravelProject.'/composer.json', json_encode([
            'name' => 'acme/alpha',
            'require' => [
                'laravel/framework' => '^12.0',
            ],
        ]));
        File::put($laravelProject.'/artisan', '');

        $reactProject = $yard.'/beta';
        File::makeDirectory($reactProject, 0755, true);
        File::put($reactProject.'/manifest.json', json_encode([
            'name' => 'Beta Line',
        ]));
        File::put($reactProject.'/package.json', json_encode([
            'name' => 'beta',
            'dependencies' => [
                'react' => '^19.0.0',
                'react-dom' => '^19.0.0',
            ],
        ]));

        $ignored = $yard.'/node_modules/ignored-project';
        File::makeDirectory($ignored, 0755, true);
        File::put($ignored.'/package.json', json_encode(['name' => 'ignored']));

        $hidden = $yard.'/.hidden-project';
        File::makeDirectory($hidden, 0755, true);
        File::put($hidden.'/composer.json', json_encode(['name' => 'hidden']));

        $this->artisan('conductor:inspect', [
            '--yard' => $yard,
            '--max-depth' => 2,
        ])->assertExitCode(0);

        expect(Train::query()->count())->toBe(2);

        $alpha = Train::query()->where('path', realpath($laravelProject))->firstOrFail();
        expect($alpha->name)->toBe('Alpha Line');
        expect($alpha->platform)->toBe('Platform 1');
        expect($alpha->status)->toBeIn(['on_time', 'delayed', 'in_yard']);
        expect($alpha->cargo)->not()->toBeNull();
        expect($alpha->cargo->toArray())->toHaveKeys(['has_composer', 'has_package', 'has_env']);

        $beta = Train::query()->where('path', realpath($reactProject))->firstOrFail();
        expect($beta->name)->toBe('Beta Line');
        expect($beta->platform)->toBe('React');
        expect($beta->status)->toBeIn(['on_time', 'delayed', 'in_yard']);
        expect($beta->cargo)->not()->toBeNull();
        expect($beta->cargo->toArray())->toHaveKeys(['has_composer', 'has_package', 'has_env']);
    } finally {
        File::deleteDirectory($yard);
    }
});

test('conductor:inspect dry run does not write to the database', function () {
    $yard = grandcentralTempDir('grandcentral-yard-');

    File::makeDirectory($yard, 0755, true);

    try {
        $project = $yard.'/alpha';
        File::makeDirectory($project, 0755, true);
        File::put($project.'/manifest.json', json_encode(['name' => 'Alpha Line']));

        $this->artisan('conductor:inspect', [
            '--yard' => $yard,
            '--max-depth' => 1,
            '--dry-run' => true,
        ])->assertExitCode(0);

        expect(Train::query()->count())->toBe(0);
    } finally {
        File::deleteDirectory($yard);
    }
});
