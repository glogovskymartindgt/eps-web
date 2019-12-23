import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Project } from '../../../shared/models/project.model';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'iihf-project-list',
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
                       private readonly userDataService: UserDataService,
                       private readonly projectUserService: ProjectUserService,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router) {
    }

    /**
     * Create filter listener on projects and set default value to ALL
     */
    public ngOnInit(): void {
        this.filterProjects('ALL');
        this.dashboardService.dashboardFilterNotifier$.subscribe((filterValue: string) => {
            this.filterProjects(filterValue);
        });
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.initializeUserPhoto();
    }

    public openCreateProjectDetail(): void {
        this.router.navigate(['dashboard/create']);
    }

    public hasRoleCreateProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateProject);
    }

    public trackProjectById(index: number, project: Project): number {
        return project.id;
    }

    /**
     * Filter projects based on selected filter
     * @param filterValue
     */
    private filterProjects(filterValue = 'ALL'): void {
        this.dashboardService.filterProjects(filterValue)
            .subscribe((data: ProjectInterface[]) => {
                this.projects = data;
                this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
            });
    }

    private initializeUserPhoto(): void {
        this.userDataService.getOwnUserDetail(this.projectUserService.instant.userId)
            .subscribe((user: User) => {
                if (user.avatar) {
                    this.imagesService.getImage(user.avatar)
                        .subscribe((blob: Blob) => {
                            const reader = new FileReader();
                            reader.onload = (): void => {
                                this.projectUserService.setProperty('avatar', (reader.result) as string);
                            };
                            reader.readAsDataURL(blob);
                        }, () => {
                            this.notificationService.openErrorNotification('error.imageDownload');
                        });
                }
            });

    }

}
