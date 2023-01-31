import { Injectable } from '@angular/core';
import { Venue } from '../../interfaces/venue.interface';

@Injectable({
    providedIn: 'root'
})
export class SortService {

    public constructor() {
    }

    public numericSortByScreenPosition = (comparable: Venue, compared: Venue): number => comparable.screenPosition < compared.screenPosition ?
                                                                                 -1 :
                                                                                 comparable.screenPosition > compared.screenPosition ? 1 : 0

    public sortByParam(data: any[], param: string): any[] {
        return data.sort((comparable: any, compared: any): number => (comparable[param] > compared[param]) ? 1 : -1);
    }
}
