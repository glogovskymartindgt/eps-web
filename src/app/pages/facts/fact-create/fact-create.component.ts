import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/removeLastChar';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
    selector: 'fact-create',
    templateUrl: './fact-create.component.html',
    styleUrls: ['./fact-create.component.scss']
})

/**
 * Fact create component
 */
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

    /**
     * Default form initialization is in child form component
     */
    public ngOnInit() {
    }

    /**
     * Cancel create form and navigate to list component
     */
    public onCancel(): void {
        this.router.navigate(['facts/list']);
    }

    /**
     * Save fact with formm values and navigate to list component
     */
    public onSave(): void {
        this.factService.createFact(this.transformTaskToApiObject(this.formData)).subscribe((response) => {
            this.notificationService.openSuccessNotification('success.add');
            this.router.navigate(['facts/list']);
        }, (error) => {
            this.notificationService.openErrorNotification('error.add');
        });
    }

    /**
     * Partial fact form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        formObject.firstValue = checkAndRemoveLastDotComma(formObject.firstValue);
        formObject.secondValue = checkAndRemoveLastDotComma(formObject.secondValue);
        formObject.totalValue = checkAndRemoveLastDotComma(formObject.totalValue);

        return {
            categoryId: formObject.category,
            subCategoryId: formObject.subCategory,
            valueFirst: +formObject.firstValue,
            valueSecond: +formObject.secondValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: (formObject.totalValue) ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue),
            projectId: this.projectEventService.instant.id
        };
    }

}
