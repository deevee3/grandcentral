<?php

namespace App\Services;

use App\Models\AiSetting;
use App\Models\Train;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Carbon;

class Conductor
{
    private ?OpenAiService $openAi = null;

    public function __construct(private readonly Filesystem $files) {}

    public function withAi(OpenAiService $openAi): self
    {
        $this->openAi = $openAi;

        return $this;
    }

    public function inspect(?string $yardPath = null, ?int $maxDepth = null, bool $dryRun = false): array
    {
        $yardPath = $yardPath ?? AiSetting::getYardPath();
        $maxDepth = $maxDepth ?? AiSetting::getScanMaxDepth();
        $yardPath = rtrim($yardPath, '/');

        if (! $this->files->isDirectory($yardPath)) {
            throw new \RuntimeException("Yard path is not a directory: {$yardPath}");
        }

        $stats = [
            'yard_path' => $yardPath,
            'found' => 0,
            'created' => 0,
            'updated' => 0,
            'analyzed' => 0,
        ];

        $this->scanDirectory($yardPath, 0, $maxDepth, $dryRun, $stats);

        return $stats;
    }

    public function analyzeAll(bool $force = false): array
    {
        if (! $this->openAi || ! $this->openAi->isConfigured()) {
            return ['analyzed' => 0, 'error' => 'OpenAI not configured'];
        }

        $query = Train::query();

        if (! $force) {
            $query->whereDoesntHave('fingerprint')
                ->orWhereHas('fingerprint', function ($q) {
                    $q->where('last_analyzed_at', '<', now()->subDays(7));
                });
        }

        $trains = $query->get();
        $analyzed = 0;

        foreach ($trains as $train) {
            $fingerprint = $this->openAi->analyzeProject($train);
            if ($fingerprint) {
                $analyzed++;
            }
        }

        return ['analyzed' => $analyzed];
    }

    public function analyzeTrain(Train $train, bool $deepAudit = false): bool
    {
        if (! $this->openAi || ! $this->openAi->isConfigured()) {
            return false;
        }

        $fingerprint = $this->openAi->analyzeProject($train, $deepAudit);

        return $fingerprint !== null;
    }

    private function scanDirectory(string $path, int $depth, int $maxDepth, bool $dryRun, array &$stats): void
    {
        if ($depth > $maxDepth) {
            return;
        }

        foreach ($this->files->directories($path) as $dir) {
            $dirName = basename($dir);

            if ($this->shouldIgnoreDirectory($dirName)) {
                continue;
            }

            if ($this->isProjectDirectory($dir)) {
                $stats['found']++;

                if (! $dryRun) {
                    $result = $this->upsertTrainFromDirectory($dir);
                    $stats[$result]++;
                }

                continue;
            }

            if ($depth < $maxDepth) {
                $this->scanDirectory($dir, $depth + 1, $maxDepth, $dryRun, $stats);
            }
        }
    }

    private function shouldIgnoreDirectory(string $dirName): bool
    {
        if (str_starts_with($dirName, '.')) {
            return true;
        }

        $ignored = config('grandcentral.ignore_directories', []);

        return in_array($dirName, $ignored, true);
    }

    private function isProjectDirectory(string $dir): bool
    {
        return $this->files->exists($dir.'/manifest.json')
            || $this->files->exists($dir.'/composer.json')
            || $this->files->exists($dir.'/package.json');
    }

    private function upsertTrainFromDirectory(string $dir): string
    {
        $path = realpath($dir) ?: $dir;

        $manifest = $this->readJsonIfExists($path.'/manifest.json');
        $name = $this->deriveName($path, $manifest);

        $cargo = $this->detectCargo($path, $manifest);
        $platform = $this->determinePlatform($path, $cargo, $manifest);

        $observedDeparture = $this->directoryModifiedAt($path);

        $train = Train::query()->where('path', $path)->first();

        $lastDeparture = $train?->last_departure;
        if ($observedDeparture && (! $lastDeparture || $observedDeparture->greaterThan($lastDeparture))) {
            $lastDeparture = $observedDeparture;
        }

        $status = $this->determineStatus($lastDeparture);

        $attributes = [
            'name' => $name,
            'status' => $status,
            'last_departure' => $lastDeparture,
            'platform' => $platform,
            'cargo' => $cargo,
        ];

        if ($train) {
            $train->fill($attributes);
            $train->save();

            return 'updated';
        }

        Train::create([
            'path' => $path,
            ...$attributes,
        ]);

        return 'created';
    }

    private function deriveName(string $path, ?array $manifest): string
    {
        $name = basename($path);

        if (is_array($manifest)) {
            $manifestName = $manifest['name'] ?? null;

            if (is_string($manifestName) && $manifestName !== '') {
                return $manifestName;
            }
        }

        return $name;
    }

    private function readJsonIfExists(string $path): ?array
    {
        if (! $this->files->exists($path)) {
            return null;
        }

        try {
            $decoded = json_decode($this->files->get($path), true);
        } catch (\Throwable) {
            return null;
        }

        return is_array($decoded) ? $decoded : null;
    }

    private function detectCargo(string $path, ?array $manifest): array
    {
        $cargo = [
            'has_composer' => $this->files->exists($path.'/composer.json'),
            'has_package' => $this->files->exists($path.'/package.json'),
            'has_env' => $this->files->exists($path.'/.env'),
        ];

        if ($cargo['has_composer']) {
            $composer = $this->readJsonIfExists($path.'/composer.json') ?? [];

            $cargo['composer'] = [
                'name' => is_string($composer['name'] ?? null) ? $composer['name'] : null,
                'require' => is_array($composer['require'] ?? null) ? array_keys($composer['require']) : [],
            ];
        }

        if ($cargo['has_package']) {
            $package = $this->readJsonIfExists($path.'/package.json') ?? [];

            $cargo['package'] = [
                'name' => is_string($package['name'] ?? null) ? $package['name'] : null,
                'dependencies' => is_array($package['dependencies'] ?? null) ? array_keys($package['dependencies']) : [],
                'devDependencies' => is_array($package['devDependencies'] ?? null) ? array_keys($package['devDependencies']) : [],
            ];
        }

        if (is_array($manifest)) {
            $cargo['manifest'] = $manifest;
        }

        return $cargo;
    }

    private function determinePlatform(string $path, array $cargo, ?array $manifest): ?string
    {
        if (is_array($manifest)) {
            $manifestPlatform = $manifest['platform'] ?? null;

            if (is_string($manifestPlatform) && $manifestPlatform !== '') {
                return $manifestPlatform;
            }
        }

        $composerRequire = $cargo['composer']['require'] ?? [];
        $packageDeps = array_merge($cargo['package']['dependencies'] ?? [], $cargo['package']['devDependencies'] ?? []);

        if (($cargo['has_composer'] ?? false) && $this->files->exists($path.'/artisan')) {
            return 'Laravel';
        }

        if (in_array('laravel/framework', $composerRequire, true)) {
            return 'Laravel';
        }

        if (in_array('react', $packageDeps, true) || in_array('react-dom', $packageDeps, true)) {
            return 'React';
        }

        if ($cargo['has_composer'] ?? false) {
            return 'PHP';
        }

        if ($cargo['has_package'] ?? false) {
            return 'Node';
        }

        return null;
    }

    private function directoryModifiedAt(string $path): ?Carbon
    {
        $timestamp = @filemtime($path);

        if (! is_int($timestamp) || $timestamp <= 0) {
            return null;
        }

        return Carbon::createFromTimestamp($timestamp);
    }

    private function determineStatus(?Carbon $lastDeparture): string
    {
        if (! $lastDeparture) {
            return 'in_yard';
        }

        $daysSince = $lastDeparture->diffInDays(now());
        $onTimeDays = (int) config('grandcentral.status_thresholds.on_time_days', 2);
        $delayedDays = (int) config('grandcentral.status_thresholds.delayed_days', 14);

        return match (true) {
            $daysSince <= $onTimeDays => 'on_time',
            $daysSince <= $delayedDays => 'delayed',
            default => 'in_yard',
        };
    }
}
