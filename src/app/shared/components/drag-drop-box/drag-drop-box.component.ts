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
    @Input() public add: boolean;
    @Input() public labelKey: string;
    @Input() public supportedFileTypes?: string[];
    @Output() public readonly unsupportedFileType: EventEmitter<any> = new EventEmitter<any>();
    @Output() public readonly fileUpload: EventEmitter<any> = new EventEmitter<any>();

    public constructor() {
    }

    public onDropped(files: File[]): void {
        const file: File = files[0];
        if (this.supportedFileTypes && !this.supportedFileTypes.includes(file.type)) {
            this.unsupportedFileType.emit(true);
        } else {
            this.unsupportedFileType.emit(false);
            this.fileEmit(file);
        }
    }

    public onInserted(event: any): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        if (this.supportedFileTypes && !this.supportedFileTypes.includes(file.type)) {
            this.unsupportedFileType.emit(true);
        } else {
            this.unsupportedFileType.emit(false);
            this.fileEmit(file);
        }
    }

    private fileEmit(file: File): void {
        if (![!!this.edit, !!this.add].includes(true)) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (): void => {
            this.fileUpload.emit({content: reader.result, fileName: file.name, blobPart: file});
        };
        reader.readAsDataURL(file);
    }

}
