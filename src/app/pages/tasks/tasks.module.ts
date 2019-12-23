import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../shared/components/components.module';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../../shared/hazelnut/small-components';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
    declarations: [TaskListComponent, TaskCreateComponent, TaskEditComponent, TaskFormComponent],
    imports: [
        CommonModule,
        TasksRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule,
        PipesModule,
        ComponentsModule
    ],
    providers: [TranslateWrapperService]
})
export class TasksModule {
}
