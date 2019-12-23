import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../hazelnut-common/material/material.module';
import { IndeterminateProgressBarComponent } from './indeterminate-progress-bar/indeterminate-progress-bar.component';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';

@NgModule({
    declarations: [
        NotificationSnackBarComponent,
        IndeterminateProgressBarComponent,
    ],
    exports: [
        NotificationSnackBarComponent,
        IndeterminateProgressBarComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ]
})
export class SmallComponentsModule {
}
