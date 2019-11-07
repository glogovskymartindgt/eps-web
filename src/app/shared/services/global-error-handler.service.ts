import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler {

    public constructor() {
    }

    public handleError(error: string | any): void {
        console.error(error);
    }

}
