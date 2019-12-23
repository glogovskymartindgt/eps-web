import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[dragDrop]'
})
export class DragDropDirective {

    @Output() public readonly onFileDropped = new EventEmitter<any>();

    @HostListener('dragover', ['$event'])
    public onDragOver(event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('drop', ['$event'])
    public ondrop(event): void {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.onFileDropped.emit(files);
        }
    }

}
