import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'task-create',
    templateUrl: './task-create.component.html',
    styleUrls: ['./task-create.component.scss'],
    animations: [fadeEnterLeave],
})
export class TaskCreateComponent implements OnInit {
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;
    public loading: false;

    public constructor(private router: Router,
                       private taskService: TaskService,
                       private notificationService: NotificationService,
                       private projectEventService: ProjectEventService
    ) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.router.navigate(['tasks/list']);
    }

    public onSave(): void {
        this.taskService.createTask(this.transformTaskToApiObject(this.formData)).subscribe((response) => {
            console.log(response);
            this.notificationService.openSuccessNotification('success.add');
            this.router.navigate(['tasks/list']);
        }, (error) => {
            console.log(error);
            this.notificationService.openErrorNotification('error.add');
        });

    }

    private transformTaskToApiObject(formObject: any): any {
        console.log('formObject', formObject);
        const apiObject: any = {
            taskType: formObject.taskType.toUpperCase(),
            name: formObject.title,
            clBusinessArea: formObject.businessArea,
            project: this.projectEventService.instant.id
        };
        if (formObject.trafficLight) {
            apiObject.trafficLight = formObject.trafficLight.toUpperCase();
        }
        if (formObject.sourceOfAgenda !== '') {
            apiObject.clSourceOfAgenda = formObject.sourceOfAgenda;
        }
        if (formObject.phase !== '') {
            apiObject.projectPhase = formObject.phase;
        }
        if (formObject.dueDate !== null) {
            apiObject.dueDate = formObject.dueDate;
        }
        if (formObject.responsible !== '') {
            apiObject.responsible = formObject.responsible;
        }
        if (formObject.responsible !== '') {
            apiObject.responsibleUser = formObject.responsible;
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
