import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../hazlenut/hazelnut-common';
import { SmallComponentsModule } from '../hazlenut/small-components';
import { NotificationSnackBarComponent } from '../hazlenut/small-components/notifications';
import { PdfDialogComponent } from './dialog/pdf-dialog/pdf-dialog.component';

@NgModule({
    declarations: [PdfDialogComponent],
    imports: [
        CommonModule,
        SmallComponentsModule,
        MaterialModule,
        PdfViewerModule
    ],
    exports: [
        NotificationSnackBarComponent,
        PdfDialogComponent
    ]
})
export class ComponentsModule {
}
