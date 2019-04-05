import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComment, TaskCommentResponse } from 'src/app/shared/interfaces/task-comment.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TaskCommentService } from 'src/app/shared/services/task-comment.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;

    public newComment: FormControl = new FormControl('', Validators.required);
    public comments: TaskCommentResponse[] = [];
    public loading = false;
    private taskId: number;

    public constructor(
        private router: Router,
        private readonly taskCommentService: TaskCommentService,
        private readonly notificationService: NotificationService,
        private activatedRoute: ActivatedRoute,
        private taskService: TaskService,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.taskId = param.id;
            this.getAllComments();
        });
    }

    public onCancel() {
        this.router.navigate(['tasks/list']);
    }

    public onSave() {
        this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData));
        // .subscribe(
        //     (response) => {
        //         console.log(response);
        //         this.notificationService.openSuccessNotification('success.edit');
        //         this.router.navigate(['tasks/list']);
        //     }, (error) => {
        //         console.log(error);
        //         this.notificationService.openErrorNotification('error.add');
        //     });
    }

    public onCommentAdded() {
        this.newComment.markAsTouched();
        if (this.newComment.invalid) {
            return;
        }
        const taskComment: TaskComment = {description: this.newComment.value, taskId: this.taskId};
        this.loading = true;
        this.taskCommentService.addComment(taskComment)
            .subscribe((commentResponse: TaskCommentResponse) => {
                this.newComment.reset();
                this.getAllComments();
                this.loading = false;
            }, (error) => {
                this.notificationService.openErrorNotification('error.addComment');
                this.loading = false;
            });
    }

    public getAllComments() {
        this.loading = true;
        this.taskCommentService.getAllComment(this.taskId)
            .subscribe((comments: TaskCommentResponse[]) => {
                this.comments = comments;
                this.comments.reverse();
                this.loading = false;
            }, (error) => {
                this.notificationService.openErrorNotification('error.loadComments');
                this.loading = false;
            });

    }

    private transformTaskToApiObject(formObject: any): any {
        console.log('editFormObject', formObject);
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
