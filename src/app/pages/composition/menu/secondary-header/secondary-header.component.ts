import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecondaryHeader } from 'src/app/shared/interfaces/secondary-header.interface';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { fadeEnterLeave } from '../../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectEventService } from '../../../../shared/services/project-event.service';

@Component({
    selector: 'secondary-header',
    templateUrl: './secondary-header.component.html',
    styleUrls: ['./secondary-header.component.scss'],
    animations: [fadeEnterLeave]
})
export class SecondaryHeaderComponent implements OnInit {

    public dashboardVisible = true;
    public activeFilter = 'ALL';
    public secondaryHeaderTitle = '';

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly router: Router,
                       private readonly dashboardService: DashboardService,
    ) {
    }

    public ngOnInit() {
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.dashboardService.secondaryHeaderNotifier$.subscribe((secondaryHeader: SecondaryHeader) => {
            if (secondaryHeader.isDashboard) {
                this.dashboardVisible = true;
                this.secondaryHeaderTitle = '';
                this.activeFilter = 'ALL';
            } else {
                this.secondaryHeaderTitle = secondaryHeader.title;
                this.dashboardVisible = false;
            }
        });
    }

    public toggleFilter(filterValue: string) {
        
        this.dashboardService.setDashboardFilter(filterValue);

        this.activeFilter = 
                (filterValue === 'ALL') ? 'ALL' :
                (filterValue === 'OPEN') ? 'OPEN' :
                (filterValue === 'CLOSED') ? 'CLOSED' : 'ALL';

    }


    public routeToDashboard() {
        this.router.navigate(['dashboard']);
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.projectEventService.setEventData('', false);
    }

}
