import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectCardComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FlexLayoutModule,
        MaterialModule,
    ]
})
export class DashboardModule {
}
