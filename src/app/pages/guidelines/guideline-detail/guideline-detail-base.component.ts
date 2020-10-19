import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListItemSync } from 'hazelnut';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { ClBusinessArea } from '../../../shared/interfaces/cl-business-area.interface';
import { Guideline } from '../../../shared/interfaces/guideline.interface';
import { AttachmentDetail } from '../../../shared/models/attachment-detail.model';
import { DeleteButtonOptions } from '../../../shared/models/delete-button-options.model';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

export enum GuidelineFormControlNames {
    TITLE = 'title',
    BUSINESS_AREA = 'clBusinessAreaId',
    ATTACHMENT = 'attachment',
    DESCRIPTION = 'description',
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class GuidelineDetailBaseComponent implements OnInit {
    public formData = null;
    public loading = false;

    public abstract labelKey: string;
    public abstract editMode: boolean;
    public abstract submitButtonRole: Role;
    public abstract updateScreen: boolean;
    public guidelineDetailForm: FormGroup;
    public businessAreaControl: FormControl;
    public attachmentControl: FormControl;
    public businessAreas$: Observable<ListItemSync[]>;
    public selectedBusinessArea: ClBusinessArea = null;
    public readonly formControlNames: typeof GuidelineFormControlNames = GuidelineFormControlNames;
    public readonly fifteenMBinBytes = 15728640;
    public readonly roles: typeof Role = Role;
    public deleteButtonOptions: DeleteButtonOptions = null;

    public hasCreatedSection = false;
    public hasChangedSection = false;
    public createdAtControl: FormControl;
    public changedAtControl: FormControl;
    public changedByControl: FormControl;

    protected constructor(
        protected readonly attachmentService: AttachmentService,
        protected readonly businessAreaService: BusinessAreaService,
        protected readonly router: Router,
        protected readonly formBuilder: FormBuilder,
        protected readonly notificationService: NotificationService,
        protected readonly projectEventService: ProjectEventService,
    ) {
    }

    public get attachmentRequiredError(): boolean {
        return this.attachmentControl.touched && this.attachmentControl.hasError('required');
    }

    public ngOnInit(): void {
        this.loadBusinessAreas();
    }

    /**
     * Cancel create/edit and navigate to the list component
     */
    public back(): void {
        this.router.navigate([RouteNames.GUIDELINES, RouteNames.LIST]);
    }

    /**
     * Save the form values
     */
    public abstract onSave(): void;

    public enableEdit(): void {
    }

    public attachmentUnsupportedFiletype(): void {
        this.notificationService.openInfoNotification('guidelines.detail.unsupportedFileType');
    }

    public attachmentMaximumFileSizedExceeded(): void {
        this.notificationService.openInfoNotification('guidelines.detail.maximumSizeExceeded');
    }

    public isOpenProject(): boolean {
        return this.projectEventService.instant.active;
    }

    protected setBaseForm(): void {
        this.guidelineDetailForm = this.formBuilder.group({
            [GuidelineFormControlNames.TITLE]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.BUSINESS_AREA]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.ATTACHMENT]: this.formBuilder.control('', Validators.required),
            [GuidelineFormControlNames.DESCRIPTION]: '',
        });

        this.businessAreaControl = this.guidelineDetailForm.get(GuidelineFormControlNames.BUSINESS_AREA) as FormControl;
        this.attachmentControl = this.guidelineDetailForm.get(this.formControlNames.ATTACHMENT) as FormControl;
    }

    protected getGuidelineToSave(): Guideline {
        const {source, ...attachmentWithoutSource}: AttachmentDetail = this.guidelineDetailForm.get(this.formControlNames.ATTACHMENT).value[0];

        return {
            ...this.guidelineDetailForm.value,
            attachment: attachmentWithoutSource,
        };
    }

    protected loadBusinessAreas(): void {
        this.businessAreas$ = this.businessAreaService.listGuidelineBusinessAreas()
            .pipe(
                map((businessAreas: BusinessArea[]): ListItemSync[] =>
                    businessAreas.map((businessArea: BusinessArea): ListItemSync => ({
                        value: `${businessArea.codeItem} - ${businessArea.name}`,
                        code: businessArea.id,
                    }))
                )
            );
    }

}
