import { InjectionToken } from '@angular/core';

export interface NotificationWrapper {
    openErrorNotification(error: any): void;

    openInfoNotification(info: any): void;

    openSuccessNotification(success: any): void;
}

export const NOTIFICATION_WRAPPER_TOKEN = new InjectionToken<NotificationWrapper>('notificationServiceWrapper');
