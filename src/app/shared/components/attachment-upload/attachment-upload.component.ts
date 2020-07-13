import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Inject, Input, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '@hazelnut';
import { AttachmentFormat } from '../../enums/attachment-format.enum';
import { AttachmentType } from '../../enums/attachment-type.enum';
import { AttachmentDetail } from '../../models/attachment-detail.model';
import { AttachmentService } from '../../services/data/attachment.service';
import { CustomInputComponent } from './custom-input.component';

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
        return this.attachment === null;
    }

    public writeValue(value: any): void {
        // this.selectSearchControl.setValue(value);
    }

    public onContainerClick(event: MouseEvent): void {
        this.onTouched({});
        this.stateChanges.next();
    }

    public attachmentUpload(file: any): void {
        const fileName: string = file.fileName;

        this.attachmentService.uploadAttachment([file.blobPart])
            .subscribe((response: { fileNames: object }): void => {
                this.attachment = {
                    filePath: response.fileNames[fileName],
                    source: file.content,
                    fileName,
                    type: AttachmentType.Document,
                    format: AttachmentFormat.Pdf,
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

}
