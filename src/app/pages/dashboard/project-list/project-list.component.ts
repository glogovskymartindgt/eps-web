import { SecondaryHeader } from './../../../shared/interfaces/secondary-header.interface';
import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from 'src/app/shared/interfaces/project.interface';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/project-event.service';

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})

export class ProjectListComponent implements OnInit {

    public allProjects: ProjectInterface[] = [];
    private mockID = 0;

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly dashboardService: DashboardService,
    ) {
    }

    public ngOnInit() {
        // this.projectEventService.setEventData('', false);
        // const length = 35;
        // for (let i = 0; i < length; i++) {
        //     this.allProjects.push(this.mockProjectCard());
        // }

        this.dashboardService.dashboardFilterNotifier$.subscribe((filterValue: string) => {
            this.filterProjects(filterValue);
        });

        this.filterProjects('ALL');
        
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
    }

    private filterProjects(filterValue: string = 'ALL') {
        this.dashboardService.filterProjects(filterValue).subscribe((projects: ProjectInterface[])=>{
            this.allProjects = projects;
            this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        });
    }

    private mockProjectCard(): ProjectInterface {
        const newState = (this.mockID % 2 === 0) ? 'OPEN' : 'CLOSED';
        const card: ProjectInterface = {
            id: 1 + this.mockID,
            name: '2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP' + this.mockID,
            logo: 'https://picsum.photos/76/103',
            country_1: 'Belarus' + this.mockID,
            country_2: 'Latvia' + this.mockID,
            venue_city_1: 'Minsk' + this.mockID,
            venue_city_2: 'Riga' + this.mockID,
            state: newState
        };
        this.mockID++;
        return card;
    }

}
