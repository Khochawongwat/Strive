export interface Task {
    _id: string;
    description: string;
    dueDate?: Date;
    priority: number;
    subtasks?: TaskClass[];
    attachments?: string[];
    tags?: string[];
    status: number;
    parent: string | null;
}

export class TaskClass implements Task {
    _id: string;
    description: string;
    dueDate?: Date;
    priority: number;
    subtasks?: TaskClass[];
    attachments?: string[];
    tags?: string[];
    status: number;
    parent: string | null;

    constructor(taskData: Task) {
        this._id = taskData._id;
        this.description = taskData.description;
        this.dueDate = taskData.dueDate;
        this.priority = taskData.priority;
        this.subtasks = taskData.subtasks;
        this.attachments = taskData.attachments;
        this.tags = taskData.tags;
        this.status = taskData.status;
        this.parent = taskData.parent;
    }

    markAsCompleted(): void {
        this.status = 3;
    }
}