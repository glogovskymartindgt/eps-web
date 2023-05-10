import { Injectable } from '@angular/core';
import { Venue } from '../../interfaces/venue.interface';

@Injectable({
    providedIn: 'root'
})
export class SortService {

    public constructor() {
    }

    public numericSortByScreenPosition = (comparable: Venue, compared: Venue): number => {
        if (comparable.screenPosition === null) return 1
        if (compared.screenPosition === null) return -1
        if (comparable.screenPosition < compared.screenPosition) return -1
        if (comparable.screenPosition > compared.screenPosition) return 1
        if (comparable.screenPosition === compared.screenPosition) return 0
    } 

    public sortByParam(data: any[], param: string): any[] {
        return data.sort((comparable: any, compared: any): number => (comparable[param] > compared[param]) ? 1 : -1);
    }
}