import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
    title?: string;
    message?: string;
    confirmationButtonText: string;
    rejectionButtonText: string;
}

@Component({
  selector: 'iihf-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    public constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    public ngOnInit(): any {
    }

    public onCancel(): void {
    this.dialogRef.close();
    }

}
