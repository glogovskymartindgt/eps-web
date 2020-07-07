import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

let idCounter = 1;

@Component({
    selector: 'iihf-drag-drop-box',
    templateUrl: './drag-drop-box.component.html',
    styleUrls: ['./drag-drop-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragDropBoxComponent {
    public readonly id = idCounter++;
    @Input() public edit: boolean;
    @Input() public labelKey: string;
    @Input() public supportedFileTypes?: string[] = null;
    @Input() public maximumFileSize?: number = null;
    @Output() public readonly unsupportedFileType: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public readonly maximumSizeExceeded: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public readonly fileUpload: EventEmitter<any> = new EventEmitter<any>();

    public constructor() {
    }

    public get acceptedFileTypes(): string {
        return this.supportedFileTypes.join(',');
    }

    public onDropped(files: File[]): void {
        const file: File = files[0];
        this.processFile(file);
    }

    public onInserted(event: any): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.processFile(file);
    }

    public resetInput(event: MouseEvent): void {
        (event.target as any).value = null;
    }

    private processFile(file: File): void {
        if (!!this.maximumFileSize && file.size > this.maximumFileSize) {
            this.maximumSizeExceeded.emit(true);

            return;
        }

        if (this.supportedFileTypes && !this.supportedFileTypes.includes(file.type)) {
            this.unsupportedFileType.emit(true);

            return;
        }

        this.fileEmit(file);
    }

    private fileEmit(file: File): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.fileUpload.emit({content: reader.result, fileName: file.name, blobPart: file});
        };
        reader.readAsDataURL(file);
    }

}
