import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
    selector: 'iihf-action-point-create',
    templateUrl: './action-point-create.component.html',
    styleUrls: ['./action-point-create.component.scss']
})
export class ActionPointCreateComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public loading: false;

    public constructor(private readonly router: Router,
                       private readonly actionPointService: ActionPointService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.router.navigate(['action-points/list']);
    }

    public onSave(): void {
        this.actionPointService.createActionPoint(this.transformActionPointToApiObject(this.formData)).subscribe((response) => {
            this.notificationService.openSuccessNotification('success.add');
            this.router.navigate(['action-points/list']);
        }, () => {
            this.notificationService.openErrorNotification('error.add');
        });
    }

    private transformActionPointToApiObject(formObject: any): any {
        const apiObject: any = {
            title: formObject.title,
            projectId: this.projectEventService.instant.id
        };
        if (formObject.actionPointText !== '') {
            apiObject.actionPointText = formObject.actionPointText;
        }
        if (formObject.dueDate !== null) {
            apiObject.dueDate = formObject.dueDate;
        }
        if (formObject.area !== '') {
            apiObject.area = formObject.area;
        }
        if (formObject.meetingDate !== null) {
            apiObject.meetingDate = formObject.meetingDate;
        }
        if (formObject.meetingText !== '') {
            apiObject.meetingDescription = formObject.meetingText;
        }
        if (formObject.venue !== '') {
            apiObject.cityName = formObject.venue;
        }
        if (formObject.description !== '') {
            apiObject.description = formObject.description;
        }
        if (formObject.responsibleUsers && formObject.responsibleUsers.length > 0) {
            apiObject.responsibles = formObject.responsibleUsers.map((responsible) => responsible.id);
        }

        return apiObject;
    }

}
