import { Injectable, NgZone, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotificationSnackBarComponent, NotificationWrapper } from '../hazelnut/small-components/notifications';
import { NotificationType } from '../hazelnut/small-components/notifications/notification-type.enum';

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

/**
 * Notification service for showing notifications in snack bar
 */
export class NotificationService implements NotificationWrapper {

    public constructor(private readonly snackBar: MatSnackBar,
                       private readonly translateService: TranslateService,
                       private readonly zone: NgZone) {
    }

    /**
     * Error notification when something fails
     * @param message
     */
    public openErrorNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        this.zone.run(() => this.snackBar.open(message));

        return this.openNotification('snack-error', {message, type: NotificationType.ERROR});
    }

    /**
     * Info notification
     * @param message
     */
    public openInfoNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        this.zone.run(() => this.snackBar.open(message));

        return this.openNotification('snack-info', {message, type: NotificationType.WARNING});
    }

    /**
     * Sucess notification when something done properly
     * @param message
     */
    public openSuccessNotification(message: any): MatSnackBarRef<NotificationSnackBarComponent> {
        this.zone.run(() => this.snackBar.open(message));

        return this.openNotification('snack-success', {message, type: NotificationType.SUCCESS});
    }

    /**
     * Show snack bar notification
     * @param styleClass
     * @param type
     * @param message
     * @param duration
     */
    private openNotification(styleClass: string, {type, message, duration = DEFAULT_DURATION}: NotificationParameters): MatSnackBarRef<NotificationSnackBarComponent> {
        return this.snackBar.openFromComponent(NotificationSnackBarComponent, {
            duration,
            data: {type, message: this.translateService.instant(message)},
            panelClass: [styleClass]
        });
    }
}
