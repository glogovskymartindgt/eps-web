import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListItemSync } from 'hazelnut';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

export enum GuidelineFormControlNames {
    TITLE= 'title',
    BUSINESS_AREA = 'businessArea',
    ATTACHMENT = 'attachment',
    DESCRIPTION = 'description',
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class GuidelineDetailBaseComponent implements OnInit {
    public formData = null;
    public loading = false;

    public abstract labelKey: string;
    public guidelineDetailForm: FormGroup;
    public businessAreaControl: FormControl;
    public businessAreas$: Observable<ListItemSync[]>;
    public readonly formControlNames: typeof GuidelineFormControlNames = GuidelineFormControlNames;

    protected constructor(
        protected readonly businessAreaService: BusinessAreaService,
        protected readonly router: Router,
        protected readonly formBuilder: FormBuilder,
        protected readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit(): void {
        this.loadBusinessAreas();
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

        this.businessAreaControl = this.guidelineDetailForm.get(GuidelineFormControlNames.BUSINESS_AREA) as FormControl;
    }

    protected loadBusinessAreas(): void {
        this.businessAreas$ = this.businessAreaService.listGuidelineBusinessAreas(this.projectEventService.instant.id)
            .pipe(
                map((businessAreas: BusinessArea[]): ListItemSync[] =>
                    businessAreas.map((businessArea: BusinessArea): ListItemSync => ({
                        value: businessArea.name,
                        code: businessArea.id,
                    }))
                )
            );
    }

}
