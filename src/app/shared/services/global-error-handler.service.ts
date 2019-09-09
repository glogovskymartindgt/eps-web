import { ErrorHandler, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './notification.service';

const ERROR = 'errorCode.';

@Injectable({
    providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler {

    public constructor(private readonly notificationService: NotificationService, private readonly translateService: TranslateService) {
    }

    public handleError(error: string | any): void {
        // const errorCode = '';
        //
        // if (typeof error === 'string') {
        //     errorCode = error;
        // } else if (!isNullOrUndefined(error) && !isNullOrUndefined(error.error) && !isNullOrUndefined(error.error.code)) {
        //     errorCode = ERROR + error.error.code;
        // } else if (!isNullOrUndefined(error) && !isNullOrUndefined(error.error) && !isNullOrUndefined(error.error.message)) {
        //     errorCode = ERROR + error.error.message;
        // } else {
        //     errorCode = 'error.api';
        // }

        // this.notificationService.openErrorNotification(this.translateService.instant(errorCode));
        console.error(error);
    }

}
