import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { GuideLineService } from '../../../shared/services/data/guideline.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { GuidelineDetailBaseComponent } from './guideline-detail-base.component';

@Component({
    selector: 'iihf-guideline-create',
    templateUrl: './guideline-detail-base.component.html',
    styleUrls: ['./guideline-detail-base.component.scss']
})

/**
 * Guideline create component
 */
export class GuidelineCreateComponent extends GuidelineDetailBaseComponent implements OnInit {
    public labelKey = 'guidelines.newGuideline';
    public editMode = true;
    public updateScreen = false;
    public submitButtonRole: Role = Role.RoleCreateGuideline;

    public constructor(
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
        this.loading = false;
        super.ngOnInit();

        this.setBaseForm();
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
            ...this.getGuidelineToSave(),
            projectId: this.projectEventService.instant.id,
        })
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.back();
            });
    }

}
