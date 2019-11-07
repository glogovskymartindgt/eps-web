import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AttachmentFormat } from '../../../shared/enums/attachment-format.enum';
import { AttachmentType } from '../../../shared/enums/attachment-type.enum';
import { Role } from '../../../shared/enums/role.enum';
import { enterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { AuthService } from '../../../shared/services/auth.service';
import { ProjectsService } from '../../../shared/services/data/projects.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss'],
    animations: [enterLeave]
})
export class ProjectDetailComponent implements OnInit {
    public formData = null;
    public firstVenueMaps = null;
    public secondVenueMaps = null;
    public firstVenueImages = null;
    public secondVenueImages = null;
    public firstVenueDocuments = null;
    public secondVenueDocuments = null;
    public canSave = true;
    public editMode = false;
    public refreshSubject: Subject<any> = new Subject();

    public constructor(private readonly projectsService: ProjectsService,
                       private readonly notificationService: NotificationService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
    }

    /**
     * Cancel form, navigate to facts list screen
     */
    public onCancel() {
        this.toggleEditMode();
        this.refreshSubject.next('Refresh after cancel');
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave() {
        if (this.formData) {
            this.projectsService.editProject(this.formData.projectId, this.transformProjectToApiObject(this.formData))
                .subscribe(() => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.refreshSubject.next('Refresh after save');
                    this.projectEventService.setEventDataFromDetail(this.formData, true, this.formData.logoUploadId);
                }, () => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
        this.toggleEditMode();
    }

    /**
     * Toggle edit mode on edit button or accept/cancel form
     */
    public toggleEditMode() {
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
        const apiObject: any = {
            name: formObject.name,
            year: formObject.year,
            state: formObject.status,
        };
        if (formObject.dateFrom) {
            apiObject.dateFrom = formObject.dateFrom;
        }
        if (formObject.dateTo) {
            apiObject.dateTo = formObject.dateTo;
        }
        if (formObject.logoUploadId) {
            apiObject.logo = formObject.logoUploadId;
        }
        if (formObject.firstCountry || formObject.secondCountry) {
            apiObject.projectVenues = [];
        }
        if (formObject.firstCountry) {
            const firstVenueObject: any = {};
            firstVenueObject.screenPosition = 1;
            firstVenueObject.clCountry = {id: formObject.firstCountry};
            if (formObject.firstVenue) {
                firstVenueObject.cityName = formObject.firstVenue;
            }
            firstVenueObject.attachments = [];
            if(this.firstVenueMaps && this.firstVenueMaps.names.length > 0){
                for (var i = 0; i < this.firstVenueMaps.names.length; i++) {
                    firstVenueObject.attachments.push({
                    fileName: this.firstVenueMaps.names[i],
                    filePath: this.firstVenueMaps.paths[i],
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf
                    });
                }
            }
            if(this.firstVenueImages && this.firstVenueImages.names.length > 0){
                for (var i = 0; i < this.firstVenueImages.names.length; i++) {
                    firstVenueObject.attachments.push({
                    fileName: this.firstVenueImages.names[i],
                    filePath: this.firstVenueImages.paths[i],
                    type: AttachmentType.Image,
                    format: this.firstVenueImages.paths[i].substr(this.firstVenueImages.paths[i].lastIndexOf(".") + 1).toUpperCase()
                    });
                }
            }
            if(this.firstVenueDocuments && this.firstVenueDocuments.names.length > 0){
                for (var i = 0; i < this.firstVenueDocuments.names.length; i++) {
                    firstVenueObject.attachments.push({
                    fileName: this.firstVenueDocuments.names[i],
                    filePath: this.firstVenueDocuments.paths[i],
                    type: AttachmentType.Document,
                    format: this.firstVenueDocuments.paths[i].substr(this.firstVenueDocuments.paths[i].lastIndexOf(".") + 1).toUpperCase()
                    });
                }
            }
            apiObject.projectVenues.push(firstVenueObject);
        }
        if (formObject.secondCountry) {
            const secondVenueObject: any = {};
            secondVenueObject.screenPosition = 2;
            secondVenueObject.clCountry = {id: formObject.secondCountry};
            if (formObject.secondVenue) {
                secondVenueObject.cityName = formObject.secondVenue;
            }
            secondVenueObject.attachments = [];
            if(this.secondVenueMaps.names.length > 0){
                for (var i = 0; i < this.secondVenueMaps.names.length; i++) {
                    secondVenueObject.attachments.push({
                    fileName: this.secondVenueMaps.names[i],
                    filePath: this.secondVenueMaps.paths[i],
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf
                    });
                }
            }
            if(this.secondVenueImages && this.secondVenueImages.names.length > 0){
                for (var i = 0; i < this.secondVenueImages.names.length; i++) {
                    secondVenueObject.attachments.push({
                    fileName: this.secondVenueImages.names[i],
                    filePath: this.secondVenueImages.paths[i],
                    type: AttachmentType.Image,
                    format: this.secondVenueImages.paths[i].substr(this.secondVenueImages.paths[i].lastIndexOf(".") + 1).toUpperCase()
                    });
                }
            }
            if(this.secondVenueDocuments && this.secondVenueDocuments.names.length > 0){
                for (var i = 0; i < this.secondVenueDocuments.names.length; i++) {
                    secondVenueObject.attachments.push({
                    fileName: this.secondVenueDocuments.names[i],
                    filePath: this.secondVenueDocuments.paths[i],
                    type: AttachmentType.Document,
                    format: this.secondVenueDocuments.paths[i].substr(this.secondVenueDocuments.paths[i].lastIndexOf(".") + 1).toUpperCase()
                    });
                }
            }
            apiObject.projectVenues.push(secondVenueObject);
        }
        if (formObject.description) {
            apiObject.description = formObject.description;
        }
        return apiObject;
    }

}
