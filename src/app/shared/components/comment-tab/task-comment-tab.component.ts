import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommentType } from '../../enums/comment-type.enum';
import { CommentResponse, TaskComment } from '../../interfaces/task-comment.interface';
import { CommentService } from '../../services/comment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { CommentTabComponent } from './comment-tab.component';

@Component({
    selector: 'iihf-task-comment-tab',
    templateUrl: './comment-tab.component.html',
    styleUrls: ['./comment-tab.component.scss']
})
export class TaskCommentTabComponent extends CommentTabComponent implements OnInit {

    private taskId: number;

    public constructor(
        protected readonly activatedRoute: ActivatedRoute,
        protected readonly commentService: CommentService,
        protected readonly formBuilder: FormBuilder,
        protected readonly imagesService: ImagesService,
        protected readonly notificationService: NotificationService,
    ) {
        super(commentService, formBuilder, imagesService, notificationService);
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {

            this.taskId = param.id;
            this.getAllComments();

        });
        super.ngOnInit();
    }

    public onAttachmentAdded(): void {
        const taskComment: TaskComment = {
            description: '',
            taskId: this.taskId,
            type: CommentType.Attachment,
            attachment: {
                type: 'COMMENT',
                format: this.attachmentFormat,
                fileName: this.attachmentFileName,
                filePath: this.attachmentPathName
            }
        };

        this.onSendCommentService(taskComment);
    }

    public getAllComments(): void {
        this.loading = true;
        this.commentService.getAllComment(this.taskId, 'task')
            .pipe(finalize((): any => this.loading = false))
            .subscribe((comments: CommentResponse[]): any => {
                this.comments = [...comments].sort((taskCommentResponseComparable: CommentResponse, taskCommentResponseCompared: CommentResponse): any => {
                    return (taskCommentResponseComparable.created > taskCommentResponseCompared.created) ? 1 : -1;
                })
                    .reverse();
            }, (): void => {
                this.notificationService.openErrorNotification('error.loadComments');
            });
    }

    protected sendTextMessage(comment: string): void {
        const taskComment: TaskComment = {
            description: comment,
            taskId: this.taskId,
            type: CommentType.Text
        };
        this.onSendCommentService(taskComment);
    }

    protected sendUrlMessage(comment: string): void {
        const taskComment: TaskComment = {
            description: comment,
            taskId: this.taskId,
            type: CommentType.Url
        };
        this.onSendCommentService(taskComment);
    }
}
