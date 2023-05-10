import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Attachment } from '../../interfaces/attachment.interface';
import { AttachmentService } from '../../services/data/attachment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { BlobManager } from '../../utils/blob-manager';
import { ImageDialogComponent } from '../dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from '../dialog/pdf-dialog/pdf-dialog.component';
import { VideoDialogComponent } from '../dialog/video-dialog/video-dialog.component';

@Component({
  selector: 'iihf-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
    @Output() readonly deleteAttachment: EventEmitter<number> = new EventEmitter<number>()
    public _attachments: Attachment[] = [];
    public src = [];

    allowedImages = ['JPG', 'JPEG', 'PNG'];
    allowedVideos = ['MP4', 'MPEG'];
    allowedDocuments = ['ZIP', 'PDF', 'CSV', 'TXT', 'XLS', 'XLSX', 'DOC', 'DOCX'];

    constructor(
        private readonly attachmentService: AttachmentService,
        private readonly domSanitizer: DomSanitizer,
        private readonly imagesService: ImagesService,
        private readonly notificationService: NotificationService,
        private readonly matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {

    }

    @Input()
    public set attachments(attachments: Attachment[]) {
        if (attachments) {
            this._attachments = attachments
            this._attachments.map((attachment: Attachment, index: number) => {
                if (this.isImage(attachment.format)) {
                    this.loadImage(attachment.filePath, index)
                }
                if (this.isDocument(attachment.format)) {
                    this.loadDocument(attachment.filePath, index)
                }
            })
        }
    }
    public onDeleteAttachment(id: number) {
        this.deleteAttachment.next(id)
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

    /**
     * Is filetype Image
     * @param format
     */
    public isImage(format: string) {
        return this.allowedImages.includes(format)
    }

    /**
     * Is filetype Video
     * @param format
     */
    public isVideo(format: string) {
        return this.allowedVideos.includes(format)
    }

    /**
     * Is filetype Document
     * @param format
     */
    public isDocument(format: string) {
        return this.allowedDocuments.includes(format)
    }

    /**
     * Is filetype PDF
     * @param format
     */
    public isPdf(format: string) {
        return format === 'PDF'
    }

    /**
     * Whether attachment has a preview class
     * @param format
     */
    public hasPreview(format: string): boolean {
        return this.isImage(format) || this.isVideo(format) || this.isPdf(format)
    }

    /**
     * Sanitize url string
     * @param url
     */
    public sanitize(url:string): SafeUrl{
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

    /**
     * Download video from BLOB
     * @param attachment
     */
    public downloadVideo(attachment: Attachment) {
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

    /**
     * Load image attachment
     * @param filePath
     * @param index
     * @private
     */
    private loadImage(filePath: string, index: number): void {
        this.imagesService.getImage(filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.src[index] = reader.result;
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

    /**
     * Load Document and Video attachments
     * @param filePath
     * @param index
     * @private
     */
    private loadDocument(filePath: string, index: number): void {
        this.attachmentService.getAttachment(filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.src[index] = reader.result;
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.attachmentDownload');
            });
    }

}
