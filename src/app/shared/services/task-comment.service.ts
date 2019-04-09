import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskComment, TaskCommentResponse } from '../interfaces/task-comment.interface';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService extends ProjectService<any> {// TODO comment from BE interface create

  public constructor(
      http: HttpClient,
      notificationService: NotificationService,
      userService: ProjectUserService,
) {
    super(http, 'comment', notificationService, userService);
}

  public addComment(taskComment: TaskComment): Observable<TaskCommentResponse> {

    return this.http.post<TaskCommentResponse>(
        `${environment.URL_API}/comment`,
        taskComment,
        {headers: this.getHeader()}
    );

  }

  public getAllComment(taskId: number): Observable<TaskCommentResponse[]> {

    return this.http.get<TaskCommentResponse[]>(
          `${environment.URL_API}/comment/${taskId}`,
          {headers: this.getHeader()}
    );

  }

}
