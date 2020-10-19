import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ShowByRoleDirective } from '../directives/show-by-role.directive';
import { AbstractInputsModule } from '../hazelnut/abstract-inputs';
import { MaterialModule, SharedDirectivesModule } from '../hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../hazelnut/small-components';
import { NotificationSnackBarComponent } from '../hazelnut/small-components/notifications';
import { TranslateWrapperService } from '../services/translate-wrapper.service';
import { AttachmentUploadComponent } from './attachment-upload/attachment-upload.component';
import { AvatarInputComponent } from './avatar-input/avatar-input.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ActionPointCommentTabComponent } from './comment-tab/action-point-comment-tab.component';
import { TaskCommentTabComponent } from './comment-tab/task-comment-tab.component';
import { CommentComponent } from './comment/comment.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { ImageDialogComponent } from './dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from './dialog/pdf-dialog/pdf-dialog.component';
import { DownloadLinkComponent } from './download-link/download-link.component';
import { DragDropBoxComponent } from './drag-drop-box/drag-drop-box.component';
import { HeaderComponent } from './header/header.component';
import { PdfComponent } from './pdf/pdf.component';

@NgModule({
    declarations: [
        PdfDialogComponent,
        ImageDialogComponent,
        CommentComponent,
        ActionPointCommentTabComponent,
        TaskCommentTabComponent,
        ConfirmationDialogComponent,
        HeaderComponent,
        ShowByRoleDirective,
        DragDropBoxComponent,
        PdfComponent,
        DownloadLinkComponent,
        AttachmentUploadComponent,
        AvatarInputComponent,
        AvatarComponent,
        DeleteButtonComponent,
    ],
    imports: [
        CommonModule,
        SmallComponentsModule,
        MaterialModule,
        PdfViewerModule,
        FlexLayoutModule,
        AbstractInputsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedDirectivesModule,
        TranslateModule.forChild(),
    ],
    exports: [
        NotificationSnackBarComponent,
        PdfDialogComponent,
        ImageDialogComponent,
        CommentComponent,
        ActionPointCommentTabComponent,
        TaskCommentTabComponent,
        HeaderComponent,
        ShowByRoleDirective,
        DragDropBoxComponent,
        PdfComponent,
        DownloadLinkComponent,
        AttachmentUploadComponent,
        AvatarInputComponent,
        AvatarComponent,
        DeleteButtonComponent,
    ],
    providers: [TranslateWrapperService],
    entryComponents: [
        ConfirmationDialogComponent
      ]
})
export class ComponentsModule {
}
