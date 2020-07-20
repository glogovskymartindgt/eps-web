import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeEnterLeave } from '@hazelnut';
import { PdfDialogComponent } from '../dialog/pdf-dialog/pdf-dialog.component';

@Component({
    selector: 'iihf-pdf',
    templateUrl: './pdf.component.html',
    styleUrls: ['./pdf.component.scss'],
    animations: [
        fadeEnterLeave
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfComponent {
    @Input() public src: string = null;
    @Input() public alt: string;
    @Input() public border: boolean;
    @ViewChild('imageTemplate', {static: true}) public imageTemplate: TemplateRef<HTMLDivElement>;

    public constructor(
        private readonly dialog: MatDialog,
    ) {
    }

    public openDialog(): void {
        this.dialog.open(PdfDialogComponent, {
            maxHeight: '90vh',
            minHeight: '90vh',
            maxWidth: '80vw',
            minWidth: '80vw',
            panelClass: 'image-dialog',
            data: {
                source: this.src
            }
        });
    }

    public stopPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }

    public pdfZoom(pdfWindow: any): number {
        const parentHeight = pdfWindow.element.nativeElement.parentElement.clientHeight;
        const defHeight = 70;

        return parentHeight / defHeight;
    }

    /**
     * Trigger a change detection cycle on pdf page rendered, to recalculate pdfZoom
     */
    public pdfRendered(): void {
    }
}
