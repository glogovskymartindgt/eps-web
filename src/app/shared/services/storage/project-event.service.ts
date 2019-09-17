import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../../hazlenut/hazelnut-common/services';
import { EventDataInterface } from '../../interfaces/event.interface';
import { ProjectDetail } from '../../models/project-detail.model';
import { Project } from '../../models/project.model';
import { EventService } from './event.service';

@Injectable({
    providedIn: 'root'
})

export class ProjectEventService extends EventService<EventDataInterface> {
    public constructor(storageService: AbstractStorageService) {
        super(storageService);
    }

    public setEventData(project: Project = null, isEvent = false, imagePath: string = null) {
        this.setData({
            isEvent,
            imagePath,
            id: project ? project.id : null,
            year: project ? +project.year : null,
            projectName: project ? project.name : null,
            firstVenue: project &&  project.venues[0] ? project.venues[0].city : null,
            secondVenue: project &&  project.venues[1] ? project.venues[1].city : null,
            active: project ? project.state === 'OPEN' : null,
        });
    }

    public setEventDataFromDetail(project: ProjectDetail = null, isEvent = false, imagePath: string = null) {
        this.setData({
            isEvent,
            imagePath,
            id: project ? project.id : null,
            year: project ? +project.year : null,
            projectName: project ? project.name : null,
            firstVenue: project &&  project.projectVenues[0] ? project.projectVenues[0].cityName : null,
            secondVenue: project &&  project.projectVenues[1] ? project.projectVenues[1].cityName : null,
            active: project ? project.state === 'OPEN' : null,
        });
    }

}
