import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../hazelnut/small-components';
import { NotificationSnackBarComponent } from '../hazelnut/small-components/notifications';
import { TranslateWrapperService } from '../services/translate-wrapper.service';
import { CommentComponent } from './comment/comment.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ImageDialogComponent } from './dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from './dialog/pdf-dialog/pdf-dialog.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
    declarations: [
        PdfDialogComponent,
        ImageDialogComponent,
        CommentComponent,
        ConfirmationDialogComponent,
        HeaderComponent,
    ],
    imports: [
        CommonModule,
        SmallComponentsModule,
        MaterialModule,
        PdfViewerModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
    ],
    exports: [
        NotificationSnackBarComponent,
        PdfDialogComponent,
        ImageDialogComponent,
        CommentComponent,
        HeaderComponent,
    ],
    providers: [TranslateWrapperService],
    entryComponents: [
        ConfirmationDialogComponent
      ]
})
export class ComponentsModule {
}
