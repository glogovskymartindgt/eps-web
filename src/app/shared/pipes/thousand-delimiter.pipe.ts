import { Pipe, PipeTransform } from '@angular/core';
import { Regex } from '../hazlenut/hazelnut-common/regex/regex';

@Pipe({
    name: 'thousandDelimiter'
})
export class ThousandDelimiterPipe implements PipeTransform {

    public transform(value: string | number, decimalSeparator = '.'): any {
        return (value === null) ? null : value.toString()
            .replace(Regex.thousandSeparatorOccurenceWithMaxTwoDecimal, ' ')
            .replace('.', decimalSeparator);
    }

}
