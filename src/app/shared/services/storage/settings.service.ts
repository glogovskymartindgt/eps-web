import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../../hazelnut/hazelnut-common/services';
import { EventDataInterface } from '../../interfaces/event.interface';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends EventService<EventDataInterface> {

    public constructor(storageService: AbstractStorageService) {
        super(storageService);
    }

}
