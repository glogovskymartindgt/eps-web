import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { config } from 'rxjs';
import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { CompositionModule } from './pages/composition/composition.module';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { ComponentsModule } from './shared/components/components.module';
import { ImageDialogComponent } from './shared/components/dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from './shared/components/dialog/pdf-dialog/pdf-dialog.component';
import { VideoDialogComponent } from './shared/components/dialog/video-dialog/video-dialog.component';
import { CoreTableModule } from './shared/hazelnut/core-table';
import { MaterialModule, NOTIFICATION_WRAPPER_TOKEN, TRANSLATE_WRAPPER_TOKEN } from './shared/hazelnut/hazelnut-common';
import { NotificationSnackBarComponent } from './shared/hazelnut/small-components/notifications';
import { PipesModule } from './shared/pipes/pipes.module';
import { AuthGuard } from './shared/services/auth-guard';
import { DashboardService } from './shared/services/dashboard.service';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { NotificationService } from './shared/services/notification.service';
import { TranslateWrapperService } from './shared/services/translate-wrapper.service';
import { AppConstants } from './shared/utils/constants';
import { MissingTranslationUtils } from './shared/utils/translation.utils';

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
        RouterModule.forRoot(routes, {useHash: true}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MissingTranslationUtils,
            },
        }),
        MaterialModule,
        ComponentsModule,
        FlexLayoutModule,
        CoreTableModule.forRoot({
            pageSize: AppConstants.defaultTablePageSize,
        }),
        PipesModule,
    ],
    providers: [
        AuthGuard,
        {
            provide: 'abstractInputConfig',
            useValue: config
        },
        {
            provide: NOTIFICATION_WRAPPER_TOKEN,
            useClass: NotificationService
        },
        {
            provide: TRANSLATE_WRAPPER_TOKEN,
            useClass: TranslateWrapperService
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandlerService
        },
        DashboardService
    ],
    entryComponents: [
        NotificationSnackBarComponent,
        PdfDialogComponent,
        ImageDialogComponent,
        VideoDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
