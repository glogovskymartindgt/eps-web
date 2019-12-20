import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { finalize } from 'rxjs/operators';
import { CommentType } from '../../../shared/enums/comment-type.enum';
import { Role } from '../../../shared/enums/role.enum';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { TaskComment, TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskCommentService } from '../../../shared/services/task-comment.service';
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
    public comments: TaskCommentResponse[] = [];
    public loading = false;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public attachmentFormat = '';
    public attachmentFileName = '';
    public attachmentPathName = '';
    private taskId: number;

    public constructor(private readonly router: Router,
                       private readonly taskCommentService: TaskCommentService,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly taskService: TaskService,
                       private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params) => {
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
        this.router.navigate(['tasks/list']);
    }

    public onSave(): void {
        if (this.formData) {
            this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData))
                .subscribe(() => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate(['tasks/list']);
                }, () => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
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
        this.taskCommentService.addComment(taskComment)
            .pipe(finalize(() => this.loading = false))
            .subscribe((commentResponse: TaskCommentResponse) => {
                this.getAllComments();
                this.addCommentForm.controls.newComment.reset();
            }, () => {
                this.notificationService.openErrorNotification('error.addComment');
            });
    }

    public getAllComments(): void {
        this.loading = true;
        this.taskCommentService.getAllComment(this.taskId, 'task')
            .pipe(tap(() => this.loading = false))
            .subscribe((comments: TaskCommentResponse[]) => {
                this.comments = [...comments].sort((taskCommentResponseComparable: TaskCommentResponse, taskCommentResponseCompared: TaskCommentResponse) => {
                                                 return (taskCommentResponseComparable.created > taskCommentResponseCompared.created) ? 1 : -1;
                                             })
                                             .reverse();
            }, () => {
                this.notificationService.openErrorNotification('error.loadComments');
            });

    }

    public hasRoleUploadImage(): boolean {
        return this.authService.hasRole(Role.RoleUploadImage);
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout(() => {
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
                .subscribe((data: any) => {
                    this.attachmentFormat = file.name.split('.')
                                                .pop()
                                                .toUpperCase();
                    this.attachmentFileName = file.name;
                    this.attachmentPathName = data.fileNames[file.name].replace(/^.*[\\\/]/, '');
                    this.onAttachmentAdded();
                }, () => {
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

    public trackCommentById(index: number, item: TaskCommentResponse): any {
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

}
