import { CommentType } from '../enums/comment-type.enum';
import { UserDataComment } from './user-data-comment.interface';

export interface CommentAttachment {
    type: string;
    format: string;
    fileName: string;
    filePath: string;
}

export interface TaskComment {
    description: string;
    taskId: number;
    type: CommentType;
    attachment?: CommentAttachment;
}

export interface ActionPointComment {
    description: string;
    actionPointId: number;
    type: CommentType;
    attachment?: CommentAttachment;
}

export interface TaskCommentResponse extends TaskComment {
    id: number;
    createdBy: UserDataComment;
    created: string;
}
