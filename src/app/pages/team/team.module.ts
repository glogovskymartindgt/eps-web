import { NgModule } from '@angular/core';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
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
    ],
    providers: [
        TableChangeStorageService,
    ]
})
export class TeamModule {
}
