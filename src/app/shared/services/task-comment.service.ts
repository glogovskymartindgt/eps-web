import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';
import { TaskComment, TaskCommentResponse } from '../interfaces/task-comment.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService extends ProjectService<any> {//TODO comment from BE interface create

  public constructor(
      http: HttpClient,
      notificationService: NotificationService,
      userService: ProjectUserService,
) {
    super(http, 'comment', notificationService, userService);
}

  public addComment(taskComment: TaskComment): Observable<TaskCommentResponse> {

    return this.http.post<TaskCommentResponse>(
        environment.URL_API + '/comment',
        taskComment,
        {headers: this.getHeader()}
    );

  }

  public getAllComment(taskId: number): Observable<TaskCommentResponse[]> {

    return this.http.get<TaskCommentResponse[]>(
          environment.URL_API + '/comment/' + taskId,
          {headers: this.getHeader()}
    );

  }

}
