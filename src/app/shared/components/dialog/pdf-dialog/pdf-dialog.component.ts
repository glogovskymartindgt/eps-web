import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'pdf-dialog',
    templateUrl: './pdf-dialog.component.html',
    styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent {

    public zoom = 1;

    public constructor(public dialogRef: MatDialogRef<PdfDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    public close(): void {
        this.dialogRef.close();
    }

    public zoomIn(): void {
        if (this.zoom > 0.21) {
            this.zoom -= 0.1;
        }
    }

    public zoomOut(): void {
        this.zoom += 0.1;
    }

}
