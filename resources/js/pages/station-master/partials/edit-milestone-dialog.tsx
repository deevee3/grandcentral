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
import { useEffect } from 'react';
import { Milestone, Train } from './types';

export function EditMilestoneDialog({
    trainId,
    milestone,
    open,
    onOpenChange,
}: {
    trainId: Train['id'];
    milestone: Milestone | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        due_date: '',
        status: 'pending',
    });

    useEffect(() => {
        if (open && milestone) {
            setData({
                title: milestone.title,
                description: milestone.description || '',
                due_date: milestone.due_date
                    ? milestone.due_date.split('T')[0]
                    : '',
                status: milestone.status,
            });
        }
    }, [open, milestone]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!milestone) return;

        put(
            stationMaster.milestones.update({
                train: trainId,
                milestone: milestone.id,
            }).url,
            {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            },
        );
    };

    if (!milestone) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Milestone</DialogTitle>
                    <DialogDescription>
                        Update the details of this waypoint.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-milestone-title">Title</Label>
                        <Input
                            id="edit-milestone-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g., Alpha Release"
                            required
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-milestone-description">
                            Description
                        </Label>
                        <textarea
                            id="edit-milestone-description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Optional details about this milestone..."
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-milestone-due_date">
                                Due Date
                            </Label>
                            <Input
                                id="edit-milestone-due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                            />
                            {errors.due_date && (
                                <p className="text-sm text-destructive">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-milestone-status">
                                Status
                            </Label>
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
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="missed">
                                        Missed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
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
