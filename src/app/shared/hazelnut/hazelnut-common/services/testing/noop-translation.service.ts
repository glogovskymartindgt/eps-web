import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateWrapper } from '../../interfaces/translate.interface';

@Injectable({
    providedIn: 'root'
})
export class NoopTranslationsService implements TranslateWrapper {

    public get(key: string): Observable<string> {
        return of(`translate of ${key}`);
    }

    public instant(key: string): string {
        return `translate of ${key}`;
    }
}
