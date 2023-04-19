import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListOption } from 'src/app/shared/interfaces/list-option.interface';

interface OptionDialogData {
  title?: string;
  message?: string;
  options: ListOption[]
  confirmationButtonText: string;
  rejectionButtonText: string;
}

@Component({
  selector: 'iihf-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.scss']
})
export class OptionDialogComponent implements OnInit {

  selectedOption : ListOption = null

  public constructor(
    public dialogRef: MatDialogRef<OptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OptionDialogData) { }

  public ngOnInit(): any {
    this.selectedOption = this.data.options?.length > 0 ? this.data.options[0] : null
  }

  public onCancel(): void {
  this.dialogRef.close();
  }
}