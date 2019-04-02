import { Component, Input, OnInit } from '@angular/core';
import { TaskCommentResponse } from 'src/app/shared/interfaces/task-comment.interface';
import { ProjectUserService } from 'src/app/shared/services/storage/project-user.service';

@Component({
  selector: 'task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

  @Input() comment: TaskCommentResponse;

  @Input() index: number;

  public isMyComment: boolean = false;

  public constructor(private readonly projectUserService: ProjectUserService) { }

  public ngOnInit() {
    this.projectUserService.subject.login.subscribe((login) => {
      this.isMyComment = (login == this.comment.createdBy) ? true : false;
  });
  }

}
