import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'venue'
})
export class VenuePipe implements PipeTransform {

    public constructor(private readonly translateService: TranslateService) {
    }

    public transform(value: any, args?: any) {
        if (!value) {
            return;
        }
        switch (value.toString().toLowerCase()) {
            case 'all':
                return this.translateService.instant('venue.value.all');
            case 'both':
                return this.translateService.instant('venue.value.all');
            case  'none':
                return this.translateService.instant('venue.value.none');
            default:
        }
        return value;
    }

}
