import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'iihf-task-create',
    templateUrl: './task-create.component.html',
    styleUrls: ['./task-create.component.scss'],
    animations: [fadeEnterLeave],
})
export class TaskCreateComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public loading: false;

    public constructor(private readonly router: Router,
                       private readonly taskService: TaskService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.router.navigate(['tasks/list']);
    }

    public onSave(): void {
        this.taskService.createTask(this.transformTaskToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['tasks/list']);
            }, (): void => {
                this.notificationService.openErrorNotification('error.add');
            });
    }

    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            taskType: formObject.taskType,
            name: formObject.title,
            clBusinessAreaId: formObject.businessArea,
            projectId: this.projectEventService.instant.id
        };
        if (formObject.trafficLight) {
            apiObject.trafficLight = formObject.trafficLight;
        }
        if (formObject.sourceOfAgenda !== '') {
            apiObject.clSourceOfAgendaId = formObject.sourceOfAgenda;
        }
        if (formObject.phase !== '') {
            apiObject.projectPhaseId = formObject.phase;
        }
        if (formObject.dueDate !== null) {
            apiObject.dueDate = formObject.dueDate;
        }
        if (formObject.responsible !== '') {
            apiObject.responsibleUserId = formObject.responsible;
        }
        if (formObject.venue !== '') {
            apiObject.cityName = formObject.venue;
        }
        if (formObject.description !== '') {
            apiObject.description = formObject.description;
        }
        if (formObject.sourceDescription !== '') {
            apiObject.sourceDescription = formObject.sourceDescription;
        }

        return apiObject;
    }

}
