import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CommentType } from '../../enums/comment-type.enum';
import { Role } from '../../enums/role.enum';
import { Regex } from '../../hazelnut/hazelnut-common/regex/regex';
import { CommentResponse } from '../../interfaces/task-comment.interface';
import { AuthService } from '../../services/auth.service';
import { AttachmentService } from '../../services/data/attachment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { ProjectUserService } from '../../services/storage/project-user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ImageDialogComponent } from '../dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from '../dialog/pdf-dialog/pdf-dialog.component';

@Component({
    selector: 'iihf-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    @Input() public comment: CommentResponse;
    @Input() public index: number;

    @Output() public readonly delete: EventEmitter<void> = new EventEmitter<void>();

    public isMyComment = false;
    public imageSrc;
    public pdfSrc;
    public pdfSrcSanitized;

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
            if (this.comment.attachment.format === 'PDF') {
                this.loadPdf();
            } else {
                this.loadImage();
            }
        }

        this.projectUserService.subject.userId.subscribe((userId: number): void => {
            this.isMyComment = userId === this.comment.createdBy.id;
        });
    }

    public openPreviewAttachment(image): void {
        this.matDialog.open(ImageDialogComponent, {
            data: {
                image
            }
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

    private loadPdf(): void {
        this.attachmentService.getAttachment(this.comment.attachment.filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.pdfSrc = reader.result;
                    this.pdfSrcSanitized = this.domSanitizer.bypassSecurityTrustUrl(reader.result as string);
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
}
