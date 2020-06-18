import { Directive } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/remove-last-char';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class GuidelineDetailBaseComponent {
    public formData = null;
    public loading = false;

    public abstract labelKey: string;
    public guidelineDetailForm: FormGroup;

    protected constructor(
        protected readonly router: Router,
        protected readonly formBuilder: FormBuilder,
        protected readonly projectEventService: ProjectEventService,
    ) {
    }

    /**
     * Cancel create/edit and navigate to the list component
     */
    public onCancel(): void {
        this.router.navigate(['guideline', 'list']);
    }

    /**
     * Save the form values
     */
    public abstract onSave(): void;

    protected setBaseForm(): void {
        this.guidelineDetailForm = this.formBuilder.group({
            
        });
    }

    private transformTaskToApiObject(formObject: any): any {
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
