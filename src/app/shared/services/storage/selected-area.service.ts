import { Injectable } from '@angular/core';
import { AbstractStorageService } from '../../hazelnut/hazelnut-common/services';
import { SelectedArea } from '../../interfaces/selected-area';
import { AreaService } from './area.service';

@Injectable({
    providedIn: 'root'
})
export class SelectedAreaService extends AreaService<SelectedArea> {
    public constructor(storageService: AbstractStorageService) {
        super(storageService);
    }

    public setSelectedArea(selectedArea: string): void {
        this.setData({
            selectedArea
        });
    }

}
