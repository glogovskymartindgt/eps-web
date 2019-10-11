import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
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
    selector: 'task-edit',
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
        this.activatedRoute.queryParams.subscribe((param) => {
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

    public onCancel() {
        this.router.navigate(['tasks/list']);
    }

    public onSave() {
        if (this.formData) {
            this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData))
                .subscribe((response) => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate(['tasks/list']);
                }, (error) => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    public onCommentAdded() {
        if (this.addCommentForm.invalid) {
            return;
        }
        const taskComment: TaskComment = {
            description: this.addCommentForm.value.newComment.toString(),
            taskId: this.taskId,
            type: 'TEXT'
        };

        this.onSendCommentService(taskComment);
    }

    public onAttachmentAdded() {
        const taskComment: TaskComment = {
            description: '',
            taskId: this.taskId,
            type: 'ATTACHMENT',
            attachment: {
                type: 'COMMENT',
                format: this.attachmentFormat,
                fileName: this.attachmentFileName,
                filePath: this.attachmentPathName
            }
        };

        this.onSendCommentService(taskComment);
    }

    public onSendCommentService(taskComment) {
        this.loading = true;
        this.taskCommentService.addComment(taskComment)
            .subscribe((commentResponse: TaskCommentResponse) => {
                this.getAllComments();
                this.addCommentForm.controls.newComment.reset();
                this.loading = false;
            }, (error) => {
                this.notificationService.openErrorNotification('error.addComment');
                this.loading = false;
            });
    }

    public getAllComments() {
        this.loading = true;
        this.taskCommentService.getAllComment(this.taskId)
            .pipe(tap(() => this.loading = false))
            .subscribe((comments: TaskCommentResponse[]) => {
                this.comments = [...comments].reverse();
            }, (error) => {
                this.notificationService.openErrorNotification('error.loadComments');
            });

    }

    public hasRoleUpdateTask() {
        return this.authService.hasRole(Role.RoleUpdateTask);
    }

    public hasRoleReadComment() {
        return this.authService.hasRole(Role.RoleReadComment);
    }

    public hasRoleCreateComment() {
        return this.authService.hasRole(Role.RoleCreateComment);
    }

    public hasRoleUploadImage() {
        return this.authService.hasRole(Role.RoleUploadImage);
    }

    public formDataChange($event) {
        setTimeout(() => {
            this.formData = $event;
        }, 200);
    }

    public onFileChange(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.imagesService.uploadImages([file])
                .subscribe((data) => {
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
