import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDetail } from '../../models/project-detail.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService extends ProjectService<ProjectDetail> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService, ) {
        super(http, 'projects', notificationService, userService);
    }

    public getProjectByProjectId(projectId: number): Observable<ProjectDetail> {
        return this.getDetail(projectId);
    }

    /**
     * Edit project object API call
     * @param id
     * @param taskObject
     */
    public editProject(id: number, projectObject: any) {
        return this.update(id, projectObject);
    }
}
