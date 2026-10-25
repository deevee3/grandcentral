import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowUpDown,
    CheckCircle2,
    Clock,
    ExternalLink,
    Filter,
    FolderCheck,
    FolderGit2,
    FolderOpen,
    FolderX,
    LayoutGrid,
    ListFilter,
    RefreshCw,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

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
    mcProjectId?: number | null;
    mcProjectTitle?: string | null;
    aboardUrl: string;
    stationMasterUrl: string;
};

interface ScanStats {
    yard_path: string;
    found: number;
    created: number;
    updated: number;
    analyzed?: number;
}

interface DashboardProps {
    trains: Train[];
    yardPath?: string;
    scanMaxDepth?: number;
    yardExists?: boolean;
    status?: string | null;
    stats?: ScanStats | null;
}

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

type SortOption =
    | 'platform'
    | 'name_asc'
    | 'name_desc'
    | 'status_delayed'
    | 'status_ontime'
    | 'departure_recent'
    | 'departure_oldest';

type McFilterOption = 'all' | 'linked' | 'unlinked';

export default function Dashboard({
    trains,
    yardPath = '/home/housedv/projects',
    scanMaxDepth = 2,
    yardExists = true,
    status,
    stats,
}: DashboardProps) {
    // Search, filter, and sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'on_time' | 'delayed' | 'in_yard'>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [mcFilter, setMcFilter] = useState<McFilterOption>('all');
    const [sortBy, setSortBy] = useState<SortOption>('platform');
    const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');

    // Folder modal and rescan state
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isRescanning, setIsRescanning] = useState(false);

    const folderForm = useForm({
        yard_path: yardPath,
        scan_max_depth: scanMaxDepth,
        rescan_now: true,
    });

    const submitFolderChange: FormEventHandler = (e) => {
        e.preventDefault();
        folderForm.patch('/settings/yard', {
            onSuccess: () => {
                setIsFolderModalOpen(false);
            },
        });
    };

    const handleRescan = () => {
        setIsRescanning(true);
        router.post(
            '/settings/yard/rescan',
            {},
            {
                onFinish: () => setIsRescanning(false),
            },
        );
    };

    // Calculate unique platforms across all trains
    const allPlatforms = useMemo(() => {
        const set = new Set<string>();
        trains.forEach((t) => {
            if (t.platform) set.add(t.platform);
        });
        return Array.from(set).sort();
    }, [trains]);

    // Counts for filter pills
    const totalCount = trains.length;
    const onTimeCount = trains.filter((t) => t.status === 'on_time').length;
    const delayedCount = trains.filter((t) => t.status === 'delayed').length;
    const inYardCount = trains.filter((t) => t.status === 'in_yard').length;
    const mcLinkedCount = trains.filter((t) => !!t.mcProjectId).length;

    // Filtered trains
    const filteredTrains = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return trains.filter((train) => {
            // Text search
            if (query !== '') {
                const matchName = train.name.toLowerCase().includes(query);
                const matchPath = train.path.toLowerCase().includes(query);
                const matchPlatform = (train.platform ?? '').toLowerCase().includes(query);
                const matchMc = (train.mcProjectTitle ?? '').toLowerCase().includes(query);
                if (!matchName && !matchPath && !matchPlatform && !matchMc) {
                    return false;
                }
            }

            // Status filter
            if (statusFilter !== 'all' && train.status !== statusFilter) {
                return false;
            }

            // Platform filter
            if (platformFilter !== 'all') {
                if (platformFilter === 'unknown' && train.platform !== null) {
                    return false;
                }
                if (platformFilter !== 'unknown' && train.platform !== platformFilter) {
                    return false;
                }
            }

            // Mission Control filter
            if (mcFilter === 'linked' && !train.mcProjectId) {
                return false;
            }
            if (mcFilter === 'unlinked' && !!train.mcProjectId) {
                return false;
            }

            return true;
        });
    }, [trains, searchQuery, statusFilter, platformFilter, mcFilter]);

    // Sorted trains
    const sortedTrains = useMemo(() => {
        const result = [...filteredTrains];

        result.sort((a, b) => {
            if (sortBy === 'name_asc') {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'name_desc') {
                return b.name.localeCompare(a.name);
            }
            if (sortBy === 'status_delayed') {
                const order = { delayed: 0, on_time: 1, in_yard: 2 };
                const diff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
                return diff !== 0 ? diff : a.name.localeCompare(b.name);
            }
            if (sortBy === 'status_ontime') {
                const order = { on_time: 0, delayed: 1, in_yard: 2 };
                const diff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
                return diff !== 0 ? diff : a.name.localeCompare(b.name);
            }
            if (sortBy === 'departure_recent') {
                if (!a.lastDeparture && !b.lastDeparture) return a.name.localeCompare(b.name);
                if (!a.lastDeparture) return 1;
                if (!b.lastDeparture) return -1;
                return b.lastDeparture.localeCompare(a.lastDeparture);
            }
            if (sortBy === 'departure_oldest') {
                if (!a.lastDeparture && !b.lastDeparture) return a.name.localeCompare(b.name);
                if (!a.lastDeparture) return 1;
                if (!b.lastDeparture) return -1;
                return a.lastDeparture.localeCompare(b.lastDeparture);
            }

            // Default 'platform' sort
            const pA = a.platform ?? 'ZZZ';
            const pB = b.platform ?? 'ZZZ';
            const pDiff = pA.localeCompare(pB);
            return pDiff !== 0 ? pDiff : a.name.localeCompare(b.name);
        });

        return result;
    }, [filteredTrains, sortBy]);

    // Grouping by platform (for concourse view)
    const grouped = useMemo(() => {
        return sortedTrains.reduce(
            (acc, train) => {
                const platform = train.platform ?? 'Unknown';
                acc[platform] ??= [];
                acc[platform].push(train);
                return acc;
            },
            {} as Record<string, Train[]>,
        );
    }, [sortedTrains]);

    const activePlatforms = useMemo(() => {
        return Object.keys(grouped).sort((a, b) => {
            if (a === 'Unknown') return 1;
            if (b === 'Unknown') return -1;
            return a.localeCompare(b);
        });
    }, [grouped]);

    const hasActiveFilters =
        searchQuery !== '' ||
        statusFilter !== 'all' ||
        platformFilter !== 'all' ||
        mcFilter !== 'all' ||
        sortBy !== 'platform';

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPlatformFilter('all');
        setMcFilter('all');
        setSortBy('platform');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departure Board" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
                {/* Concourse Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Departure Board
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Live dispatch status, platform assignments, and filterable manifests across your yard.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
                        <Badge
                            variant="secondary"
                            className="px-2.5 py-1 font-mono text-xs"
                        >
                            {totalCount} Total Trains
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
                        {mcLinkedCount > 0 && (
                            <Badge
                                variant="outline"
                                className="border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-xs text-foreground"
                            >
                                {mcLinkedCount} MC Synced
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Yard Sourcing Concourse Bar */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                            {yardExists ? (
                                <FolderCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <FolderX className="size-4 text-destructive" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold text-foreground">
                                    Yard Source:
                                </span>
                                <Badge
                                    variant="outline"
                                    className={
                                        yardExists
                                            ? 'border-emerald-600/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                                            : 'border-destructive/30 bg-destructive/10 font-mono text-[10px] text-destructive'
                                    }
                                >
                                    {yardExists ? 'Active' : 'Missing'}
                                </Badge>
                                <span className="font-mono text-[11px] text-muted-foreground">
                                    (depth: {scanMaxDepth})
                                </span>
                            </div>
                            <p className="truncate font-mono text-xs text-muted-foreground" title={yardPath}>
                                {yardPath}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Change Folder Modal Trigger */}
                        <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="font-mono text-xs"
                                >
                                    <FolderOpen className="mr-1.5 size-3.5" />
                                    Change Folder
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-lg">
                                        Configure Yard Source Folder
                                    </DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Change the directory path where Grand Central discovers and inspects your projects.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={submitFolderChange} className="space-y-4 py-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="modal_yard_path" className="font-mono text-xs font-semibold">
                                            Yard Directory Path
                                        </Label>
                                        <div className="relative">
                                            <FolderOpen className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                id="modal_yard_path"
                                                value={folderForm.data.yard_path}
                                                onChange={(e) =>
                                                    folderForm.setData('yard_path', e.target.value)
                                                }
                                                className="pl-9 font-mono text-xs"
                                                placeholder="/home/housedv/projects"
                                                required
                                            />
                                        </div>
                                        {folderForm.errors.yard_path && (
                                            <p className="font-mono text-xs text-destructive">
                                                {folderForm.errors.yard_path}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="modal_scan_depth" className="font-mono text-xs font-semibold">
                                            Scan Max Depth
                                        </Label>
                                        <Select
                                            value={String(folderForm.data.scan_max_depth)}
                                            onValueChange={(val) =>
                                                folderForm.setData('scan_max_depth', Number(val))
                                            }
                                        >
                                            <SelectTrigger id="modal_scan_depth" className="font-mono text-xs">
                                                <SelectValue placeholder="Select depth" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1" className="font-mono text-xs">
                                                    1 Level (Immediate child repos)
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
                                    </div>

                                    <div className="flex items-center space-x-2 pt-1">
                                        <Checkbox
                                            id="modal_rescan_now"
                                            checked={folderForm.data.rescan_now}
                                            onCheckedChange={(checked) =>
                                                folderForm.setData('rescan_now', !!checked)
                                            }
                                        />
                                        <Label
                                            htmlFor="modal_rescan_now"
                                            className="font-mono text-xs cursor-pointer font-medium"
                                        >
                                            Rescan yard immediately upon saving
                                        </Label>
                                    </div>

                                    <DialogFooter className="pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsFolderModalOpen(false)}
                                            className="font-mono text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={folderForm.processing}
                                            className="font-mono text-xs"
                                        >
                                            {folderForm.processing ? 'Saving...' : 'Save & Rescan'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRescan}
                            disabled={isRescanning || !yardExists}
                            className="font-mono text-xs"
                        >
                            <RefreshCw
                                className={`mr-1.5 size-3.5 ${isRescanning ? 'animate-spin' : ''}`}
                            />
                            {isRescanning ? 'Rescanning...' : 'Rescan Yard'}
                        </Button>

                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="font-mono text-xs"
                        >
                            <Link href="/settings/yard">
                                <SlidersHorizontal className="mr-1.5 size-3.5" />
                                Yard Settings
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Scan Feedback Banner */}
                {(stats || status === 'yard-rescanned') && (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-mono text-xs font-semibold">
                                Yard Scan Synchronized:
                            </span>
                            <span className="font-mono text-xs opacity-90">
                                {stats
                                    ? `Found ${stats.found} trains (${stats.created} new, ${stats.updated} updated).`
                                    : 'All local manifests and tracks are up to date.'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Search, Filter & Sort Controls */}
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
                    {/* Top Row: Search Input + Sort Dropdown + View Mode */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, path, platform, or Mission Control..."
                                className="pl-9 font-mono text-xs"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                    title="Clear search"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Sort Selector */}
                            <div className="flex items-center gap-1.5">
                                <ArrowUpDown className="size-3.5 text-muted-foreground" />
                                <Select
                                    value={sortBy}
                                    onValueChange={(val) => setSortBy(val as SortOption)}
                                >
                                    <SelectTrigger className="w-[185px] font-mono text-xs">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="platform" className="font-mono text-xs">
                                            Platform (Track Order)
                                        </SelectItem>
                                        <SelectItem value="name_asc" className="font-mono text-xs">
                                            Name (A → Z)
                                        </SelectItem>
                                        <SelectItem value="name_desc" className="font-mono text-xs">
                                            Name (Z → A)
                                        </SelectItem>
                                        <SelectItem value="status_delayed" className="font-mono text-xs">
                                            Status (Delayed First)
                                        </SelectItem>
                                        <SelectItem value="status_ontime" className="font-mono text-xs">
                                            Status (On Time First)
                                        </SelectItem>
                                        <SelectItem value="departure_recent" className="font-mono text-xs">
                                            Last Departure (Newest)
                                        </SelectItem>
                                        <SelectItem value="departure_oldest" className="font-mono text-xs">
                                            Last Departure (Oldest)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center rounded-md border border-border p-0.5">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={viewMode === 'grouped' ? 'secondary' : 'ghost'}
                                    className="h-7 px-2 font-mono text-xs"
                                    onClick={() => setViewMode('grouped')}
                                    title="Group by Platform"
                                >
                                    <LayoutGrid className="mr-1 size-3.5" />
                                    Tracks
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={viewMode === 'flat' ? 'secondary' : 'ghost'}
                                    className="h-7 px-2 font-mono text-xs"
                                    onClick={() => setViewMode('flat')}
                                    title="Flat Manifest"
                                >
                                    <ListFilter className="mr-1 size-3.5" />
                                    Flat
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Status Filter Pills + Platform Filter + MC Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                                Status:
                            </span>
                            <Button
                                type="button"
                                size="sm"
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                className="h-6 px-2 font-mono text-[11px]"
                                onClick={() => setStatusFilter('all')}
                            >
                                All ({totalCount})
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={statusFilter === 'on_time' ? 'default' : 'outline'}
                                className="h-6 px-2 font-mono text-[11px]"
                                onClick={() => setStatusFilter('on_time')}
                            >
                                On Time ({onTimeCount})
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={statusFilter === 'delayed' ? 'default' : 'outline'}
                                className="h-6 px-2 font-mono text-[11px]"
                                onClick={() => setStatusFilter('delayed')}
                            >
                                Delayed ({delayedCount})
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={statusFilter === 'in_yard' ? 'default' : 'outline'}
                                className="h-6 px-2 font-mono text-[11px]"
                                onClick={() => setStatusFilter('in_yard')}
                            >
                                In Yard ({inYardCount})
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Platform Filter */}
                            <Select
                                value={platformFilter}
                                onValueChange={(val) => setPlatformFilter(val)}
                            >
                                <SelectTrigger className="h-7 w-[140px] font-mono text-xs">
                                    <SelectValue placeholder="All Platforms" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="font-mono text-xs">
                                        All Platforms
                                    </SelectItem>
                                    {allPlatforms.map((plat) => (
                                        <SelectItem
                                            key={plat}
                                            value={plat}
                                            className="font-mono text-xs"
                                        >
                                            {plat}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="unknown" className="font-mono text-xs">
                                        Unassigned
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Mission Control Filter */}
                            <Select
                                value={mcFilter}
                                onValueChange={(val) => setMcFilter(val as McFilterOption)}
                            >
                                <SelectTrigger className="h-7 w-[130px] font-mono text-xs">
                                    <SelectValue placeholder="MC Link" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="font-mono text-xs">
                                        All MC Links
                                    </SelectItem>
                                    <SelectItem value="linked" className="font-mono text-xs">
                                        MC Linked ({mcLinkedCount})
                                    </SelectItem>
                                    <SelectItem value="unlinked" className="font-mono text-xs">
                                        Unlinked ({totalCount - mcLinkedCount})
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-7 px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <X className="mr-1 size-3" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Results Summary */}
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <span>
                        Showing {sortedTrains.length} of {totalCount} trains
                        {hasActiveFilters && ' (filtered)'}
                    </span>
                    {hasActiveFilters && (
                        <span className="font-mono text-[11px]">
                            Filtered by:{' '}
                            {[
                                searchQuery && `query "${searchQuery}"`,
                                statusFilter !== 'all' && `status ${statusFilter}`,
                                platformFilter !== 'all' && `platform ${platformFilter}`,
                                mcFilter !== 'all' && `MC ${mcFilter}`,
                                sortBy !== 'platform' && `sort ${sortBy}`,
                            ]
                                .filter(Boolean)
                                .join(' • ')}
                        </span>
                    )}
                </div>

                {/* Trains List / Tracks */}
                {trains.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                        <p className="font-mono text-sm text-muted-foreground">
                            No trains indexed in the yard yet. Run a yard scan or check your yard source folder.
                        </p>
                        <Button
                            onClick={handleRescan}
                            disabled={isRescanning}
                            className="mt-4 font-mono text-xs"
                        >
                            <RefreshCw
                                className={`mr-1.5 size-3.5 ${isRescanning ? 'animate-spin' : ''}`}
                            />
                            Scan Yard Now
                        </Button>
                    </div>
                ) : sortedTrains.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                        <Filter className="mx-auto size-8 text-muted-foreground/60" />
                        <p className="mt-2 font-mono text-sm font-semibold text-foreground">
                            No trains match your filter criteria
                        </p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            Try adjusting your search keywords, status filter, or platform selection.
                        </p>
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4 font-mono text-xs"
                        >
                            Reset All Filters
                        </Button>
                    </div>
                ) : viewMode === 'flat' ? (
                    /* Flat Manifest View */
                    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                        <ul className="divide-y divide-border">
                            {sortedTrains.map((train, index) => (
                                <li
                                    key={train.id}
                                    className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="font-mono text-xs font-bold text-primary tabular-nums">
                                                #{String(index + 1).padStart(3, '0')}
                                            </span>
                                            <span className="truncate font-mono text-sm font-semibold text-foreground">
                                                {train.name}
                                            </span>
                                            {train.platform && (
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono text-xs"
                                                >
                                                    {train.platform}
                                                </Badge>
                                            )}
                                            <Badge
                                                variant="outline"
                                                className={
                                                    'font-mono text-xs font-semibold uppercase ' +
                                                    statusClasses(train.status)
                                                }
                                            >
                                                {train.statusLabel}
                                            </Badge>
                                            {train.mcProjectId && (
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono text-xs"
                                                    title={`Synced with Mission Control: ${train.mcProjectTitle}`}
                                                >
                                                    MC #{train.mcProjectId}
                                                </Badge>
                                            )}
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
                                                {formatDeparture(train.lastDeparture)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={train.stationMasterUrl}>
                                                <SlidersHorizontal className="mr-1.5 size-3.5" />
                                                Station Master
                                            </Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <a href={train.aboardUrl}>
                                                All Aboard
                                                <ExternalLink className="ml-1.5 size-3.5" />
                                            </a>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    /* Concourse Track View (Grouped by Platform) */
                    <div className="space-y-8">
                        {activePlatforms.map((platform) => (
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
                                        {grouped[platform].map((train, index) => (
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
                                                            ).padStart(2, '0')}
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
                                                            {train.statusLabel}
                                                        </Badge>
                                                        {train.mcProjectId && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="font-mono text-xs"
                                                                title={`Synced with Mission Control: ${train.mcProjectTitle}`}
                                                            >
                                                                MC #
                                                                {
                                                                    train.mcProjectId
                                                                }
                                                            </Badge>
                                                        )}
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
                                        ))}
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
