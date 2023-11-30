export interface Task {
    type: string;
    title: string;
    description: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    subtasks?: Task[];
    attachments?: string[];
    tags?: string[];
    status: string;
}

export class TaskClass implements Task {
    type: string;
    title: string;
    description: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    subtasks?: Task[];
    attachments?: string[];
    tags?: string[];
    status: string;

    constructor(taskData: Task) {
        this.type = taskData.type;
        this.title = taskData.title;
        this.description = taskData.description;
        this.dueDate = taskData.dueDate;
        this.priority = taskData.priority;
        this.subtasks = taskData.subtasks;
        this.attachments = taskData.attachments;
        this.tags = taskData.tags;
        this.status = taskData.status;
    }

    markAsCompleted(): void {
        this.status = "completed";
    }
}