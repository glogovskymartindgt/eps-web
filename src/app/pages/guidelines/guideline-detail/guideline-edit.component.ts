import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { Guideline } from '../../../shared/interfaces/guideline.interface';
import { Project } from '../../../shared/models/project.model';
import { DashboardService } from '../../../shared/services/dashboard.service';
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
    public labelKey = 'guidelines.guidelineDetail';
    public editMode = false;
    public updateScreen = true;
    public submitButtonRole: Role = Role.RoleUpdateGuideline;
    public projects: Project[]

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
        protected readonly dashboardService: DashboardService,
    ) {
        super(attachmentService, businessAreaService, router, formBuilder, notificationService, projectEventService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.guidelineId = this.activatedRoute.snapshot.params.id;

        this.setBaseForm();
        this.fillFormData();
        this.setDeleteButtonOptions();
        this.loadProjects();
        this.setProjectEvent()
    }

    /**
     * Save guideline with formm values and navigate to list component
     */
    public onSave(): void {
        if (this.guidelineDetailForm.invalid) {
            return;
        }
        this.loading = true;

        this.guideLineService.updateGuideline(this.guidelineId, this.getGuidelineToSave())
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.back();
            });
    }

    public enableEdit(): void {
        this.editMode = true;
        this.labelKey = 'guidelines.editGuideline';
        this.guidelineDetailForm.enable();
        this.guidelineDetailForm.get(GuidelineFormControlNames.BUSINESS_AREA).disable();
    }

    private fillFormData(): void {
        this.guideLineService.getGuideline(this.guidelineId)
            .subscribe((guideline: Guideline): void => {
                this.selectedBusinessArea = guideline.clBusinessArea;

                this.guidelineDetailForm.patchValue({
                    [GuidelineFormControlNames.TITLE]: guideline.title,
                    [GuidelineFormControlNames.BUSINESS_AREA]: guideline.clBusinessArea.id,
                    [GuidelineFormControlNames.DESCRIPTION]: guideline.description,
                    [GuidelineFormControlNames.ATTACHMENT]: [guideline.attachment],
                });

                this.guidelineDetailForm.disable();

                this.fillCreatedChangedData(guideline);
            });
    }

    private fillCreatedChangedData(guideline: Guideline): void {
        const dateTimeFormat = 'D.M.YYYY - HH:mm';

        if (guideline.created) {
            this.createdAtControl = new FormControl({
                value: moment(guideline.created).format(dateTimeFormat),
                disabled: true,
            });
            this.hasCreatedSection = true;
        }

        if (guideline.updated && guideline.updatedBy) {
            this.changedAtControl = new FormControl({
                value: moment(guideline.updated).format(dateTimeFormat),
                disabled: true,
            });

            this.changedByControl = new FormControl({
                value: `${guideline.updatedBy.firstName} ${guideline.updatedBy.lastName}`,
                disabled: true,
            });
            this.hasChangedSection = true;
        }
    }

    private setDeleteButtonOptions(): void {
        this.deleteButtonOptions = {
            titleKey: 'confirmation.guideline.title',
            messageKey: 'confirmation.guideline.message',
            rejectionButtonKey: 'confirmation.guideline.rejectButton',
            confirmationButtonKey: 'confirmation.guideline.confirmButton',
            deleteApiCall: this.guideLineService.deleteById(this.guidelineId),
            redirectRoute: [RouteNames.GUIDELINES, RouteNames.LIST],
        };
    }

    private loadProjects() {
        this.dashboardService.filterProjects('ALL')
            .subscribe((data): void => {
                this.projects = data;
            });
    }

    /**
     * Set project by guideline when redirected from returnUrl
     * Guideline detail URL is sharable via copy link
     * @private
     */
    private setProjectEvent() {
        setTimeout(() => {
            if (!this.projectEventService.instant.id) {
                this.guideLineService.getGuideline().subscribe((guideline: Guideline) => {
                    const project = this.projects.find((project) => project.id === guideline.projectId);
                    this.projectEventService.setEventData(project, true, this.projectEventService.imagePath);
                    this.dashboardService.setSecondaryHeaderContent({
                        isDashboard: false,
                    });
                });
            }
        }, 100) // Timeout due the required animation affect
    }
}
