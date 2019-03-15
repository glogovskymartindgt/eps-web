import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmallComponentsModule } from '../hazlenut/small-components';
import { NotificationSnackBarComponent } from '../hazlenut/small-components/notifications';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SmallComponentsModule
    ],
    exports: [NotificationSnackBarComponent]
})
export class ComponentsModule {
}
