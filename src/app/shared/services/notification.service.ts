import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotificationSnackBarComponent, NotificationWrapper } from '../hazlenut/small-components/notifications';
import { NotificationType } from '../hazlenut/small-components/notifications/notification-type.enum';

const DEFAULT_DURATION = 5000;

interface NotificationParameters {
    message: string;
    buttonText?: string;
    duration?: number;
    type?: NotificationType;
    template?: TemplateRef<any>;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements NotificationWrapper {

    public constructor(private readonly snackBar: MatSnackBar,
                       private readonly translateService: TranslateService) {
    }

    public openErrorNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification('snack-error', {message, type: NotificationType.ERROR});
    }

    public openInfoNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification('snack-info', {message, type: NotificationType.WARNING});
    }

    public openSuccessNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.openNotification('snack-success', {message, type: NotificationType.SUCCESS});
    }

    private openNotification(styleClass: string, {type, message, duration = DEFAULT_DURATION}: NotificationParameters): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.snackBar.openFromComponent(NotificationSnackBarComponent, {
            duration,
            data: {type, message: this.translateService.instant(message)},
            panelClass: [styleClass]
        });
    }
}
