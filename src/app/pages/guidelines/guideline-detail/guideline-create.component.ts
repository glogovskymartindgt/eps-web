import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/remove-last-char';
import { GuidelineDetailBaseComponent } from './guideline-detail-base.component';

@Component({
    selector: 'iihf-guideline-create',
    templateUrl: './guideline-detail-base.component.html',
    styleUrls: ['./guideline-detail-base.component.scss']
})

/**
 * Guideline create component
 */ export class GuidelineCreateComponent extends GuidelineDetailBaseComponent {
    public formData = null;
    public loading = false;

    public labelKey = 'fact.newFact';

    public constructor(
        protected readonly router: Router,
        protected readonly factService: FactService,
        protected readonly formBuilder: FormBuilder,
        protected readonly notificationService: NotificationService,
        protected readonly projectEventService: ProjectEventService,
    ) {
        super(router, formBuilder, projectEventService);
    }

    /**
     * Save guideline with formm values and navigate to list component
     */
    public onSave(): void {
        this.factService.createFact(this.transformTaskToApiObject2(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.onCancel();
            });
    }

    /**
     * Partial fact form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject2(formObject: any): any {
        formObject.firstValue = checkAndRemoveLastDotComma(formObject.firstValue);
        formObject.secondValue = checkAndRemoveLastDotComma(formObject.secondValue);
        formObject.totalValue = checkAndRemoveLastDotComma(formObject.totalValue);
        const apiObject: any = {
            categoryId: formObject.category,
            subCategoryId: formObject.subCategory,
            valueFirst: formObject.firstValue,
            valueSecond: formObject.secondValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: (formObject.totalValue) ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue),
            projectId: this.projectEventService.instant.id
        };
        if (formObject.description) {
            apiObject.description = formObject.description;
        }

        return apiObject;
    }

}
