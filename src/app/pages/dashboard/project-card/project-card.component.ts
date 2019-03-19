import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInterface } from 'src/app/shared/interfaces/project.interface';
import { ProjectEventService } from '../../../shared/services/project-event.service';
import { DashboardService } from './../../../shared/services/dashboard.service';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

    @Input() public project: ProjectInterface;

    public constructor(private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly projectEventService: ProjectEventService
    ) {
    }

    public ngOnInit() {
    }

    public openAreas() {
        this.router.navigate(['business-areas/list']);
    }

    public onProjectSelected() {
        this.projectEventService.setEventData('Project 2019', true);
        const selectedProject = '2021 IIHF Ice Hockey World Championship';
        this.openAreas();
        this.dashboardService.setSecondaryHeaderContent({
            isDashboard: false, title: selectedProject
        });
    }

}
