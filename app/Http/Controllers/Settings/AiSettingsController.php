<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use App\Services\BotFleetService;
use App\Services\MissionControlService;
use App\Services\OpenAiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiSettingsController extends Controller
{
    public function edit(
        OpenAiService $openAi,
        MissionControlService $mc,
        BotFleetService $bots
    ): Response {
        return Inertia::render('settings/ai', [
            'hasApiKey' => AiSetting::hasOpenAiKey(),
            'activeProvider' => $openAi->activeProviderName(),
            'mcStatus' => $mc->status(),
            'botStatus' => $bots->status(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'openai_api_key' => 'required|string|min:10',
        ]);

        AiSetting::setOpenAiKey($validated['openai_api_key']);

        return back()->with('status', 'api-key-updated');
    }

    public function updateMissionControl(Request $request, MissionControlService $mc)
    {
        $validated = $request->validate([
            'mc_api_url' => 'required|url',
            'mc_password_or_token' => 'nullable|string',
        ]);

        AiSetting::setMissionControlConfig($validated['mc_api_url']);

        $secret = trim((string) ($validated['mc_password_or_token'] ?? ''));
        if ($secret !== '') {
            // Try logging in with email + password first to mint a session token; fallback to storing as raw bearer token
            $minted = $mc->login($secret);
            if (! $minted) {
                AiSetting::setMissionControlConfig($validated['mc_api_url'], $secret);
            }
        }

        return back()->with('status', 'mc-updated');
    }

    public function updateBotHq(Request $request, BotFleetService $bots)
    {
        $validated = $request->validate([
            'bot_hq_url' => 'required|url',
            'bot_hq_key' => 'nullable|string',
        ]);

        AiSetting::setBotHqConfig(
            $validated['bot_hq_url'],
            ! empty($validated['bot_hq_key']) ? $validated['bot_hq_key'] : null
        );

        $bots->heartbeat();

        return back()->with('status', 'bot-hq-updated');
    }

    public function destroy()
    {
        AiSetting::where('key', 'openai_api_key')->delete();

        return back()->with('status', 'api-key-removed');
    }
}
