import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
        data: {animation: 'taskList'},
      },
      {
        path: 'list',
        component: TaskListComponent,
        data: {animation: 'taskList'},
      },
        {
            path: 'create',
            component: TaskCreateComponent,
            data: {animation: 'taskCreate'},
        },
        {
            path: 'edit',
            component: TaskEditComponent,
            data: {animation: 'taskEdit'},
        }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
