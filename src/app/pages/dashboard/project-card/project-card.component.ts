import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectEventService } from '../../../shared/services/project-event.service';
import { DashboardService } from './../../../shared/services/dashboard.service';
import { Project } from 'src/app/shared/models/project.model';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
    animations: [fadeEnterLeave]
})
export class ProjectCardComponent implements OnInit {
    @Input() public project: Project;

    show2Cities: boolean = false;
    show1City: boolean = false;
    show2Countries: boolean = false;
    show1Country: boolean = false;

    public constructor(private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly projectEventService: ProjectEventService
    ) {
    }

    public ngOnInit() {
        console.log(this.project);
        if (this.project.cities != null && this.project.cities.length == 2) {
            if (this.project.cities[0] != this.project.cities[1]) {
                this.show2Cities = true;
            } else {
                this.show2Cities = false;
                this.show1City = true;
            }
        }

        if (this.project.countries != null && this.project.countries.length == 2) {
            if (this.project.countries[0] != this.project.countries[1]) {
                this.show2Countries = true;
            } else {
                this.show2Countries = false;
                this.show1Country = true;
            }
        }
    }

    public openAreas() {
        this.router.navigate(['business-areas/list']);
    }

    public onProjectSelected() {
        this.projectEventService.setEventData('Project 2019', true);
        const selectedProject = '2021 IIHF Ice Hockey World Championship';
        this.dashboardService.setSecondaryHeaderContent({isDashboard: false, title: this.project.year + ' '+ this.project.name});
        this.openAreas();
    }

}
