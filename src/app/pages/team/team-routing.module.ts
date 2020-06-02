import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
            {
                path: 'list',
                component: TeamListComponent,
                data: {title: 'teamList'}
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamRoutingModule {
}
