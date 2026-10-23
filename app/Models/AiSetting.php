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
}
