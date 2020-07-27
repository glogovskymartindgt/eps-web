import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
export class ActionPointCreateComponent {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public saving: boolean = false;

    public constructor(private readonly router: Router,
                       private readonly actionPointService: ActionPointService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly actionPointStructureService: ActionPointStructureService) {
    }

    public onCancel(): void {
        this.router.navigate(['action-points/list']);
    }

    public onSave(): void {
        this.saving = true;
        this.actionPointService.createActionPoint(this.transformActionPointToApiObject(this.formData))
            .pipe(finalize((): any => this.saving = false))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['action-points/list']);
            }, (): void => {
                this.notificationService.openErrorNotification('error.add');
            });
    }

    private transformActionPointToApiObject(formObject: any): any {
        const apiObject: any = {
            title: formObject.title,
            trafficLight: formObject.trafficLight,
            projectId: this.projectEventService.instant.id
        };

        return this.actionPointStructureService.addOptionalAttributesToApiObject(apiObject, formObject);
    }

}
