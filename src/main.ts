import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';
import { initHazelnutConfig } from './app/shared/hazlenut/hazelnut-common/config/hazelnut-config';

initHazelnutConfig({
  URL_API: environment.URL_API,
  LANGUAGE: 'sk',
  VERSION: '1.0.0',
  BROWSE_LIMIT: 10
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
