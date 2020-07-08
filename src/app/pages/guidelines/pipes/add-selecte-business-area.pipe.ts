import { Pipe, PipeTransform } from '@angular/core';
import { ListItemSync } from 'hazelnut';
import { ClBusinessArea } from '../../../shared/interfaces/cl-business-area.interface';

@Pipe({
    name: 'addSelectedBusinessArea'
})

/**
 * Transform value to number with two decimal parameter and specified decimal separator
 */ export class AddSelecteBusinessAreaPipe implements PipeTransform {
    public transform(selectList: ListItemSync[], selectedBusinessArea: ClBusinessArea): ListItemSync[] {
        if (!selectedBusinessArea) {
            return selectList;
        }

        return [
            {
                code: selectedBusinessArea.id,
                value: selectedBusinessArea.name,
            },
            ...selectList
        ];
    }
}
