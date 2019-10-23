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
            if (formObject.firstVenue && formObject.firstMapUploadId) {
                firstVenueObject.attachment = {
                    fileName: formObject.firstMapUploadName,
                    filePath: formObject.firstMapUploadId,
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf
                };
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
            if (formObject.secondVenue && formObject.secondMapUploadId) {
                secondVenueObject.attachment = {
                    fileName: formObject.secondMapUploadName,
                    filePath: formObject.secondMapUploadId,
                    type: AttachmentType.Map,
                    format: AttachmentFormat.Pdf
                };
            }
            apiObject.projectVenues.push(secondVenueObject);
        }
        if (formObject.description) {
            apiObject.description = formObject.description;
        }
        return apiObject;
    }

}
