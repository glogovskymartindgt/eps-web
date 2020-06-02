import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, CommentResponse } from '../interfaces/task-comment.interface';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Fact service communicating with 'comment' API url
 */
export class CommentService extends ProjectService<Comment> {

  public constructor(
      http: HttpClient,
      notificationService: NotificationService,
      userService: ProjectUserService,
) {
    super(http, 'comment', notificationService, userService);
}

    /**
     * Add comment object with API call
     * @param comment
     */
  public addComment(comment: Comment): Observable<CommentResponse> {
      return this.add<CommentResponse>(comment);
  }

  public getAllComment(id: number, type: string): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(
          `${environment.URL_API}/comment/${type}/${id}`,
          {headers: this.getHeader()}
    );
  }
}
