import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/remove-last-char';

@Component({
    selector: 'iihf-fact-create',
    templateUrl: './fact-create.component.html',
    styleUrls: ['./fact-create.component.scss']
})

/**
 * Fact create component
 */ export class FactCreateComponent implements OnInit {
    public formData = null;
    public loading = false;

    public constructor(private readonly router: Router,
                       private readonly factService: FactService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService) {
    }

    /**
     * Default form initialization is in child form component
     */
    public ngOnInit(): void {
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
        this.factService.createFact(this.transformTaskToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['facts/list']);
            }, (error) => {
                if (error?.status === 500 && error?.error?.message === "error.fact.create.subcategory"){
                    this.notificationService.openErrorNotification("error.factAlreadyExists")
                } else {
                    this.notificationService.openErrorNotification('error.add')
                }
            });
    }

    /**
     * Partial fact form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        formObject.firstValue = checkAndRemoveLastDotComma(formObject.firstValue);
        formObject.secondValue = checkAndRemoveLastDotComma(formObject.secondValue);
        formObject.thirdValue = checkAndRemoveLastDotComma(formObject.thirdValue);
        formObject.totalValue = checkAndRemoveLastDotComma(formObject.totalValue);
        const apiObject: any = {
            categoryId: formObject.category,
            subCategoryId: formObject.subCategory,
            valueFirst: formObject.firstValue,
            valueSecond: formObject.secondValue,
            valueThird: formObject.thirdValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: this.setTotalValueToApiObject(formObject),
            projectId: this.projectEventService.instant.id
        };
        if (formObject.description) {
            apiObject.description = formObject.description;
        }

        return apiObject;
    }

    private setTotalValueToApiObject(formObject: any){
        if (formObject?.unitShortName?.toLowerCase() === 'y/n' || formObject?.unitShortName?.toLowerCase() === 'yes/no'){
            return formObject.totalValue ? formObject.totalValue : null
        } else {
            return formObject.totalValue ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue + +formObject.thirdValue)
        }
    }

}
