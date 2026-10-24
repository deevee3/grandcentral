<?php

return [
    'yard_path' => env('GRANDCENTRAL_YARD_PATH', (($_SERVER['HOME'] ?? getenv('HOME'))
        ? rtrim(($_SERVER['HOME'] ?? getenv('HOME')), '/').'/Code'
        : base_path())),

    'max_depth' => (int) env('GRANDCENTRAL_SCAN_MAX_DEPTH', 2),

    'status_thresholds' => [
        'on_time_days' => (int) env('GRANDCENTRAL_ON_TIME_DAYS', 2),
        'delayed_days' => (int) env('GRANDCENTRAL_DELAYED_DAYS', 14),
    ],

    'ignore_directories' => [
        '.git',
        'node_modules',
        'vendor',
    ],

    'mission_control' => [
        'url' => env('MC_API_URL', 'https://mission-control-hq-api.mwszghdkkf.workers.dev'),
        'token' => env('MC_API_TOKEN', env('MC_PASSWORD')),
        'seed_sql_path' => env('MC_SEED_SQL_PATH', '/home/housedv/projects/mission-control/scripts/seed.sql'),
    ],

    'bot_hq' => [
        'url' => env('BOT_HQ_URL', 'https://bots.dvaughnhouse.com'),
        'key' => env('BOT_HQ_KEY'),
        'openclaw_gateway_url' => env('OPENCLAW_GATEWAY_URL', 'http://127.0.0.1:18789'),
        'openclaw_bin' => env('OPENCLAW_BIN', '/home/housedv/.local/share/mise/shims/openclaw'),
    ],
];
