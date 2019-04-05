import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'venue'
})
export class VenuePipe implements PipeTransform {

    public constructor(private readonly translateService: TranslateService) {
    }

    public transform(value: any, args?: any): any {
        if (value === 'all') {
            return this.translateService.instant('venue.value.all');
        } else if (value === 'None') {
            return this.translateService.instant('venue.value.none');
        } else {
            return value;
        }
    }

}
