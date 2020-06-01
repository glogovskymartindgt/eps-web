import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
    declarations: [
        TeamListComponent,
    ],
    imports: [
        SharedModule,
        TeamRoutingModule,
    ]
})
export class TeamModule {
}
