<?php

namespace App\Console\Commands;

use App\Models\Train;
use App\Services\Conductor;
use App\Services\OpenAiService;
use Illuminate\Console\Command;

class ConductorAnalyze extends Command
{
    protected $signature = 'conductor:analyze
                            {--train= : Specific train ID to analyze}
                            {--force : Force re-analysis of all projects}
                            {--deep : Use deep audit mode (more tokens, better analysis)}';

    protected $description = 'Analyze projects with AI to generate fingerprints and embeddings.';

    public function handle(Conductor $conductor, OpenAiService $openAi): int
    {
        if (! $openAi->isConfigured()) {
            $this->error('OpenAI API key not configured. Please add your key in Settings > AI Settings.');

            return Command::FAILURE;
        }

        $conductor->withAi($openAi);

        $trainId = $this->option('train');
        $force = (bool) $this->option('force');
        $deep = (bool) $this->option('deep');

        if ($trainId) {
            $train = Train::find($trainId);

            if (! $train) {
                $this->error("Train with ID {$trainId} not found.");

                return Command::FAILURE;
            }

            $this->info("Analyzing: {$train->name}");

            $success = $conductor->analyzeTrain($train, $deep);

            if ($success) {
                $this->info('Analysis complete.');

                return Command::SUCCESS;
            }

            $this->error('Analysis failed.');

            return Command::FAILURE;
        }

        $this->info('Analyzing all projects...');

        if ($force) {
            $this->warn('Force mode: re-analyzing all projects.');
        }

        $stats = $conductor->analyzeAll($force);

        if (isset($stats['error'])) {
            $this->error($stats['error']);

            return Command::FAILURE;
        }

        $this->info("Analyzed: {$stats['analyzed']} projects");

        return Command::SUCCESS;
    }
}
