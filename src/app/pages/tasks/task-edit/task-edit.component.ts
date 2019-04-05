import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComment, TaskCommentResponse } from 'src/app/shared/interfaces/task-comment.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormControl, Validators } from '@angular/forms';
import { TaskCommentService } from 'src/app/shared/services/task-comment.service';

@Component({
    selector: 'task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

    private taskId: number;
    public newComment: FormControl = new FormControl("", Validators.required);
    public comments: TaskCommentResponse[] = [];
    public loading = false;
    public changedDataForm: FormGroup;

    private taskId: number;

    public constructor(
        private router: Router,
        private readonly taskCommentService: TaskCommentService,
        private readonly notificationService: NotificationService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {

    }

    public ngOnInit(): void {
        this.changedDataForm = this.formBuilder.group({
            changedAt: {value: 'changedAt', disabled: true},
            changedBy: {value: 'changedBy', disabled: true},
        });

        this.route.params.subscribe((params) => {
            this.taskId = Number.parseInt(params.id);
            this.getAllComments();
        });
    }

    public onCancel() {
        this.router.navigate(['tasks/list']);
    }

    public onSave() {

        // if (this.taskForm.invalid) {
        //     return;
        // }
        //
        // if (this.f.title.value.trim() == '') {
        //     this.taskForm.get('title').setValue(null);
        // }

    }

    public onCommentAdded() {

        this.newComment.markAsTouched();

        if(this.newComment.invalid) {
            return;
        }

        let taskComment: TaskComment = { description: this.newComment.value, taskId: this.taskId }
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

}
