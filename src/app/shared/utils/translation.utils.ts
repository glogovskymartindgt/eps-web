import { HttpBackend, HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

export class MissingTranslationUtils implements MissingTranslationHandler {
    public handle(params: MissingTranslationHandlerParams): any {
        if (!environment.production) {
            console.assert(false, `the key "${params.key}" does not exist in the "${params.translateService.currentLang}.json" dictionary`);
        }

        return params.key;
    }
}

export function HttpLoaderFactory(handler: HttpBackend): any {
    const http = new HttpClient(handler);

    return new TranslateHttpLoader(http);
}
