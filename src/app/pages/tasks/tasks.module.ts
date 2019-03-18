import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';

@NgModule({
    declarations: [TaskListComponent, TaskCreateComponent, TaskEditComponent],
    imports: [
        CommonModule,
        TasksRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
    ]
})
export class TasksModule {
}
