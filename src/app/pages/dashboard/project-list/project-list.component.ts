import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';
import { UserPhotoService } from '../../../shared/services/user-photo.service';

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})

/**
 * Custom responsive design project list of cards with filter option
 */ export class ProjectListComponent implements OnInit {

    public projects: ProjectInterface[] = [];

    public constructor(private readonly projectEventService: ProjectEventService,
                       private readonly dashboardService: DashboardService,
                       private readonly authService: AuthService,
                       private readonly userPhotoService: UserPhotoService,
                       private readonly userDataService: UserDataService,
                       private readonly projectUserService: ProjectUserService) {
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
        this.initializeUserPhoto();
    }

    /**
     * Filter projects based on selected filter
     * @param filterValue
     */
    private filterProjects(filterValue = 'ALL') {
        this.dashboardService.filterProjects(filterValue)
            .subscribe((data: ProjectInterface[]) => {
                this.projects = data;
                this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
            });
    }

    private initializeUserPhoto(): void {
        this.userDataService.getUserDetail(this.projectUserService.instant.id)
            .subscribe((user) => {
                if (user.avatar) {
                    this.userPhotoService.changePhoto(user.avatar);
                }
            });

    }

}
