import { Component, OnInit } from '@angular/core';
import { Role } from '../../../shared/enums/role.enum';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})

/**
 * Custom responsive design project list of cards with filter option
 */
export class ProjectListComponent implements OnInit {

    public projects: ProjectInterface[] = [];

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly dashboardService: DashboardService,
        private readonly authService: AuthService,
    ) {
    }

    /**
     * Create filter listener on projects and set default value to ALL
     */
    public ngOnInit() {
        this.dashboardService.dashboardFilterNotifier$.subscribe((filterValue: string) => {
            this.filterProjects(filterValue);
        });
        this.filterProjects('ALL');
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
    }

    /**
     * Filter projects based on selected filter
     * @param filterValue
     */
    private filterProjects(filterValue = 'ALL') {
        this.dashboardService.filterProjects(filterValue).subscribe((data: ProjectInterface[]) => {
            this.projects = data;
            this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        });
    }

}
