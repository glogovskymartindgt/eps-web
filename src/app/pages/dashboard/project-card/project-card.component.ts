import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Project } from '../../../shared/models/project.model';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
    animations: [fadeEnterLeave]
})

/**
 * Project card component with logo data
 */
export class ProjectCardComponent implements OnInit {
    @Input() public project: Project;

    public showAllCities = false;
    public showOneCity = false;
    public showAllCountries = false;
    public showOneCountry = false;
    public imagePath = '';

    public constructor(private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly projectEventService: ProjectEventService
    ) {
    }

    /**
     * Project data setup in intialization
     */
    public ngOnInit() {
        this.imagePath = this.getImagePath();
        if (this.project.venues !== null && this.project.venues.length === 1) {
            this.showOneCity = true;
            this.showAllCities = false;
            this.showOneCountry = true;
            this.showAllCountries = false;
        }
        if (this.project.venues !== null && this.project.venues.length === 2) {
            const firstPosition = this.project.venues[0].screenPosition;
            const secondPosition = this.project.venues[1].screenPosition;
            if ((firstPosition !== null && secondPosition !== null) && (secondPosition < firstPosition)) {
                const venue: Venue = this.project.venues[0];
                this.project.venues[0] = this.project.venues[1];
                this.project.venues[1] = venue;
            }
            if (this.project.venues[0].country === this.project.venues[1].country) {
                this.showOneCountry = true;
                this.showAllCountries = false;
            } else {
                this.showOneCountry = false;
                this.showAllCountries = true;
            }
            if (this.project.venues[0].city === this.project.venues[1].city) {
                this.showOneCity = true;
                this.showAllCities = false;
            } else {
                this.showOneCity = false;
                this.showAllCities = true;
            }
        }
    }

    /**
     * Route to selected project detail screen
     */
    public openAreas() {
        this.router.navigate(['project/detail']);
    }

    /**
     * Using projectEventService to store selected project information into local storage
     * Apply changes on second header to show project title logo and unselect project button
     */
    public onProjectSelected() {
        this.projectEventService.setEventData(
            this.project,
            true,
            this.imagePath
        );
        this.dashboardService.setSecondaryHeaderContent({
            isDashboard: false,
            title: `${this.project.year} ${this.project.name}`
        });
        this.openAreas();
    }

    /**
     * Set default image for years where image logo is unknown
     */
    public setDefaultImage() {
        this.imagePath = `assets/img/event-logos/2020.png`;
    }

    /**
     * Return image logo path from assets based on year
     * images are not from project API
     */
    public getImagePath() {
        return `assets/img/event-logos/${this.project.year}.png`;
    }

}
