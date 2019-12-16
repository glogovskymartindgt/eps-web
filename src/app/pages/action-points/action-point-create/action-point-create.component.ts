import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { ActionPointStructureService } from '../action-point-structure.service';

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
                       private readonly projectEventService: ProjectEventService,
                       private readonly actionPointStructureService: ActionPointStructureService) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.router.navigate(['action-points/list']);
    }

    public onSave(): void {
        this.actionPointService.createActionPoint(this.transformActionPointToApiObject(this.formData))
            .subscribe(() => {
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

        return this.actionPointStructureService.addOptionalAttributesToApiObject(apiObject, formObject);
    }

}
