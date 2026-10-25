import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    FolderCheck,
    FolderGit2,
    FolderOpen,
    FolderX,
    RefreshCw,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Yard Sourcing',
        href: '/settings/yard',
    },
];

interface ScanStats {
    yard_path: string;
    found: number;
    created: number;
    updated: number;
    analyzed?: number;
}

interface YardSettingsProps {
    yardPath: string;
    scanMaxDepth: number;
    exists: boolean;
    projectCount: number;
    detectedDirectories: string[];
    status?: string | null;
    stats?: ScanStats | null;
}

export default function YardSettings({
    yardPath,
    scanMaxDepth,
    exists,
    projectCount,
    detectedDirectories = [],
    status,
    stats,
}: YardSettingsProps) {
    const [isRescanning, setIsRescanning] = useState(false);

    const { data, setData, patch, processing, recentlySuccessful, errors } =
        useForm({
            yard_path: yardPath,
            scan_max_depth: scanMaxDepth,
            rescan_now: true,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/yard');
    };

    const handleRescanOnly = () => {
        setIsRescanning(true);
        router.post(
            '/settings/yard/rescan',
            {},
            {
                onFinish: () => setIsRescanning(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yard Sourcing Settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall
                        title="Yard Sourcing & Discovery"
                        description="Configure the host filesystem location and directory depth where Grand Central indexes your local applications and repositories."
                    />

                    {/* Rescan Notification Banner */}
                    {(stats || status === 'yard-rescanned') && (
                        <div className="flex items-start gap-3 rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-4 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <div className="space-y-1">
                                <p className="font-mono text-sm font-semibold">
                                    Yard Scan Completed Successfully
                                </p>
                                {stats ? (
                                    <p className="font-mono text-xs opacity-90">
                                        Found {stats.found} projects ({stats.created} created, {stats.updated} updated) at depth {scanMaxDepth}.
                                    </p>
                                ) : (
                                    <p className="font-mono text-xs opacity-90">
                                        All project tracks and manifests have been synchronized.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Current Yard Status Card */}
                    <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                                    {exists ? (
                                        <FolderCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <FolderX className="size-5 text-destructive" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-mono text-sm font-semibold text-foreground">
                                            Active Yard Directory
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className={
                                                exists
                                                    ? 'border-emerald-600/30 bg-emerald-500/10 font-mono text-xs text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                    : 'border-destructive/30 bg-destructive/10 font-mono text-xs text-destructive'
                                            }
                                        >
                                            {exists ? 'Valid Directory' : 'Directory Not Found'}
                                        </Badge>
                                    </div>
                                    <p className="truncate font-mono text-xs text-muted-foreground">
                                        {yardPath}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRescanOnly}
                                disabled={isRescanning || !exists}
                                className="font-mono text-xs"
                            >
                                <RefreshCw
                                    className={`mr-1.5 size-3.5 ${isRescanning ? 'animate-spin' : ''}`}
                                />
                                {isRescanning ? 'Scanning Yard...' : 'Rescan Yard Now'}
                            </Button>
                        </div>

                        {/* Metric Bar */}
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
                            <div className="space-y-0.5">
                                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                                    Indexed Trains
                                </span>
                                <p className="font-mono text-base font-semibold text-foreground">
                                    {projectCount}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                                    Scan Max Depth
                                </span>
                                <p className="font-mono text-base font-semibold text-foreground">
                                    {scanMaxDepth} {scanMaxDepth === 1 ? 'level' : 'levels'}
                                </p>
                            </div>
                            <div className="col-span-2 space-y-0.5 sm:col-span-1">
                                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                                    Detected Folders
                                </span>
                                <p className="font-mono text-base font-semibold text-foreground">
                                    {detectedDirectories.length > 0
                                        ? `${detectedDirectories.length} detected`
                                        : 'None'}
                                </p>
                            </div>
                        </div>

                        {/* Subdirectory chips preview */}
                        {detectedDirectories.length > 0 && (
                            <div className="mt-4 border-t border-border pt-3">
                                <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                                    Top-level folders detected in yard:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {detectedDirectories.map((dir) => (
                                        <Badge
                                            key={dir}
                                            variant="secondary"
                                            className="font-mono text-[11px] font-normal"
                                        >
                                            <FolderGit2 className="mr-1 size-3 text-muted-foreground" />
                                            {dir}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sourcing Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="yard_path" className="font-mono text-xs font-semibold">
                                Yard Folder Path
                            </Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FolderOpen className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        id="yard_path"
                                        value={data.yard_path}
                                        onChange={(e) =>
                                            setData('yard_path', e.target.value)
                                        }
                                        className="pl-9 font-mono text-xs"
                                        placeholder="/home/housedv/projects"
                                        required
                                    />
                                </div>
                            </div>
                            {errors.yard_path && (
                                <p className="font-mono text-xs text-destructive">
                                    {errors.yard_path}
                                </p>
                            )}
                            <p className="font-mono text-[11px] text-muted-foreground">
                                Enter the absolute filesystem path containing your Git repositories or application folders.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="scan_max_depth" className="font-mono text-xs font-semibold">
                                    Scan Max Depth
                                </Label>
                                <Select
                                    value={String(data.scan_max_depth)}
                                    onValueChange={(val) =>
                                        setData('scan_max_depth', Number(val))
                                    }
                                >
                                    <SelectTrigger id="scan_max_depth" className="font-mono text-xs">
                                        <SelectValue placeholder="Select scan depth" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1" className="font-mono text-xs">
                                            1 Level (Immediate subfolders only)
                                        </SelectItem>
                                        <SelectItem value="2" className="font-mono text-xs">
                                            2 Levels (Standard yard repos - Recommended)
                                        </SelectItem>
                                        <SelectItem value="3" className="font-mono text-xs">
                                            3 Levels (Monorepos & nested groups)
                                        </SelectItem>
                                        <SelectItem value="4" className="font-mono text-xs">
                                            4 Levels (Deeply nested submodules)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.scan_max_depth && (
                                    <p className="font-mono text-xs text-destructive">
                                        {errors.scan_max_depth}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col justify-end space-y-2">
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="rescan_now"
                                        checked={data.rescan_now}
                                        onCheckedChange={(checked) =>
                                            setData('rescan_now', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="rescan_now"
                                        className="font-mono text-xs cursor-pointer font-medium"
                                    >
                                        Immediately rescan yard upon saving
                                    </Label>
                                </div>
                                <p className="font-mono text-[11px] text-muted-foreground">
                                    Runs the conductor discovery pass to update the Departure Board.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-t border-border pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="font-mono text-xs"
                            >
                                {processing ? 'Saving Yard Settings...' : 'Save Yard Settings'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                                    Yard configuration saved successfully.
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
