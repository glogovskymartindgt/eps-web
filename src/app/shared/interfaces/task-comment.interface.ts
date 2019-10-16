import { UserDataComment } from './user-data-comment.interface';

export type TaskType = 'TEXT' | 'ATTACHMENT'| 'URL' | 'NOTIFICATION';

export interface TaskAttachment {
    type: string;
    format: string;
    fileName: string;
    filePath: string;
}

export interface TaskComment {
    description: string;
    taskId: number;
    type: TaskType;
    attachment?: TaskAttachment;
}

export interface TaskCommentResponse extends TaskComment {
    id: number;
    createdBy: UserDataComment;
    created: string;
}
