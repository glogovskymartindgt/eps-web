import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[dragDrop]'
})
export class DragDropDirective {

    @Output() public onFileDropped = new EventEmitter<any>();

    @HostListener('dragover', ['$event'])
    public onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('drop', ['$event'])
    public ondrop(event) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.onFileDropped.emit(files);
        }
    }

}
