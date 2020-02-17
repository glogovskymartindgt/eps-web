import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler {

    public constructor(private readonly notificationService: NotificationService) {
    }

    public handleError(error: string | any): void {
        this.notificationService.openErrorNotification(error);
    }

}
