import { NgModule } from '@angular/core';
import { AbstractInputsModule, TRANSLATE_WRAPPER_TOKEN } from 'hazelnut';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
import { ProjectDetailFormComponent } from './project-detail-form/project-detail-form.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectFilePlaceholderComponent } from './project-file-placeholder/project-file-placeholder.component';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
    declarations: [
        ProjectDetailComponent,
        ProjectDetailFormComponent,
        ProjectFilePlaceholderComponent
    ],
    imports: [
        ProjectRoutingModule,
        SharedDirectivesModule,
        PdfViewerModule,
        SharedModule,
        AbstractInputsModule,
    ],
    providers: [
        TranslateWrapperService,
        {
            provide: TRANSLATE_WRAPPER_TOKEN,
            useExisting: TranslateWrapperService,
        }
    ],
})
export class ProjectModule {
}
