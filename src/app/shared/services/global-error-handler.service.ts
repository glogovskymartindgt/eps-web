import { NotificationService } from './notification.service';
import { Injectable, ErrorHandler } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

const ERROR = "errorCode.";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
      private readonly notificationService: NotificationService,
      private readonly translateService: TranslateService
  ) { }

  handleError(error: string | any ): void {
    let errorCode = "";

    if (typeof error === 'string') {
      errorCode = error;
    } else if (!isNullOrUndefined(error) && !isNullOrUndefined(error.error) && !isNullOrUndefined(error.error.code)) {
      errorCode = ERROR+error.error.code;
    } else if (!isNullOrUndefined(error) && !isNullOrUndefined(error.error) && !isNullOrUndefined(error.error.message)) {
      errorCode = ERROR+error.error.message;
    } else {
      errorCode = "error.api"
    }

    this.notificationService.openErrorNotification(this.translateService.instant(errorCode));
  }

}