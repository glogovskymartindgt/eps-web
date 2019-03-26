import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Filter } from '../hazlenut/hazelnut-common/models';
import { ProjectInterface } from '../interfaces/project.interface';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './project-user.service';
import { ProjectService } from './project.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ProjectService<ProjectInterface>{
    private readonly secondaryHeader = new Subject<SecondaryHeader>();
    public secondaryHeaderNotifier$ = this.secondaryHeader.asObservable();

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'projects', notificationService, userService);
    }

    public filterProjects(state: string) {
        const filters = [];
        filters.push(new Filter('STATE', state, 'ENUM'));
        return this.filter(filters);
    }

    public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader) {
        this.secondaryHeader.next(secondaryHeader);
    }

}
