import { Component, Input, OnInit } from '@angular/core';
import { TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'task-comment',
    templateUrl: './task-comment.component.html',
    styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

    @Input() public comment: TaskCommentResponse;
    @Input() public index: number;

    public isMyComment = false;

    public constructor(private readonly projectUserService: ProjectUserService) {
    }

    public ngOnInit() {
        this.projectUserService.subject.userId.subscribe((userId) => {
            this.isMyComment = userId === this.comment.createdBy.id;
        });
    }

}
