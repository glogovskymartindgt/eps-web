import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { FactService } from '../../../shared/services/data/fact.service';
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
 */ export class GuidelineCreateComponent extends GuidelineDetailBaseComponent implements OnInit {
    public formData = null;
    public loading = false;

    public labelKey = 'guidelines.newGuideline';
    public editMode = true;

    public constructor(
        protected readonly attachmentService: AttachmentService,
        protected readonly businessAreaService: BusinessAreaService,
        protected readonly router: Router,
        protected readonly factService: FactService,
        protected readonly formBuilder: FormBuilder,
        protected readonly notificationService: NotificationService,
        protected readonly projectEventService: ProjectEventService,
    ) {
        super(attachmentService, businessAreaService, router, formBuilder, notificationService, projectEventService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.setBaseForm();
    }

    /**
     * Save guideline with formm values and navigate to list component
     */
    public onSave(): void {
        this.factService.createFact(this.transformTaskToApiObject2(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.onCancel();
            });
    }

    /**
     * Partial fact form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject2(formObject: any): any {
        return formObject;
    }

}
