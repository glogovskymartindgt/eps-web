export interface TaskComment {
    description: string;
    taskId: number;
}

export interface TaskCommentResponse extends TaskComment {
    id: number;
    createdBy: string;
    created: string;
}
