<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class AiSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'encrypted',
    ];

    protected $casts = [
        'encrypted' => 'boolean',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();

        if (! $setting) {
            return $default;
        }

        if ($setting->encrypted && $setting->value) {
            try {
                return Crypt::decryptString($setting->value);
            } catch (\Exception) {
                return $default;
            }
        }

        return $setting->value;
    }

    public static function set(string $key, mixed $value, bool $encrypted = false): void
    {
        $storedValue = $value;

        if ($encrypted && $value) {
            $storedValue = Crypt::encryptString($value);
        }

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $storedValue, 'encrypted' => $encrypted]
        );
    }

    public static function getOpenAiKey(): ?string
    {
        return static::get('openai_api_key');
    }

    public static function setOpenAiKey(string $key): void
    {
        static::set('openai_api_key', $key, true);
    }

    public static function hasOpenAiKey(): bool
    {
        return static::getOpenAiKey() !== null;
    }

    public static function getMissionControlUrl(): string
    {
        return rtrim((string) (static::get('mc_api_url') ?: config('grandcentral.mission_control.url', 'https://mission-control-hq-api.mwszghdkkf.workers.dev')), '/');
    }

    public static function getMissionControlToken(): ?string
    {
        return static::get('mc_api_token') ?: config('grandcentral.mission_control.token');
    }

    public static function setMissionControlConfig(string $url, ?string $token = null): void
    {
        static::set('mc_api_url', rtrim($url, '/'), false);
        if ($token !== null && $token !== '') {
            static::set('mc_api_token', $token, true);
        }
    }

    public static function hasMissionControlToken(): bool
    {
        $token = static::getMissionControlToken();

        return is_string($token) && $token !== '';
    }

    public static function getBotHqUrl(): string
    {
        $stored = static::get('bot_hq_url');
        if (is_string($stored) && $stored !== '') {
            return rtrim($stored, '/');
        }

        $localEnv = static::readLocalBridgeEnv();
        if (! empty($localEnv['BOT_HQ_URL'])) {
            return rtrim($localEnv['BOT_HQ_URL'], '/');
        }

        return rtrim((string) config('grandcentral.bot_hq.url', 'https://bots.dvaughnhouse.com'), '/');
    }

    public static function getBotHqKey(): ?string
    {
        $stored = static::get('bot_hq_key');
        if (is_string($stored) && $stored !== '') {
            return $stored;
        }

        $envKey = config('grandcentral.bot_hq.key');
        if (is_string($envKey) && $envKey !== '') {
            return $envKey;
        }

        $localEnv = static::readLocalBridgeEnv();

        return $localEnv['BOT_HQ_KEY'] ?? null;
    }

    public static function setBotHqConfig(string $url, ?string $key = null): void
    {
        static::set('bot_hq_url', rtrim($url, '/'), false);
        if ($key !== null && $key !== '') {
            static::set('bot_hq_key', $key, true);
        }
    }

    public static function hasBotHqKey(): bool
    {
        $key = static::getBotHqKey();

        return is_string($key) && $key !== '';
    }

    /**
     * Read local OpenClaw bridge .env if present on the host (never logged or committed).
     */
    public static function readLocalBridgeEnv(): array
    {
        $home = $_SERVER['HOME'] ?? getenv('HOME') ?: '/home/housedv';
        $path = rtrim((string) $home, '/').'/openclaw-hq-bridge/.env';

        if (! is_file($path) || ! is_readable($path)) {
            return [];
        }

        $env = [];
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
                continue;
            }
            [$k, $v] = explode('=', $line, 2);
            $env[trim($k)] = trim(trim($v), "\"'");
        }

        return $env;
    }

    /**
     * Read local OpenClaw / LM Studio provider config if present on the host.
     */
    public static function readLocalLmStudioConfig(): ?array
    {
        $home = $_SERVER['HOME'] ?? getenv('HOME') ?: '/home/housedv';
        $path = rtrim((string) $home, '/').'/.openclaw/openclaw.json';

        if (! is_file($path) || ! is_readable($path)) {
            return null;
        }

        try {
            $cfg = json_decode((string) file_get_contents($path), true);
            if (! is_array($cfg)) {
                return null;
            }
            $prov = $cfg['models']['providers']['lmstudio'] ?? [];
            $primary = (string) ($cfg['agents']['defaults']['model']['primary'] ?? '');
            $model = str_contains($primary, '/') ? explode('/', $primary, 2)[1] : $primary;

            if ($model === '') {
                return null;
            }

            return [
                'base_url' => rtrim((string) ($prov['baseUrl'] ?? 'http://mac-studio.tail22a20c.ts.net:1234/v1'), '/'),
                'api_key' => (string) ($prov['apiKey'] ?? 'lm-studio'),
                'model' => $model,
            ];
        } catch (\Throwable) {
            return null;
        }
    }
}
