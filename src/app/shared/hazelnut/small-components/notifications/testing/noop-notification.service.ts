import { Injectable } from '@angular/core';
import { NotificationWrapper } from '../notification.wrapper';

@Injectable({
    providedIn: 'root'
})
export class NoopNotificationService implements NotificationWrapper {

    public openErrorNotification(error: any): void {
    }

    public openInfoNotification(info: any): void {
    }

    public openSuccessNotification(success: any): void {
    }
}
