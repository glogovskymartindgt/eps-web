import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})

export class ProjectListComponent implements OnInit {

    public projects: ProjectInterface[] = [];

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly dashboardService: DashboardService,
    ) {
    }

    public ngOnInit() {

        this.dashboardService.dashboardFilterNotifier$.subscribe((filterValue: string) => {
            this.filterProjects(filterValue);
        });
        this.filterProjects('ALL');
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
    }

    private filterProjects(filterValue = 'ALL') {
        this.dashboardService.filterProjects(filterValue).subscribe((data: ProjectInterface[]) => {
            this.projects = data;
            this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        });
    }

}
