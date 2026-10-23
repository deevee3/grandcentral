<?php

namespace App\Console\Commands;

use App\Services\Conductor;
use Illuminate\Console\Command;

class ConductorInspect extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'conductor:inspect
                            {--yard= : Absolute path to the Yard to scan}
                            {--max-depth= : Max directory depth to scan}
                            {--dry-run : Discover projects but do not write to the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan the Yard and upsert trains from manifest and cargo detection.';

    /**
     * Execute the console command.
     */
    public function handle(Conductor $conductor): int
    {
        $yard = $this->option('yard');
        $maxDepthOption = $this->option('max-depth');
        $dryRun = (bool) $this->option('dry-run');

        $maxDepth = is_null($maxDepthOption) || $maxDepthOption === ''
            ? null
            : (int) $maxDepthOption;

        try {
            $stats = $conductor->inspect(
                yardPath: is_string($yard) && $yard !== '' ? $yard : null,
                maxDepth: $maxDepth,
                dryRun: $dryRun,
            );
        } catch (\RuntimeException $e) {
            $this->error($e->getMessage());

            return Command::FAILURE;
        }

        $this->info('Yard: '.$stats['yard_path']);
        $this->line('Found: '.$stats['found']);

        if ($dryRun) {
            $this->warn('Dry run enabled (no database writes).');

            return Command::SUCCESS;
        }

        $this->line('Created: '.$stats['created']);
        $this->line('Updated: '.$stats['updated']);

        return Command::SUCCESS;
    }
}
