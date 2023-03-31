import { Observable } from 'rxjs';
import { ListOption } from './list-option.interface';

export interface ChoiceButtonOptions {
    titleKey?: string;
    messageKey?: string;
    options?: ListOption[];
    confirmationButtonKey: string;
    rejectionButtonKey: string;
    chooseOptionApiCall: Observable<unknown>;
}