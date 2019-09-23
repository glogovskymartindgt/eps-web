import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../../hazlenut/hazelnut-common/services';
import { EventDataInterface } from '../../interfaces/event.interface';
import { Project } from '../../models/project.model';
import { ImagesService } from '../data/images.service';
import { EventService } from './event.service';

@Injectable({
    providedIn: 'root'
})

export class ProjectEventService extends EventService<EventDataInterface> {

    public imagePath: any = 'assets/img/event-logos/default_logo.png';

    public constructor(storageService: AbstractStorageService, private readonly imagesService: ImagesService) {
        super(storageService);
    }

    public setEventData(project: Project = null, isEvent = false, imagePath: string = null) {
        this.setData({
            isEvent,
            imagePath,
            id: project ? project.id : null,
            year: project ? +project.year : null,
            projectName: project ? project.name : null,
            firstVenue: project && project.venues[0] ? project.venues[0].city : null,
            secondVenue: project && project.venues[1] ? project.venues[1].city : null,
            active: project ? project.state === 'OPEN' : null,
        });
    }

    public setEventDataFromDetail(project: Project = null, isEvent = false, imagePath: string = null) {
        if (imagePath === null) {
            this.setDetailObject(project, isEvent);
        } else {
            this.imagesService.getImage(imagePath)
                .subscribe((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imagePath = reader.result;
                        this.setDetailObject(project, isEvent);
                    };
                    reader.readAsDataURL(blob);
                });
        }

    }

    private setDetailObject(project: any, isEvent: boolean) {
        this.setData({
            isEvent,
            imagePath: this.imagePath,
            id: project ? project.projectId : null,
            year: project ? +project.year : null,
            projectName: project ? project.name : null,
            firstVenue: project && project.projectVenues && project.projectVenues[0] ? project.projectVenues[0].cityName : null,
            secondVenue: project && project.projectVenues && project.projectVenues[1] ? project.projectVenues[1].cityName : null,
            active: project ? project.state === 'OPEN' : null,
        });
    }

}
