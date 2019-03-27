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

    // todo test this
    public get isEventSelected(): boolean {
        return Boolean(this.instant && this.instant.selectedEvent);
    }

    public get activeEvent(): boolean {
        return Boolean(this.instant && this.instant.selectedEvent);
    }

    public setEventData(event: string, isEvent: boolean, active: boolean, imagePath: string) {
        console.log('selecting event', {
            isEvent,
            selectedEvent: event,
            active,
            imagePath,
        });
        this.setData({
            isEvent,
            selectedEvent: event,
            active,
            imagePath,
        });
    }

}
