import { Venue } from './../../../shared/interfaces/venue.interface';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/shared/models/project.model';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
    animations: [fadeEnterLeave]
})
export class ProjectCardComponent implements OnInit {
    @Input() public project: Project;

    public show2Cities = false;
    public show1City = false;
    public show2Countries = false;
    public show1Country = false;
    public imagePath = '';

    public constructor(private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly projectEventService: ProjectEventService
    ) {
    }

    public ngOnInit() {
        this.imagePath = this.getImagePath(this.project.id);

        if(this.project.venues !== null && this.project.venues.length === 1) {
        
            this.show1City = true;
            this.show2Cities = false;
            this.show1Country = true;
            this.show2Countries = false;

        }

        if(this.project.venues !== null && this.project.venues.length === 2) {

            let pos1 = this.project.venues[0].screenPosition;
            let pos2 = this.project.venues[1].screenPosition;
            if ( (pos1 !== null && pos2 !== null) && (pos2 < pos1) ) {
                let venue: Venue = this.project.venues[0];
                this.project.venues[0] = this.project.venues[1];
                this.project.venues[1] = venue;
            }

            if (this.project.venues[0].country === this.project.venues[1].country) {
                this.show1Country = true;
                this.show2Countries = false;
            } else {
                this.show1Country = false;
                this.show2Countries = true;
            }

            if (this.project.venues[0].city === this.project.venues[1].city) {
                this.show1City = true;
                this.show2Cities = false;
            } else {
                this.show1City = false;
                this.show2Cities = true;
            }

        }

    }

    public openAreas() {
        this.router.navigate(['business-areas/list']);
    }

    public onProjectSelected() {
        this.projectEventService.setEventData(
            +this.project.year,
            this.project.name,
            true,
            this.project.state === 'OPEN',
            this.imagePath
        );
        this.dashboardService.setSecondaryHeaderContent({
            isDashboard: false,
            title: this.project.year + ' ' + this.project.name
        });
        this.openAreas();
    }

    public getImagePath(projectId: number) {
        return `assets/img/event-logos/${2017 + projectId - 1}.png`;
    }

}
