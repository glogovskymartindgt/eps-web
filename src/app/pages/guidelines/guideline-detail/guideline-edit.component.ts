import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { Guideline } from '../../../shared/interfaces/guideline.interface';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { GuideLineService } from '../../../shared/services/data/guideline.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { GuidelineDetailBaseComponent, GuidelineFormControlNames } from './guideline-detail-base.component';

@Component({
    selector: 'iihf-guideline-edit',
    templateUrl: './guideline-detail-base.component.html',
    styleUrls: ['./guideline-detail-base.component.scss']
})

/**
 * Guideline edit component
 */
export class GuidelineEditComponent extends GuidelineDetailBaseComponent implements OnInit {
    public labelKey = 'guidelines.editGuideline';
    public editMode = false;
    public submitButtonRole: Role = Role.RoleUpdateGuideline;
    public hasEditButton = true;

    private guidelineId: number;

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        protected readonly attachmentService: AttachmentService,
        protected readonly businessAreaService: BusinessAreaService,
        private readonly guideLineService: GuideLineService,
        protected readonly router: Router,
        protected readonly formBuilder: FormBuilder,
        protected readonly notificationService: NotificationService,
        protected readonly projectEventService: ProjectEventService,
    ) {
        super(attachmentService, businessAreaService, router, formBuilder, notificationService, projectEventService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.setBaseForm();
        this.fillFormData();
    }

    /**
     * Save guideline with formm values and navigate to list component
     */
    public onSave(): void {
        if (this.guidelineDetailForm.invalid) {
            return;
        }
        this.loading = true;

        this.guideLineService.createGuideline({
            ...this.guidelineDetailForm.value,
            projectId: this.projectEventService.instant.id,
        })
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.back();
            });
    }

    public enableEdit(): void {
        this.editMode = true;
        this.guidelineDetailForm.enable();
    }

    private fillFormData(): void {
        this.guidelineId = this.activatedRoute.snapshot.params.id;

        this.guideLineService.getGuideline(this.guidelineId)
            .subscribe((guideline: Guideline): void => {
                console.table([guideline]);
                this.selectedBusinessArea = guideline.clBusinessArea;

                this.guidelineDetailForm.patchValue({
                    [GuidelineFormControlNames.TITLE]: guideline.title,
                    [GuidelineFormControlNames.BUSINESS_AREA]: guideline.clBusinessArea.id,
                    [GuidelineFormControlNames.DESCRIPTION]: guideline.description,
                });

                this.guidelineDetailForm.disable();
            });
    }

}
