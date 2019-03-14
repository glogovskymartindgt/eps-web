import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotificationSnackBarComponent, NotificationWrapper } from '../hazlenut/small-components/notifications';
import { NotificationType } from '../hazlenut/small-components/notifications/notification-type.enum';

const DEFAULT_DURATION = 5000;

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements NotificationWrapper {

    public constructor(private readonly snackBar: MatSnackBar,
                       private readonly translateService: TranslateService) {
    }

    public openErrorNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification(message, NotificationType.ERROR);
    }

    public openInfoNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification(message, NotificationType.WARNING);
    }

    public openSuccessNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification(message, NotificationType.SUCCESS);
    }

    private openNotification(message: any, type: NotificationType): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.snackBar.openFromComponent(NotificationSnackBarComponent, {
            duration: DEFAULT_DURATION,
            data: {
                type,
                message: this.translateService.instant(message),
            }
        });
    }
}
