import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TranslateWrapper } from '../hazlenut/hazelnut-common/interfaces';

@Injectable({
  providedIn: 'root'
})

/**
 * Translate wrapper
 */
export class TranslateWrapperService implements TranslateWrapper {
    public constructor(private readonly translateService: TranslateService) {
    }

    public get(key: string): Observable<string> {
        return this.translateService.get(key);
    }

    public instant(key: string): string {
        return this.translateService.instant(key);
    }

}
