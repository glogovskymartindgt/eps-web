import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommentType } from '../../../shared/enums/comment-type.enum';
import { Role } from '../../../shared/enums/role.enum';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { ActionPointComment, TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskCommentService } from '../../../shared/services/task-comment.service';
import { ActionPointFormComponent } from '../action-point-form/action-point-form.component';
import { ActionPointStructureService } from '../action-point-structure.service';

const routes = {
    listRoute: 'action-points/list'
};
@Component({
    selector: 'iihf-action-point-edit',
    templateUrl: './action-point-edit.component.html',
    styleUrls: ['./action-point-edit.component.scss']
})
export class ActionPointEditComponent implements OnInit {
    @ViewChild(ActionPointFormComponent, {static: true}) public actionPointForm: ActionPointFormComponent;
    public formData = null;
    public addCommentForm: FormGroup;
    public comments: TaskCommentResponse[] = [];
    public loading = false;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public attachmentFormat = '';
    public attachmentFileName = '';
    public attachmentPathName = '';
    private actionPointId: number;

    public constructor(public dialog: MatDialog,
                       private readonly router: Router,
                       private readonly taskCommentService: TaskCommentService,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly actionPointService: ActionPointService,
                       private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService,
                       private readonly actionPointStructureService: ActionPointStructureService,
                       private readonly translateService: TranslateService) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.actionPointId = param.id;
            this.getAllComments();
        });
        this.addCommentForm = this.formBuilder.group({
            newComment: [
                '',
                Validators.required
            ],
            attachment: ['']
        });
    }

    public onCancel(): void {
        this.router.navigate([routes.listRoute]);
    }

    public onDelete(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: this.translateService.instant('confirmation.actionPoint.title'),
              message: this.translateService.instant('confirmation.actionPoint.message'),
              rejectionButtonText: this.translateService.instant('confirmation.actionPoint.rejectButton'),
              confirmationButtonText: this.translateService.instant('confirmation.actionPoint.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
        .subscribe((result: any): void => {

            if (!result) {
                return;
            }

            this.actionPointService.deleteActionPoint(this.actionPointId)
                .subscribe(
                    (): void => {
                        this.notificationService.openSuccessNotification('success.delete');
                        this.router.navigate([routes.listRoute]);
                    }, (): void => {
                        this.notificationService.openErrorNotification('error.delete');
                    }
                );

        });
    }

    public onSave(): void {
        if (!this.formData) {
            return;
        }
        this.actionPointService.editActionPoint(this.actionPointId, this.transformActionPointToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.edit');
                this.router.navigate([routes.listRoute]);
            }, (): void => {
                this.notificationService.openErrorNotification('error.edit');
            });
    }

    public onCommentAdded(): void {
        if (this.addCommentForm.invalid) {
            return;
        }
        const comment = this.addCommentForm.value.newComment.toString();
        if (RegExp(Regex.httpsStringPattern)
            .test(comment)) {
            this.sendUrlMessage(comment);
        } else {
            this.sendTextMessage(comment);
        }
    }

    public onAttachmentAdded(): void {
        const actionPointComment: ActionPointComment = {
            description: '',
            actionPointId: this.actionPointId,
            type: CommentType.Attachment,
            attachment: {
                type: 'COMMENT',
                format: this.attachmentFormat,
                fileName: this.attachmentFileName,
                filePath: this.attachmentPathName
            }
        };

        this.onSendCommentService(actionPointComment);
    }

    public onSendCommentService(actionPointComment): void {
        this.loading = true;
        this.taskCommentService.addComment(actionPointComment)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.getAllComments();
                this.addCommentForm.controls.newComment.reset();
            }, (): void => {
                this.notificationService.openErrorNotification('error.addComment');
            });
    }

    public getAllComments(): void {
        this.loading = true;
        this.taskCommentService.getAllComment(this.actionPointId, 'actionPoint')
            .pipe(finalize((): any => this.loading = false))
            .subscribe((comments: TaskCommentResponse[]): void => {
                this.comments = [...comments].sort((comparableCommentTaskResponse: TaskCommentResponse,
                                                    comparedCommentTaskResponse: TaskCommentResponse): number => (comparableCommentTaskResponse.created >
                    comparedCommentTaskResponse.created) ? 1 : -1)
                                             .reverse();
            }, (): void => {
                this.notificationService.openErrorNotification('error.loadComments');
            });
    }

    public hasRoleUploadImage(): boolean {
        return this.authService.hasRole(Role.RoleUploadImage);
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    public onFileChange(event): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (): void => {
            this.imagesService.uploadImages([file])
                .subscribe((data: any): void => {
                    this.attachmentFormat = file.name.split('.')
                                                .pop()
                                                .toUpperCase();
                    this.attachmentFileName = file.name;
                    this.attachmentPathName = data.fileNames[file.name].replace(/^.*[\\\/]/, '');
                    this.onAttachmentAdded();
                }, (): void => {
                    this.attachmentFormat = '';
                    this.attachmentFileName = '';
                    this.attachmentPathName = '';
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public allowReadComment(): boolean {
        return this.hasRoleReadComment() || this.hasRoleReadCommentInAssignProject();
    }

    public allowUpdateTask(): boolean {
        return this.hasRoleUpdateTask() || this.hasRoleUpdateTaskInAssignProject();
    }

    public allowDeleteActionPoint(): boolean {
        return this.hasRoleDeleteActionPoint();
    }

    public allowCreateComment(): boolean {
        return this.hasRoleCreateComment() || this.hasRoleCreateCommentInAssignProject();
    }

    public trackCommentById(index: number, item: TaskCommentResponse): any {
        return item.id;
    }

    private sendTextMessage(comment: string): void {
        const actionPointComment: ActionPointComment = {
            description: comment,
            actionPointId: this.actionPointId,
            type: CommentType.Text
        };
        this.onSendCommentService(actionPointComment);
    }

    private sendUrlMessage(comment: string): void {
        const actionPointComment: ActionPointComment = {
            description: comment,
            actionPointId: this.actionPointId,
            type: CommentType.Url
        };
        this.onSendCommentService(actionPointComment);
    }

    private hasRoleUpdateTask(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTask);
    }

    private hasRoleUpdateTaskInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTaskInAssignProject);
    }

    private hasRoleReadComment(): boolean {
        return this.authService.hasRole(Role.RoleReadComment);
    }

    private hasRoleReadCommentInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleReadCommentInAssignProject);
    }

    private hasRoleCreateComment(): boolean {
        return this.authService.hasRole(Role.RoleCreateComment);
    }

    private hasRoleCreateCommentInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateCommentInAssignProject);
    }

    private hasRoleDeleteActionPoint(): boolean {
        return this.authService.hasRole(Role.RoleDeleteActionPoint);
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

}
