import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../../shared/enums/role.enum';
import { fadeEnterLeave } from '../../../../shared/hazlenut/hazelnut-common/animations';
import { AuthService } from '../../../../shared/services/auth.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';

@Component({
    selector: 'secondary-header-project',
    templateUrl: './secondary-header-project.component.html',
    styleUrls: ['./secondary-header-project.component.scss'],
    animations: [fadeEnterLeave]
})
export class SecondaryHeaderProjectComponent implements OnInit {

    public dashboardVisible = true;
    public activeFilter = 'ALL';
    public imagePath = '';

    @Output() public onSectionSelected: EventEmitter<any> = new EventEmitter<any>();

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.imagePath = this.projectEventService.instant.imagePath;
        this.dashboardVisible = this.projectEventService.instant.active;
    }

    public toggleFilter(filterValue: string) {
        this.dashboardService.setDashboardFilter(filterValue);
        this.activeFilter = filterValue;
        this.imagePath = this.projectEventService.instant.imagePath;
    }

    public routeToDashboard() {
        this.activeFilter = 'ALL';
        this.router.navigate(['dashboard']);
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.projectEventService.setEventData();
    }

    public setSection(data) {
        this.projectEventService.setEventData(null, true, this.imagePath);
        this.onSectionSelected.emit(data);
    }

    public hasRoleAccessSettings(): boolean {
        return this.authService.hasRole(Role.RoleAccessSettings);
    }

}
