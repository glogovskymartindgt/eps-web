import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersListComponent } from './users-list/users-list.component';

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
                component: UsersListComponent,
                data: {title: 'usersList'},
            },
            {
                path: 'create',
                component: UserCreateComponent,
                data: {title: 'userCreate'}
            },
            {
                path: 'edit',
                component: UserEditComponent,
                data: {title: 'userEdit'}
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutineModule { }
