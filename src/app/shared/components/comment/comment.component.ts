import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommentType } from '../../enums/comment-type.enum';
import { Regex } from '../../hazlenut/hazelnut-common/regex/regex';
import { TaskCommentResponse } from '../../interfaces/task-comment.interface';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { ProjectUserService } from '../../services/storage/project-user.service';
import { ImageDialogComponent } from '../dialog/image-dialog/image-dialog.component';

@Component({
    selector: 'iihf-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

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

    public commentIsYoutubeUrl(): boolean {
        return RegExp(Regex.youtubeLinkPattern)
            .test(this.comment.description);
    }

    public commentIsText(): boolean {
        return this.comment.type === CommentType.Text;
    }

    /**
     * YouTube url consist of https://www.youtube.com/watch?v=<video-id>&optional parameters..., so we extract id
     * @returns {string}
     */
    public getVideoId(): string {
        const splitUrlByVideId = this.comment.description.split('v=');
        if (splitUrlByVideId.length < 2) {
            return;
        }
        return splitUrlByVideId[1].split('&')[0];
    }

    public openUrl() {
        window.open(this.comment.description, '_blank');
    }
}
