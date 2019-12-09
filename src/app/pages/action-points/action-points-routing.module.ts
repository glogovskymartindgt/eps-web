import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionPointCreateComponent } from './action-point-create/action-point-create.component';
import { ActionPointEditComponent } from './action-point-edit/action-point-edit.component';
import { ActionPointListComponent } from './action-point-list/action-point-list.component';

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
                component: ActionPointListComponent,
                data: {title: 'actionPointList'}
            },
            {
                path: 'create',
                component: ActionPointCreateComponent,
                data: {title: 'actionPointCreate'}
            },
            {
                path: 'edit',
                component: ActionPointEditComponent,
                data: {title: 'actionPointTaskEdit'}
            }
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionPointsRoutingModule { }
