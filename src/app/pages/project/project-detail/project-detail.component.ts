import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AttachmentFormat } from '../../../shared/enums/attachment-format.enum';
import { AttachmentType } from '../../../shared/enums/attachment-type.enum';
import { Role } from '../../../shared/enums/role.enum';
import { enterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { AttachmentDetail } from '../../../shared/models/attachment-detail.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ProjectsService } from '../../../shared/services/data/projects.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ProjectAttachmentService } from '../services/project-attachment.service';

@Component({
    selector: 'iihf-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss'],
    animations: [enterLeave]
})
/* tslint:disable */
export class ProjectDetailComponent implements OnInit {
    public formData = null;
    public canSave = true;
    public editMode = false;
    public refreshSubject: Subject<any> = new Subject();
    private apiObject: any;

    public constructor(private readonly projectsService: ProjectsService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService,
                       private readonly projectAttachmentService: ProjectAttachmentService) {
    }

    public ngOnInit(): void {
    }

    /**
     * Cancel form, navigate to facts list screen
     */
    public onCancel(): void {
        this.toggleEditMode();
        this.refreshSubject.next('Refresh after cancel');
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave(): void {
        if (this.formData) {
            this.projectsService.editProject(this.formData.projectId, this.transformProjectToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.refreshSubject.next('Refresh after save');
                    this.projectEventService.setEventDataFromDetail(this.formData, true, this.formData.logoUploadId);
                }, (): void => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
        this.toggleEditMode();
    }

    /**
     * Toggle edit mode on edit button or accept/cancel form
     */
    public toggleEditMode(): void {
        this.editMode = !this.editMode;
    }

    public allowEditButton(): boolean {
        return !this.editMode && (this.hasRoleUpdateProject() || this.hasRoleUpdateAssignProject());
    }

    private hasRoleUpdateProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateProject);
    }

    private hasRoleUpdateAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateAssignProject);
    }

    /**
     * Partial project form object to API fact object transformation
     * @param formObject
     */
    private transformProjectToApiObject(formObject: any): any {
        this.apiObject = {
            name: formObject.name,
            year: formObject.year,
            state: formObject.status,
            clProjectType: {
                id: formObject.projectType,
            }
        };
        if (formObject.dateFrom) {
            this.apiObject.dateFrom = formObject.dateFrom;
        }
        if (formObject.dateTo) {
            this.apiObject.dateTo = formObject.dateTo;
        }
        if (formObject.logoUploadId) {
            this.apiObject.logo = formObject.logoUploadId;
        }
        if (formObject.firstCountry || formObject.secondCountry) {
            this.apiObject.projectVenues = [];
        }
        if (formObject.firstCountry) {
            this.setFirstCountryApiObject(formObject);
        }
        if (formObject.secondCountry) {
            this.setSecondCountryApiObject(formObject);
        }
        if (formObject.thirdCountry) {
            this.setThirdCountryApiObject(formObject);
        }

        if (formObject.description) {
            this.apiObject.description = formObject.description;
        }

        return this.apiObject;
    }

    private setFirstCountryApiObject(formObject: any): void {
        const firstVenueObject: any = {};
        firstVenueObject.screenPosition = 1;
        firstVenueObject.clCountry = {id: formObject.firstCountry};
        if (formObject.firstVenue) {
            firstVenueObject.cityName = formObject.firstVenue;
        }
        firstVenueObject.attachments = [];
        if (this.projectAttachmentService.firstVenueAnyMaps()) {
            this.projectAttachmentService.files.firstVenueAttachments.maps.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                firstVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf,
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.firstVenueAnyImages()) {
            this.projectAttachmentService.files.firstVenueAttachments.images.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                firstVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Image,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.firstVenueAnyDocuments()) {
            this.projectAttachmentService.files.firstVenueAttachments.documents.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                firstVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Document,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        this.apiObject.projectVenues.push(firstVenueObject);
    }

    private setSecondCountryApiObject(formObject: any): void {
        const secondScreenPositionValue = 2;

        const secondVenueObject: any = {};
        secondVenueObject.screenPosition = secondScreenPositionValue;
        secondVenueObject.clCountry = {id: formObject.secondCountry};
        if (formObject.secondVenue) {
            secondVenueObject.cityName = formObject.secondVenue;
        }
        secondVenueObject.attachments = [];

        if (this.projectAttachmentService.secondVenueAnyMaps()) {
            this.projectAttachmentService.files.secondVenueAttachments.maps.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                secondVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf,
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.secondVenueAnyImages()) {
            this.projectAttachmentService.files.secondVenueAttachments.images.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                secondVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Image,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.secondVenueAnyDocuments()) {
            this.projectAttachmentService.files.secondVenueAttachments.documents.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                secondVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Document,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        this.apiObject.projectVenues.push(secondVenueObject);
    }

    private setThirdCountryApiObject(formObject: any): void {
        const thirdScreenPositionValue = 3;

        const thirdVenueObject: any = {};
        thirdVenueObject.screenPosition = thirdScreenPositionValue;
        thirdVenueObject.clCountry = {id: formObject.secondCountry};
        if (formObject.secondVenue) {
            thirdVenueObject.cityName = formObject.secondVenue;
        }
        thirdVenueObject.attachments = [];

        if (this.projectAttachmentService.thirdVenueAnyMaps()) {
            this.projectAttachmentService.files.thirdVenueAttachments.maps.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                thirdVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf,
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.thirdVenueAnyImages()) {
            this.projectAttachmentService.files.thirdVenueAttachments.images.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                thirdVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Image,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        if (this.projectAttachmentService.thirdVenueAnyDocuments()) {
            this.projectAttachmentService.files.thirdVenueAttachments.documents.forEach((attachmentDetail: AttachmentDetail, index: number): void => {
                thirdVenueObject.attachments.push({
                    fileName: attachmentDetail.fileName,
                    filePath: attachmentDetail.filePath,
                    type: AttachmentType.Document,
                    format: attachmentDetail.filePath.substr(attachmentDetail.filePath.lastIndexOf('.') + 1)
                                            .toUpperCase(),
                    order: index
                });
            });
        }
        this.apiObject.projectVenues.push(thirdVenueObject);
    }
}
