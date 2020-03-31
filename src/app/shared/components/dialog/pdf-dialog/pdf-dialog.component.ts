import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'iihf-pdf-dialog',
    templateUrl: './pdf-dialog.component.html',
    styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent {
    public zoom = 1;
    public zoomChange = 0.1;

    public constructor(public dialogRef: MatDialogRef<PdfDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    public close(): void {
        this.dialogRef.close();
    }

    public zoomIn(): void {
        const minimalZoom = 0.21;
        if (this.zoom > minimalZoom) {
            this.zoom -= this.zoomChange;
        }
    }

    public zoomOut(): void {
        this.zoom += this.zoomChange;
    }

}
