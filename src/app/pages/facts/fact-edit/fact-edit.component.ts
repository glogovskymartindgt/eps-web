import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
    selector: 'fact-edit',
    templateUrl: './fact-edit.component.html',
    styleUrls: ['./fact-edit.component.scss']
})
export class FactEditComponent implements OnInit {
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;
    private factId: number;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly factService: FactService,
        private readonly activatedRoute: ActivatedRoute,
        public readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit() {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.factId = param.id;
        });
    }

    public onCancel() {
        this.router.navigate(['facts/list']);
    }

    public onSave() {
        if (this.formData) {
            this.factService.editTask(this.factId, this.transformTaskToApiObject(this.formData)).subscribe(
                (response) => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate(['facts/list']);
                }, (error) => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }

    }

    private transformTaskToApiObject(formObject: any): any {
        return {
            valueFirst: +formObject.firstValue,
            valueSecond: +formObject.secondValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: +formObject.totalValue,
        };
    }

}
