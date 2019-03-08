import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../abstract-storage.service';

@Injectable({
    providedIn: 'root'
})
export class NoopStorageService extends AbstractStorageService {
    public constructor() {
        super();
    }
}
