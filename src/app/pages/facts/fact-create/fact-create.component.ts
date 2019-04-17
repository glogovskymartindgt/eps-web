import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
    selector: 'fact-create',
    templateUrl: './fact-create.component.html',
    styleUrls: ['./fact-create.component.scss']
})
export class FactCreateComponent implements OnInit {
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;
    public loading = false;

    public constructor(
        private readonly router: Router,
        private readonly factService: FactService,
        private readonly notificationService: NotificationService,
        private readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit() {
    }

    public onCancel(): void {
        this.router.navigate(['facts/list']);
    }

    // TODO
    public onSave(): void {
        this.factService.createFact(this.transformTaskToApiObject(this.formData)).subscribe((response) => {
            this.notificationService.openSuccessNotification('success.add');
            this.router.navigate(['facts/list']);
        }, (error) => {
            this.notificationService.openErrorNotification('error.add');
        });
    }

    // TODO
    private transformTaskToApiObject(formObject: any): any {
        return {
            categoryId: formObject.category,
            subCategoryId: formObject.subCategory,
            valueFirst: +formObject.firstValue,
            valueSecond: +formObject.secondValue,
            projectId: this.projectEventService.instant.id
        };
    }

}
