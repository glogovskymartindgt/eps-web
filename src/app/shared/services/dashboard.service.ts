import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../hazelnut/hazelnut-common/models';
import { ProjectInterface } from '../interfaces/project.interface';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ProjectService<ProjectInterface> {
    public dashboardFilterNotifier$;

    private readonly secondaryHeader = new BehaviorSubject<SecondaryHeader>({isDashboard: true});
    private readonly dashboardFilter = new BehaviorSubject<string>('ALL');

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'projects', notificationService, userService);
        this.dashboardFilterNotifier$ = this.dashboardFilter.asObservable();
    }

    /**
     * Add state filter
     * @param state
     */
    public filterProjects(state: string): any {
        const filters = [];
        if (state !== 'ALL') {
            filters.push(new Filter('STATE', state, 'ENUM'));
        }

        return this.filter(filters);
    }

    public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader): void {
        this.secondaryHeader.next(secondaryHeader);
    }

    public setDashboardFilter(filterValue: string): void {
        this.dashboardFilter.next(filterValue);
    }

}
