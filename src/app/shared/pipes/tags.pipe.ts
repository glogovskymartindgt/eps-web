import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tags'
})
export class TagsPipe implements PipeTransform {

    transform(value: string[], maxTags?: number): string {
        if (!maxTags) {
            maxTags = 2
        }

        const more = value.length > maxTags ? ' ...' : '';

        return  value
            .splice(0, maxTags)
            .join(', ') + more;
    }
}
