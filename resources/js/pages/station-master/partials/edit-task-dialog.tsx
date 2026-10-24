import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import stationMaster from '@/routes/station-master';
import { useForm } from '@inertiajs/react';
import { Bot } from 'lucide-react';
import { useEffect } from 'react';
import { BotCrewMember, Task, Train } from './types';

const DEFAULT_CREW = [
    'Janine',
    'OpenClaw',
    'Community Manager',
    'Prism',
    'Trading Bot',
];

export function EditTaskDialog({
    trainId,
    task,
    botRoster = [],
    open,
    onOpenChange,
}: {
    trainId: Train['id'];
    task: Task | null;
    botRoster?: BotCrewMember[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        assigned_crew: '',
        status: 'pending',
        milestone_id: null as number | null,
        completion_steps: '',
    });

    useEffect(() => {
        if (open && task) {
            setData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                assigned_crew: task.assigned_crew || '',
                status: task.status,
                milestone_id: task.milestone_id,
                completion_steps: task.completion_steps || '',
            });
        }
    }, [open, task]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        put(stationMaster.tasks.update({ train: trainId, task: task.id }).url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    if (!task) return null;

    const crewNames =
        botRoster.length > 0 ? botRoster.map((b) => b.name) : DEFAULT_CREW;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Manifest Item</DialogTitle>
                    <DialogDescription>
                        Update task details, Mission Control completion steps,
                        or Bot HQ crew assignment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-task-title">Title</Label>
                        <Input
                            id="edit-task-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g., Fix navigation bug"
                            required
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-task-description">
                            Description
                        </Label>
                        <textarea
                            id="edit-task-description"
                            className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Optional details..."
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-task-priority">Priority</Label>
                            <Select
                                value={data.priority}
                                onValueChange={(value) =>
                                    setData('priority', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-sm text-destructive">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-task-status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="edit-assigned_crew">
                                Assigned Crew / Bot
                            </Label>
                            <Input
                                id="edit-assigned_crew"
                                value={data.assigned_crew}
                                onChange={(e) =>
                                    setData('assigned_crew', e.target.value)
                                }
                                placeholder="e.g., Janine or OpenClaw"
                            />
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {crewNames.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() =>
                                            setData('assigned_crew', name)
                                        }
                                        className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                                            data.assigned_crew === name
                                                ? 'border-primary bg-primary/15 font-semibold text-primary'
                                                : 'border-border bg-secondary/60 text-secondary-foreground hover:bg-secondary'
                                        }`}
                                    >
                                        <Bot className="mr-1 inline h-3 w-3" />
                                        {name}
                                    </button>
                                ))}
                            </div>
                            {errors.assigned_crew && (
                                <p className="text-sm text-destructive">
                                    {errors.assigned_crew}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="edit-completion_steps">
                                Bot / Janine Completion Guide
                            </Label>
                            <textarea
                                id="edit-completion_steps"
                                className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.completion_steps}
                                onChange={(e) =>
                                    setData('completion_steps', e.target.value)
                                }
                                placeholder="Step title — what to do..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
