import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import centralTower from '@/routes/central-tower';
import stationMaster from '@/routes/station-master';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    ListTodo,
} from 'lucide-react';

interface Task {
    id: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
}

interface GlobalTask {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assigned_crew: string | null;
    train_id: number;
    train_name: string;
    train_status: 'on_time' | 'delayed' | 'in_yard';
    created_at: string;
}

interface Milestone {
    id: number;
    title: string;
    due_date: string | null;
    status: 'pending' | 'completed' | 'missed';
}

interface Train {
    id: number;
    name: string;
    path: string;
    status: 'on_time' | 'delayed' | 'in_yard';
    milestones: Milestone[];
    tasks: Task[];
}

interface TaskStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    high_priority: number;
}

interface Props {
    trains: Train[];
    allTasks: GlobalTask[];
    taskStats: TaskStats;
}

function priorityIcon(priority: 'low' | 'medium' | 'high') {
    if (priority === 'high') {
        return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />;
    }
    if (priority === 'medium') {
        return (
            <Circle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
        );
    }
    return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
}

function statusIcon(status: 'pending' | 'in_progress' | 'completed') {
    if (status === 'completed') {
        return (
            <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
        );
    }
    if (status === 'in_progress') {
        return <Clock className="h-4 w-4 text-blue-700 dark:text-blue-400" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function trainStatusBadgeClasses(status: Train['status']): string {
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

export default function CentralTower({ trains, allTasks, taskStats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Central Tower',
            href: centralTower.index().url,
        },
    ];

    const totalTrains = trains.length;
    const activeTrains = trains.filter((t) => t.status === 'on_time').length;
    const delayedTrains = trains.filter((t) => t.status === 'delayed').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Central Tower" />

            <div className="mx-auto max-w-7xl space-y-8 p-6">
                {/* Header & Signal Telemetry Strip */}
                <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 lg:flex-row lg:items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Central Tower
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Fleet-wide milestone timetables and global task
                            manifest across all tracks.
                        </p>
                    </div>

                    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border">
                        <div className="sm:px-5 first:sm:pl-0">
                            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Traffic
                            </dt>
                            <dd className="mt-0.5 font-mono text-xl font-bold text-foreground tabular-nums">
                                {activeTrains} / {totalTrains}
                            </dd>
                        </div>
                        <div className="sm:px-5">
                            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Delays
                            </dt>
                            <dd
                                className={`mt-0.5 font-mono text-xl font-bold tabular-nums ${
                                    delayedTrains > 0
                                        ? 'text-amber-800 dark:text-amber-300'
                                        : 'text-emerald-800 dark:text-emerald-300'
                                }`}
                            >
                                {delayedTrains}
                            </dd>
                        </div>
                        <div className="sm:px-5">
                            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Manifest
                            </dt>
                            <dd className="mt-0.5 font-mono text-xl font-bold text-foreground tabular-nums">
                                {taskStats.total}
                            </dd>
                        </div>
                        <div className="sm:pl-5">
                            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Urgent
                            </dt>
                            <dd
                                className={`mt-0.5 font-mono text-xl font-bold tabular-nums ${
                                    taskStats.high_priority > 0
                                        ? 'text-destructive'
                                        : 'text-foreground'
                                }`}
                            >
                                {taskStats.high_priority}
                            </dd>
                        </div>
                    </dl>
                </div>

                <Tabs defaultValue="schedule" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="schedule" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Master Schedule
                        </TabsTrigger>
                        <TabsTrigger value="manifest" className="gap-2">
                            <ListTodo className="h-4 w-4" />
                            Global Manifest
                        </TabsTrigger>
                    </TabsList>

                    {/* Master Schedule Tab */}
                    <TabsContent value="schedule">
                        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                            <ul className="divide-y divide-border">
                                {trains.map((train) => (
                                    <li
                                        key={train.id}
                                        className="flex flex-col transition-colors hover:bg-muted/30 md:flex-row"
                                    >
                                        {/* Train Info Column */}
                                        <div className="md: flex shrink-0 flex-col justify-between border-b border-border p-5 md:w-64 md:border-r md:border-b-0">
                                            <div>
                                                <h2
                                                    className="truncate font-serif text-lg font-bold text-foreground"
                                                    title={train.name}
                                                >
                                                    {train.name}
                                                </h2>
                                                <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                                                    {train.path}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="group w-full justify-between"
                                                >
                                                    <Link
                                                        href={
                                                            stationMaster.show({
                                                                train: train.id,
                                                            }).url
                                                        }
                                                    >
                                                        Station Master
                                                        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Timeline / Milestones Column */}
                                        <div className="flex-1 overflow-x-auto p-5">
                                            {train.milestones.length === 0 ? (
                                                <div className="flex h-full items-center border-l-2 border-border pl-4 text-sm text-muted-foreground italic">
                                                    No schedule set.
                                                </div>
                                            ) : (
                                                <ol className="flex min-w-max items-start gap-6">
                                                    {train.milestones.map(
                                                        (milestone) => (
                                                            <li
                                                                key={
                                                                    milestone.id
                                                                }
                                                                className="min-w-[190px] border-l-2 border-primary/40 pl-3.5"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={`h-2 w-2 rounded-full ${
                                                                            milestone.status ===
                                                                            'completed'
                                                                                ? 'bg-emerald-600 dark:bg-emerald-400'
                                                                                : milestone.status ===
                                                                                    'missed'
                                                                                  ? 'bg-destructive'
                                                                                  : 'bg-primary'
                                                                        }`}
                                                                    />
                                                                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                                                                        {milestone.due_date
                                                                            ? new Date(
                                                                                  milestone.due_date,
                                                                              ).toLocaleDateString()
                                                                            : 'No Date'}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="mt-1.5 truncate text-sm font-semibold text-foreground"
                                                                    title={
                                                                        milestone.title
                                                                    }
                                                                >
                                                                    {
                                                                        milestone.title
                                                                    }
                                                                </div>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="mt-1.5 font-mono text-xs uppercase"
                                                                >
                                                                    {
                                                                        milestone.status
                                                                    }
                                                                </Badge>
                                                            </li>
                                                        ),
                                                    )}
                                                </ol>
                                            )}
                                        </div>

                                        {/* Stats Column */}
                                        <div className="flex flex-col justify-center gap-3 border-t border-border p-5 md:w-48 md:shrink-0 md:border-t-0 md:border-l">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Tasks
                                                </span>
                                                <span className="font-mono font-semibold text-foreground tabular-nums">
                                                    {train.tasks.length}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Status
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        'font-mono text-xs font-semibold uppercase ' +
                                                        trainStatusBadgeClasses(
                                                            train.status,
                                                        )
                                                    }
                                                >
                                                    {train.status === 'on_time'
                                                        ? 'On Time'
                                                        : train.status ===
                                                            'delayed'
                                                          ? 'Delayed'
                                                          : 'In Yard'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>

                    {/* Global Manifest Tab */}
                    <TabsContent value="manifest">
                        <div className="space-y-6">
                            {/* Task Stats Ledger */}
                            <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-4 sm:divide-x sm:divide-border">
                                <div className="sm:px-4 first:sm:pl-0">
                                    <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                        Pending
                                    </dt>
                                    <dd className="mt-1 font-mono text-2xl font-bold text-foreground tabular-nums">
                                        {taskStats.pending}
                                    </dd>
                                </div>
                                <div className="sm:px-4">
                                    <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                        In Progress
                                    </dt>
                                    <dd className="mt-1 font-mono text-2xl font-bold text-blue-700 tabular-nums dark:text-blue-400">
                                        {taskStats.in_progress}
                                    </dd>
                                </div>
                                <div className="sm:px-4">
                                    <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                        Completed
                                    </dt>
                                    <dd className="mt-1 font-mono text-2xl font-bold text-emerald-800 tabular-nums dark:text-emerald-400">
                                        {taskStats.completed}
                                    </dd>
                                </div>
                                <div className="sm:pl-4">
                                    <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                        High Priority
                                    </dt>
                                    <dd className="mt-1 font-mono text-2xl font-bold text-destructive tabular-nums">
                                        {taskStats.high_priority}
                                    </dd>
                                </div>
                            </dl>

                            {/* Task List */}
                            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                                <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/50 px-4 py-2.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                    <div className="col-span-1">Pri</div>
                                    <div className="col-span-4">Task</div>
                                    <div className="col-span-3">Project</div>
                                    <div className="col-span-2">Crew</div>
                                    <div className="col-span-2">Status</div>
                                </div>
                                <ul className="divide-y divide-border">
                                    {allTasks.length === 0 ? (
                                        <li className="p-8 text-center text-muted-foreground">
                                            No tasks across any projects yet.
                                        </li>
                                    ) : (
                                        allTasks.map((task) => (
                                            <li
                                                key={task.id}
                                                className={`grid grid-cols-12 items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40 ${
                                                    task.status === 'completed'
                                                        ? 'opacity-65'
                                                        : ''
                                                }`}
                                            >
                                                <div className="col-span-1 flex items-center">
                                                    {priorityIcon(
                                                        task.priority,
                                                    )}
                                                </div>
                                                <div className="col-span-4">
                                                    <div
                                                        className="truncate text-sm font-medium text-foreground"
                                                        title={task.title}
                                                    >
                                                        {task.title}
                                                    </div>
                                                    {task.description && (
                                                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                                            {task.description}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-span-3">
                                                    <Link
                                                        href={
                                                            stationMaster.show({
                                                                train: task.train_id,
                                                            }).url
                                                        }
                                                        className="block truncate text-sm font-medium text-primary hover:underline"
                                                    >
                                                        {task.train_name}
                                                    </Link>
                                                </div>
                                                <div className="col-span-2 text-sm text-muted-foreground">
                                                    {task.assigned_crew || '—'}
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {statusIcon(task.status)}
                                                    <span className="text-xs text-foreground capitalize">
                                                        {task.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
