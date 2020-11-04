import { Observable } from 'rxjs';

export interface DeleteButtonOptions {
    titleKey: string;
    messageKey: string;
    rejectionButtonKey: string;
    confirmationButtonKey: string;
    deleteApiCall: Observable<unknown>;
    redirectRoute: string[];
}
