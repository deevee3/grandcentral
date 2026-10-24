<?php

namespace App\Console\Commands;

use App\Services\BotFleetService;
use App\Services\MissionControlService;
use Illuminate\Console\Command;

class ConductorSyncMc extends Command
{
    protected $signature = 'conductor:sync-mc';

    protected $description = 'Sync all matching Grand Central trains, milestones, and tasks with Mission Control HQ and report heartbeat to Bot HQ.';

    public function handle(MissionControlService $mc, BotFleetService $bots): int
    {
        $this->info('Syncing Grand Central Yard with Mission Control HQ...');

        $stats = $mc->syncAllTrains();

        $this->line("Matched Trains: {$stats['matched_trains']}");
        $this->line("Milestones Pulled: {$stats['milestones_pulled']}");
        $this->line("Tasks Pulled: {$stats['tasks_pulled']}");

        if ($bots->isHqConfigured()) {
            $ok = $bots->heartbeat();
            $bots->logEvent(
                'yard_sync',
                "Grand Central CLI synced {$stats['matched_trains']} trains with Mission Control",
                "milestones={$stats['milestones_pulled']} tasks={$stats['tasks_pulled']}"
            );
            $this->line('Bot HQ Heartbeat: '.($ok ? 'sent' : 'failed'));
        }

        return Command::SUCCESS;
    }
}
