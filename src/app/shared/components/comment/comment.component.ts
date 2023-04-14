import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CommentType } from '../../enums/comment-type.enum';
import { Role } from '../../enums/role.enum';
import { Regex } from '../../hazelnut/hazelnut-common/regex/regex';
import { Attachment } from '../../interfaces/attachment.interface';
import { CommentAttachment, CommentResponse } from '../../interfaces/task-comment.interface';
import { AuthService } from '../../services/auth.service';
import { ActionPointService } from '../../services/data/action-point.service';
import { AttachmentService } from '../../services/data/attachment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { ProjectUserService } from '../../services/storage/project-user.service';
import { BlobManager } from '../../utils/blob-manager';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ImageDialogComponent } from '../dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from '../dialog/pdf-dialog/pdf-dialog.component';
import { VideoDialogComponent } from '../dialog/video-dialog/video-dialog.component';

@Component({
    selector: 'iihf-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    @Input() public comment: CommentResponse;
    @Input() public index: number;
    @Input() public hasGroupIihfSupervisor: boolean;
    @Output() public readonly delete: EventEmitter<void> = new EventEmitter<void>();
    public isMyComment = false;
    public imageSrc;
    public documentSrc;
    public documentSrcSanitized;

    public constructor(
        private readonly authService: AuthService,
        private readonly attachmentService: AttachmentService,
        private readonly domSanitizer: DomSanitizer,
        private readonly projectUserService: ProjectUserService,
        private readonly imagesService: ImagesService,
        private readonly notificationService: NotificationService,
        private readonly matDialog: MatDialog,
        private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        if (this.comment.attachment) {
            if (this.isImage(this.comment.attachment.format)) {
                this.loadImage()
            }
            if (this.isDocument(this.comment.attachment.format)) {
                this.loadDocument()
            }
        }
        this.projectUserService.subject.userId.subscribe((userId: number): void => {
            this.isMyComment = userId === this.comment.createdBy.id;
        });
    }


    public openPreviewImage(image): void {
        this.matDialog.open(ImageDialogComponent, {
            data: { image }
        });
    }

    public openPreviewVideo(video): void {
        this.matDialog.open(VideoDialogComponent, {
            data: { video }
        });
    }

    public openPreviewPdf(pdf): void {
        this.matDialog.open(PdfDialogComponent, {
            maxHeight: '90vh',
            minHeight: '90vh',
            maxWidth: '80vw',
            minWidth: '80vw',
            data: {
                source: pdf,
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
    public getVideoId(): string | undefined {
        const splitUrlByVideoId = this.comment.description.split('v=');
        if (splitUrlByVideoId.length <= 1) {
            return;
        }

        return splitUrlByVideoId[1].split('&')[0];
    }

    public openUrl(): void {
        window.open(this.comment.description, '_blank');
    }

    public showDeleteButton(): boolean {
        if (this.authService.hasRole(Role.RoleDeleteComment)) {
            return true;
        }

        if (
            this.authService.hasRole(Role.RoleDeleteOwnComment)
            || this.authService.hasRole(Role.RoleDeleteOwnCommentInAssignProject)
        ) {
            return this.isMyComment;
        }

        if (this.hasGroupIihfSupervisor || this.isMyComment) {
            return true
        }

        return false;
    }

    public deleteComment(): void {
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant('confirmation.comment.title'),
                message: this.translateService.instant('confirmation.comment.message'),
                rejectionButtonText: this.translateService.instant('confirmation.comment.rejectButton'),
                confirmationButtonText: this.translateService.instant('confirmation.comment.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {

                if (!result) {
                    return;
                }

                this.delete.next();
            });
    }

    private loadDocument(): void {
        this.attachmentService.getAttachment(this.comment.attachment.filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.documentSrc = reader.result;
                    this.documentSrcSanitized = this.domSanitizer.bypassSecurityTrustUrl(reader.result as string);
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

    private loadImage(): void {
        this.imagesService.getImage(this.comment.attachment.filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.imageSrc = reader.result;
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

    /**
     * Is filetype Image
     * @param format
     */
    public isImage(format: string) {
        return ActionPointService.allowedImages.includes(format)
    }

    /**
     * Is filetype Video
     * @param format
     */
    public isVideo(format: string) {
        return ActionPointService.allowedVideos.includes(format)
    }

    /**
     * Is filetype Document
     * @param format
     */
    public isDocument(format: string) {
        return ActionPointService.allowedDocuments.includes(format)
    }

    /**
     * Is filetype PDF
     * @param format
     */
    public isPdf(format: string) {
        return format === 'PDF'
    }


    /**
     * Download video from BLOB
     * @param attachment
     */
    public downloadVideo(attachment: CommentAttachment) {
        this.attachmentService.getAttachment(attachment.filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    BlobManager.downloadFromBlob(blob, '', attachment.fileName);
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.attachmentDownload');
            });
    }
}
