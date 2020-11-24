import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeleteButtonOptions } from '../../models/delete-button-options.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'iihf-delete-button',
    templateUrl: './delete-button.component.html',
    styleUrls: ['./delete-button.component.scss'],
})
export class DeleteButtonComponent {

    @Input()
    public options: DeleteButtonOptions;

    @Input()
    public color: ThemePalette;

    public constructor(
        private readonly matDialog: MatDialog,
        private readonly translateService: TranslateService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
    ) {
    }

    public onDelete(): void {
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant(this.options.titleKey),
                message: this.translateService.instant(this.options.messageKey),
                rejectionButtonText: this.translateService.instant(this.options.rejectionButtonKey),
                confirmationButtonText: this.translateService.instant(this.options.confirmationButtonKey)
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {

                if (!result) {
                    return;
                }

                this.options.deleteApiCall
                    .subscribe(
                        (): void => {
                            this.notificationService.openSuccessNotification('success.delete');
                            this.router.navigate(this.options.redirectRoute);
                        }, (): void => {
                            this.notificationService.openErrorNotification('error.delete');
                        }
                    );
            });
    }
}
