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
import { CommentResponse, TaskComment } from '../../../shared/interfaces/task-comment.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'iihf-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public addCommentForm: FormGroup;
    public comments: CommentResponse[] = [];
    public loading = false;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public attachmentFormat = '';
    public attachmentFileName = '';
    public attachmentPathName = '';
    public readonly role: typeof Role = Role;
    private taskId: number;

    public constructor(private readonly router: Router,
                       private readonly commentService: CommentService,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly taskService: TaskService,
                       private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService,
                       private readonly dialog: MatDialog,
                       private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: Params): void => {
            this.taskId = param.id;
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
        this.navigateToTaskList();
    }

    public onSave(): void {
        if (this.formData) {
            this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.navigateToTaskList();
                }, (): void => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    public onDelete(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant('confirmation.task.title'),
                message: this.translateService.instant('confirmation.task.message'),
                rejectionButtonText: this.translateService.instant('confirmation.task.rejectButton'),
                confirmationButtonText: this.translateService.instant('confirmation.task.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {
                if (!result) {
                    return;
                }

                this.taskService.deleteTask(this.taskId)
                    .subscribe((): void => {
                        this.notificationService.openSuccessNotification('success.delete');
                        this.navigateToTaskList();
                    }, (): void => {
                        this.notificationService.openErrorNotification('error.delete');
                    });
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
        const taskComment: TaskComment = {
            description: '',
            taskId: this.taskId,
            type: CommentType.Attachment,
            attachment: {
                type: 'COMMENT',
                format: this.attachmentFormat,
                fileName: this.attachmentFileName,
                filePath: this.attachmentPathName
            }
        };

        this.onSendCommentService(taskComment);
    }

    public onSendCommentService(taskComment): void {
        this.loading = true;
        this.commentService.addComment(taskComment)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((commentResponse: CommentResponse): void => {
                this.getAllComments();
                this.addCommentForm.controls.newComment.reset();
            }, (): void => {
                this.notificationService.openErrorNotification('error.addComment');
            });
    }

    public getAllComments(): void {
        this.loading = true;
        this.commentService.getAllComment(this.taskId, 'task')
            .pipe(finalize((): any => this.loading = false))
            .subscribe((comments: CommentResponse[]): any => {
                this.comments = [...comments].sort((taskCommentResponseComparable: CommentResponse, taskCommentResponseCompared: CommentResponse): any => {
                                                 return (taskCommentResponseComparable.created > taskCommentResponseCompared.created) ? 1 : -1;
                                             })
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

    public allowCreateComment(): boolean {
        return this.hasRoleCreateComment() || this.hasRoleCreateCommentInAssignProject();
    }

    public deleteComment(comment: CommentResponse): void {
        this.loading = true;
        this.commentService.deleteById(comment.id)
            .subscribe((): void => {
                this.getAllComments();
            }, (): any => this.loading = false);
    }

    public trackCommentById(index: number, item: CommentResponse): any {
        return item.id;
    }

    private sendTextMessage(comment: string): void {
        const taskComment: TaskComment = {
            description: comment,
            taskId: this.taskId,
            type: CommentType.Text
        };
        this.onSendCommentService(taskComment);
    }

    private sendUrlMessage(comment: string): void {
        const taskComment: TaskComment = {
            description: comment,
            taskId: this.taskId,
            type: CommentType.Url
        };
        this.onSendCommentService(taskComment);
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

    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            name: formObject.title,
            state: formObject.state,
            dueDate: formObject.dueDate,
            clSourceOfAgendaId: formObject.sourceOfAgenda,
            projectPhaseId: formObject.phase,
            responsibleUserId: formObject.responsible,
            cityName: formObject.venue,
            description: formObject.description,
            sourceDescription: formObject.sourceDescription,
        };
        if (formObject.trafficLight !== '') {
            apiObject.trafficLight = formObject.trafficLight;
        }

        return apiObject;
    }

    private navigateToTaskList(): void {
        this.router.navigate(['tasks', 'list']);
    }
}
