import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import {
    Brain,
    Calendar,
    CheckCircle2,
    FileText,
    Loader2,
    Pencil,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MarkdownFile, ProjectFingerprint, Train } from './types';

interface SuggestedTask {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    selected: boolean;
}

interface SuggestedMilestone {
    title: string;
    description?: string;
    due_date?: string;
    tasks: SuggestedTask[];
    selected: boolean;
}

interface Suggestions {
    milestones: SuggestedMilestone[];
    loose_tasks: SuggestedTask[];
}

interface Props {
    train: Train;
    markdownFiles: MarkdownFile[];
    fingerprint: ProjectFingerprint | null;
}

export function MarkdownPanel({ train, markdownFiles, fingerprint }: Props) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // AI Analysis editing state
    const [editFingerprintOpen, setEditFingerprintOpen] = useState(false);
    const [editingFingerprint, setEditingFingerprint] = useState({
        core_purpose: fingerprint?.core_purpose || '',
        tech_stack: fingerprint?.tech_stack || [],
        current_state: fingerprint?.current_state || ('draft' as const),
    });
    const [newTech, setNewTech] = useState('');
    const [isSavingFingerprint, setIsSavingFingerprint] = useState(false);

    useEffect(() => {
        if (selectedFile) {
            fetch(`/station-master/${train.id}/markdown/${selectedFile}`)
                .then((res) => res.json())
                .then((data) => {
                    setFileContent(data.content || '');
                    setEditContent(data.content || '');
                });
        }
    }, [selectedFile, train.id]);

    const handleSave = async () => {
        if (!selectedFile) return;
        setIsSaving(true);

        try {
            const response = await fetch(
                `/station-master/${train.id}/markdown/${selectedFile}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ content: editContent }),
                },
            );

            if (response.ok) {
                setFileContent(editContent);
                setIsEditing(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateSuggestions = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch(
                `/station-master/${train.id}/suggest-schedule`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || `Server error: ${response.status}`);
                return;
            }

            const data = await response.json();

            const formattedSuggestions: Suggestions = {
                milestones: (data.suggestions?.milestones || []).map(
                    (m: Omit<SuggestedMilestone, 'selected' | 'tasks'> & {
                        tasks?: Omit<SuggestedTask, 'selected'>[];
                    }) => ({
                        ...m,
                        selected: true,
                        tasks: (m.tasks || []).map(
                            (t: Omit<SuggestedTask, 'selected'>) => ({
                                ...t,
                                selected: true,
                            }),
                        ),
                    }),
                ),
                loose_tasks: (data.suggestions?.loose_tasks || []).map(
                    (t: Omit<SuggestedTask, 'selected'>) => ({
                        ...t,
                        selected: true,
                    }),
                ),
            };

            setSuggestions(formattedSuggestions);
            setShowSuggestions(true);
        } catch (err: unknown) {
            console.error('AI suggestion error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to connect to AI service',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleMilestone = (index: number) => {
        if (!suggestions) return;
        const updated = { ...suggestions };
        updated.milestones[index].selected =
            !updated.milestones[index].selected;
        setSuggestions(updated);
    };

    const toggleTask = (milestoneIndex: number, taskIndex: number) => {
        if (!suggestions) return;
        const updated = { ...suggestions };
        updated.milestones[milestoneIndex].tasks[taskIndex].selected =
            !updated.milestones[milestoneIndex].tasks[taskIndex].selected;
        setSuggestions(updated);
    };

    const toggleLooseTask = (index: number) => {
        if (!suggestions) return;
        const updated = { ...suggestions };
        updated.loose_tasks[index].selected =
            !updated.loose_tasks[index].selected;
        setSuggestions(updated);
    };

    const handleApplySuggestions = () => {
        if (!suggestions) return;
        setIsApplying(true);

        const selectedMilestones = suggestions.milestones
            .filter((m) => m.selected)
            .map((m) => ({
                title: m.title,
                description: m.description,
                due_date: m.due_date,
                tasks: m.tasks
                    .filter((t) => t.selected)
                    .map((t) => ({
                        title: t.title,
                        description: t.description,
                        priority: t.priority,
                    })),
            }));

        const selectedLooseTasks = suggestions.loose_tasks
            .filter((t) => t.selected)
            .map((t) => ({
                title: t.title,
                description: t.description,
                priority: t.priority,
            }));

        router.post(
            `/station-master/${train.id}/apply-schedule`,
            {
                milestones: selectedMilestones,
                loose_tasks: selectedLooseTasks,
            },
            {
                onFinish: () => {
                    setIsApplying(false);
                    setShowSuggestions(false);
                    setSuggestions(null);
                },
            },
        );
    };

    const priorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-700 dark:text-red-400';
            case 'medium':
                return 'text-amber-700 dark:text-amber-400';
            default:
                return 'text-blue-700 dark:text-blue-400';
        }
    };

    const openEditFingerprint = () => {
        setEditingFingerprint({
            core_purpose: fingerprint?.core_purpose || '',
            tech_stack: fingerprint?.tech_stack || [],
            current_state: fingerprint?.current_state || 'draft',
        });
        setNewTech('');
        setEditFingerprintOpen(true);
    };

    const addTechStack = () => {
        if (
            newTech.trim() &&
            !editingFingerprint.tech_stack.includes(newTech.trim())
        ) {
            setEditingFingerprint((prev) => ({
                ...prev,
                tech_stack: [...prev.tech_stack, newTech.trim()],
            }));
            setNewTech('');
        }
    };

    const removeTechStack = (tech: string) => {
        setEditingFingerprint((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.filter((t) => t !== tech),
        }));
    };

    const handleSaveFingerprint = () => {
        setIsSavingFingerprint(true);
        router.put(
            `/station-master/${train.id}/fingerprint`,
            editingFingerprint,
            {
                onFinish: () => {
                    setIsSavingFingerprint(false);
                    setEditFingerprintOpen(false);
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            <Card className="border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        Project Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {markdownFiles.map((file) => (
                            <button
                                key={file.name}
                                onClick={() =>
                                    file.exists && setSelectedFile(file.name)
                                }
                                disabled={!file.exists}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                    file.exists
                                        ? 'cursor-pointer hover:bg-accent'
                                        : 'cursor-not-allowed opacity-40'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono">
                                        {file.name}
                                    </span>
                                    {file.exists && (
                                        <span className="text-xs text-muted-foreground">
                                            {Math.round(file.size / 1024)}KB
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {fingerprint && (
                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Brain className="h-5 w-5 text-primary" />
                                AI Analysis
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={openEditFingerprint}
                                aria-label="Edit AI analysis"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {fingerprint.core_purpose && (
                            <div>
                                <div className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
                                    Purpose
                                </div>
                                <p className="text-sm">
                                    {fingerprint.core_purpose}
                                </p>
                            </div>
                        )}
                        {fingerprint.tech_stack &&
                            fingerprint.tech_stack.length > 0 && (
                                <div>
                                    <div className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
                                        Tech Stack
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {fingerprint.tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        {fingerprint.current_state && (
                            <div>
                                <div className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
                                    State
                                </div>
                                <span className="text-sm font-medium capitalize">
                                    {fingerprint.current_state}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button
                data-ai-suggestions-btn
                onClick={handleGenerateSuggestions}
                disabled={isGenerating}
                className="w-full"
                variant="outline"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing with AI...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Schedule Suggestions
                    </>
                )}
            </Button>

            {/* Suggestions Preview Dialog */}
            <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
                <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Schedule Suggestions
                        </DialogTitle>
                        <DialogDescription>
                            Review and select the milestones and tasks you want
                            to add to your project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 space-y-6 overflow-y-auto py-4">
                        {suggestions?.milestones &&
                            suggestions.milestones.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                        Milestones
                                    </h3>
                                    {suggestions.milestones.map(
                                        (milestone, mIndex) => (
                                            <div
                                                key={mIndex}
                                                className={`rounded-lg border p-4 transition-opacity ${
                                                    milestone.selected
                                                        ? 'border-primary/50 bg-primary/5'
                                                        : 'opacity-50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Checkbox
                                                        checked={
                                                            milestone.selected
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleMilestone(
                                                                mIndex,
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <span className="font-medium">
                                                                {
                                                                    milestone.title
                                                                }
                                                            </span>
                                                            {milestone.due_date && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    <Calendar className="mr-1 h-3 w-3" />
                                                                    {new Date(
                                                                        milestone.due_date,
                                                                    ).toLocaleDateString()}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {milestone.description && (
                                                            <p className="mb-3 text-sm text-muted-foreground">
                                                                {
                                                                    milestone.description
                                                                }
                                                            </p>
                                                        )}

                                                        {milestone.tasks &&
                                                            milestone.tasks
                                                                .length > 0 && (
                                                                <div className="mt-3 space-y-2 border-l-2 border-border pl-2">
                                                                    {milestone.tasks.map(
                                                                        (
                                                                            task,
                                                                            tIndex,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    tIndex
                                                                                }
                                                                                className={`flex items-start gap-2 rounded p-2 ${
                                                                                    task.selected &&
                                                                                    milestone.selected
                                                                                        ? 'bg-background'
                                                                                        : 'opacity-50'
                                                                                }`}
                                                                            >
                                                                                <Checkbox
                                                                                    checked={
                                                                                        task.selected &&
                                                                                        milestone.selected
                                                                                    }
                                                                                    onCheckedChange={() =>
                                                                                        toggleTask(
                                                                                            mIndex,
                                                                                            tIndex,
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        !milestone.selected
                                                                                    }
                                                                                    className="mt-0.5"
                                                                                />
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <CheckCircle2
                                                                                            className={`h-3.5 w-3.5 ${priorityColor(task.priority)}`}
                                                                                        />
                                                                                        <span className="text-sm">
                                                                                            {
                                                                                                task.title
                                                                                            }
                                                                                        </span>
                                                                                        <Badge
                                                                                            variant="secondary"
                                                                                            className="text-xs"
                                                                                        >
                                                                                            {
                                                                                                task.priority
                                                                                            }
                                                                                        </Badge>
                                                                                    </div>
                                                                                    {task.description && (
                                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                                            {
                                                                                                task.description
                                                                                            }
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                        {suggestions?.loose_tasks &&
                            suggestions.loose_tasks.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                        Additional Tasks
                                    </h3>
                                    {suggestions.loose_tasks.map(
                                        (task, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start gap-3 rounded-lg border p-3 ${
                                                    task.selected
                                                        ? 'border-primary/50 bg-primary/5'
                                                        : 'opacity-50'
                                                }`}
                                            >
                                                <Checkbox
                                                    checked={task.selected}
                                                    onCheckedChange={() =>
                                                        toggleLooseTask(index)
                                                    }
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2
                                                            className={`h-3.5 w-3.5 ${priorityColor(task.priority)}`}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {task.title}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                    {task.description && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    <DialogFooter className="border-t pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowSuggestions(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApplySuggestions}
                            disabled={isApplying}
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                'Apply Selected'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!selectedFile}
                onOpenChange={(open) => !open && setSelectedFile(null)}
            >
                <DialogContent className="max-h-[80vh] max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="font-mono">
                            {selectedFile}
                        </DialogTitle>
                        <DialogDescription>
                            View and edit project documentation
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[50vh] overflow-y-auto">
                        {isEditing ? (
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="h-[400px] w-full resize-none rounded-md border-0 bg-muted p-4 font-mono text-sm focus:ring-2 focus:ring-primary"
                            />
                        ) : (
                            <pre className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
                                {fileContent || 'No content'}
                            </pre>
                        )}
                    </div>
                    <DialogFooter>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditContent(fileContent);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit AI Analysis Dialog */}
            <Dialog
                open={editFingerprintOpen}
                onOpenChange={setEditFingerprintOpen}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Edit AI Analysis
                        </DialogTitle>
                        <DialogDescription>
                            Correct the AI-generated analysis if it's
                            inaccurate.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="core_purpose">Purpose</Label>
                            <Textarea
                                id="core_purpose"
                                value={editingFingerprint.core_purpose}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                    setEditingFingerprint((prev) => ({
                                        ...prev,
                                        core_purpose: e.target.value,
                                    }))
                                }
                                placeholder="What is this project for?"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tech Stack</Label>
                            <div className="mb-2 flex flex-wrap gap-1">
                                {editingFingerprint.tech_stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTechStack(tech)
                                            }
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    placeholder="Add technology..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTechStack();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addTechStack}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="current_state">Project State</Label>
                            <Select
                                value={editingFingerprint.current_state}
                                onValueChange={(
                                    value:
                                        | 'draft'
                                        | 'mvp'
                                        | 'maintenance'
                                        | 'abandoned',
                                ) =>
                                    setEditingFingerprint((prev) => ({
                                        ...prev,
                                        current_state: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="mvp">MVP</SelectItem>
                                    <SelectItem value="maintenance">
                                        Maintenance
                                    </SelectItem>
                                    <SelectItem value="abandoned">
                                        Abandoned
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditFingerprintOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveFingerprint}
                            disabled={isSavingFingerprint}
                        >
                            {isSavingFingerprint ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
