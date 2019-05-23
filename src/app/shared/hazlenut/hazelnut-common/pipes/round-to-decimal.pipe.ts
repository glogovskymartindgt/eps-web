import { Pipe, PipeTransform } from '@angular/core';
import { MathUtils } from '../hazelnut';

/**
 * Transform number value to integer
 */
@Pipe({
    name: 'roundToDecimal',
})
export class RoundToDecimalPipe implements PipeTransform {
    public transform(item: number, fractionDigits = 0): any {
        if (!isFinite(item)) {
            item = 0;
        }
        return MathUtils.roundToDecimals(item, fractionDigits);
    }
}
