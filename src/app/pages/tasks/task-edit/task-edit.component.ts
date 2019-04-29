import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { TaskComment, TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
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
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;
    public addCommentForm: FormGroup;
    public comments: TaskCommentResponse[] = [];
    public loading = false;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    private taskId: number;

    public constructor(
        private readonly router: Router,
        private readonly taskCommentService: TaskCommentService,
        private readonly notificationService: NotificationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly taskService: TaskService,
        private readonly formBuilder: FormBuilder,
        public readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.taskId = param.id;
            this.getAllComments();
        });
        this.addCommentForm = this.formBuilder.group({
            newComment: ['', Validators.required]
        });
    }

    public onCancel() {
        this.router.navigate(['tasks/list']);
    }

    public onSave() {
        console.log('save', this.formData);
        if (this.formData) {
            this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData)).subscribe(
                (response) => {
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
            taskId: this.taskId
        };
        this.loading = true;
        this.taskCommentService.addComment(taskComment)
            .subscribe((commentResponse: TaskCommentResponse) => {
                this.getAllComments();
                this.addCommentForm.reset();
                this.loading = false;
            }, (error) => {
                this.notificationService.openErrorNotification('error.addComment');
                this.loading = false;
            });
    }

    public getAllComments() {
        this.loading = true;
        this.taskCommentService.getAllComment(this.taskId)
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe((comments: TaskCommentResponse[]) => {
                this.comments = [...comments].reverse();
            }, (error) => {
                this.notificationService.openErrorNotification('error.loadComments');
            });

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
