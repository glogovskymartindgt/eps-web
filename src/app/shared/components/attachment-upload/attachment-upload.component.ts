import { FocusMonitor } from '@angular/cdk/a11y';
import { HttpErrorResponse } from '@angular/common/http';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Input,
    Optional,
    Output,
    Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '@hazelnut';
import { CustomInputComponent } from 'hazelnut';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AttachmentFormat } from '../../enums/attachment-format.enum';
import { AttachmentType } from '../../enums/attachment-type.enum';
import { AttachmentDetail } from '../../models/attachment-detail.model';
import { AttachmentService } from '../../services/data/attachment.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'iihf-attachment-upload',
    templateUrl: './attachment-upload.component.html',
    styleUrls: ['./attachment-upload.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: AttachmentUploadComponent,
        },

    ],
})
export class AttachmentUploadComponent extends CustomInputComponent<AttachmentDetail> {

    @Input()
    public maximumFileSize: number;
    @Input()
    public dragDropLabelKey: string;

    @Output()
    public readonly unsupportedFileType: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public readonly maximumFileSizeExceeded: EventEmitter<void> = new EventEmitter<void>();

    public attachment: AttachmentDetail = null;

    public readonly controlType: string = 'attachment-upload';
    @HostBinding()
    public readonly id: string = `attachment-upload-${AttachmentUploadComponent.nextId++}`;
    public value: AttachmentDetail;

    private _disabled = false;

    public constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly focusMonitor: FocusMonitor,
        @Optional() @Self() public ngControl: NgControl,
        @Inject(TRANSLATE_WRAPPER_TOKEN) private readonly translateService: TranslateWrapper,
        private readonly attachmentService: AttachmentService,
        private readonly notificationService: NotificationService,
    ) {
        super(elementRef, focusMonitor, ngControl);
    }

    @Input()
    public get disabled(): boolean {
        return this._disabled;
    }

    public set disabled(disabled: boolean) {
        this._disabled = disabled;
        this.stateChanges.next();
    }

    public get empty(): boolean {
        return !this.attachment;
    }

    public writeValue(value: AttachmentDetail): void {
        this.attachment = value;

        if (!this.attachment) {
            return;
        }

        this.attachmentService.getAttachment(this.attachment.filePath)
            .pipe(catchError((error: HttpErrorResponse): Observable<any> => {
                this.notificationService.openErrorNotification('error.attachmentDownload');

                return of(null);
            }))
            .subscribe((blob: Blob): void => {
                this.createPdfFromBlob(blob);
            });
    }

    @HostListener('click')
    public onContainerClick(event: MouseEvent): void {
    }

    public attachmentUpload(file: { fileName: string, blobPart: File, content: string }): void {
        const fileName: string = file.fileName;

        let fileFormat: AttachmentFormat = AttachmentFormat.Empty;
        if (file.blobPart.type === 'application/pdf') {
            fileFormat = AttachmentFormat.Pdf;
        }

        this.attachmentService.uploadAttachment([file.blobPart])
            .subscribe((response: { fileNames: object }): void => {
                this.attachment = {
                    filePath: response.fileNames[fileName],
                    source: file.content,
                    fileName: fileName,
                    type: AttachmentType.Document,
                    format: fileFormat,
                };

                this.updateValue(this.attachment);
            });
    }

    public attachmentRemove(): void {
        this.attachment = null;
        this.updateValue(this.attachment);
    }

    public onUnsupportedFiletype(): void {
        this.unsupportedFileType.emit();
    }

    public onMaximumFileSizedExceeded(): void {
        this.maximumFileSizeExceeded.emit();
    }

    private updateValue(attachment: AttachmentDetail): void {
        this.onChange(attachment);
        this.onTouched(attachment);
        this.stateChanges.next();
    }

    private createPdfFromBlob(attachment: Blob): any {

        const reader = new FileReader();
        const readerImage = null;
        reader.addEventListener('load', (): void => {
            this.attachment.source = reader.result as string;
        }, false);
        if (attachment) {
            reader.readAsDataURL(attachment);
        }

        return readerImage;
    }

}
