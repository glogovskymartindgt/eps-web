import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowseResponse, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { TaskInterface } from '../../interfaces/task.interface';
import { Tag } from '../../models/tag.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class TagService extends ProjectService<TaskInterface> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'tag', notificationService, userService);
    }

    public browseTags(): Observable<BrowseResponse<Tag>> {
        const filters = [];
        const sort = [];

        return this.browseWithSummary(PostContent.create(NaN, NaN, filters, sort));
    }

}
