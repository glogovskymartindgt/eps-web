import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Project } from '../../../shared/models/project.model';
import { AuthService } from '../../../shared/services/auth.service';
import { FileService } from '../../../shared/services/core/file.service';
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
                       private readonly router: Router,
                       private readonly fileService: FileService) {
    }

    /**
     * Create filter listener on projects and set default value to ALL
     */
    public ngOnInit(): void {
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.dashboardService.dashboardFilterNotifier$.subscribe((filterValue: string): void => {
            this.filterProjects(filterValue);
        });

        this.initializeUserPhoto();
    }

    public openCreateProjectDetail(): void {
        this.router.navigate(['dashboard/create']);
    }

    public hasRoleCreateProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateProject);
    }

    public trackProjectBySelf(index: number, project: Project): Project {
        return project;
    }

    /**
     * Filter projects based on selected filter
     * @param filterValue
     */
    private filterProjects(filterValue = 'ALL'): void {
        this.dashboardService.filterProjects(filterValue)
            .subscribe((data: ProjectInterface[]): void => {
                this.projects = data;
                this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
            });
    }

    private initializeUserPhoto(): any {
        this.userDataService.getOwnUserDetail(this.projectUserService.instant.userId)
            .subscribe((user: User): void => {
                if (user.avatar) {
                    this.imagesService.getImage(user.avatar)
                        .subscribe((blob: Blob): void => {
                            this.fileService.readFile(blob, (result: string): void => {
                                this.projectUserService.setProperty('avatar', result);
                            });
                        }, (): void => {
                            this.notificationService.openErrorNotification('error.imageDownload');
                        });
                }
            });

    }

}
