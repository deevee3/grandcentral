import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Clock,
    ExternalLink,
    FolderGit2,
    SlidersHorizontal,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departure Board',
        href: dashboard().url,
    },
];

type Train = {
    id: number;
    name: string;
    path: string;
    status: 'on_time' | 'delayed' | 'in_yard';
    statusLabel: string;
    platform: string | null;
    lastDeparture: string | null;
    aboardUrl: string;
    stationMasterUrl: string;
};

function statusClasses(status: Train['status']): string {
    return (
        {
            on_time:
                'border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300',
            delayed:
                'border-amber-600/35 bg-amber-500/12 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300',
            in_yard: 'border-border bg-secondary text-secondary-foreground',
        }[status] ?? 'border-border bg-secondary text-secondary-foreground'
    );
}

function formatDeparture(lastDeparture: string | null): string {
    if (!lastDeparture) {
        return '—';
    }

    return lastDeparture.replace('T', ' ').replace(/\..+$/, '');
}

export default function Dashboard({ trains }: { trains: Train[] }) {
    const grouped = trains.reduce(
        (acc, train) => {
            const platform = train.platform ?? 'Unknown';
            acc[platform] ??= [];
            acc[platform].push(train);
            return acc;
        },
        {} as Record<string, Train[]>,
    );

    const platforms = Object.keys(grouped).sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return a.localeCompare(b);
    });

    const onTimeCount = trains.filter((t) => t.status === 'on_time').length;
    const delayedCount = trains.filter((t) => t.status === 'delayed').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departure Board" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6">
                {/* Concourse Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Departure Board
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Live dispatch status and platform assignments across
                            your local yard.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
                        <Badge
                            variant="secondary"
                            className="px-2.5 py-1 font-mono text-xs"
                        >
                            {trains.length} Total Trains
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                        >
                            {onTimeCount} On Time
                        </Badge>
                        {delayedCount > 0 && (
                            <Badge
                                variant="outline"
                                className="border-amber-600/35 bg-amber-500/12 px-2.5 py-1 font-mono text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300"
                            >
                                {delayedCount} Delayed
                            </Badge>
                        )}
                    </div>
                </div>

                {trains.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                        <p className="font-mono text-sm text-muted-foreground">
                            No trains indexed in the yard yet. Run{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                                php artisan conductor:inspect
                            </code>{' '}
                            to scan your project tracks.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {platforms.map((platform) => (
                            <section key={platform} className="space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="font-mono text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                                        Platform — {platform}
                                    </h2>
                                    <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
                                        {grouped[platform].length}{' '}
                                        {grouped[platform].length === 1
                                            ? 'Train'
                                            : 'Trains'}
                                    </span>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                                    <ul className="divide-y divide-border">
                                        {grouped[platform].map(
                                            (train, index) => (
                                                <li
                                                    key={train.id}
                                                    className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2.5">
                                                            <span className="font-mono text-xs font-bold text-primary tabular-nums">
                                                                TRK{' '}
                                                                {String(
                                                                    index + 1,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            </span>
                                                            <span className="truncate font-mono text-sm font-semibold text-foreground">
                                                                {train.name}
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    'font-mono text-xs font-semibold uppercase ' +
                                                                    statusClasses(
                                                                        train.status,
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    train.statusLabel
                                                                }
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
                                                            <span className="inline-flex items-center gap-1.5 truncate">
                                                                <FolderGit2 className="size-3.5 shrink-0 text-primary/80" />
                                                                <span className="truncate">
                                                                    {train.path}
                                                                </span>
                                                            </span>
                                                            <span className="inline-flex items-center gap-1.5 tabular-nums">
                                                                <Clock className="size-3.5 shrink-0 text-primary/80" />
                                                                Last Departure:{' '}
                                                                {formatDeparture(
                                                                    train.lastDeparture,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={
                                                                    train.stationMasterUrl
                                                                }
                                                            >
                                                                <SlidersHorizontal className="mr-1.5 size-3.5" />
                                                                Station Master
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                        >
                                                            <a
                                                                href={
                                                                    train.aboardUrl
                                                                }
                                                            >
                                                                All Aboard
                                                                <ExternalLink className="ml-1.5 size-3.5" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
