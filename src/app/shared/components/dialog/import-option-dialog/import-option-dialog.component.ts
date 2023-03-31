import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListOption } from 'src/app/shared/interfaces/list-option.interface';

interface ImportDialogData {
  title?: string;
  message?: string;
  options: ListOption[]
  confirmationButtonText: string;
  rejectionButtonText: string;
}

@Component({
  selector: 'iihf-import-option-dialog',
  templateUrl: './import-option-dialog.component.html',
  styleUrls: ['./import-option-dialog.component.scss']
})
export class ImportOptionDialogComponent implements OnInit {

  selectedOption : ListOption = null

  public constructor(
    public dialogRef: MatDialogRef<ImportOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportDialogData) { }

  public ngOnInit(): any {
    this.selectedOption = this.data.options?.length > 0 ? this.data.options[0] : null
  }

  public onCancel(): void {
  this.dialogRef.close();
  }
}