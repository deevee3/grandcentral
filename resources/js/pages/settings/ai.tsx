import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Bot, Brain, CheckCircle2, Key, RefreshCw, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AI & Integrations',
        href: '/settings/ai',
    },
];

interface McStatus {
    url: string;
    worker_reachable: boolean;
    authenticated: boolean;
    mode: 'live' | 'local_mirror' | 'disconnected';
    project_count: number;
    linked_trains_count: number;
}

interface BotStatus {
    hq_url: string;
    hq_configured: boolean;
    openclaw_gateway_url: string;
    openclaw_online: boolean;
    lmstudio_configured: boolean;
}

export default function AiSettings({
    hasApiKey,
    activeProvider = 'OpenClaw / LM Studio',
    mcStatus,
    botStatus,
}: {
    hasApiKey: boolean;
    activeProvider?: string;
    mcStatus?: McStatus;
    botStatus?: BotStatus;
}) {
    const { data, setData, patch, processing, recentlySuccessful, errors } =
        useForm({
            openai_api_key: '',
        });

    const mcForm = useForm({
        mc_api_url:
            mcStatus?.url ||
            'https://mission-control-hq-api.mwszghdkkf.workers.dev',
        mc_password_or_token: '',
    });

    const botForm = useForm({
        bot_hq_url: botStatus?.hq_url || 'https://bots.dvaughnhouse.com',
        bot_hq_key: '',
    });

    const { delete: destroy, processing: destroying } = useForm({});

    const submitOpenAi: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/ai');
    };

    const submitMc: FormEventHandler = (e) => {
        e.preventDefault();
        mcForm.patch('/settings/ai/mission-control');
    };

    const submitBotHq: FormEventHandler = (e) => {
        e.preventDefault();
        botForm.patch('/settings/ai/bot-hq');
    };

    const removeKey = () => {
        if (confirm('Are you sure you want to remove your OpenAI API key?')) {
            destroy('/settings/ai');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI & Integrations" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall
                        title="Mission Control, Bot HQ & AI Configuration"
                        description="Connect Grand Central with your Mission Control HQ Worker, Bot HQ fleet, and AI providers"
                    />

                    {/* Active AI Engine Status */}
                    <div className="rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-4 dark:border-emerald-400/30 dark:bg-emerald-500/15">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-emerald-500/20 p-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-800 dark:text-emerald-300" />
                                </div>
                                <div>
                                    <div className="font-medium text-foreground">
                                        Active AI Engine: {activeProvider}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {mcStatus?.linked_trains_count ?? 0}{' '}
                                        trains linked to Mission Control •{' '}
                                        {botStatus?.hq_configured
                                            ? 'Bot HQ Connected'
                                            : 'Bot HQ Standby'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 1. Mission Control HQ Integration */}
                    <form
                        onSubmit={submitMc}
                        className="space-y-4 rounded-lg border border-border bg-card p-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                                <RefreshCw className="h-4 w-4 text-primary" />
                                Mission Control HQ Bridge
                            </div>
                            <Badge
                                variant="outline"
                                className="font-mono text-xs uppercase"
                            >
                                {mcStatus?.mode === 'live'
                                    ? 'Live D1 Sync'
                                    : 'Local Mirror Active'}
                            </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Syncs Train statuses, Timetable waypoints
                            (Milestones), and Tasks with Mission Control (
                            <span className="font-mono">
                                {mcStatus?.project_count ?? 50} projects
                            </span>
                            ). Enter your Mission Control password or Bearer
                            token to enable live two-way Cloudflare D1 writes.
                        </p>

                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="mc_api_url">
                                    Mission Control Worker URL
                                </Label>
                                <Input
                                    id="mc_api_url"
                                    type="url"
                                    value={mcForm.data.mc_api_url}
                                    onChange={(e) =>
                                        mcForm.setData(
                                            'mc_api_url',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="mc_password_or_token">
                                    Mission Control Password or Bearer Token
                                </Label>
                                <Input
                                    id="mc_password_or_token"
                                    type="password"
                                    placeholder={
                                        mcStatus?.authenticated
                                            ? '•••••••••••••••••••• (Authenticated)'
                                            : 'Enter Mission Control password to sign in...'
                                    }
                                    value={mcForm.data.mc_password_or_token}
                                    onChange={(e) =>
                                        mcForm.setData(
                                            'mc_password_or_token',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={mcForm.processing}
                            >
                                Save Mission Control Connection
                            </Button>
                            <Transition
                                show={mcForm.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                    Mission Control Updated
                                </span>
                            </Transition>
                        </div>
                    </form>

                    {/* 2. Bot HQ & OpenClaw Fleet */}
                    <form
                        onSubmit={submitBotHq}
                        className="space-y-4 rounded-lg border border-border bg-card p-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                                <Bot className="h-4 w-4 text-primary" />
                                Bot HQ & OpenClaw Fleet
                            </div>
                            <Badge
                                variant="outline"
                                className={
                                    botStatus?.hq_configured
                                        ? 'border-emerald-600/30 bg-emerald-500/10 font-mono text-xs text-emerald-800 uppercase dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                                        : 'font-mono text-xs uppercase'
                                }
                            >
                                {botStatus?.hq_configured
                                    ? 'Connected'
                                    : 'Standby'}
                            </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Connects Grand Central Conductor (
                            <span className="font-mono">grand-central</span>) to
                            Bot HQ and your local OpenClaw Gateway (
                            <span className="font-mono">
                                {botStatus?.openclaw_online
                                    ? 'Online on :18789'
                                    : 'Standby'}
                            </span>
                            ) so Janine, OpenClaw, Community Manager, Prism, and
                            Trading Bot can assist on Station Master tasks.
                        </p>

                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="bot_hq_url">Bot HQ URL</Label>
                                <Input
                                    id="bot_hq_url"
                                    type="url"
                                    value={botForm.data.bot_hq_url}
                                    onChange={(e) =>
                                        botForm.setData(
                                            'bot_hq_url',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="bot_hq_key">
                                    Bot HQ Key (X-Bot-Key)
                                </Label>
                                <Input
                                    id="bot_hq_key"
                                    type="password"
                                    placeholder={
                                        botStatus?.hq_configured
                                            ? '•••••••••••••••••••• (Auto-detected from OpenClaw bridge)'
                                            : 'Enter X-Bot-Key...'
                                    }
                                    value={botForm.data.bot_hq_key}
                                    onChange={(e) =>
                                        botForm.setData(
                                            'bot_hq_key',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={botForm.processing}
                            >
                                Save & Ping Bot HQ
                            </Button>
                            <Transition
                                show={botForm.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                    Heartbeat Sent to Bot HQ
                                </span>
                            </Transition>
                        </div>
                    </form>

                    {/* 3. OpenAI API Key Form (Optional Override) */}
                    <form
                        onSubmit={submitOpenAi}
                        className="space-y-4 rounded-lg border border-border bg-card p-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                                <Brain className="h-4 w-4 text-primary" />
                                OpenAI API Key (Optional Override)
                            </div>
                            <Badge
                                variant="secondary"
                                className="font-mono text-xs"
                            >
                                {hasApiKey ? 'Configured' : 'Using Local/MC AI'}
                            </Badge>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="openai_api_key"
                                className="flex items-center gap-2"
                            >
                                <Key className="h-4 w-4 text-primary" />
                                OpenAI API Key
                            </Label>
                            <Input
                                id="openai_api_key"
                                type="password"
                                placeholder={
                                    hasApiKey
                                        ? '••••••••••••••••••••'
                                        : 'sk-...'
                                }
                                value={data.openai_api_key}
                                onChange={(e) =>
                                    setData('openai_api_key', e.target.value)
                                }
                                autoComplete="off"
                            />
                            {errors.openai_api_key && (
                                <p className="text-sm text-destructive">
                                    {errors.openai_api_key}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Optional: when omitted, Grand Central uses your
                                local OpenClaw / LM Studio model or Mission
                                Control&apos;s Janine AI automatically.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={processing || !data.openai_api_key}
                            >
                                {hasApiKey ? 'Update API Key' : 'Save API Key'}
                            </Button>

                            {hasApiKey && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={removeKey}
                                    disabled={destroying}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Key
                                </Button>
                            )}

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
