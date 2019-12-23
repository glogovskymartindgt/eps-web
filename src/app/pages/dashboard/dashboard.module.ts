import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectCardComponent,
        ProjectCreateComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        AbstractInputsModule,
        PipesModule,
        SharedDirectivesModule,
    ]
})
export class DashboardModule {
}
