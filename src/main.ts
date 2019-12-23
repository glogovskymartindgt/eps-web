import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'hammerjs';

import { AppModule } from './app/app.module';
import { initHazelnutConfig } from './app/shared/hazelnut/hazelnut-common/config/hazelnut-config';
import { environment } from './environments/environment';

initHazelnutConfig({
    URL_API: environment.URL_API,
    LANGUAGE: 'en',
    VERSION: '1.0.0',
    BROWSE_LIMIT: 15
});

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((error: any) => console.error(error));
