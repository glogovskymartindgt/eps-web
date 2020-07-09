import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
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
        this.guidelineId = this.activatedRoute.snapshot.params.id;

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

        this.guideLineService.updateGuideline(this.guidelineId, this.guidelineDetailForm.value)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.back();
            });
    }

    public enableEdit(): void {
        this.editMode = true;
        this.guidelineDetailForm.enable();
        this.guidelineDetailForm.get(GuidelineFormControlNames.BUSINESS_AREA).disable();
    }

    private fillFormData(): void {
        this.guideLineService.getGuideline(this.guidelineId)
            .pipe(
                tap((guideline: Guideline): void => {
                    this.selectedBusinessArea = guideline.clBusinessArea;

                    this.guidelineDetailForm.patchValue({
                        [GuidelineFormControlNames.TITLE]: guideline.title,
                        [GuidelineFormControlNames.BUSINESS_AREA]: guideline.clBusinessArea.id,
                        [GuidelineFormControlNames.DESCRIPTION]: guideline.description,
                    });

                    this.guidelineDetailForm.disable();

                    this.fillCreatedChangedData(guideline);
                }),
                switchMap((guideline: Guideline): Observable<Blob | void> => {
                    this.attachmentName = guideline.attachment.filePath;
                    this.attachmentTitle = guideline.attachment.fileName;
                    this.attachmentControl.setValue({
                        type: 'DOCUMENT',
                        format: 'PDF',
                        fileName: this.attachmentTitle,
                        filePath: this.attachmentName,
                    });

                    return this.attachmentService.getAttachment(guideline.attachment.filePath)
                        .pipe(catchError((error: HttpErrorResponse): Observable<any> => {
                            this.notificationService.openErrorNotification('error.attachmentDownload');

                            return of(null);
                        }));
                }),
            )
            .subscribe((blob: Blob): void => {
                this.createPdfFromBlob(blob);
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

    private createPdfFromBlob(attachment: Blob): any {

        const reader = new FileReader();
        const readerImage = null;
        reader.addEventListener('load', (): void => {
            this.attachmentSource = reader.result as string;
        }, false);
        if (attachment) {
            reader.readAsDataURL(attachment);
        }

        return readerImage;
    }

}
