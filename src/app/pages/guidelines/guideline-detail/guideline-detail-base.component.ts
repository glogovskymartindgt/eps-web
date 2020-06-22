import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListItemSync } from 'hazelnut';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { NotificationService } from '../../../shared/services/notification.service';
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
    public abstract editMode: boolean;
    public guidelineDetailForm: FormGroup;
    public businessAreaControl: FormControl;
    public businessAreas$: Observable<ListItemSync[]>;
    public attachmentName: string = null;
    public attachmentSource: string = null;
    public attachmentTitle: string = null;
    public readonly formControlNames: typeof GuidelineFormControlNames = GuidelineFormControlNames;
    public readonly fifteenMBinBytes = 15728640;

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
        const attachmentControl: FormControl = this.getAttachmentControl();

        return attachmentControl.touched && attachmentControl.hasError('required');
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

    public attachmentUpload(file: any): void {
        const fileName: string = file.fileName;
        const attachmentControl: FormControl = this.getAttachmentControl();

        this.attachmentService.uploadAttachment([file.blobPart])
            .subscribe((response: { fileNames: object }): void => {
                this.attachmentName = response.fileNames[fileName];
                this.attachmentSource = file.content;
                this.attachmentTitle = fileName;
                attachmentControl.setValue({
                        type: 'DOCUMENT',
                        format: 'PDF',
                        fileName,
                        filePath: this.attachmentName,
                    });
                attachmentControl.markAsTouched();
            });
    }

    public attachmentRemove(): void {
        this.attachmentName = null;
        this.attachmentSource = null;
        this.attachmentTitle = null;
        const attachmentControl: FormControl = this.getAttachmentControl();
        attachmentControl.setValue(null);
        attachmentControl.markAsTouched();
    }

    public attachmentUnsupportedFiletype(): void {
        this.notificationService.openInfoNotification('guidelines.detail.unsupportedFileType');
    }

    public attachmentMaximumFileSizedExceeded(): void {
        this.notificationService.openInfoNotification('guidelines.detail.maximumSizeExceeded');
    }

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

    protected getAttachmentControl(): FormControl {
        return this.guidelineDetailForm.get(this.formControlNames.ATTACHMENT) as FormControl;
    }

}
