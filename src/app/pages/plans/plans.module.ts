import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlansRoutingModule } from './plans-routing.module';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
    declarations: [
        PlanListComponent,
        ProjectCardComponent
    ],
    imports: [
        CommonModule,
        PlansRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
    ]
})
export class PlansModule {
}
