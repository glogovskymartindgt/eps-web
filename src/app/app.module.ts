import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { config } from 'rxjs';
import { AppRoutes } from './app.routing';
import { CompositionModule } from './pages/composition/composition.module';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { ComponentsModule } from './shared/components/components.module';
import { CoreTableModule, GLOBAL_CONFIG_TOKEN } from './shared/hazlenut/core-table';
import { MaterialModule, NOTIFICATION_WRAPPER_TOKEN, TRANSLATE_WRAPPER_TOKEN } from './shared/hazlenut/hazelnut-common';
import { NotificationSnackBarComponent } from './shared/hazlenut/small-components/notifications';
import { PipesModule } from './shared/pipes/pipes.module';
import { AuthGuard } from './shared/services/auth-guard';
import { DashboardService } from './shared/services/dashboard.service';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { NotificationService } from './shared/services/notification.service';
import { TranslateWrapperService } from './shared/services/translate-wrapper.service';

@NgModule({
    declarations: [
        AppComponent,
        AuthLayoutComponent,
        AdminLayoutComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CompositionModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, {useHash: true}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MaterialModule,
        ComponentsModule,
        FlexLayoutModule,
        CoreTableModule,
        PipesModule
    ],
    providers: [
        AuthGuard,
        {provide: 'abstractInputConfig', useValue: config},
        {provide: NOTIFICATION_WRAPPER_TOKEN, useClass: NotificationService},
        {provide: TRANSLATE_WRAPPER_TOKEN, useClass: TranslateWrapperService},
        {provide: GLOBAL_CONFIG_TOKEN, useValue: {}},
        {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
        DashboardService
    ],
    entryComponents: [NotificationSnackBarComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
