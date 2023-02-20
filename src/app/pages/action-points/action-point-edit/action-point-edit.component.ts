import loader from '@angular-devkit/build-angular/src/angular-cli-files/plugins/single-test-transform';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileManager } from '@hazelnut/hazelnut-common/utils/file-manager';
import { TranslateService } from '@ngx-translate/core';
import {
    ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { Attachment } from '../../../shared/interfaces/attachment.interface';
import { DeleteButtonOptions } from '../../../shared/models/delete-button-options.model';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ActionPointFormComponent } from '../action-point-form/action-point-form.component';
import { ActionPointStructureService } from '../action-point-structure.service';

@Component({
    selector: 'iihf-action-point-edit',
    templateUrl: './action-point-edit.component.html',
    styleUrls: ['./action-point-edit.component.scss']
})
export class ActionPointEditComponent implements OnInit {
    @ViewChild(ActionPointFormComponent, {static: true}) public actionPointForm: ActionPointFormComponent;
    public formData = null;
    public loading = false;
    public titleKey: string = 'actionPoint.edit.actionPointDetail';
    public editMode: boolean = false;
    public deleteButtonOptions: DeleteButtonOptions = null;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly role: typeof Role = Role;
    public readonly actionPointEditRoles: Role[] = [Role.RoleUpdateActionPoint, Role.RoleUpdateActionPointInAssignProject];
    public attachments: Attachment[] = [];
    private actionPointId: number;

    public attachmentFormat = '';
    public attachmentFileName = '';
    public attachmentPathName = '';

    public acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    public acceptedVideoTypes = ['video/mp4', 'video/mpeg'];
    public acceptedDocumentTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/rtf',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-zip-compressed'
    ];

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly actionPointService: ActionPointService,
        public readonly projectEventService: ProjectEventService,
        private readonly actionPointStructureService: ActionPointStructureService,
        private readonly attachmentService: AttachmentService,
        private readonly imagesService: ImagesService,
        private readonly matDialog: MatDialog,
        private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.actionPointId = param.id;
            this.setDeleteButtonOptions();
            this.getAttachments();
        });
    }

    public onCancel(): void {
        this.redirectBack();
    }

    public onSave(): void {
        if (!this.formData) {
            return;
        }
        this.actionPointService.editActionPoint(this.actionPointId, this.transformActionPointToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.edit');
                this.redirectBack();
            }, (): void => {
                this.notificationService.openErrorNotification('error.edit');
            });
    }

    public enableEdit(): void {
        this.editMode = true;
        this.titleKey = 'actionPoint.edit.editActionPoint';
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    /**
     * Get all attachments
     */
    public getAttachments() {
        this.actionPointService.getAttachments(this.actionPointId).subscribe(attachments => {
            this.attachments = attachments;
        });
    }

    /**
     * File change action
     * @param event
     */
    public onFileChange(event): void {
        const file: File = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (): void => {
            if (this.acceptedImageTypes.includes(file.type)) {
                this.uploadImage(file);
            } else {
                this.uploadAttachment(file);
            }
        };
        reader.readAsDataURL(file);
    }

    public acceptedAllFileTypes(): string {
        return [
            ...this.acceptedImageTypes,
            ...this.acceptedVideoTypes,
            ...this.acceptedDocumentTypes
        ].join(', ');
    }

    private redirectBack(): void {
        this.router.navigate([RouteNames.ACTION_POINTS, RouteNames.LIST]);
    }

    private transformActionPointToApiObject(formObject: any): any {
        const apiObject: any = {
            id: this.actionPointId,
            title: formObject.title,
            trafficLight: formObject.trafficLight,
            state: formObject.state,
            projectId: this.projectEventService.instant.id
        };

        return this.actionPointStructureService.addOptionalAttributesToApiObject(apiObject, formObject);
    }

    private setDeleteButtonOptions(): void {
        this.deleteButtonOptions = {
            titleKey: 'confirmation.actionPoint.title',
            messageKey: 'confirmation.actionPoint.message',
            rejectionButtonKey: 'confirmation.actionPoint.rejectButton',
            confirmationButtonKey: 'confirmation.actionPoint.confirmButton',
            deleteApiCall: this.actionPointService.deleteActionPoint(this.actionPointId),
            redirectRoute: [RouteNames.ACTION_POINTS, RouteNames.LIST],
        };
    }

    /**
     * Add uploaded attachment to an actionPoint
     * @protected
     */
    protected addAttachmentToActionPoint() {
        const body = {
            type: 'ATTACHMENT',
            format: this.attachmentFormat,
            fileName: this.attachmentFileName,
            filePath: this.attachmentPathName,
            order: null,
            fkActionPoint: this.actionPointId
        };
        this.actionPointService.addAttachmentToActionPoint(body)
            .subscribe(response => {
                this.getAttachments();
                this.notificationService.openSuccessNotification('success.add');
            });
    }

    /**
     * Upload image
     * @param file
     * @protected
     */
    protected uploadImage(file: File): void {
        this.loading = true;
        this.imagesService.uploadImages([file])
            .subscribe((data: any): void => {
                this.setAttachmentData(file, data);
                this.addAttachmentToActionPoint();
                this.loading = false;
            }, (): void => {
                this.clearAttachmentData();
                this.notificationService.openErrorNotification('error.imageUpload');
                this.loading = false;
            });
    }

    /**
     * Upload attachments (images are not supported here)
     * @param file
     * @protected
     */
    protected uploadAttachment(file: File): void {
        this.loading = true;
        this.attachmentService.uploadAttachment([file])
            .subscribe((data: any): void => {
                this.setAttachmentData(file, data);
                this.addAttachmentToActionPoint();
                this.loading = false;
            }, (): void => {
                this.clearAttachmentData();
                this.notificationService.openErrorNotification('error.attachmentUpload');
                this.loading = false;
            });
    }

    /**
     * Download all attachments for a current actionPoint
     */
    public downloadAllAttachments() {
        this.loading = true;
        this.actionPointService.downloadAllAttachments(this.actionPointId)
            .subscribe((response): void => {
                new FileManager().saveFile(`Actionpoint-${this.actionPointId}-attachments.zip`, response, 'application/json');
                this.loading = false;
            },
            (error): any => {
                this.loading = false
            });
    }

    /**
     * Delete current attachment
     * @param id
     */
    public deleteAttachment(id): void {
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant('confirmation.actionPointAttachment.title'),
                message: this.translateService.instant('confirmation.actionPointAttachment.message'),
                rejectionButtonText: this.translateService.instant('confirmation.actionPointAttachment.rejectButton'),
                confirmationButtonText: this.translateService.instant('confirmation.actionPointAttachment.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {
                if (!result) {
                    return;
                }

                this.loading = true;
                this.actionPointService.deleteAttachmentById(id)
                    .subscribe((): void => {
                            this.getAttachments();
                            this.loading = false;
                        },
                        (): any => this.loading = false);
            });
    }

    protected setAttachmentData(file: File, data: any): void {
        this.attachmentFormat = file.name.split('.')
            .pop()
            .toUpperCase();
        this.attachmentFileName = file.name;
        this.attachmentPathName = data.fileNames[file.name].replace(/^.*[\\\/]/, '');
    }

    protected clearAttachmentData(): void {
        this.attachmentFormat = '';
        this.attachmentFileName = '';
        this.attachmentPathName = '';
    }
}
