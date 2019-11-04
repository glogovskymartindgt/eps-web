import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
                data: {title: 'projectList'},
            },
            {
                path: 'list',
                component: ProjectListComponent,
                data: {title: 'projectList'},
            },
            {
                path: 'create',
                component: ProjectCreateComponent,
                data: {title: 'projectCreate'}
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
