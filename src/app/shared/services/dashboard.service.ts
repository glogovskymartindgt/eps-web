import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Filter } from '../hazlenut/hazelnut-common/models';
import { ProjectInterface } from '../interfaces/project.interface';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ProjectService<ProjectInterface> {
    private readonly secondaryHeader = new Subject<SecondaryHeader>();
    private readonly dashboardFilter = new Subject<string>();
    public dashboardFilterNotifier$ = this.dashboardFilter.asObservable();

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'projects', notificationService, userService);
    }

    /**
     * Add state filter
     * @param state
     */
    public filterProjects(state: string) {
        const filters = [];
        if (state !== 'ALL') {
            filters.push(new Filter('STATE', state, 'ENUM'));
        }
        return this.filter(filters);
    }

    public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader) {
        this.secondaryHeader.next(secondaryHeader);
    }

    public setDashboardFilter(filterValue: string) {
        this.dashboardFilter.next(filterValue);
    }

}
