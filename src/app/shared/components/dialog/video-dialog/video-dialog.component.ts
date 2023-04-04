import { Component, Inject, OnInit } from '@angular/core';
// tslint:disable-next-line:ordered-imports
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttachmentService } from '../../../services/data/attachment.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'iihf-video-dialog',
    templateUrl: './video-dialog.component.html',
    styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit{
    src: string | ArrayBuffer = ''

    public constructor(
        public dialogRef: MatDialogRef<VideoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly attachmentService: AttachmentService,
        private readonly notificationService: NotificationService,
    ) {

    }

    ngOnInit(): void {
        this.loadDocument(this.data.video)
    }

    public close(): void {
        this.dialogRef.close();
    }

    private loadDocument(filePath: string): void {
        this.attachmentService.getAttachment(filePath)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.src = reader.result;
                };
                reader.readAsDataURL(blob);
            }, (): void => {
                this.notificationService.openErrorNotification('error.attachmentDownload');
            });
    }
}
