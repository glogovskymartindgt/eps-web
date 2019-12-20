import { Pipe, PipeTransform } from '@angular/core';
import { Regex } from '../hazlenut/hazelnut-common/regex/regex';

@Pipe({
    name: 'thousandDelimiter'
})

/**
 * Transform value to number with two decimal parameter and specified decimal separator
 */ export class ThousandDelimiterPipe implements PipeTransform {
    public transform(value: string | number, decimalSeparator = '.'): any {
        const inputValue = (value === null || value === undefined) ? '' : value;
        const decimalPart = inputValue.toString()
                                 .split('.')[1];
        const element = (decimalPart && (decimalPart.length > 0)) ? parseFloat(inputValue.toString())
            .toFixed(2)
            .toString() : inputValue.toString();
        return element
            .replace(Regex.thousandSeparatorOccurrenceWithMaxTwoDecimal, ' ')
            .replace('.', decimalSeparator);
    }
}
