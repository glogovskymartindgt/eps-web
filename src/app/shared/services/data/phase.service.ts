import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Phase } from '../../interfaces/phase.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})
export class PhaseService extends ProjectService<Phase[]> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'phase', notificationService, userService);
    }

    public getPhasesByProjectId(projectId: number): Observable<Phase[]> {
        return this.getDetail(projectId);
    }
}
