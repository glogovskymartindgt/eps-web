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
    public activeFilter = 'all';
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
            } else {
                this.secondaryHeaderTitle = secondaryHeader.title;
                this.dashboardVisible = false;
            }
        });
    }

    public toggleFilter(value: 'all' | 'open' | 'closed') {
        this.activeFilter = (value === 'all') ? 'all' :
            (value === 'open') ? 'open' :
                (value === 'closed') ? 'closed' : 'all';
        this.filterProjects(value);
    }

    private filterProjects(value: 'all' | 'open' | 'closed') {
        // this.dashboardService.filterProjects(value)
        //   .subscribe((filteredProjects: ProjectInterface[]) => {
        //     console.log(filteredProjects);
        //     this.allProjects = filteredProjects;
        // });

    }

    public routeToDashboard() {
        this.router.navigate(['dashboard']);
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.projectEventService.setEventData('', false);
    }

}
