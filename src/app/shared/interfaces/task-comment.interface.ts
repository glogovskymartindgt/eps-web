import { UserDataComment } from './user-data-comment.interface';

export interface TaskComment {
    description: string;
    taskId: number;
}

export interface TaskCommentResponse extends TaskComment {
    id: number;
    createdBy: UserDataComment;
    created: string;
}
