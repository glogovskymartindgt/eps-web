import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Project } from '../../../shared/models/project.model';
import { SortService } from '../../../shared/services/core/sort.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'iihf-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
    animations: [fadeEnterLeave]
})

export class ProjectCardComponent implements OnInit {
    @Input() public project: Project;
    public imagePath: any;
    public countriesTag: string[] = []
    public venuesTag: string[] = []

    public constructor(private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly imagesService: ImagesService,
                       private readonly sortService: SortService) {
        this.imagePath = this.projectEventService.imagePath
    }

    /**
     * Project data setup in initalization
     */
    public ngOnInit(): void {
        this.getImagePath();
        if (this.project?.venues?.length === 0){
            return
        }
        this.project.venues.sort(this.sortService.numericSortByScreenPosition);
        this.project.venues.forEach(venue => {
            if (!this.countriesTag.find(c => c === venue.country)){
                this.countriesTag.push(venue.country)
            }
            if (!this.venuesTag.find(v => v === venue.city)){
                this.venuesTag.push(venue.city)
            }
        })
    }

    /**
     * Route to selected project detail screen
     */
    public openAreas(): void {
        this.router.navigate(['project/detail']);
    }

    /**
     * Using projectEventService to store selected project information into local storage
     * Apply changes on second header to show project title logo and unselect project button
     */
    public onProjectSelected(): void {
        this.projectEventService.setEventData(this.project, true, this.imagePath);
        this.dashboardService.setSecondaryHeaderContent({
            isDashboard: false,
            title: `${this.project.year} ${this.project.name}`
        });
        this.openAreas();
    }

    public getImagePath(): any {
        if (!this.project.logo) {
            return;
        }
        this.imagesService.getImage(this.project.logo)
            .subscribe((blob: Blob): void => {
                const reader = new FileReader();
                reader.onload = (): void => {
                    this.imagePath = reader.result;
                };
                reader.readAsDataURL(blob);
            });
    }

}
