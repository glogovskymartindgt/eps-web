import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../hazlenut/hazelnut-common';
import { SmallComponentsModule } from '../hazlenut/small-components';
import { NotificationSnackBarComponent } from '../hazlenut/small-components/notifications';
import { ImageDialogComponent } from './dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from './dialog/pdf-dialog/pdf-dialog.component';

@NgModule({
    declarations: [PdfDialogComponent, ImageDialogComponent],
    imports: [
        CommonModule,
        SmallComponentsModule,
        MaterialModule,
        PdfViewerModule,
        FlexLayoutModule
    ],
    exports: [
        NotificationSnackBarComponent,
        PdfDialogComponent,
        ImageDialogComponent
    ]
})
export class ComponentsModule {
}
