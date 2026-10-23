<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiSettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('settings/ai', [
            'hasApiKey' => AiSetting::hasOpenAiKey(),
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

    public function destroy()
    {
        AiSetting::where('key', 'openai_api_key')->delete();

        return back()->with('status', 'api-key-removed');
    }
}
