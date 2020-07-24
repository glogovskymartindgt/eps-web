import { NgModule } from '@angular/core';
import { SmallComponentsModule } from 'hazelnut';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskOverviewPersistanceService } from './task-overview-persistance.service';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
    declarations: [TaskListComponent, TaskCreateComponent, TaskEditComponent, TaskFormComponent],
    imports: [
        SharedModule,
        SmallComponentsModule,
        TasksRoutingModule,
    ],
    providers: [
        TranslateWrapperService,
        TableChangeStorageService,
        TaskOverviewPersistanceService,
    ]
})
export class TasksModule {
}
