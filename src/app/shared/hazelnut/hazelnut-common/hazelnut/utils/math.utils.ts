import { NumberType } from '../../enums/number-type.enum';

export interface NumberFormatterParameter<T = number | string> {
    decimalSeparator?: string;
    groupingSeparator?: string;
    value: T;
    type: NumberType;
    defaultValue?: T;
}

const groupingSeparatorsRegexp = '[ _]';
const decimalSeparatorsRegexp = '[.,]';

const replaceGroupingSeparators = (value: string, groupingSeparator: string): string => {
    if (value.match(new RegExp(groupingSeparatorsRegexp + '\\d{3}'))) { // If number contains grouping separator
        return value.replace(new RegExp(groupingSeparatorsRegexp, 'g'), groupingSeparator);
    }

    return value;
};
const replaceDecimalSeparators = (value: string, decimalSeparator: string): string => {
    if (value.match(new RegExp(`\\d${decimalSeparatorsRegexp}\\d`))) { // If number contains grouping separator
        return value.replace(new RegExp(decimalSeparatorsRegexp, 'g'), decimalSeparator);
    }

    return value;
};

export class MathUtils {
    public static roundToDecimals(number: number, decimals = 2, noDecimalsForRounded = false): any {
        const divider = parseInt(1 + new Array(decimals + 1).join('0'), 10);
        if (noDecimalsForRounded && number % 1 === 0) {
            decimals = 0;
        }

        return (Math.round(number * divider) / divider).toFixed(decimals);
    }

    public static intToHexa(num: number): string {
        const hexString = num.toString(16);
        if (hexString.length % 2) {
            return '0' + hexString;
        }

        return hexString;
    }

    public static validateValue<T>({value, type, defaultValue = value, decimalSeparator = '.', groupingSeparator = ''}: NumberFormatterParameter<T>): T {
        switch (type) {
            case NumberType.INTEGER:
                if (typeof value === 'string') {
                    value = replaceGroupingSeparators(String(value), groupingSeparator) as any;
                }

                return value;
            case NumberType.POSITIVE_INTEGER:
                if (typeof value === 'string') {
                    value = value.replace(/-/, '') as any;
                    value = replaceGroupingSeparators(String(value), groupingSeparator) as any;
                }

                return value;
            case NumberType.HEXA:
                return MathUtils.intToHexa(parseInt(String(value), 10) as any || defaultValue) as any;
            case NumberType.POSITIVE_FLOAT:
                if (typeof value === 'string') {
                    value = value.replace('-', '') as any;
                    value = replaceGroupingSeparators(String(value), groupingSeparator) as any;
                    value = replaceDecimalSeparators(String(value), decimalSeparator) as any;
                }

                return value;
            case NumberType.FLOAT:
                if (typeof value === 'string') {
                    value = replaceGroupingSeparators(String(value), groupingSeparator) as any;
                    value = replaceDecimalSeparators(String(value), decimalSeparator) as any;
                }

                return value;
            default:
                throw new Error('Unknown number type: ' + type);
        }
    }
}
