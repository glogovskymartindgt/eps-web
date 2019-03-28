import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../../hazlenut/hazelnut-common/services';
import { EventDataInterface } from '../../interfaces/event.interface';
import { EventService } from './event.service';

@Injectable({
    providedIn: 'root'
})

export class ProjectEventService extends EventService<EventDataInterface> {
    public constructor(storageService: AbstractStorageService) {
        super(storageService);
    }

    public setEventData(
        year: number = null,
        projectName: string = null,
        isEvent = false,
        active = false,
        imagePath: string = null) {
        this.setData({
            year,
            projectName,
            isEvent,
            active,
            imagePath,
        });
    }

}
