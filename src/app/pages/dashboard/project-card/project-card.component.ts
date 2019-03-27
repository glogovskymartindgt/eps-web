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
        if (this.project.cities !== null && this.project.cities.length === 2) {
            if (this.project.cities[0] !== this.project.cities[1]) {
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
        this.projectEventService.setEventData(
            `${this.project.year} ${this.project.name}`,
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
