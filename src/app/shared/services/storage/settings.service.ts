import {Injectable} from '@angular/core';
import {AbstractStorageService} from '../../hazlenut/hazelnut-common/services';
import {EventDataInterface} from '../../interfaces/event.interface';
import {ImagesService} from '../data/images.service';
import {EventService} from './event.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends EventService<EventDataInterface> {

    public constructor(storageService: AbstractStorageService, private readonly imagesService: ImagesService) {
        super(storageService);
    }

}
