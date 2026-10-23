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
];
