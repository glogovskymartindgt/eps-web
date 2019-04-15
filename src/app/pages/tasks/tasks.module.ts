import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { SmallComponentsModule } from '../../shared/hazlenut/small-components';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
    declarations: [TaskListComponent, TaskCreateComponent, TaskEditComponent, TaskCommentComponent, TaskFormComponent],
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
    ],
    providers: [TranslateWrapperService]
})
export class TasksModule {
}
