<?php

namespace Tests\Feature\Settings;

use App\Models\AiSetting;
use App\Models\Train;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class YardSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_yard_settings_page_is_displayed_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('yard.edit'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('settings/yard')
            ->has('yardPath')
            ->has('scanMaxDepth')
            ->has('exists')
        );
    }

    public function test_guests_cannot_view_or_update_yard_settings(): void
    {
        $this->get(route('yard.edit'))->assertRedirect(route('login'));
        $this->patch(route('yard.update'), [
            'yard_path' => sys_get_temp_dir(),
            'scan_max_depth' => 2,
        ])->assertRedirect(route('login'));
        $this->post(route('yard.rescan'))->assertRedirect(route('login'));
    }

    public function test_yard_path_and_scan_max_depth_can_be_updated(): void
    {
        $user = User::factory()->create();
        $tempDir = sys_get_temp_dir().DIRECTORY_SEPARATOR.'gc_yard_test_'.uniqid();
        mkdir($tempDir, 0777, true);

        try {
            $response = $this->actingAs($user)->patch(route('yard.update'), [
                'yard_path' => $tempDir,
                'scan_max_depth' => 3,
                'rescan_now' => false,
            ]);

            $response->assertRedirect();
            $response->assertSessionHas('status', 'yard-updated');

            $this->assertSame(rtrim($tempDir, '/'), AiSetting::getYardPath());
            $this->assertSame(3, AiSetting::getScanMaxDepth());
        } finally {
            if (is_dir($tempDir)) {
                rmdir($tempDir);
            }
        }
    }

    public function test_yard_path_update_rejects_non_existent_directory(): void
    {
        $user = User::factory()->create();
        $nonExistent = '/tmp/definitely_not_a_real_directory_'.uniqid();

        $response = $this->actingAs($user)->from(route('yard.edit'))->patch(route('yard.update'), [
            'yard_path' => $nonExistent,
            'scan_max_depth' => 2,
        ]);

        $response->assertRedirect(route('yard.edit'));
        $response->assertSessionHasErrors(['yard_path']);
    }

    public function test_yard_rescan_executes_conductor_inspection_and_stores_trains(): void
    {
        $user = User::factory()->create();
        $tempYard = sys_get_temp_dir().DIRECTORY_SEPARATOR.'gc_scan_yard_'.uniqid();
        $projectDir = $tempYard.DIRECTORY_SEPARATOR.'demo-app';
        mkdir($projectDir, 0777, true);
        mkdir($projectDir.DIRECTORY_SEPARATOR.'.git', 0777, true);
        file_put_contents($projectDir.DIRECTORY_SEPARATOR.'package.json', json_encode(['name' => 'demo-app']));

        AiSetting::setYardPath($tempYard);
        AiSetting::setScanMaxDepth(2);

        try {
            $response = $this->actingAs($user)->post(route('yard.rescan'));

            $response->assertRedirect();
            $response->assertSessionHas('status', 'yard-rescanned');

            $this->assertDatabaseHas('trains', [
                'name' => 'demo-app',
            ]);
        } finally {
            File::deleteDirectory($tempYard);
        }
    }

    public function test_dashboard_renders_with_yard_context_and_trains(): void
    {
        $user = User::factory()->create();

        Train::create([
            'name' => 'alpha-station',
            'path' => '/tmp/alpha-station',
            'platform' => 'Laravel',
            'status' => 'on_time',
        ]);
        Train::create([
            'name' => 'beta-express',
            'path' => '/tmp/beta-express',
            'platform' => 'React',
            'status' => 'delayed',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('trains', 2)
            ->has('yardPath')
            ->has('scanMaxDepth')
            ->has('yardExists')
        );
    }
}
