import { NgModule } from '@angular/core';
import { AbstractInputsModule, TRANSLATE_WRAPPER_TOKEN } from 'hazelnut';
import { SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
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
        DashboardRoutingModule,
        SharedDirectivesModule,
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
export class DashboardModule {
}
