import { Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

export enum GuidelineFormControlNames {
    TITLE= 'title',
    BUSINESS_AREA = 'businessArea',
    ATTACHMENT = 'attachment',
    DESCRIPTION = 'description',
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class GuidelineDetailBaseComponent {
    public formData = null;
    public loading = false;

    public abstract labelKey: string;
    public guidelineDetailForm: FormGroup;
    public readonly formControlNames: typeof GuidelineFormControlNames = GuidelineFormControlNames;

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
            [GuidelineFormControlNames.TITLE]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.BUSINESS_AREA]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.ATTACHMENT]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.DESCRIPTION]: '',
        });
    }

}
