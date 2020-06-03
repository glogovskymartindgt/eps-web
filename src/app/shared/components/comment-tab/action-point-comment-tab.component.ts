import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommentType } from '../../enums/comment-type.enum';
import { ActionPointComment, CommentResponse } from '../../interfaces/task-comment.interface';
import { CommentService } from '../../services/comment.service';
import { AttachmentService } from '../../services/data/attachment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { CommentTabComponent } from './comment-tab.component';

@Component({
    selector: 'iihf-action-point-comment-tab',
    templateUrl: './comment-tab.component.html',
    styleUrls: ['./comment-tab.component.scss']
})
export class ActionPointCommentTabComponent extends CommentTabComponent implements OnInit {

    private actionPointId: number;

    public constructor(
        protected readonly activatedRoute: ActivatedRoute,
        protected readonly attachmentService: AttachmentService,
        protected readonly commentService: CommentService,
        protected readonly formBuilder: FormBuilder,
        protected readonly imagesService: ImagesService,
        protected readonly notificationService: NotificationService,
    ) {
        super(commentService, formBuilder, imagesService, attachmentService, notificationService);
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {

            this.actionPointId = param.id;
            this.getAllComments();

        });
        super.ngOnInit();
    }

    public onAttachmentAdded(): void {
        const actionPointComment: ActionPointComment = {
            description: '',
            actionPointId: this.actionPointId,
            type: CommentType.Attachment,
            attachment: {
                type: 'COMMENT',
                format: this.attachmentFormat,
                fileName: this.attachmentFileName,
                filePath: this.attachmentPathName
            }
        };

        this.onSendCommentService(actionPointComment);
    }

    public getAllComments(): void {
        this.loading = true;
        this.commentService.getAllComment(this.actionPointId, 'actionPoint')
            .pipe(finalize((): any => this.loading = false))
            .subscribe((comments: CommentResponse[]): void => {
                this.comments = [...comments].sort((comparableCommentTaskResponse: CommentResponse,
                                                    comparedCommentTaskResponse: CommentResponse): number => (comparableCommentTaskResponse.created >
                    comparedCommentTaskResponse.created) ? 1 : -1)
                    .reverse();
            }, (): void => {
                this.notificationService.openErrorNotification('error.loadComments');
            });
    }

    protected sendTextMessage(comment: string): void {
        const actionPointComment: ActionPointComment = {
            description: comment,
            actionPointId: this.actionPointId,
            type: CommentType.Text
        };
        this.onSendCommentService(actionPointComment);
    }

    protected sendUrlMessage(comment: string): void {
        const actionPointComment: ActionPointComment = {
            description: comment,
            actionPointId: this.actionPointId,
            type: CommentType.Url
        };
        this.onSendCommentService(actionPointComment);
    }
}
