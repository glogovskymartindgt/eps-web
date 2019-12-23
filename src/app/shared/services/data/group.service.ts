import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowseResponse, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { TaskInterface } from '../../interfaces/task.interface';
import { Group } from '../../models/group.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends ProjectService<TaskInterface> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'group', notificationService, userService);
    }

    public browseGroups(): Observable<BrowseResponse<Group>> {
        const filters = [];
        const sort = [new Sort('CODE', 'ASC')];

        return this.browseWithSummary(PostContent.create(NaN, NaN, filters, sort));
    }

}
