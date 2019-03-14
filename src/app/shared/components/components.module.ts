import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationSnackBarComponent } from '../hazlenut/small-components/notifications';

@NgModule({
    declarations: [NotificationSnackBarComponent],
    imports: [
        CommonModule
    ],
    exports: [NotificationSnackBarComponent]
})
export class ComponentsModule {
}
