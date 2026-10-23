import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import stationMaster from '@/routes/station-master';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    MapPin,
    MoreVertical,
    Pencil,
    Plus,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { CreateMilestoneDialog } from './partials/create-milestone-dialog';
import { CreateTaskDialog } from './partials/create-task-dialog';
import { EditMilestoneDialog } from './partials/edit-milestone-dialog';
import { EditTaskDialog } from './partials/edit-task-dialog';
import { EditTrainDialog } from './partials/edit-train-dialog';
import { MarkdownPanel } from './partials/markdown-panel';
import { Milestone, Props, Task } from './partials/types';

export default function StationMaster({
    train,
    milestones,
    looseTasks,
    markdownFiles,
    fingerprint,
}: Props) {
    // Create Dialog States
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<
        number | null
    >(null);
    const [createTaskDialogKey, setCreateTaskDialogKey] = useState(0);

    // Edit Dialog States
    const [editTrainOpen, setEditTrainOpen] = useState(false);
    const [editMilestoneOpen, setEditMilestoneOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
        null,
    );

    const [editTaskOpen, setEditTaskOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openCreateTask = (
        e: React.MouseEvent,
        milestoneId: number | null,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedMilestoneId(milestoneId);
        setCreateTaskDialogKey((prev) => prev + 1);
        setCreateTaskOpen(true);
    };

    const openEditMilestone = (e: React.MouseEvent, milestone: Milestone) => {
        e.preventDefault();
        // Don't stop propagation if we want the card to be interactive,
        // but here we specifically want to edit when clicking the header.
        setEditingMilestone(milestone);
        setEditMilestoneOpen(true);
    };

    const openEditTask = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingTask(task);
        setEditTaskOpen(true);
    };

    const openInWindsurf = (e: React.MouseEvent, milestone: Milestone) => {
        e.preventDefault();
        e.stopPropagation();

        // Build the prompt for Cascade
        const taskList = milestone.tasks
            .filter((t) => t.status !== 'completed')
            .map(
                (t) =>
                    `- ${t.title}${t.description ? `: ${t.description}` : ''}`,
            )
            .join('\n');

        const prompt = `I'm working on the milestone "${milestone.title}" for the ${train.name} project.${milestone.description ? `\n\nMilestone description: ${milestone.description}` : ''}\n\nRemaining tasks:\n${taskList || 'No tasks defined yet.'}\n\nPlease help me work on this milestone.`;

        // Copy prompt to clipboard
        navigator.clipboard.writeText(prompt).then(() => {
            // Open project in Windsurf
            const encodedPath = train.path
                .split('/')
                .filter(Boolean)
                .map(encodeURIComponent)
                .join('/');
            window.location.href = `windsurf://file/${encodedPath}`;
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: train.name,
            href: stationMaster.show({ train: train.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Station Master - ${train.name}`} />

            <div className="mx-auto max-w-7xl space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                                {train.name}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setEditTrainOpen(true)}
                                aria-label="Edit train details"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{train.path}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge
                            variant="outline"
                            className="border-primary/35 bg-primary/10 font-mono text-xs font-semibold tracking-wider text-primary uppercase"
                        >
                            {train.status.replace('_', ' ')}
                        </Badge>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                                const panel = document.querySelector(
                                    '[data-ai-suggestions-btn]',
                                ) as HTMLButtonElement;
                                if (panel) panel.click();
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Suggestions
                        </Button>
                        <CreateMilestoneDialog trainId={train.id} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content: Timetable & Milestones */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Milestones */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border pb-2">
                                <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    The Timetable
                                </h2>
                            </div>

                            {milestones.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        No waypoints set for this journey yet.
                                    </p>
                                    <CreateMilestoneDialog trainId={train.id} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {milestones.map((milestone) => (
                                        <Card
                                            key={milestone.id}
                                            className="group/card border-border bg-card shadow-xs"
                                        >
                                            <CardHeader
                                                className="cursor-pointer pb-3 transition-colors hover:bg-muted/40"
                                                onClick={(e) =>
                                                    openEditMilestone(
                                                        e,
                                                        milestone,
                                                    )
                                                }
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors group-hover/card:text-primary">
                                                            {milestone.title}
                                                        </CardTitle>
                                                        <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
                                                            {milestone.due_date ? (
                                                                <>
                                                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                                                    <span>
                                                                        Due:{' '}
                                                                        {new Date(
                                                                            milestone.due_date,
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span>
                                                                    No deadline
                                                                    set
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 gap-1.5 px-2.5 text-xs"
                                                            onClick={(e) =>
                                                                openInWindsurf(
                                                                    e,
                                                                    milestone,
                                                                )
                                                            }
                                                            title="Open in Windsurf with prompt copied to clipboard"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            Work in Windsurf
                                                        </Button>
                                                        <Badge
                                                            variant={
                                                                milestone.status ===
                                                                'completed'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {milestone.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {milestone.description && (
                                                    <p className="mb-4 text-sm text-muted-foreground">
                                                        {milestone.description}
                                                    </p>
                                                )}

                                                {/* Milestone Tasks */}
                                                <div className="space-y-2">
                                                    {milestone.tasks.length >
                                                        0 && (
                                                        <ul className="divide-y divide-border border-t border-border">
                                                            {milestone.tasks.map(
                                                                (task) => (
                                                                    <li
                                                                        key={
                                                                            task.id
                                                                        }
                                                                        className="flex cursor-pointer items-center gap-3 py-2.5 transition-colors hover:bg-muted/40"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            openEditTask(
                                                                                e,
                                                                                task,
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle2
                                                                            className={`h-4 w-4 shrink-0 ${
                                                                                task.status ===
                                                                                'completed'
                                                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                                                    : 'text-muted-foreground'
                                                                            }`}
                                                                        />
                                                                        <span
                                                                            className={`flex-1 text-sm ${
                                                                                task.status ===
                                                                                'completed'
                                                                                    ? 'text-muted-foreground line-through'
                                                                                    : 'text-foreground'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                task.title
                                                                            }
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="font-mono text-xs uppercase"
                                                                        >
                                                                            {
                                                                                task.priority
                                                                            }
                                                                        </Badge>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                                                        onClick={(e) =>
                                                            openCreateTask(
                                                                e,
                                                                milestone.id,
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-3.5 w-3.5" />{' '}
                                                        Add Task
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Loose Cargo (Unassigned Tasks) */}
                        <div>
                            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                                <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                                    <MoreVertical className="h-5 w-5 text-primary" />
                                    Loose Cargo
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => openCreateTask(e, null)}
                                    aria-label="Add unassigned task"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                                {looseTasks.length === 0 ? (
                                    <div className="py-10 text-center text-sm text-muted-foreground">
                                        All cargo stowed safely.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-border">
                                        {looseTasks.map((task) => (
                                            <li
                                                key={task.id}
                                                className="cursor-pointer px-4 py-3 transition-colors hover:bg-muted/40"
                                                onClick={(e) =>
                                                    openEditTask(e, task)
                                                }
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2.5">
                                                        <span
                                                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                                task.priority ===
                                                                'high'
                                                                    ? 'bg-red-600 dark:bg-red-400'
                                                                    : task.priority ===
                                                                        'medium'
                                                                      ? 'bg-amber-600 dark:bg-amber-400'
                                                                      : 'bg-blue-600 dark:bg-blue-400'
                                                            }`}
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">
                                                                {task.title}
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-muted-foreground">
                                                                {task.assigned_crew ||
                                                                    'Unassigned'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-mono text-xs uppercase"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Markdown Files & AI Analysis */}
                        <MarkdownPanel
                            train={train}
                            markdownFiles={markdownFiles}
                            fingerprint={fingerprint}
                        />
                    </div>
                </div>

                {/* Dialogs */}
                <EditTrainDialog
                    train={train}
                    open={editTrainOpen}
                    onOpenChange={setEditTrainOpen}
                />

                <CreateTaskDialog
                    key={createTaskDialogKey}
                    trainId={train.id}
                    milestoneId={selectedMilestoneId}
                    open={createTaskOpen}
                    onOpenChange={setCreateTaskOpen}
                />

                <EditMilestoneDialog
                    trainId={train.id}
                    milestone={editingMilestone}
                    open={editMilestoneOpen}
                    onOpenChange={setEditMilestoneOpen}
                />

                <EditTaskDialog
                    trainId={train.id}
                    task={editingTask}
                    open={editTaskOpen}
                    onOpenChange={setEditTaskOpen}
                />
            </div>
        </AppLayout>
    );
}
