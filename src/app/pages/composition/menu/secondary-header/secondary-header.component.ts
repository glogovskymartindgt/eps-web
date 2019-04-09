import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../../shared/hazlenut/hazelnut-common/animations';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';

@Component({
    selector: 'secondary-header',
    templateUrl: './secondary-header.component.html',
    styleUrls: ['./secondary-header.component.scss'],
    animations: [fadeEnterLeave]
})
export class SecondaryHeaderComponent implements OnInit {

    public dashboardVisible = true;
    public activeFilter = 'ALL';
    public imagePath = '';

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly router: Router,
                       private readonly dashboardService: DashboardService,
    ) {
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

}
