import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../../shared/components/dialog/image-dialog/image-dialog.component';
import { CommentType } from '../../../shared/enums/comment-type.enum';
import { TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
import { ImagesService } from '../../../shared/services/data/images.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'task-comment',
    templateUrl: './task-comment.component.html',
    styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

    @Input() public comment: TaskCommentResponse;
    @Input() public index: number;

    public isMyComment = false;
    public imageSrc;

    public constructor(private readonly projectUserService: ProjectUserService,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly matDialog: MatDialog) {
    }

    public ngOnInit() {
        if (this.comment.attachment) {
            this.imagesService.getImage(this.comment.attachment.filePath)
                .subscribe((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imageSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        }

        this.projectUserService.subject.userId.subscribe((userId) => {
            this.isMyComment = userId === this.comment.createdBy.id;
        });
    }

    public openPreviewAttachment(image) {
        this.matDialog.open(ImageDialogComponent, {
            data: {
                image
            }
        });
    }

    public commentIsAttachment(): boolean {
        return this.comment.type === CommentType.Attachment;
    }

    public commentIsUrl(): boolean {
        return this.comment.type === CommentType.Url;
    }

    public commentIsText(): boolean {
        return this.comment.type === CommentType.Text;
    }

    /**
     * YouTube url consist of https://www.youtube.com/watch?v=<video-id>&optional parameters..., so we extract id
     * @returns {string}
     */
    public getVideoId(): string {
        return this.comment.description.split('v=')[1].split('&')[0];
    }

    public openUrl() {
        window.open(this.comment.description, '_blank');
    }
}
