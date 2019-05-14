import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Regex } from '../hazlenut/hazelnut-common/regex/regex';

@Pipe({
    name: 'thousandDelimiter'
})
export class ThousandDelimiterPipe implements PipeTransform {

    public transform(value: string | number, decimalSeparator = '.'): any {

        value = isNullOrUndefined(value) ? '' : value;

        const decimalPart = value.toString().split('.')[1];
        let numberOfDecimals = 0;

        if (decimalPart) {
            numberOfDecimals = decimalPart.length;
        }

        const element = (numberOfDecimals > 0) ? parseFloat(value.toString()).toFixed(2).toString() : value.toString();

        return element
            .replace(Regex.thousandSeparatorOccurenceWithMaxTwoDecimal, ' ')
            .replace('.', decimalSeparator);
    }

}
