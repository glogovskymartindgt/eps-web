import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Regex } from '../hazlenut/hazelnut-common/regex/regex';

@Pipe({
    name: 'thousandDelimiter'
})

/**
 * Transform value to number with two decimal parameter and specified decimal separator
 */
export class ThousandDelimiterPipe implements PipeTransform {
    public transform(value: string | number, decimalSeparator = '.'): any {
        value = isNullOrUndefined(value) ? '' : value;
        const decimalPart = value.toString().split('.')[1];
        const element = (decimalPart && (decimalPart.length > 0))
            ? parseFloat(value.toString()).toFixed(2).toString()
            : value.toString();
        return element
            .replace(Regex.thousandSeparatorOccurrenceWithMaxTwoDecimal, ' ')
            .replace('.', decimalSeparator);
    }
}
