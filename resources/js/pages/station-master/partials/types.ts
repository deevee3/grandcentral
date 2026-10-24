export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assigned_crew: string | null;
    milestone_id: number | null;
    mc_task_id?: number | null;
    completion_steps?: string | null;
    bot_dispatch_status?: string | null;
    bot_dispatch_reply?: string | null;
    bot_dispatched_at?: string | null;
}

export interface Milestone {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    status: 'pending' | 'completed' | 'missed';
    mc_milestone_id?: number | null;
    tasks: Task[];
}

export interface Train {
    id: number;
    name: string;
    path: string;
    status: 'on_time' | 'delayed' | 'in_yard';
    platform: string | null;
    last_departure: string | null;
    mc_project_id?: number | null;
    mc_project_title?: string | null;
    mc_synced_at?: string | null;
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

export interface McProjectOption {
    id: number;
    title: string;
    status: string;
    stage: string;
}

export interface McStatus {
    url: string;
    worker_reachable: boolean;
    authenticated: boolean;
    mode: 'live' | 'local_mirror' | 'disconnected';
    project_count: number;
    linked_trains_count: number;
}

export interface BotCrewMember {
    id: string;
    name: string;
    role: string;
    status: 'online' | 'standby' | 'offline';
    capabilities: string[];
}

export interface Props {
    train: Train;
    milestones: Milestone[];
    looseTasks: Task[];
    markdownFiles: MarkdownFile[];
    fingerprint: ProjectFingerprint | null;
    mcStatus: McStatus;
    mcProjects: McProjectOption[];
    suggestedMcProjectId: number | null;
    botRoster: BotCrewMember[];
    aiProvider: string;
}
