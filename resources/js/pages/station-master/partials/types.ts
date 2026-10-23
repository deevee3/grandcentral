export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assigned_crew: string | null;
    milestone_id: number | null;
}

export interface Milestone {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    status: 'pending' | 'completed' | 'missed';
    tasks: Task[];
}

export interface Train {
    id: number;
    name: string;
    path: string;
    status: 'on_time' | 'delayed' | 'in_yard';
    platform: string | null;
    last_departure: string | null;
}

export interface MarkdownFile {
    name: string;
    exists: boolean;
    size: number;
}

export interface ProjectFingerprint {
    id: number;
    train_id: number;
    core_purpose: string | null;
    tech_stack: string[];
    current_state: 'draft' | 'mvp' | 'maintenance' | 'abandoned';
    summary: string | null;
    last_analyzed_at: string | null;
}

export interface Props {
    train: Train;
    milestones: Milestone[];
    looseTasks: Task[];
    markdownFiles: MarkdownFile[];
    fingerprint: ProjectFingerprint | null;
}
