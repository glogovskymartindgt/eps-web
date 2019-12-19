import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazlenut/hazelnut-common';
import { PipesModule } from '../../shared/pipes/pipes.module';
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
        CommonModule,
        ProjectRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        AbstractInputsModule,
        PipesModule,
        SharedDirectivesModule,
        PdfViewerModule
    ]
})
export class ProjectModule {
}
