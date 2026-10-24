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
import { BotCrewMember, Milestone, Train } from './types';

const DEFAULT_CREW = [
    'Janine',
    'OpenClaw',
    'Community Manager',
    'Prism',
    'Trading Bot',
];

export function CreateTaskDialog({
    trainId,
    milestoneId,
    botRoster = [],
    open,
    onOpenChange,
}: {
    trainId: Train['id'];
    milestoneId: Milestone['id'] | null;
    botRoster?: BotCrewMember[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        assigned_crew: 'Janine',
        milestone_id: milestoneId,
    });

    useEffect(() => {
        if (open) {
            setData({
                title: '',
                description: '',
                priority: 'medium',
                assigned_crew: 'Janine',
                milestone_id: milestoneId,
            });
        }
    }, [open, milestoneId]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(stationMaster.tasks.store({ train: trainId }).url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const crewNames =
        botRoster.length > 0 ? botRoster.map((b) => b.name) : DEFAULT_CREW;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Manifest Item</DialogTitle>
                    <DialogDescription>
                        {milestoneId
                            ? 'Add a task to this milestone (synced with Mission Control when linked).'
                            : 'Add a loose task to the project and assign a Bot HQ crew.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-title">Title</Label>
                        <Input
                            id="task-title"
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
                        <Label htmlFor="task-description">Description</Label>
                        <textarea
                            id="task-description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                            <Label htmlFor="task-priority">Priority</Label>
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
                            <Label htmlFor="assigned_crew">
                                Assigned Crew / Bot
                            </Label>
                            <Input
                                id="assigned_crew"
                                value={data.assigned_crew}
                                onChange={(e) =>
                                    setData('assigned_crew', e.target.value)
                                }
                                placeholder="e.g., Janine or OpenClaw"
                            />
                            {errors.assigned_crew && (
                                <p className="text-sm text-destructive">
                                    {errors.assigned_crew}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                            <Bot className="h-3.5 w-3.5 text-primary" />
                            Mission Control & Bot HQ Crew:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
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
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Add Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
