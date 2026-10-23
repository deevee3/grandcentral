import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Brain, CheckCircle2, Key, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AI Settings',
        href: '/settings/ai',
    },
];

export default function AiSettings({ hasApiKey }: { hasApiKey: boolean }) {
    const { data, setData, patch, processing, recentlySuccessful, errors } =
        useForm({
            openai_api_key: '',
        });

    const { delete: destroy, processing: destroying } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/ai');
    };

    const removeKey = () => {
        if (confirm('Are you sure you want to remove your OpenAI API key?')) {
            destroy('/settings/ai');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="AI Configuration"
                        description="Configure your OpenAI API key to enable AI-powered project analysis"
                    />

                    {/* Status Card */}
                    <div
                        className={`rounded-lg border p-4 ${
                            hasApiKey
                                ? 'border-emerald-600/30 bg-emerald-500/10 dark:border-emerald-400/30 dark:bg-emerald-500/15'
                                : 'border-amber-600/35 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-500/15'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-full p-2 ${
                                    hasApiKey
                                        ? 'bg-emerald-500/20'
                                        : 'bg-amber-500/20'
                                }`}
                            >
                                {hasApiKey ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-800 dark:text-emerald-300" />
                                ) : (
                                    <Brain className="h-5 w-5 text-amber-900 dark:text-amber-300" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-foreground">
                                    {hasApiKey
                                        ? 'API Key Configured'
                                        : 'API Key Required'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {hasApiKey
                                        ? 'Your OpenAI API key is securely stored and ready for use.'
                                        : 'Add your OpenAI API key to enable AI-powered features.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Key Form */}
                    <form onSubmit={submit} className="space-y-6">
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
                                Your API key is encrypted and stored securely.
                                Get your key from{' '}
                                <a
                                    href="https://platform.openai.com/api-keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary hover:underline"
                                >
                                    platform.openai.com
                                </a>
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={processing || !data.openai_api_key}
                            >
                                {hasApiKey ? 'Update API Key' : 'Save API Key'}
                            </Button>

                            {hasApiKey && (
                                <Button
                                    type="button"
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

                    {/* Features Section */}
                    <div className="border-t border-border pt-6">
                        <h3 className="mb-4 font-serif text-base font-semibold text-foreground">
                            AI Features
                        </h3>
                        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                            <li className="flex items-start gap-3 p-4">
                                <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        Project Analysis
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        Automatically analyze projects to
                                        generate summaries, detect tech stacks,
                                        and determine project state.
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-4">
                                <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        Semantic Search
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        Query across all your projects with
                                        natural language to find relevant code
                                        and context.
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-4">
                                <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        Smart Suggestions
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        Get AI-powered next step suggestions
                                        based on your project&apos;s TODO.md and
                                        recent activity.
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
