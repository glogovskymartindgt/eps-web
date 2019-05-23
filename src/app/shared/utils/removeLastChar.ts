import { isNullOrUndefined } from 'util';

export function checkAndRemoveLastDotComma(value: string): string {
    if (isNullOrUndefined(value)) {
        return null;
    }
    const lastCharacter = value.toString().slice(-1);
    if (lastCharacter !== '' && (lastCharacter === '.' || lastCharacter === ',')) {
        value = value.toString().substring(0, value.toString().length - 1);
    }
    value = value.replace(',','.');
    return value;

}
