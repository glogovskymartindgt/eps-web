import { FocusMonitor } from '@angular/cdk/a11y';
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
export class AttachmentUploadComponent extends CustomInputComponent<AttachmentDetail[]> {

    @Input()
    public maximumFileSize: number;
    @Input()
    public dragDropLabelKey: string;
    @Input()
    public multiple: boolean = false;
    @Input()
    public showAll: boolean = true;

    @Output()
    public readonly unsupportedFileType: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public readonly maximumFileSizeExceeded: EventEmitter<void> = new EventEmitter<void>();

    public readonly controlType: string = 'attachment-upload';
    @HostBinding()
    public readonly id: string = `attachment-upload-${AttachmentUploadComponent.nextId++}`;
    public value: AttachmentDetail[];

    private attachments: AttachmentDetail[] = [];
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
        return this.attachments.length === 0;
    }

    public get displayedAttachments(): AttachmentDetail[] {
        if (this.showAll) {
            return this.attachments;
        }

        return this.attachments.length > 0 ? [this.attachments[0]] : [];
    }

    public writeValue(value: AttachmentDetail[]): void {
        this.attachments = value || [];

        if (this.attachments.length === 0) {
            return;
        }

        this.attachments.forEach((attachment: AttachmentDetail): void => {
            this.attachmentService.getAttachment(attachment.filePath)
                .pipe(catchError((): Observable<any> => {
                    this.notificationService.openErrorNotification('error.attachmentDownload');

                    return of(null);
                }))
                .subscribe((blob: Blob): void => {
                    this.createPdfFromBlob(blob, attachment);
                });
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
                this.attachments.unshift({
                    filePath: response.fileNames[fileName],
                    source: file.content,
                    fileName: fileName,
                    type: AttachmentType.Document,
                    format: fileFormat,
                });

                this.updateValue(this.attachments);
            });
    }

    public attachmentRemove(attachment: AttachmentDetail): void {
        this.attachments = this.attachments.filter((item: AttachmentDetail): boolean => item.filePath !== attachment.filePath);
        this.updateValue(this.attachments);
    }

    public onUnsupportedFiletype(): void {
        this.unsupportedFileType.emit();
    }

    public onMaximumFileSizedExceeded(): void {
        this.maximumFileSizeExceeded.emit();
    }

    private updateValue(attachments: AttachmentDetail[]): void {
        this.onChange(attachments);
        this.onTouched(attachments);
        this.stateChanges.next();
    }

    private createPdfFromBlob(attachmentSource: Blob, attachment: AttachmentDetail): any {

        const reader = new FileReader();
        const readerImage = null;
        reader.addEventListener('load', (): void => {
            attachment.source = reader.result as string;
        }, false);
        if (attachment) {
            reader.readAsDataURL(attachmentSource);
        }

        return readerImage;
    }

}
